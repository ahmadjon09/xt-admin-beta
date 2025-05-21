import { useState, useRef, useEffect } from 'react'
import { X, Upload, Loader2, Save, Trash2, Plus } from 'lucide-react'
import Fetch from '../middlewares/fetch'
import { mutate } from 'swr'
import { IsOpenModal } from '../assets/css/Modal'

export const ProductModal = ({ isOpen, setIsOpen, productId = null }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [imagePending, setImagePending] = useState(false)
  const fileInputRef = useRef(null)
  const isEditMode = !!productId

  const [productData, setProductData] = useState({
    title: '',
    description: 'N/A',
    in_price: '',
    out_price: '',
    stock: 0,
    selled_count: 0,
    sale: 0,
    category: '',
    brand: '',
    photos: [],
    colors: [],
    size: '',
    rating: 0
  })

  const [newColor, setNewColor] = useState({ name: '', value: '#000000' })
  const [previewImages, setPreviewImages] = useState([])

  useEffect(() => {
    if (isEditMode && isOpen) {
      const fetchProduct = async () => {
        try {
          setIsLoading(true)
          setError('')
          const { data } = await Fetch.get(`/product/one/${productId}`)
          const product = data.data
          setProductData({
            title: product.title || '',
            description: product.description || 'N/A',
            in_price: product.in_price || '',
            out_price: product.out_price || '',
            ID: product.ID || '',
            stock: product.stock || '',
            selled_count: product.selled_count || '',
            sale: product.sale || '',
            category: product.category || '',
            brand: product.brand || '',
            photos: product.photos || [],
            colors: product.colors || [],
            size: product.size || '',
            rating: product.rating || ''
          })
          setPreviewImages(product.photos || [])
        } catch (err) {
          setError(
            err.response?.data?.message || 'Маҳсулотни юклашда хатолик юз берди'
          )
        } finally {
          setIsLoading(false)
        }
      }

      fetchProduct()
    }
  }, [isEditMode, productId, isOpen])

  useEffect(() => {
    if (!isOpen && !isEditMode) {
      setProductData({
        title: '',
        description: '',
        in_price: '',
        out_price: '',
        stock: '',
        selled_count: '',
        sale: '',
        category: '',
        brand: '',
        photos: [],
        colors: [],
        size: '',
        rating: ''
      })
      setPreviewImages([])
      setNewColor({ name: '', value: '#000000' })
      setError('')
      setSuccess(false)
    }
  }, [isOpen, isEditMode])

  const handleInputChange = e => {
    const { name, value } = e.target
    setProductData(prev => ({ ...prev, [name]: value }))
  }

  const handleNumberInputChange = e => {
    const { name, value } = e.target
    const numValue = value === '' ? 0 : Number(value)
    setProductData(prev => ({ ...prev, [name]: numValue }))
  }

  const handleColorInputChange = e => {
    const { name, value } = e.target
    setNewColor(prev => ({ ...prev, [name]: value }))
  }

  const addColor = () => {
    if (!newColor.name.trim()) {
      setError('Ранг номини киритиш шарт')
      return
    }

    setProductData(prev => ({
      ...prev,
      colors: [...prev.colors, { name: newColor.name, value: newColor.value }]
    }))
    setNewColor({ name: '', value: '#000000' })
    setError('')
  }

  const removeColor = index => {
    setProductData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }))
  }

  const handleFileChange = async e => {
    if (!e.target.files || e.target.files.length === 0) return

    const formImageData = new FormData()
    const files = Array.from(e.target.files)

    const localPreviews = files.map(file => URL.createObjectURL(file))
    setPreviewImages([...previewImages, ...localPreviews])

    files.forEach(file => {
      formImageData.append('images', file)
    })

    try {
      setImagePending(true)
      setError('')
      const { data } = await Fetch.post('/upload', formImageData)

      setPreviewImages(prevImages => {
        const oldImages = prevImages.slice(0, prevImages.length - files.length)
        return [...oldImages, ...data.images]
      })

      setProductData(prevData => ({
        ...prevData,
        photos: [...(prevData.photos || []), ...data.images]
      }))
    } catch (err) {
      setError('Расмларни юклашда хатолик юз берди')
      setPreviewImages(prevImages =>
        prevImages.slice(0, prevImages.length - files.length)
      )
    } finally {
      setImagePending(false)
    }
  }

  const removeImage = index => {
    setProductData(prevData => ({
      ...prevData,
      photos: prevData.photos.filter((_, i) => i !== index)
    }))
    setPreviewImages(prevImages => prevImages.filter((_, i) => i !== index))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!productData.title.trim()) {
      setError('Маҳсулот номини киритиш шарт')
      return
    }

    if (!productData.in_price || !productData.out_price) {
      setError('Кириш ва чиқиш нархларини киритиш шарт')
      return
    }

    if (productData.photos.length === 0) {
      setError('Камида битта расм юклаш шарт')
      return
    }

    try {
      setIsLoading(true)
      setError('')

      const dataToSubmit = {
        ...productData,
        in_price: Number(productData.in_price),
        out_price: Number(productData.out_price),
        stock: Number(productData.stock || 0),
        sale: Number(productData.sale || 0)
      }

      if (isEditMode) {
        await Fetch.put(`/product/${productId}`, dataToSubmit)
      } else {
        await Fetch.post('/product/create', dataToSubmit)
      }

      setSuccess(true)

      mutate('/product')

      setTimeout(() => {
        setIsOpen(false)
        IsOpenModal(false)
        setSuccess(false)
      }, 1500)
    } catch (err) {
      const action = isEditMode ? 'янгилашда' : 'қўшишда'
      setError(
        err.response?.data?.message || `Маҳсулотни ${action} хатолик юз берди`
      )
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  const modalTitle = isEditMode ? 'Маҳсулотни таҳрирлаш' : 'Янги маҳсулот қўшиш'
  const buttonText = isEditMode ? 'Янгилаш' : 'Сақлаш'
  const successMessage = isEditMode
    ? 'Маҳсулот муваффақиятли янгиланди!'
    : 'Маҳсулот муваффақиятли қўшилди!'

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001] p-4'
      onClick={() => !isLoading && !imagePending && setIsOpen(false)}
    >
      <div
        className='bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'
        onClick={e => e.stopPropagation()}
      >
        {success ? (
          <div className='p-8 flex flex-col items-center justify-center'>
            <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4'>
              <svg
                className='w-8 h-8 text-green-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
            <h3 className='text-xl font-bold text-gray-900 mb-2'>
              {successMessage}
            </h3>
            <p className='text-gray-600'>
              Маҳсулотлар рўйхатига қайтарилмоқда...
            </p>
          </div>
        ) : (
          <>
            <div className='sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center'>
              <h2 className='text-xl font-bold text-gray-900'>{modalTitle}</h2>
              <button
                onClick={() => !isLoading && !imagePending && setIsOpen(false)}
                className='text-gray-500 hover:text-gray-700 focus:outline-none'
                disabled={isLoading || imagePending}
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            {isLoading && !productData.title ? (
              <div className='flex flex-col items-center justify-center p-12'>
                <Loader2 className='h-12 w-12 text-purple-600 animate-spin mb-4' />
                <p className='text-gray-600'>Юкланмоқда...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='p-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                  <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Маҳсулот номи <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='text'
                      name='title'
                      value={productData.title}
                      onChange={handleInputChange}
                      className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                      placeholder='Маҳсулот номини киритинг'
                      required
                    />
                  </div>

                  <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Тавсиф
                    </label>
                    <textarea
                      name='description'
                      value={productData.description}
                      onChange={handleInputChange}
                      rows='3'
                      className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                      placeholder='Маҳсулот тавсифини киритинг'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Омбордаги миқдори
                    </label>
                    <input
                      type='number'
                      name='stock'
                      value={productData.stock}
                      onChange={handleNumberInputChange}
                      min='0'
                      className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                      placeholder='Омбордаги миқдори'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Кириш нархи <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='number'
                      name='in_price'
                      value={productData.in_price}
                      onChange={handleNumberInputChange}
                      min='0'
                      className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                      placeholder='Кириш нархи'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Чиқиш нархи <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='number'
                      name='out_price'
                      value={productData.out_price}
                      onChange={handleNumberInputChange}
                      min='0'
                      className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                      placeholder='Чиқиш нархи'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Чегирма (%)
                    </label>
                    <input
                      type='number'
                      name='sale'
                      value={productData.sale}
                      onChange={handleNumberInputChange}
                      min='0'
                      max='100'
                      className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                      placeholder='Чегирма фоизи'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Категория
                    </label>
                    <input
                      type='text'
                      name='category'
                      value={productData.category}
                      onChange={handleInputChange}
                      className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                      placeholder='Маҳсулот категорияси'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Бренд
                    </label>
                    <input
                      type='text'
                      name='brand'
                      value={productData.brand}
                      onChange={handleInputChange}
                      className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                      placeholder='Маҳсулот бренди'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Ўлчами
                    </label>
                    <input
                      type='text'
                      name='size'
                      value={productData.size}
                      onChange={handleInputChange}
                      className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                      placeholder='Маҳсулот ўлчами'
                    />
                  </div>

                  {/* Colors section */}
                  <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Рангларни қўшиш
                    </label>
                    <div className='flex gap-2 mb-2'>
                      <input
                        type='text'
                        name='name'
                        value={newColor.name}
                        onChange={handleColorInputChange}
                        className='flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                        placeholder='Ранг номи'
                      />
                      <input
                        type='color'
                        name='value'
                        value={newColor.value}
                        onChange={handleColorInputChange}
                        className='w-12 h-10 border border-gray-300 rounded-md cursor-pointer'
                      />
                      <button
                        type='button'
                        onClick={addColor}
                        className='px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors'
                      >
                        <Plus className='h-5 w-5' />
                      </button>
                    </div>

                    {/* Display added colors */}
                    {productData.colors.length > 0 && (
                      <div className='mt-2'>
                        <p className='text-sm font-medium text-gray-700 mb-2'>
                          Қўшилган ранглар:
                        </p>
                        <div className='flex flex-wrap gap-2'>
                          {productData.colors.map((color, index) => (
                            <div
                              key={index}
                              className='flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1'
                            >
                              <div
                                className='w-4 h-4 rounded-full'
                                style={{ backgroundColor: color.value }}
                              />
                              <span className='text-sm'>{color.name}</span>
                              <button
                                type='button'
                                onClick={() => removeColor(index)}
                                className='text-gray-500 hover:text-red-500'
                              >
                                <X className='h-4 w-4' />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Расмлар <span className='text-red-500'>*</span>
                    </label>
                    <div
                      className='border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer'
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type='file'
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        multiple
                        accept='image/*'
                        className='hidden'
                      />
                      <div className='flex flex-col items-center'>
                        <Upload className='h-8 w-8 text-gray-400 mb-2' />
                        <p className='text-sm text-gray-600'>
                          Расмларни юклаш учун босинг ёки бу ерга тортиб ташланг
                        </p>
                        <p className='text-xs text-gray-500 mt-1'>
                          PNG, JPG, GIF форматлари қўллаб-қувватланади
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image previews */}
                {previewImages.length > 0 && (
                  <div className='mb-6'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Юкланган расмлар
                    </label>
                    <div className='grid grid-cols-3 sm:grid-cols-4 gap-3'>
                      {previewImages.map((img, index) => (
                        <div
                          key={index}
                          className='relative group rounded-md overflow-hidden border border-gray-200'
                        >
                          <img
                            src={img || '/placeholder.svg'}
                            alt={`Маҳсулот расми ${index + 1}`}
                            className='w-full h-24 object-cover'
                          />
                          <button
                            type='button'
                            onClick={() => removeImage(index)}
                            className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                          >
                            <Trash2 className='h-3 w-3' />
                          </button>
                        </div>
                      ))}
                      {imagePending && (
                        <div className='flex items-center justify-center h-24 border border-gray-200 rounded-md bg-gray-50'>
                          <Loader2 className='h-6 w-6 text-purple-500 animate-spin' />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {error && (
                  <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm'>
                    {error}
                  </div>
                )}

                <div className='flex justify-end gap-3'>
                  <button
                    type='button'
                    onClick={() =>
                      !isLoading && !imagePending && setIsOpen(false)
                    }
                    className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors'
                    disabled={isLoading || imagePending}
                  >
                    Бекор қилиш
                  </button>
                  <button
                    type='submit'
                    className={`px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2 ${
                      isLoading || imagePending
                        ? 'opacity-70 cursor-not-allowed'
                        : ''
                    }`}
                    disabled={isLoading || imagePending}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className='h-4 w-4 animate-spin' />
                        Юкланмоқда...
                      </>
                    ) : (
                      <>
                        <Save className='h-4 w-4' />
                        {buttonText}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}

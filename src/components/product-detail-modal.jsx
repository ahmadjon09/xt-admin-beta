import { X, Pencil, Trash2, Star } from 'lucide-react'
import { formatNumber, formatCount } from '../middlewares/format'

export const ProductDetailModal = ({ product, onClose, onEdit, onDelete }) => {
  if (!product) return null

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-[1000]'>
      <div className='bg-white p-4 md:p-6 rounded-lg shadow-xl max-w-md md:max-w-lg w-full overflow-y-auto max-h-[90vh]'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-bold text-gray-800'>
            Маҳсулот тафсилотлари
          </h2>
          <button
            onClick={onClose}
            className='text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        <div className='relative mb-6 z-[999] overflow-hidden rounded-lg shadow-md'>
          {product.photos && product.photos.length > 0 ? (
            <div className='aspect-ratio-container relative'>
              <img
                src={product.photos[0] || 'null'}
                alt='Маҳсулот'
                className='w-full h-auto object-contain bg-gray-50 rounded-lg transition-transform duration-300 hover:scale-105 max-h-[250px] md:max-h-[300px]'
              />
              {product.photos.length > 1 && (
                <div className='absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full'>
                  +{product.photos.length - 1} фото
                </div>
              )}
            </div>
          ) : (
            <div className='w-full h-48 md:h-64 bg-gray-200 rounded-lg flex items-center justify-center'>
              <p className='text-gray-500 text-sm md:text-base'>
                Расм мавжуд эмас
              </p>
            </div>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg'>
          <div className='col-span-1 md:col-span-2'>
            <h3 className='font-bold text-lg text-gray-800 mb-2'>
              {product.title || 'Кўрсатилмаган'}
            </h3>
            {product.rating > 0 && (
              <div className='flex items-center mb-2'>
                <Star className='h-4 w-4 text-yellow-500 fill-yellow-500 mr-1' />
                <span className='font-medium'>{product.rating.toFixed(1)}</span>
              </div>
            )}
            <p className='text-gray-600 text-sm mb-3'>{product.description}</p>
          </div>
          <p className='flex flex-col'>
            <span className='text-gray-500 text-sm'>ID:</span>
            <span className='font-medium'>{product.ID || 'Кўрсатилмаган'}</span>
          </p>
          <p className='flex flex-col'>
            <span className='text-gray-500 text-sm'>Категория:</span>
            <span className='font-medium'>
              {product.category || 'Кўрсатилмаган'}
            </span>
          </p>
          <p className='flex flex-col'>
            <span className='text-gray-500 text-sm'>Бренд:</span>
            <span className='font-medium'>
              {product.brand || 'Кўрсатилмаган'}
            </span>
          </p>
          <p className='flex flex-col'>
            <span className='text-gray-500 text-sm'>Кириш нархи:</span>
            <span className='font-medium'>
              {formatNumber(product.in_price)}
            </span>
          </p>
          <p className='flex flex-col'>
            <span className='text-gray-500 text-sm'>Чиқиш нархи:</span>
            <span className='font-medium'>
              {formatNumber(product.out_price)}
            </span>
          </p>
          {product.sale > 0 && (
            <p className='flex flex-col'>
              <span className='text-gray-500 text-sm'>Чегирма:</span>
              <span className='font-medium text-red-600'>{product.sale}%</span>
            </p>
          )}
          <p className='flex flex-col'>
            <span className='text-gray-500 text-sm'>Омбордаги миқдор:</span>
            <span className='font-medium'>{formatCount(product.stock)}</span>
          </p>
          <p className='flex flex-col'>
            <span className='text-gray-500 text-sm'>Сотилган миқдор:</span>
            <span className='font-medium'>
              {formatCount(product.selled_count) || 0}
            </span>
          </p>
          {product.size && (
            <p className='flex flex-col'>
              <span className='text-gray-500 text-sm'>Ўлчами:</span>
              <span className='font-medium'>{product.size}</span>
            </p>
          )}
          {product.colors && product.colors.length > 0 && (
            <div className='flex flex-col md:col-span-2 mt-2'>
              <span className='text-gray-500 text-sm mb-1'>
                Мавжуд ранглар:
              </span>
              <div className='flex flex-wrap gap-2'>
                {product.colors.map((color, index) => (
                  <div
                    key={index}
                    className='flex items-center gap-1 bg-white rounded-full px-2 py-1 border border-gray-200'
                  >
                    <div
                      className='w-3 h-3 rounded-full'
                      style={{ backgroundColor: color.value }}
                    />
                    <span className='text-xs'>{color.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className='flex flex-col md:col-span-2 mt-2'>
            <span className='text-gray-500 text-sm'>Қўшилган сана:</span>
            <span className='font-medium'>
              {new Date(product.createdAt).toLocaleDateString('uz-UZ')}
            </span>
          </p>
        </div>

        <div className='mt-6 flex justify-end items-center gap-3 flex-wrap'>
          <button
            onClick={onClose}
            className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors'
          >
            Ёпиш
          </button>
          <button
            onClick={() => {
              onClose()
              onEdit(product._id)
            }}
            className='bg-sky-600 text-white rounded-md px-4 py-2 hover:bg-sky-700 flex items-center transition-colors'
          >
            <Pencil className='text-white w-4 h-4 mr-2' />
            Таҳрирлаш
          </button>
          <button
            onClick={() => {
              onClose()
              onDelete(product._id)
            }}
            className='bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-700 flex items-center transition-colors'
          >
            <Trash2 className='text-white w-4 h-4 mr-2' />
            Ўчириш
          </button>
        </div>
      </div>
    </div>
  )
}

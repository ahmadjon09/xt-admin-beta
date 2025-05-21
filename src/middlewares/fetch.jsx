import axios from 'axios'
import Cookies from 'js-cookie'

const token = Cookies.get('admin_token')
// const BASE_URL = 'https://xt-server-w6zs.onrender.com'
const BASE_URL = 'http://localhost:8000/'

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: token
  }
})

export default instance

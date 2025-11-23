import axios from 'axios'
import { API_CONFIGURATIONS } from '../../constants/apiConfigurations'

const axiosInstance = axios.create({
  baseURL: API_CONFIGURATIONS.BASE_URL,
  headers: API_CONFIGURATIONS.HEADERS,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

class ChequeBookServices {
  async getAllChequeBooks() {
    try {
      const response = await axiosInstance.get(API_CONFIGURATIONS.ENDPOINTS.CHEQUEBOOK)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getChequeBookByCheckBookId(id) {
    try {
      const response = await axiosInstance.get(
        API_CONFIGURATIONS.ENDPOINTS.CHEQUEBOOK_BY_BANKACCOUNTID(id),
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async createChequeBook(BankAccountData) {
    try {
      const response = await axiosInstance.post(
        API_CONFIGURATIONS.ENDPOINTS.CHEQUEBOOK,
        BankAccountData,
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async updateChequeBook(id, bankData) {
    try {
      const response = await axiosInstance.put(
        API_CONFIGURATIONS.ENDPOINTS.CHEQUEBOOK_BY_ID(id),
        bankData,
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async deleteChequeBook(id) {
    try {
      await axiosInstance.delete(API_CONFIGURATIONS.ENDPOINTS.CHEQUEBOOK_BY_ID(id))
      return true
    } catch (error) {
      throw this.handleError(error)
    }
  }

  handleError(error) {
    if (error.response) {
      return new Error(
        error.response.data?.message || error.response.statusText || 'An error occurred',
      )
    } else if (error.request) {
      return new Error('No response from server. Please check your connection.')
    } else {
      return new Error(error.message || 'An unexpected error occurred')
    }
  }
}

export default new ChequeBookServices()

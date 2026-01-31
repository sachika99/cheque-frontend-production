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

class ChequeServices {
  async getAllCheques() {
    try {
      const response = await axiosInstance.get(API_CONFIGURATIONS.ENDPOINTS.CHEQUE)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getChequeById(id) {
    try {
      const response = await axiosInstance.get(API_CONFIGURATIONS.ENDPOINTS.CHEQUE_BY_ID(id))
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async createCheque(BankAccountData) {
    try {
      const response = await axiosInstance.post(
        API_CONFIGURATIONS.ENDPOINTS.CHEQUE,
        BankAccountData,
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async updateCheque(id, bankData) {
    try {
      debugger
      const response = await axiosInstance.put(
        API_CONFIGURATIONS.ENDPOINTS.CHEQUE_BY_ID(id),
        bankData,
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

async updateChequeStatus(chequeId, newStatus, user) {
  try {
    const payload = {
      newStatus: newStatus,
      user: user,
    }

    const response = await axiosInstance.patch(
      API_CONFIGURATIONS.ENDPOINTS.CHEQUE_STATUS(chequeId),
      payload
    )

    return response.data
  } catch (error) {
    throw this.handleError(error)
  }
}

async updateChequeStatusBulk(chequeIds, newStatus, user) {
    try {
      const payload = {
        chequeIds: chequeIds,
        newStatus: newStatus,
        user: user,
      }

      const response = await axiosInstance.patch(
        API_CONFIGURATIONS.ENDPOINTS.CHEQUE_STATUS_BULK,
        payload
      )

      return response.data
    } catch (error) {
      throw error
    }
  }

  async deleteCheque(id) {
    try {
      await axiosInstance.delete(API_CONFIGURATIONS.ENDPOINTS.CHEQUE_BY_ID(id))
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

export default new ChequeServices()

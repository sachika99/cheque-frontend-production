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

class BankAccountServices {
  async getAllBankAccounts() {
    try {
      const response = await axiosInstance.get(API_CONFIGURATIONS.ENDPOINTS.BANKACCOUNT)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getBankAccountById(id) {
    try {
      const response = await axiosInstance.get(API_CONFIGURATIONS.ENDPOINTS.BANKACCOUNT_BY_ID(id))
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async createBankAccount(BankAccountData) {
    try {
      const response = await axiosInstance.post(
        API_CONFIGURATIONS.ENDPOINTS.BANKACCOUNT,
        BankAccountData,
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async updateBankAccount(id, bankData) {
    try {
      const response = await axiosInstance.put(
        API_CONFIGURATIONS.ENDPOINTS.BANKACCOUNT_BY_ID(id),
        bankData,
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

 async deleteBankAccount(id) {
  try {
    const response = await axiosInstance.delete(
      API_CONFIGURATIONS.ENDPOINTS.BANKACCOUNT_BY_ID(id)
    );

    if (response.status === 204) {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}

  async createBankAndAccount(BankAccountData) {
    try {
      const response = await axiosInstance.post(
        API_CONFIGURATIONS.ENDPOINTS.BANKACCOUNTVACCOUNT,
        BankAccountData,
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }
async updateBankAccountStatus(chequeId) {
  try {
debugger
    const response = await axiosInstance.patch(
      API_CONFIGURATIONS.ENDPOINTS.BANK_STATUS(chequeId)
    )

    return response.data
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



export default new BankAccountServices()

import axios from 'axios'
import { API_CONFIGURATIONS } from '../constants/apiConfigurations'
import { decryptOtp } from '../../utils/crypto'

const authService = () => {
  const register = async (email, username, password) => {
    try {
      const response = await axios.post(
        API_CONFIGURATIONS.ENDPOINTS.REGISTER_USER,
        { email, username, password },
        { headers: { 'Content-Type': 'application/json' } }
      )
      return response
    } catch (error) {
      return {error: error.response?.data || 'Registration failed. Please try again.'}
    }
  }

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        API_CONFIGURATIONS.ENDPOINTS.LOGIN_USER,
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      )
      return response
    } catch (error) {
      return { error: error.response?.data || 'Login failed. Please try again.' }
    }
  }

  const forgotPassword = async (email) => {
    try {
      const response = await axios.post(
        `${API_CONFIGURATIONS.ENDPOINTS.FORGOT_PASSWORD_USER}?email=${encodeURIComponent(email)}`,
        null,
        { headers: { 'Content-Type': 'application/json' } }
      )

      if (response?.data) {
        const data = response.data
        const encryptedOtp = data.otp
        const decryptedOtp = encryptedOtp ? decryptOtp(encryptedOtp) : ''
        return {
           data: {
            ...data,
            otp: decryptedOtp,
          },
           status:response.status
        }
      }
    } catch (error) {
      // return error.response?.data?.message || 'Password reset request failed. Please try again.'
      return {error: error.response?.data|| 'Password reset request failed. Please try again.'}
    }
  }

  const resetPassword = async (email, token, newPassword) => {
    try {
      const response = await axios.post(
        API_CONFIGURATIONS.ENDPOINTS.RESET_PASSWORD_USER,
        { email, token, newPassword },
        { headers: { 'Content-Type': 'application/json' } }
      )
      return response
    } catch (error) {
      return error.response?.data?.message || 'Reset password failed. Please try again.'
    }
  }

  const logout = async (email, username, password) => {
    try {
      const response = await axios.post(
        API_CONFIGURATIONS.ENDPOINTS.REGISTER_USER,
        { email, username, password },
        { headers: { 'Content-Type': 'application/json' } }
      )
      return response
    } catch (error) {
      return {error: error.response?.data || 'Logout failed. Please try again.'}
    }
  }

  const verifyEmail = async (email) => {
    try {
      const response = await axios.post(
        `${API_CONFIGURATIONS.ENDPOINTS.VERIFY_EMAIL}?email=${encodeURIComponent(email)}`,
        null,
        { headers: { 'Content-Type': 'application/json' } }
      )

      if (response?.data) {
        const data = response.data
        const encryptedOtp = data.otp
        const decryptedOtp = encryptedOtp ? decryptOtp(encryptedOtp) : ''
        return {
           data: {
            ...data,
            otp: decryptedOtp,
          },
           status:response.status
        }
      }
    } catch (error) {
      return {error: error.response?.data || 'Email verification failed. Please try again.'}
    }
  }

  return { register, login, forgotPassword, resetPassword, logout, verifyEmail }
}

export default authService

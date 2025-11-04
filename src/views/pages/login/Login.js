import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import authService from '../../../api/authservices/authService'
import ForgotPasswordModal from '../forgotPassword/ForgotPasswordModal'
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [warningMessage, setWarningMessage] = useState('')
  const [isFloatingLoading, setIsFloatingLoading] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      setErrorMessage('')
      setSuccessMessage('')
      setWarningMessage('')

      if (username === '') {
        setWarningMessage('Username is required!')
        return
      } else if (password === '') {
        setWarningMessage('password is required')
        return
      }

      setIsFloatingLoading(true)
      const response = await authService().login(username, password)
      if (response?.data && response?.status === 200) {
        localStorage.setItem('accessToken', response.data.accessToken)
        localStorage.setItem('email', response.data.email)
        localStorage.setItem('username', response.data.username)
        setIsFloatingLoading(false)
        navigate('/dashboard')
      } else {
        setIsFloatingLoading(false)
        setErrorMessage(response?.error)
      }
    } catch (error) {
      setIsFloatingLoading(false)
      setErrorMessage(error?.response?.data || response)
      console.warn('Error during login:', error || response)
    }
  }

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center position-relative"
      style={{
        backgroundImage: "url('/pxfuel.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {isFloatingLoading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: '100vw',
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(2px)',
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <div className="text-center">
            <CSpinner
              style={{
                width: '4rem',
                height: '4rem',
                borderWidth: '4px',
                borderColor: '#0d6efd',
                borderRightColor: 'transparent',
              }}
              variant="border"
              role="status"
            />

            <h6
              className="mt-3 fw-semibold"
              style={{
                color: '#f8f9fa',
                letterSpacing: '0.5px',
              }}
            >
              Please wait...
            </h6>
          </div>
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.0)',
          zIndex: 0,
        }}
      ></div>

      <CContainer className="position-relative" style={{ zIndex: 1 }}>
        <CRow className="justify-content-center">
          <CCol md={8} lg={6} xl={4}>
            <CCard
              className="border-0 shadow-lg p-4"
              style={{
                backgroundColor: 'var(--cui-card-bg)',
                borderRadius: '12px',
                backdropFilter: 'blur(6px)',
              }}
            >
              <CCardBody>
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-body">Welcome Back</h2>
                  <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                    Sign in to continue to <span className="fw-semibold">JANASIRI MOTORS</span>
                  </p>
                </div>

                {successMessage && (
                  <CAlert
                    color="success"
                    className="mb-3 py-2 px-3"
                    dismissible
                    style={{ fontSize: '0.875rem', borderRadius: '6px' }}
                  >
                    {successMessage}
                  </CAlert>
                )}

                {errorMessage && (
                  <CAlert
                    color="danger"
                    className="mb-3 py-2 px-3"
                    dismissible
                    style={{ fontSize: '0.875rem', borderRadius: '6px' }}
                  >
                    {errorMessage}
                  </CAlert>
                )}
                {warningMessage && (
                  <CAlert
                    color="warning"
                    className="mb-3 py-2 px-3"
                    dismissible
                    style={{ fontSize: '0.875rem', borderRadius: '6px' }}
                  >
                    {warningMessage}
                  </CAlert>
                )}

                <CForm>
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-muted">Email Address</label>
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Enter your username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </CInputGroup>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold text-muted">Password</label>
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <CInputGroupText
                        role="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '0.85rem',
                          backgroundColor: 'transparent',
                          color: 'var(--cui-body-color)',
                          userSelect: 'none',
                        }}
                      >
                        {showConfirmPassword ?  <Eye size={20} /> : <EyeOff size={20} />}
                      </CInputGroupText>
                    </CInputGroup>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="rememberMe" />
                      <label className="form-check-label text-muted" htmlFor="rememberMe">
                        Remember Me
                      </label>
                    </div>
                    <Link
                      to="#"
                      className="text-decoration-none fw-semibold"
                      style={{
                        color: 'inherit',
                        textAlign: 'center',
                        display: 'block',
                        fontSize: '1rem',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => (e.target.style.color = '#0d6efd')}
                      onMouseLeave={(e) => (e.target.style.color = 'inherit')}
                      onClick={(e) => {
                        e.preventDefault()
                        setShowForgotModal(true)
                      }}
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <CButton
                    className="w-100 py-2 fw-semibold border-0 mb-3"
                    style={{
                      backgroundColor: 'var(--cui-primary)',
                      color: 'var(--cui-primary-color)',
                      fontSize: '1rem',
                      transition: 'background 0.3s',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = 'var(--cui-primary-dark)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = 'var(--cui-primary)')
                    }
                    onClick={handleLogin}
                  >
                    Sign in now
                  </CButton>

                  <p
                    className="text-center text-muted small mt-3"
                    style={{ lineHeight: '1.6', fontSize: '0.9rem' }}
                  >
                    Don't have an account?{' '}
                    <Link
                      to="/register"
                      className="text-decoration-none fw-semibold"
                      style={{ color: 'var(--cui-link-color)' }}
                    >
                      Register now
                    </Link>
                    .
                  </p>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>

      <ForgotPasswordModal
        visible={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        onSuccess={() =>
          setSuccessMessage('Password reset successful! Please login with your new password.')
        }
      />
    </div>
  )
}

export default Login

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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import authService from '../../../api/authservices/authService'
import EmailVerificationModal from '../emailVerify/EmailVerificationModal'

const Register = () => {
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [warningMessage, setWarningMessage] = useState('')

  const navigate = useNavigate()

  const registerUser = async () => {
    try {
      setSuccessMessage('')
      setErrorMessage('')
      setWarningMessage('')
      if (username === '') {
        setWarningMessage('Username is required!')
        return
      } else if (email === '') {
        setWarningMessage('Email is required!')
        return
      } else if (password === '') {
        setWarningMessage('Password is required!')
        return
      } else if (confirmPassword === '') {
        setWarningMessage('Please confirm your password!')
        return
      } else if (password !== confirmPassword) {
        setWarningMessage('')
        setErrorMessage('Passwords do not match!')
        return
      }

      setShowForgotModal(true)
    } catch (error) {
      console.warn('Error registering user:', error)
      setErrorMessage('Registration failed. Please try again.')
    }
  }

  const clear = () => {
    setEmail('')
    setUsername('')
    setPassword('')
    setConfirmPassword('')
    setWarningMessage('')
    setErrorMessage('')
    setSuccessMessage('User created successfully! Welcome to Janasiri!')
    setTimeout(() => {
      navigate('/login')
    }, 1000)
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
          <CCol md={9} lg={7} xl={6}>
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
                  <h2 className="fw-bold text-body">Register</h2>
                  <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                    Join <strong>JANASIRI MOTORS</strong> and get started
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
                    <label className="form-label fw-semibold text-muted">Username</label>
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={icon.cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Enter your username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </CInputGroup>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold text-muted">Email</label>
                    <CInputGroup>
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Enter your email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </CInputGroup>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold text-muted">Password</label>
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={icon.cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <CInputGroupText
                        role="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '0.85rem',
                          backgroundColor: 'transparent',
                          color: 'var(--cui-body-color)',
                          userSelect: 'none',
                        }}
                      >
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </CInputGroupText>
                    </CInputGroup>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold text-muted">Repeat Password</label>
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={icon.cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Repeat your password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
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
                        {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                      </CInputGroupText>
                    </CInputGroup>
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
                    onClick={registerUser}
                  >
                    Create Account
                  </CButton>

                  <p
                    className="text-center text-muted small mt-3"
                    style={{ lineHeight: '1.6', fontSize: '0.9rem' }}
                  >
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="text-decoration-none fw-semibold"
                      style={{ color: 'var(--cui-link-color)' }}
                    >
                      Sign in now
                    </Link>
                    .
                  </p>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>

      <EmailVerificationModal
        visible={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        onSuccess={() => clear()}
        onError={(msg) => {
          setShowForgotModal(false)
          setErrorMessage(msg)
        }}
        email={email}
        username={username}
        password={password}
      />
    </div>
  )
}

export default Register

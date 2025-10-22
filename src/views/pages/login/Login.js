import React from 'react'
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

const Login = () => {
  const navigate = useNavigate()

  const handleLogin = () => {

    navigate('/dashboard')
  }

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center position-relative"
      style={{
        backgroundImage: "url('/nature-3082832_1280.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 0,
        }}
      ></div>

      <CContainer className="position-relative" style={{ zIndex: 1 }}>
        <CRow className="justify-content-center">
          <CCol md={8} lg={6} xl={4}>
            <CCard
              className="border-0 shadow-lg p-4"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                borderRadius: '12px',
                backdropFilter: 'blur(6px)',
              }}
            >
              <CCardBody>
                <div className="text-center mb-4">
                  <h2 className="fw-bold" style={{ color: '#0f172a' }}>
                    Welcome Back
                  </h2>
                  <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                    Sign in to continue to <span className="fw-semibold">JANASIRI MOTORS</span>
                  </p>
                </div>

                <CForm>
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-muted">Email Address</label>
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        placeholder="Enter your username"
                        autoComplete="username"
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
                        type="password"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                      />
                    </CInputGroup>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                      />
                      <label
                        className="form-check-label text-muted"
                        htmlFor="rememberMe"
                      >
                        Remember Me
                      </label>
                    </div>
                    <Link
                      to="#"
                      className="text-decoration-none"
                      style={{ color: '#ff6a00', fontSize: '0.9rem' }}
                    >
                      Lost your password?
                    </Link>
                  </div>

                  <CButton
                    className="w-100 py-2 fw-semibold border-0 mb-3"
                    style={{
                      backgroundColor: '#ff6a00',
                      color: '#fff',
                      fontSize: '1rem',
                      transition: 'background 0.3s',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = '#e85d00')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = '#ff6a00')
                    }
                    onClick={handleLogin}
                  >
                    Sign in now
                  </CButton>

                  <p
                    className="text-center text-muted small mt-3"
                    style={{ lineHeight: '1.5' }}
                  >
                    By clicking on <strong>“Sign in now”</strong> you agree to our{' '}
                    <Link
                      to="#"
                      className="text-decoration-none"
                      style={{ color: '#ff6a00' }}
                    >
                      Terms of Service
                    </Link>{' '}
                    &amp;{' '}
                    <Link
                      to="#"
                      className="text-decoration-none"
                      style={{ color: '#ff6a00' }}
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login

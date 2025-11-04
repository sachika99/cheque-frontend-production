import React, { useEffect, useState } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput,
  CSpinner,
  CAlert,
} from '@coreui/react'
import authService from '../../../api/authservices/authService'

const ForgotPasswordModal = ({ visible, onClose, onSuccess }) => {
  const [forgotStep, setForgotStep] = useState(1)
  const [forgotEmail, setForgotEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [newPassErrorMessage, setNewPassErrorMessage] = useState('')
  const [otpErrorMessage, setOtpErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [newToken, setNewToken] = useState('')
  const [otp, setOTP] = useState('')
  const [registrationEmail, setRegistrationEmail] = useState('')
  const [registrationUserName, setRegistrationUserName] = useState('')

  const forgetPassword = async (email) => {
    try {
      setErrorMessage('')
      const response = await authService().forgotPassword(email)
      if (response?.data && response?.status === 200) {
        setNewToken(response?.data.newToken)
        setOTP(response?.data.otp)
        setRegistrationEmail(response?.data.email)
        setRegistrationUserName(response?.data.username)
        return true
      } else {
        setErrorMessage(response?.error)
        return false
      }
    } catch (error) {
      setErrorMessage(error?.response?.data || 'An error occurred. Please try again.')
      console.warn('Error during forgot password:', error)
      return false
    }
  }

  const resetPassword = async (email, token, password) => {
    try {
      setErrorMessage('')
      const response = await authService().resetPassword(email, token, password)
      if (response?.status === 200) {
        return true
      } else {
        setErrorMessage(response?.error)
        return false
      }
    } catch (error) {
      setNewPassErrorMessage(
        error?.response?.data[0]?.description || 'An error occurred. Please try again.',
      )
      console.warn('Error during forgot password:', error)
      return false
    }
  }
  const handleEmailSubmit = async () => {
    if (forgotEmail) {
      setIsLoading(true)
      const ok = await forgetPassword(forgotEmail)
      setIsLoading(false)
      if (ok) (setOtpErrorMessage(''), setForgotStep(2))
    }
  }

  const handleCodeSubmit = () => {
    if (verificationCode === otp.toString()) {
      setNewPassErrorMessage('')
      setForgotStep(3)
    } else {
      setOtpErrorMessage('Invalid OTP. Please check the code and try again.')
    }
  }

  const handlePasswordReset = async () => {
    if (newPassword.length < 8) {
      setNewPassErrorMessage('Password must be at least 8 characters long.')
      return
    }
    try {
      const resetResponse = await resetPassword(forgotEmail, newToken, newPassword)
      if (resetResponse) {
        onClose()
        onSuccess?.()
      } else {
        setErrorMessage(response?.error)
        return false
      }
    } catch (error) {
      console.error('Error during password reset:', error)
      setNewPassErrorMessage('An unexpected error occurred. Please try again later.')
    }
  }

  useEffect(() => {
    if (visible) {
      setForgotStep(1)
      setForgotEmail('')
      setVerificationCode('')
      setNewPassword('')
      setErrorMessage('')
      setIsLoading(false)
      setNewPassErrorMessage('')
      setOtpErrorMessage('')
    }
  }, [visible])

  return (
    <CModal
      visible={visible}
      onClose={() => !isLoading && onClose()}
      backdrop="static"
      alignment="center"
      size="lg"
    >
      <CModalHeader className="border-bottom pb-3">
        <CModalTitle className="fw-bold fs-4">
          {forgotStep === 1 && 'Reset Your Password'}
          {forgotStep === 2 && 'Verify Your Email'}
          {forgotStep === 3 && 'Create New Password'}
        </CModalTitle>
      </CModalHeader>

      {errorMessage && (
        <CAlert
          color="danger"
          dismissible
          className="mb-2 py-1 px-2 text-center"
          style={{
            fontSize: '1rem',
            lineHeight: '1',
            borderRadius: '4px',
            paddingTop: '4px',
            paddingBottom: '4px',
            paddingLeft: '8px',
            paddingRight: '8px',
            marginBottom: '6px',
            fontWeight: 500,
          }}
        >
          {errorMessage}
        </CAlert>
      )}

      <CModalBody className="px-5 py-4">
        {isLoading && (
          <div className="text-center py-5">
            <CSpinner color="primary" style={{ width: '3rem', height: '3rem' }} className="mb-4" />
            <h5 className="fw-semibold mb-2">Sending Verification Code</h5>
            <p className="text-muted mb-0">Please wait while we send the OTP to your email...</p>
          </div>
        )}

        {!isLoading && forgotStep === 1 && (
          <div>
            <p className="text-muted mb-4">
              Enter your registered{' '}
              <span className="fw-bold text-primary">Email address / Username</span> below. We'll
              send you a 4-digit verification code to ypur registerd Email.
            </p>

            {/* <label className="form-label fw-semibold mb-2">Email Address or Username</label> */}
            <CFormInput
              type="email"
              placeholder="Email Address or Username"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="py-3"
            />
          </div>
        )}

        {!isLoading && forgotStep === 2 && (
          <div className="text-center">
            {!otpErrorMessage && (
              <p
                className="text-center mb-4"
                style={{
                  fontSize: '0.95rem',
                  color: 'var(--cui-text-color, #6c757d)',
                  lineHeight: '1.6',
                }}
              >
                A 4-digit verification code has been sent to{' '}
                <strong style={{ color: 'var(--cui-link-color, #0d6efd)' }}>
                  {registrationEmail}
                </strong>
                .
              </p>
            )}

            {otpErrorMessage && (
              <CAlert
                color="danger"
                className="mb-3 py-2 px-3 text-start"
                dismissible
                style={{
                  fontSize: '0.9rem',
                  borderRadius: '6px',
                  maxWidth: '400px',
                  margin: '0 auto',
                }}
              >
                {otpErrorMessage}
              </CAlert>
            )}

            <label
              className="form-label fw-semibold mb-3 d-block"
              style={{
                color: 'var(--cui-text-color, #e0e0e0)',
                fontSize: '1rem',
              }}
            >
              Enter Verification Code
            </label>

            <CFormInput
              type="text"
              placeholder="0 0 0 0"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
              maxLength={4}
              className="mx-auto text-center"
              style={{
                width: '220px',
                fontSize: '1.8rem',
                letterSpacing: '0.6rem',
                fontWeight: '700',
                border: '2px solid #0d6efd',
                borderRadius: '10px',
                padding: '12px 0',
                color: '#fff',
                backgroundColor: '#0d1117',
                boxShadow: '0 2px 8px rgba(13,110,253,0.3)',
                transition: 'all 0.2s ease-in-out',
              }}
              onFocus={(e) => (e.target.style.boxShadow = '0 0 10px rgba(13,110,253,0.4)')}
              onBlur={(e) => (e.target.style.boxShadow = '0 2px 8px rgba(13,110,253,0.3)')}
            />

            <div className="text-center mt-4">
              <p
                className="mb-0"
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--cui-text-color, #6c757d)',
                }}
              >
                Secured{' '}
                <a
                  className="fw-semibold"
                  style={{
                    color: 'var(--cui-link-color, #0d6efd)',
                    textDecoration: 'none',
                  }}
                >
                  Web Portal
                </a>
              </p>
            </div>
          </div>
        )}

        {!isLoading && forgotStep === 3 && (
          <div className="px-2 py-3">
            <div className="mb-4">
              <p className="text-secondary mb-1">
                <strong>Username:</strong> {registrationUserName}
              </p>
              <p className="text-secondary mb-1">
                <strong>Email:</strong> {registrationEmail}
              </p>
              <p className="text-muted mb-0">
                Please choose a strong password to secure your account.
              </p>
            </div>

            {newPassErrorMessage && (
              <CAlert
                color="danger"
                className="mb-3 py-2 px-3 shadow-sm border-0"
                dismissible
                style={{ fontSize: '0.9rem', borderRadius: '8px' }}
              >
                {newPassErrorMessage}
              </CAlert>
            )}

            <div className="mb-3">
              <label className="form-label fw-semibold mb-2" htmlFor="newPassword">
                New Password
              </label>
              <CFormInput
                id="newPassword"
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="py-3 border-1 border-secondary-subtle rounded-2"
              />
              <small className="text-muted">
                Use at least 8 characters, including letters, numbers, and symbols.
              </small>
            </div>
          </div>
        )}
      </CModalBody>
      <CModalFooter className="border-top pt-3 px-5 pb-4 d-flex justify-content-end gap-2">
        <CButton
          color="danger"
          // variant="outline"
          onClick={onClose}
          disabled={isLoading}
          style={{
            minHeight: '40px',
            padding: '8px 20px',
            fontSize: '0.9rem',
            fontWeight: '600',
            borderWidth: '1.5px',
            color: '#fff',
          }}
        >
          Cancel
        </CButton>

        {forgotStep === 1 && (
          <CButton
            color="primary"
            onClick={handleEmailSubmit}
            disabled={!forgotEmail || isLoading}
            style={{
              minHeight: '40px',
              padding: '8px 20px',
              fontSize: '0.9rem',
              fontWeight: '600',
            }}
          >
            {isLoading ? (
              <>
                <CSpinner size="sm" className="me-2" /> Sending...
              </>
            ) : (
              'Send Verification Code'
            )}
          </CButton>
        )}

        {forgotStep === 2 && (
          <CButton
            color="primary"
            onClick={handleCodeSubmit}
            disabled={verificationCode.length !== 4}
            style={{
              minHeight: '40px',
              padding: '8px 20px',
              fontSize: '0.9rem',
              fontWeight: '600',
            }}
          >
            Verify & Continue
          </CButton>
        )}

        {forgotStep === 3 && (
          <CButton
            color="primary"
            onClick={handlePasswordReset}
            disabled={!newPassword || newPassword.length < 8}
            style={{
              minHeight: '40px',
              padding: '8px 20px',
              fontSize: '0.9rem',
              fontWeight: '600',
            }}
          >
            Update Password
          </CButton>
        )}
      </CModalFooter>
    </CModal>
  )
}

export default ForgotPasswordModal

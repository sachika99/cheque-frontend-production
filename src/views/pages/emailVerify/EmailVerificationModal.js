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

const EmailVerificationModal = ({ visible, onClose, onSuccess, onError,email, username, password }) => {
  const [forgotStep, setForgotStep] = useState(0)
  const [verificationCode, setVerificationCode] = useState('')
  const [otp, setOTP] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [otpErrorMessage, setOtpErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFloatingLoading, setIsFloatingLoading] = useState(false)

  const registerUser = async () => {
    try {
      setErrorMessage('')
      setIsLoading(true)
      const emailResponse = await authService().verifyEmail(email)
      if (emailResponse?.data) {
        setOTP(emailResponse.data.otp)
        setForgotStep(1)
      }
    } catch (error) {
      debugger
      console.warn('Error verifying email:', error)
      onError?.(error?.response?.data)
    } finally {
      setIsLoading(false)
    }
  }

  
  const handleCodeSubmit = async () => {
    if (verificationCode === otp.toString()) {
      setOtpErrorMessage('')
      try {
        setIsFloatingLoading(true)
        const response = await authService().register(email, username, password)
        if (response?.data) {
          onClose()
          onSuccess?.()
        }
      } catch (error) {
        setOtpErrorMessage('Registration failed. Please try again later.')
      } finally {
        setIsFloatingLoading(false)
      }
    } else {
      setOtpErrorMessage('Invalid OTP. Please check the code and try again.')
    }
  }

  useEffect(() => {
    if (visible) registerUser()
  }, [visible])

  return (
    <>
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
            <CSpinner color="primary" style={{ width: '4rem', height: '4rem' }} />
            <h6 className="text-light mt-3 fw-semibold">Please wait...</h6>
          </div>
        </div>
      )}

      <CModal
        visible={visible}
        onClose={() => !isLoading && onClose()}
        backdrop="static"
        alignment="center"
        size="lg"
        className="fade-in"
      >
        <CModalHeader className="border-bottom pb-2">
          <CModalTitle className="fw-bold fs-5">
            Email Verification
          </CModalTitle>
        </CModalHeader>

        <CModalBody className="px-5 py-4">
          {errorMessage && (
            <div className="d-flex justify-content-center">
              <CAlert
                color="danger"
                className="fw-semibold text-center py-2 px-3"
                style={{
                  display: 'inline-block',
                  maxWidth: '90%',
                  width: 'auto',
                  minWidth: '200px',
                  borderRadius: '8px',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                }}
              >
                {errorMessage}
              </CAlert>
            </div>
          )}


          {forgotStep === 0 && isLoading && (
            <div className="text-center py-5">
              <CSpinner color="primary" style={{ width: '3rem', height: '3rem' }} className="mb-4" />
              <h5 className="fw-semibold mb-2">Sending Verification Code</h5>
              <p className="text-muted mb-0">
                Please wait while we send an OTP to your email address...
              </p>
            </div>
          )}

          {forgotStep === 1 && (
            <div className="text-center animate__animated animate__fadeIn">
              <p
                className="mb-4"
                style={{
                  fontSize: '0.95rem',
                  color: '#6c757d',
                  lineHeight: '1.6',
                }}
              >
                A 4-digit verification code has been sent to your email.
              </p>

              {otpErrorMessage && (
                <CAlert
                  color="danger"
                  className="mb-3 py-2 px-3 text-start"
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

              <p className="mt-4 text-muted" style={{ fontSize: '0.9rem' }}>
                Secure verification powered by{' '}
                <span className="fw-semibold text-primary">Janasiri Motor Stores</span>
              </p>
            </div>
          )}
        </CModalBody>

        <CModalFooter className="border-top pt-3 px-5 pb-4 d-flex justify-content-end gap-2">
          <CButton
            color="danger"
            onClick={onClose}
            disabled={isLoading || isFloatingLoading}
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
              onClick={handleCodeSubmit}
              disabled={verificationCode.length !== 4 || isFloatingLoading}
              style={{
                minHeight: '40px',
                padding: '8px 20px',
                fontSize: '0.9rem',
                fontWeight: '600',
                transition: 'all 0.2s ease-in-out',
              }}
            >
              Verify & Continue
            </CButton>
          )}
        </CModalFooter>
      </CModal>
    </>
  )
}

export default EmailVerificationModal

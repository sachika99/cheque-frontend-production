import React, { useState, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CTabs,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CAlert,
} from '@coreui/react'
import { cilPrint, cilX, cilChevronLeft, cilChevronRight, cilSettings } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import ChequePrintOverlay from '../../components/ChequePrintOverlay'
import ChequeCalibration from '../../components/ChequeCalibration'
import { amountToWords } from '../../utils/amountToWords'

const ChequePreviewModal = ({ visible, onClose, chequeData, onPrint }) => {
  const [activeTab, setActiveTab] = useState('front')
  const [showCalibration, setShowCalibration] = useState(false)
   
  const getCalibrationKey = () => {
    const bankCode = chequeData.bankName?.toUpperCase().includes('SEYLAN') ? 'SEYLAN' : 'SEYLAN'
    return `cheque_calibration_${bankCode}`
  }
  
  const loadCalibration = () => {
    const saved = localStorage.getItem(getCalibrationKey())
    return saved ? JSON.parse(saved) : {}
  }
  
  const [calibration] = useState(loadCalibration)

  const handlePrint = () => {
  
    const existingPrintContainer = document.getElementById('cheque-print-only')
    if (existingPrintContainer) {
      existingPrintContainer.remove()
    }
    
    const printContainer = document.createElement('div')
    printContainer.id = 'cheque-print-only'
    printContainer.className = 'cheque-print-overlay-container'
    printContainer.style.cssText = 'position: absolute; left: -9999px; top: 0; width: 210mm; height: 99mm;'
    document.body.appendChild(printContainer)
     
    const overlay = document.querySelector('.cheque-print-overlay')
    if (overlay) {
      const clonedOverlay = overlay.cloneNode(true)
       
      clonedOverlay.style.backgroundImage = 'none'
      clonedOverlay.style.backgroundColor = 'white'
      printContainer.appendChild(clonedOverlay)
       
      const fields = clonedOverlay.querySelectorAll('.cheque-field')
      fields.forEach(field => {
        field.style.cssText += 'visibility: visible !important; display: block !important; opacity: 1 !important; color: #000000 !important;'
      })
    }
     
    setTimeout(() => {
      window.print()
      
      setTimeout(() => {
        if (printContainer) printContainer.remove()
      }, 1000)
    }, 100)
    
    if (onPrint) {
      onPrint()
    }
  }
 
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault()
        handlePrint()
      }
    }

    if (visible) {
      window.addEventListener('keydown', handleKeyPress)
      return () => {
        window.removeEventListener('keydown', handleKeyPress)
      }
    }
  }, [visible])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const chequePreviewData = {
    ...chequeData,
    amountInWords: chequeData.chequeAmount ? amountToWords(parseFloat(chequeData.chequeAmount)) : '',
    formattedDate: formatDate(chequeData.chequeDate),
    formattedAmount: chequeData.chequeAmount ? parseFloat(chequeData.chequeAmount).toFixed(2) : '0.00',
  }

  return (
    <CModal
      visible={visible}
      onClose={onClose}
      size="xl"
      backdrop="static"
      className="cheque-preview-modal"
    >
      <CModalHeader>
        <CModalTitle>Cheque Preview</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CAlert color="info" className="mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Preview Mode:</strong> This is how your cheque will appear when printed. 
              Please verify all details before printing.
            </div>
            <CButton
              color="warning"
              size="sm"
              onClick={() => setShowCalibration(true)}
              className="ms-2"
            >
              <CIcon icon={cilSettings} className="me-1" />
              Calibrate Positions
            </CButton>
          </div>
        </CAlert>

        <CTabs activeTab={activeTab} onActiveTabChange={setActiveTab}>
          <CNav variant="tabs">
            <CNavItem>
              <CNavLink data-tab="front">
                <CIcon icon={cilChevronRight} className="me-2" />
                Front Side
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink data-tab="back">
                <CIcon icon={cilChevronLeft} className="me-2" />
                Back Side
              </CNavLink>
            </CNavItem>
          </CNav>

          <CTabContent>
            <CTabPane visible={activeTab === 'front'}>
              <div className="cheque-preview-container mt-3">
                <div className="cheque-print-overlay-container">
                  <ChequePrintOverlay
                    side="front"
                    data={chequePreviewData}
                    bankCode={chequeData.bankName?.toUpperCase().includes('SEYLAN') ? 'SEYLAN' : 'SEYLAN'}
                    showPreview={true}
                    calibration={calibration}
                  />
                </div>
              </div>
            </CTabPane>

            <CTabPane visible={activeTab === 'back'}>
              <div className="cheque-preview-container mt-3">
                <div className="cheque-print-overlay-container">
                  <ChequePrintOverlay
                    side="back"
                    data={chequePreviewData}
                    bankCode={chequeData.bankName?.toUpperCase().includes('SEYLAN') ? 'SEYLAN' : 'SEYLAN'}
                    showPreview={true}
                    calibration={calibration}
                  />
                </div>
              </div>
            </CTabPane>
          </CTabContent>
        </CTabs>

        <div className="mt-3 p-3 bg-light rounded" style={{ color: '#333' }}>
          <h6 className="mb-2" style={{ color: '#1e88e5', fontWeight: 'bold' }}>Cheque Summary:</h6>
          <div className="row small" style={{ color: '#555' }}>
            <div className="col-md-6">
              <strong style={{ color: '#1e88e5' }}>Payee:</strong> <span style={{ color: '#333' }}>{chequeData.payeeName || 'N/A'}</span>
            </div>
            <div className="col-md-6">
              <strong style={{ color: '#1e88e5' }}>Amount:</strong> <span style={{ color: '#333' }}>LKR {chequePreviewData.formattedAmount}</span>
            </div>
            <div className="col-md-6 mt-2">
              <strong style={{ color: '#1e88e5' }}>Cheque No:</strong> <span style={{ color: '#333' }}>{chequeData.chequeNo || 'N/A'}</span>
            </div>
            <div className="col-md-6 mt-2">
              <strong style={{ color: '#1e88e5' }}>Date:</strong> <span style={{ color: '#333' }}>{chequePreviewData.formattedDate}</span>
            </div>
            <div className="col-md-6 mt-2">
              <strong style={{ color: '#1e88e5' }}>Bank:</strong> <span style={{ color: '#333' }}>{chequeData.bankName || 'N/A'}</span>
            </div>
            <div className="col-md-6 mt-2">
              <strong style={{ color: '#1e88e5' }}>Account:</strong> <span style={{ color: '#333' }}>{chequeData.accountNo || 'N/A'}</span>
            </div>
            <div className="col-md-12 mt-2">
              <strong style={{ color: '#1e88e5' }}>Amount in Words:</strong> <span style={{ color: '#333', fontStyle: 'italic' }}>{chequePreviewData.amountInWords}</span>
            </div>
          </div>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton 
          color="secondary" 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onClose()
          }}
        >
          <CIcon icon={cilX} className="me-2" />
          Close
        </CButton>
        <CButton 
          color="primary" 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handlePrint()
          }}
        >
          <CIcon icon={cilPrint} className="me-2" />
          Confirm & Print
        </CButton>
      </CModalFooter>
 
      <ChequeCalibration
        visible={showCalibration}
        onClose={() => {
          setShowCalibration(false)
          
          window.location.reload()
        }}
        chequeData={chequePreviewData}
        bankCode={chequeData.bankName?.toUpperCase().includes('SEYLAN') ? 'SEYLAN' : 'SEYLAN'}
      />
    </CModal>
  )
}

export default ChequePreviewModal


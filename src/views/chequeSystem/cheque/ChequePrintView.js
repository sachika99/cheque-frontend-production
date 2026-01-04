import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CButton,
  CRow,
  CCol,
  CAlert,
  CSpinner,
} from '@coreui/react'
import { cilPrint, cilArrowLeft, cilSearch } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import chequeServices from '../../../api/services/ChequeServices/chequeServices'
import bankAccountServices from '../../../api/services/BankAccountServices/bankAccountServices'
import bankService from '../../../api/services/BankServices/bankService'
import ChequePreviewModal from '../ChequePreviewModal'
import { formatAmount } from '../../../utils/amountToWords'

const ChequePrintView = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [formData, setFormData] = useState({
    chequeId: '',
    supplierId: '',
    supplierName: '',
    payeeName: '',
    invoiceNo: '',
    invoiceDate: '',
    invoiceAmount: '',
    chequeNo: '',
    chequeDate: '',
    chequeAmount: '',
    bankId: '',
    bankName: '',
    branchName: '',
    accountNo: '',
    accountName: '',
    chequeType: 'BEARER',
    notes: '',
  })

  useEffect(() => {
    fetchChequeData()
  }, [id])

  const fetchChequeData = async () => {
    try {
      setLoading(true)
       
      const cheque = await chequeServices.getChequeById(id)
       
      let bankName = ''
      let branchName = ''
      let accountName = ''
      let bankId = null
      
      if (cheque.bankAccountId) {
        try {
          const bankAccount = await bankAccountServices.getBankAccountById(cheque.bankAccountId)
          bankName = bankAccount.bankName || ''
          accountName = bankAccount.accountName || ''
          bankId = bankAccount.bankId
           
          if (bankId) {
            try {
              const bank = await bankService.getBankById(bankId)
              branchName = bank.branchName || ''
            } catch (error) {
              console.warn('Could not fetch bank details:', error)
            }
          }
        } catch (error) {
          console.warn('Could not fetch bank account details:', error)
        }
      }
 
      setFormData({
        chequeId: cheque.chequeId || '',
        supplierId: cheque.supplierId || '',
        supplierName: cheque.supplierName || '',
        payeeName: cheque.payeeName || cheque.supplierName || '',
        invoiceNo: cheque.invoiceNo || '',
        invoiceDate: cheque.invoiceDate ? cheque.invoiceDate.substring(0, 10) : '',
        invoiceAmount: cheque.invoiceAmount?.toString() || '',
        chequeNo: cheque.chequeNo || '',
        chequeDate: cheque.chequeDate ? cheque.chequeDate.substring(0, 10) : '',
        chequeAmount: cheque.chequeAmount?.toString() || '',
        bankId: cheque.bankAccountId?.toString() || '',
        bankName: bankName,
        branchName: branchName,
        accountNo: cheque.accountNo || '',
        accountName: accountName,
        chequeType: 'BEARER', 
        notes: '',
      })
    } catch (error) {
      toast.error(error.message || 'Failed to load cheque data')
      setTimeout(() => navigate('/cheque'), 2000)
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = () => {
    setShowPreview(true)
  }

  const handlePrint = () => {
    
    if (!formData.payeeName || !formData.chequeAmount) {
      toast.error('Please fill all required fields')
      return
    }
    setShowPreview(true)
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <CSpinner />
        <p className="mt-3">Loading cheque data...</p>
      </div>
    )
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Print Cheque - {formData.chequeId}</h5>
            <CButton
              variant="outline"
              color="secondary"
              size="sm"
              onClick={() => navigate('/cheque')}
            >
              <CIcon icon={cilArrowLeft} className="me-2" />
              Back to List
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          <CAlert color="info" className="mb-3">
            <strong>Print Mode:</strong> This is a read-only view of the cheque data. 
            To make changes, please use the Edit action from the cheque list.
          </CAlert>

          <CForm>
            <CRow className="mb-3">
              <CCol md={12}>
                <h6 className="text-primary border-bottom pb-2 mb-3">Cheque Details</h6>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>Supplier</CFormLabel>
                  <CFormInput
                    type="text"
                    value={formData.supplierName}
                    disabled
                  />
                </div>
              </CCol>

              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>Payee Name</CFormLabel>
                  <CFormInput
                    type="text"
                    value={formData.payeeName}
                    disabled
                  />
                </div>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={4}>
                <div className="mb-3">
                  <CFormLabel>Invoice Number</CFormLabel>
                  <CFormInput
                    type="text"
                    value={formData.invoiceNo}
                    disabled
                  />
                </div>
              </CCol>

              <CCol md={4}>
                <div className="mb-3">
                  <CFormLabel>Invoice Date</CFormLabel>
                  <CFormInput
                    type="date"
                    value={formData.invoiceDate}
                    disabled
                  />
                </div>
              </CCol>

              <CCol md={4}>
                <div className="mb-3">
                  <CFormLabel>Invoice Amount (LKR)</CFormLabel>
                  <CFormInput
                    type="text"
                    value={formatAmount(formData.invoiceAmount)}
                    disabled
                  />
                </div>
              </CCol>
            </CRow>

            <CRow className="mb-3 mt-4">
              <CCol md={12}>
                <h6 className="text-primary border-bottom pb-2 mb-3">Cheque Information</h6>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={4}>
                <div className="mb-3">
                  <CFormLabel>Bank</CFormLabel>
                  <CFormInput
                    type="text"
                    value={formData.bankName}
                    disabled
                  />
                </div>
              </CCol>

              <CCol md={4}>
                <div className="mb-3">
                  <CFormLabel>Branch</CFormLabel>
                  <CFormInput
                    type="text"
                    value={formData.branchName}
                    disabled
                  />
                </div>
              </CCol>

              <CCol md={4}>
                <div className="mb-3">
                  <CFormLabel>Account Number</CFormLabel>
                  <CFormInput
                    type="text"
                    value={formData.accountNo}
                    disabled
                  />
                </div>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={4}>
                <div className="mb-3">
                  <CFormLabel>Account Name</CFormLabel>
                  <CFormInput
                    type="text"
                    value={formData.accountName}
                    disabled
                  />
                </div>
              </CCol>

              <CCol md={4}>
                <div className="mb-3">
                  <CFormLabel>Cheque Number</CFormLabel>
                  <CFormInput
                    type="text"
                    value={formData.chequeNo}
                    disabled
                  />
                </div>
              </CCol>

              <CCol md={4}>
                <div className="mb-3">
                  <CFormLabel>Cheque Date</CFormLabel>
                  <CFormInput
                    type="date"
                    value={formData.chequeDate}
                    disabled
                  />
                </div>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={4}>
                <div className="mb-3">
                  <CFormLabel>Cheque Amount (LKR)</CFormLabel>
                  <CFormInput
                    type="text"
                    value={formatAmount(formData.chequeAmount)}
                    disabled
                  />
                  
                </div>
              </CCol>

              <CCol md={4}>
                <div className="mb-3">
                  <CFormLabel>Cheque Type</CFormLabel>
                  <CFormSelect
                    value={formData.chequeType}
                    disabled
                  >
                    <option value="BEARER">Bearer Cheque</option>
                    <option value="CROSS">Cross Cheque</option>
                  </CFormSelect>
                </div>
              </CCol>
            </CRow>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <CButton
                color="info"
                variant="outline"
                onClick={handlePreview}
                disabled={!formData.payeeName || !formData.chequeAmount}
              >
                <CIcon icon={cilSearch} className="me-2" />
                Preview Cheque
              </CButton>
              <CButton
                color="primary"
                onClick={handlePrint}
                disabled={!formData.payeeName || !formData.chequeAmount}
              >
                <CIcon icon={cilPrint} className="me-2" />
                Print Cheque
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>

      {showPreview && (
        <ChequePreviewModal
          visible={showPreview}
          onClose={() => setShowPreview(false)}
          chequeData={formData}
          onPrint={handlePrint}
        />
      )}

      <ToastContainer position="top-right" autoClose={2300} theme="colored" />
    </>
  )
}

export default ChequePrintView


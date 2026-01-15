import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CButton,
  CRow,
  CCol,
  CAlert,
} from '@coreui/react'
import { cilPrint, cilSearch } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import ChequePreviewModal from './ChequePreviewModal'
import { formatAmount } from '../../utils/amountToWords'

const ChequePrint = () => {
  const mockData = {
    banks: [
      { id: 1, name: 'Bank of Ceylon', branch: 'Colombo Fort', code: 'BOC' },
      { id: 2, name: 'People\'s Bank', branch: 'Kandy', code: 'PEOPLES' },
      { id: 3, name: 'Commercial Bank', branch: 'Galle', code: 'COMMERCIAL' },
      { id: 4, name: 'Sampath Bank', branch: 'Kandy', code: 'SAMPATH' },
    ],
    accounts: [
      { id: 1, accountNo: '1234567890', accountName: 'Janasiri Motor Stores', bankId: 1 },
      { id: 2, accountNo: '9876543210', accountName: 'Janasiri Motor Stores', bankId: 2 },
    ],
    suppliers: [
      { id: 1, name: 'ABC Motors Pvt Ltd', code: 'SUP001' },
      { id: 2, name: 'XYZ Auto Parts', code: 'SUP002' },
      { id: 3, name: 'Premier Auto Services', code: 'SUP003' },
    ],
  }

  const [formData, setFormData] = useState({
    supplierId: '',
    payeeName: 'ABC Motors Pvt Ltd',
    invoiceNo: 'INV-2024-001',
    invoiceDate: new Date().toISOString().split('T')[0],
    invoiceAmount: '50000.00',
    chequeNo: '000001',
    chequeDate: new Date().toISOString().split('T')[0],
    chequeAmount: '50000.00',
    bankId: '1',
    bankName: 'Bank of Ceylon',
    branchName: 'Colombo Fort',
    accountNo: '1234567890',
    accountName: 'Janasiri Motor Stores',
    chequeType: 'BEARER',
    notes: '',
  })

  const [showPreview, setShowPreview] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (name === 'bankId') {
      const bank = mockData.banks.find(b => b.id === parseInt(value))
      if (bank) {
        const account = mockData.accounts.find(a => a.bankId === bank.id)
        setFormData(prev => ({
          ...prev,
          bankName: bank.name,
          branchName: bank.branch,
          accountNo: account?.accountNo || '',
          accountName: account?.accountName || '',
        }))
      }
    }

    if (name === 'supplierId') {
      const supplier = mockData.suppliers.find(s => s.id === parseInt(value))
      if (supplier) {
        setFormData(prev => ({ ...prev, payeeName: supplier.name }))
      }
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.payeeName?.trim()) {
      newErrors.payeeName = 'Payee name is required'
    }

    if (!formData.chequeAmount || parseFloat(formData.chequeAmount) <= 0) {
      newErrors.chequeAmount = 'Valid cheque amount is required'
    }

    if (!formData.chequeDate) {
      newErrors.chequeDate = 'Cheque date is required'
    }

    if (!formData.chequeNo?.trim()) {
      newErrors.chequeNo = 'Cheque number is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePreview = () => {
    if (validateForm()) {
      setShowPreview(true)
    } else {
      setMessage({ type: 'danger', text: 'Please fill all required fields correctly' })
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    }
  }

  const handlePrint = () => {
    if (validateForm()) {
      window.print()
      setMessage({ type: 'success', text: 'Cheque sent to printer!' })
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    }
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <h5 className="mb-0">Cheque Print</h5>
          <small className="text-muted">Using mock data for preview and testing</small>
        </CCardHeader>
        <CCardBody>
          {message.text && (
            <CAlert color={message.type} className="mb-3">
              {message.text}
            </CAlert>
          )}

          <CForm>
            <CRow className="mb-3">
              <CCol md={12}>
                <h6 className="text-primary border-bottom pb-2 mb-3">Cheque Details</h6>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>
                    Supplier (Optional)
                  </CFormLabel>
                  <CFormSelect
                    name="supplierId"
                    value={formData.supplierId}
                    onChange={handleChange}
                  >
                    <option value="">Select Supplier</option>
                    {mockData.suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.code} - {supplier.name}
                      </option>
                    ))}
                  </CFormSelect>
                </div>
              </CCol>

              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>
                    Payee Name <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormInput
                    type="text"
                    name="payeeName"
                    value={formData.payeeName}
                    onChange={handleChange}
                    invalid={!!errors.payeeName}
                    placeholder="Enter payee name"
                  />
                  {errors.payeeName && (
                    <div className="text-danger small mt-1">{errors.payeeName}</div>
                  )}
                </div>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={4}>
                <div className="mb-3">
                  <CFormLabel>Invoice Number</CFormLabel>
                  <CFormInput
                    type="text"
                    name="invoiceNo"
                    value={formData.invoiceNo}
                    onChange={handleChange}
                    placeholder="INV-001"
                  />
                </div>
              </CCol>

              <CCol md={4}>
                <div className="mb-3">
                  <CFormLabel>Invoice Date</CFormLabel>
                  <CFormInput
                    type="date"
                    name="invoiceDate"
                    value={formData.invoiceDate}
                    onChange={handleChange}
                  />
                </div>
              </CCol>

              <CCol md={4}>
                <div className="mb-3">
                  <CFormLabel>Invoice Amount (LKR)</CFormLabel>
                  <CFormInput
                    type="number"
                    name="invoiceAmount"
                    value={formData.invoiceAmount}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
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
                  <CFormSelect
                    name="bankId"
                    value={formData.bankId}
                    onChange={handleChange}
                  >
                    {mockData.banks.map(bank => (
                      <option key={bank.id} value={bank.id}>
                        {bank.name} - {bank.branch}
                      </option>
                    ))}
                  </CFormSelect>
                </div>
              </CCol>

              <CCol md={4}>
                <div className="mb-3">
                  <CFormLabel>Account Number</CFormLabel>
                  <CFormInput
                    type="text"
                    name="accountNo"
                    value={formData.accountNo}
                    onChange={handleChange}
                    readOnly
                    className="bg-light"
                  />
                </div>
              </CCol>

              <CCol md={4}>
                <div className="mb-3">
                  <CFormLabel>Account Name</CFormLabel>
                  <CFormInput
                    type="text"
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleChange}
                    readOnly
                    className="bg-light"
                  />
                </div>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={4}>
                <div className="mb-3">
                  <CFormLabel>
                    Cheque Number <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormInput
                    type="text"
                    name="chequeNo"
                    value={formData.chequeNo}
                    onChange={handleChange}
                    invalid={!!errors.chequeNo}
                    placeholder="000001"
                  />
                  {errors.chequeNo && (
                    <div className="text-danger small mt-1">{errors.chequeNo}</div>
                  )}
                </div>
              </CCol>

              <CCol md={4}>
                <div className="mb-3">
                  <CFormLabel>
                    Cheque Date <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormInput
                    type="date"
                    name="chequeDate"
                    value={formData.chequeDate}
                    onChange={handleChange}
                    invalid={!!errors.chequeDate}
                  />
                  {errors.chequeDate && (
                    <div className="text-danger small mt-1">{errors.chequeDate}</div>
                  )}
                </div>
              </CCol>

              <CCol md={4}>
                <div className="mb-3">
                  <CFormLabel>
                    Cheque Amount (LKR) <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormInput
                    type="number"
                    name="chequeAmount"
                    value={formData.chequeAmount}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    invalid={!!errors.chequeAmount}
                    placeholder="0.00"
                  />
                  {errors.chequeAmount && (
                    <div className="text-danger small mt-1">{errors.chequeAmount}</div>
                  )}
                  {formData.chequeAmount && (
                    <div className="text-muted small mt-1">
                      {formatAmount(formData.chequeAmount)} LKR
                    </div>
                  )}
                </div>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>Cheque Type</CFormLabel>
                  <CFormSelect
                    name="chequeType"
                    value={formData.chequeType}
                    onChange={handleChange}
                  >
                    <option value="BEARER">Bearer Cheque</option>
                    <option value="CROSS">Cross Cheque</option>
                  </CFormSelect>
                </div>
              </CCol>
            </CRow>

            <CRow>
              <CCol md={12}>
                <div className="mb-3">
                  <CFormLabel>Notes (Optional)</CFormLabel>
                  <CFormTextarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Additional notes (optional)"
                  />
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
    </>
  )
}

export default ChequePrint

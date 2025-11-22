import React, { useState, useEffect } from 'react'
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
  CSpinner,
  CRow,
  CCol,
} from '@coreui/react'
import { cilArrowLeft, cilSave } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import bankAccountServices from '../../../api/services/BankAccountServices/bankAccountServices'
import chequeBookServices from '../../../api/services/ChequeBookServices/chequeBookServices'


const ChequeBookForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id

  const [loading, setLoading] = useState(isEditMode)
  const [submitting, setSubmitting] = useState(false)
  const [accounts, setAccounts] = useState([])
  const [formData, setFormData] = useState({
    bankAccountId: '',
    accountNo: '',
    chequeBookNo: '',
    startChequeNo: '',
    endChequeNo: '',
    currentChequeNo: '',
    issuedDate: '',
    status: 'Active',
    notes: '',
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchAccounts()
    if (isEditMode) fetchChequeBook()
    else setLoading(false)
  }, [id])

  const fetchAccounts = async () => {
    try {
      const response = await bankAccountServices.getAllBankAccounts()
      const list = Array.isArray(response) ? response : response?.data || []
      setAccounts(list)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const fetchChequeBook = async () => {
    try {
      const cb = await chequeBookServices.getChequeBookById(id)
      setFormData({
        bankAccountId: cb.bankAccountId || '',
        accountNo: cb.accountNo || '',
        chequeBookNo: cb.chequeBookNo || '',
        startChequeNo: cb.startChequeNo || '',
        endChequeNo: cb.endChequeNo || '',
        currentChequeNo: cb.currentChequeNo || '',
        issuedDate: cb.issuedDate ? cb.issuedDate.substring(0, 10) : '',
        status: cb.status || 'Active',
        notes: cb.notes || '',
      })
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.bankAccountId) newErrors.bankAccountId = 'Bank account is required'
    if (!formData.chequeBookNo.trim()) newErrors.chequeBookNo = 'Cheque book number is required'
    if (!formData.startChequeNo) newErrors.startChequeNo = 'Start number required'
    if (!formData.endChequeNo) newErrors.endChequeNo = 'End number required'
    if (Number(formData.endChequeNo) <= Number(formData.startChequeNo))
      newErrors.endChequeNo = 'End number must be greater than start number'

    if (!formData.issuedDate) newErrors.issuedDate = 'Issued date required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please correct the errors')
      return
    }

    setSubmitting(true)

    try {
      const payload = {
        ...formData,
        startChequeNo: Number(formData.startChequeNo),
        endChequeNo: Number(formData.endChequeNo),
        currentChequeNo: Number(formData.currentChequeNo || formData.startChequeNo),
      }

      if (isEditMode) {
        payload.id = parseInt(id)
        await chequeBookServices.updateChequeBook(id, payload)
        toast.success('Cheque book updated')
      } else {
        await chequeBookServices.createChequeBook(payload)
        toast.success('Cheque book created')
      }

      setTimeout(() => navigate('/chequeBook'), 1300)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <CSpinner />
      </div>
    )
  }

  return (
    <>
      <CCard className="mb-4 shadow-sm rounded-3">
        <CCardHeader className="py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-semibold">
              {isEditMode ? 'Edit Cheque Book' : 'Add New Cheque Book'}
            </h5>

            <CButton
              color="secondary"
              variant="outline"
              size="sm"
              onClick={() => navigate('/chequeBooks')}
            >
              <CIcon icon={cilArrowLeft} className="me-2" />
              Back to List
            </CButton>
          </div>
        </CCardHeader>

        <CCardBody className="pt-4">
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-4">
              <CCol md={6}>
                <CFormLabel>Bank Account <span className="text-danger">*</span></CFormLabel>
                <CFormSelect
                  name="bankAccountId"
                  value={formData.bankAccountId}
                  onChange={(e) => {
                    const acc = accounts.find(a => a.id == e.target.value)
                    setFormData(prev => ({
                      ...prev,
                      bankAccountId: acc?.id,
                      accountNo: acc?.accountNo || ''
                    }))
                  }}
                  invalid={!!errors.bankAccountId}
                >
                  <option value="">Select Account</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.accountNo} - {acc.bankName}
                    </option>
                  ))}
                </CFormSelect>
                {errors.bankAccountId && <div className="text-danger small mt-1">{errors.bankAccountId}</div>}
              </CCol>
            </CRow>

            <CRow className="mb-4">
              <CCol md={6}>
                <CFormLabel>Cheque Book No <span className="text-danger">*</span></CFormLabel>
                <CFormInput
                  name="chequeBookNo"
                  value={formData.chequeBookNo}
                  onChange={handleChange}
                  invalid={!!errors.chequeBookNo}
                />
                {errors.chequeBookNo && <div className="text-danger small mt-1">{errors.chequeBookNo}</div>}
              </CCol>

              <CCol md={6}>
                <CFormLabel>Issued Date <span className="text-danger">*</span></CFormLabel>
                <CFormInput
                  type="date"
                  name="issuedDate"
                  value={formData.issuedDate}
                  onChange={handleChange}
                  invalid={!!errors.issuedDate}
                />
                {errors.issuedDate && <div className="text-danger small mt-1">{errors.issuedDate}</div>}
              </CCol>
            </CRow>

            <CRow className="mb-4">
              <CCol md={4}>
                <CFormLabel>Start Cheque No</CFormLabel>
                <CFormInput
                  type="number"
                  name="startChequeNo"
                  value={formData.startChequeNo}
                  onChange={handleChange}
                  invalid={!!errors.startChequeNo}
                />
                {errors.startChequeNo && <div className="text-danger small mt-1">{errors.startChequeNo}</div>}
              </CCol>

              <CCol md={4}>
                <CFormLabel>End Cheque No</CFormLabel>
                <CFormInput
                  type="number"
                  name="endChequeNo"
                  value={formData.endChequeNo}
                  onChange={handleChange}
                  invalid={!!errors.endChequeNo}
                />
                {errors.endChequeNo && <div className="text-danger small mt-1">{errors.endChequeNo}</div>}
              </CCol>

              <CCol md={4}>
                <CFormLabel>Current Cheque No</CFormLabel>
                <CFormInput
                  type="number"
                  name="currentChequeNo"
                  value={formData.currentChequeNo}
                  onChange={handleChange}
                />
              </CCol>
            </CRow>

            {isEditMode && (
              <CRow className="mb-4">
                <CCol md={6}>
                  <CFormLabel>Status</CFormLabel>
                  <CFormSelect
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Used">Used</option>
                    <option value="Cancelled">Cancelled</option>
                  </CFormSelect>
                </CCol>
              </CRow>
            )}

            <CRow className="mb-4">
              <CCol md={12}>
                <CFormLabel>Notes</CFormLabel>
                <CFormTextarea
                  name="notes"
                  rows="3"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </CCol>
            </CRow>

            <div className="d-flex justify-content-end gap-2">
              <CButton
                color="secondary"
                variant="outline"
                onClick={() => navigate('/chequeBooks')}
              >
                Cancel
              </CButton>

              <CButton color="primary" type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <CSpinner size="sm" className="me-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CIcon icon={cilSave} className="me-2" />
                    {isEditMode ? 'Update Cheque Book' : 'Create Cheque Book'}
                  </>
                )}
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>

      <ToastContainer position="top-right" autoClose={2300} theme="colored" />
    </>
  )
}

export default ChequeBookForm

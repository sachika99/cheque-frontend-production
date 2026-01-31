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
import bankService from '../../../api/services/BankServices/bankService'

const BankAccountForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id

  const [loading, setLoading] = useState(isEditMode)
  const [submitting, setSubmitting] = useState(false)
const [banks, setBanks] = useState([])
  const [formData, setFormData] = useState({
    bankId: 0,
    bankName: '',
    accountNo: '',
    accountName: '',
    branchName:'',
    accountType: 'Current',
    balance: '10000',
    status: 'Active',
    notes: 'NOTE',
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isEditMode) {
      fetchAccount()
      fetchBanks()
    } else {
      setLoading(false)
    }
  }, [id])
  useEffect(() => {
    
        fetchBanks()
  }, [])

  const fetchAccount = async () => {
    try {
      const acc = await bankAccountServices.getBankAccountById(id)
      setFormData({
        bankId: acc.bankId || 0,
        bankName: acc.bankName || '',
        branchName: acc.branchName || '',
        accountNo: acc.accountNo || '',
        accountName: acc.accountName || '',
        accountType: acc.accountType || '',
        balance: acc.balance != null ? acc.balance : '',
        status: acc.status || 'Active',
        notes: acc.notes || '',
      })
    } catch (error) {
      toast.error(error.message || 'Failed to fetch bank account')
    } finally {
      setLoading(false)
    }
  }
const fetchBanks = async () => {
  setLoading(true)
  try {
    const response = await bankService.getAllBanks()

    setBanks(Array.isArray(response) ? response : response?.data || [])
  } catch (error) {
    toast.error(error.message || 'Failed to load banks')
  } finally {
    setLoading(false)
  }
}
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    

    if (!formData.accountNo.trim()) {
      newErrors.accountNo = 'Account number is required'
    } else if (formData.accountNo.trim().length < 3) {
      newErrors.accountNo = 'Account number must be at least 3 characters'
    }


    if (!formData.accountType.trim()) {
      newErrors.accountType = 'Account type is required'
    }

    if (formData.balance !== '' && isNaN(Number(formData.balance))) {
      newErrors.balance = 'Balance must be a valid number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please correct the errors in the form')
      return
    }

    setSubmitting(true)

    try {
      const payload = {
        ...formData,
        balance: formData.balance === '' ? 0 : Number(formData.balance),
        branchName:"kandy"
      }

      if (isEditMode) {
        payload.id = parseInt(id)
        await bankAccountServices.updateBankAccount(id, payload)
        toast.success('Bank account updated successfully')
      } else {
        await bankAccountServices.createBankAccount(payload)
        toast.success('Bank account created successfully')
      }

      setTimeout(() => {
        navigate('/bankAccounts')
      }, 1500)
    } catch (error) {
      toast.error(error.message || 'Failed to save bank account')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <CSpinner color="primary" />
      </div>
    )
  }
return (
  <>
    <CCard className="mb-4 shadow-sm rounded-3">
      <CCardHeader className="py-3">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-semibold">
            {isEditMode ? "Edit Bank Account" : "Add New Bank Account"}
          </h5>

          <CButton
            color="secondary"
            variant="outline"
            size="sm"
            onClick={() => navigate("/bankAccounts")}
            className="d-flex align-items-center"
          >
            <CIcon icon={cilArrowLeft} className="me-2" />
            Back to List
          </CButton>
        </div>
      </CCardHeader>

      <CCardBody className="pt-4">
        <CForm onSubmit={handleSubmit}>
          
          {/* Bank Name */}
          <CRow className="mb-4">
            <CCol md={6}>
              <CFormLabel className="fw-medium">
                Bank Name <span className="text-danger">*</span>
              </CFormLabel>

              <CFormSelect
                name="bankId"
                value={formData.bankId}
                onChange={(e) => {
  const selected = banks.find(b => b.id === Number(e.target.value))

  setFormData(prev => ({
    ...prev,
    bankId: selected?.id ?? null,
    branchName:selected.branchName
  }))
}}

                className="w-100"
                invalid={!!errors.bankId}
              >
                <option value="">Select Bank</option>
                {banks.map((bank) => (
                  <option key={bank.id} value={bank.id}>
                    {bank.bankName} - {bank.branchName}
                  </option>
                ))}
              </CFormSelect>

              {errors.bankId && (
                <div className="text-danger small mt-1">{errors.bankId}</div>
              )}
            </CCol>
            <CCol md={4}>
              <CFormLabel className="fw-medium">
                Account Number <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                type="text"
                name="accountNo"
                value={formData.accountNo}
                onChange={handleChange}
                invalid={!!errors.accountNo}
              />
              {errors.accountNo && (
                <div className="text-danger small mt-1">{errors.accountNo}</div>
              )}
            </CCol>
            
          </CRow>

          {/* Account No + Name */}
          <CRow className="mb-4">
            <CCol md={6}>
              <CFormLabel className="fw-medium">
                Account Name <span className="text-danger">*</span>
              </CFormLabel>
              <CFormInput
                type="text"
                name="accountName"
                value={formData.accountName}
                onChange={handleChange}
                invalid={!!errors.accountName}
              />
              {errors.accountName && (
                <div className="text-danger small mt-1">{errors.accountName}</div>
              )}
            </CCol>
<CCol md={4}>
              <CFormLabel className="fw-medium">
                Account Type <span className="text-danger">*</span>
              </CFormLabel>
              <CFormSelect
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                invalid={!!errors.accountType}
              >
                <option value="">Select Type</option>
                <option value="Savings">Savings</option>
                <option value="Current">Current</option>
                <option value="Fixed Deposit">Fixed Deposit</option>
                <option value="Loan">Loan</option>
              </CFormSelect>
              {errors.accountType && (
                <div className="text-danger small mt-1">{errors.accountType}</div>
              )}
            </CCol>
            
          </CRow>

          {/* Account Type + Balance */}
          {/* <CRow className="mb-4">
            

           
          </CRow> */}

          {/* Status */}
          {isEditMode && (
            <CRow className="mb-4">
              <CCol md={6}>
                <CFormLabel className="fw-medium">Status</CFormLabel>
                <CFormSelect
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </CFormSelect>
              </CCol>
            </CRow>
          )}

          {/* Notes */}
      

          {/* Buttons */}
          <div className="d-flex justify-content-end gap-2 mt-2">
            <CButton
              color="secondary"
              variant="outline"
              onClick={() => navigate("/bankAccounts")}
              disabled={submitting}
              className="px-4"
            >
              Cancel
            </CButton>

            <CButton color="primary" type="submit" disabled={submitting} className="px-4">
              {submitting ? (
                <>
                  <CSpinner size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                <>
                  <CIcon icon={cilSave} className="me-2" />
                  {isEditMode ? "Update Bank Account" : "Create Bank Account"}
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

export default BankAccountForm

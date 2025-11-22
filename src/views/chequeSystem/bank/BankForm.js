import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CButton,
  CSpinner,
  CRow,
  CCol,
} from '@coreui/react'
import { cilArrowLeft, cilSave, cilPlus, cilX } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate, useParams } from 'react-router-dom'
import bankService from '../../../api/services/BankServices/bankService'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const BankForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id

  const [loading, setLoading] = useState(isEditMode)
  const [submitting, setSubmitting] = useState(false)
  const [nextBankCode, setNextBankCode] = useState('BANK001')

  const [formData, setFormData] = useState({
    id:0,
    bankName: '',
    branchName: '',
    branchCode: '',
    status: '1',
  })

  const [errors, setErrors] = useState({})
  const [bankAccounts, setBankAccounts] = useState([])

  const [showAccountForm, setShowAccountForm] = useState(false)

  const [accountForm, setAccountForm] = useState({
    id:0,
    bankName:'',
    accountNo: '',
    accountName: '',
    accountType: '',
    balance: 0,
    status: 'Active',
  })

  useEffect(() => {
    if (isEditMode) fetchBank()
    else fetchNextBankCode()
  }, [id])

  const fetchNextBankCode = async () => {
    try {
      const banks = await bankService.getAllBanks()
      const list = Array.isArray(banks) ? banks : banks?.data || []

      if (!list || list.length === 0) {
        setNextBankCode('BANK001')
        return
      }

      const codes = list.map((b) => b.branchCode).filter((c) => c && c.startsWith('BANK'))

      if (codes.length === 0) {
        setNextBankCode('BANK001')
        return
      }

      const numbers = codes.map((c) => {
        const m = c.match(/BANK(\d+)/)
        return m ? parseInt(m[1]) : 0
      })

      const next = Math.max(...numbers) + 1
      setNextBankCode(`BANK${String(next).padStart(3, '0')}`)
    } catch {
      setNextBankCode('BANK001')
    }
  }

  const fetchBank = async () => {
    try {
      const bank = await bankService.getBankById(id)
      setFormData({
        bankName: bank.bankName,
        branchName: bank.branchName,
        branchCode: bank.branchCode,
        status: bank.status,
      })
    } catch (e) {
      toast.error('Failed to load bank')
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
    if (!formData.bankName.trim()) newErrors.bankName = 'Bank name is required'
    if (!formData.branchName.trim()) newErrors.branchName = 'Branch name is required'
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fill required fields')
      return false
    }
    return true
  }

  const handleAccountChange = (e) => {
    const { name, value } = e.target
    setAccountForm((prev) => ({ ...prev, [name]: value }))
  }

  const saveAccount = () => {
    if (!accountForm.accountNo.trim() || !accountForm.accountName.trim()) {
      toast.error('Account No and Account Name are required')
      return
    }

    const newAcc = {
      id: 0,
      bankId: 0,
      bankName: formData.bankName,
      ...accountForm,
    }

    setBankAccounts((prev) => [...prev, newAcc])

    toast.success('Account added')
    setShowAccountForm(false)

    setAccountForm({
      accountNo: '',
      accountName: '',
      accountType: '',
      balance: 0,
      status: 'Active',
    })
  }

  const handleSubmit = async (e) => {

    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)

    try {

      const payloadAccount = {
        ...accountForm,
        bankName: formData.bankName,
      }


      const payload = {
        ...formData,
        branchCode: isEditMode ? formData.branchCode : nextBankCode,
        bankAccounts: [payloadAccount],
      }

      if (isEditMode) {
      await bankService.updateBank(id, payload)
      toast.success('Bank updated')
    }
    else if (showAccountForm) {
      await bankService.createBankAndAccount(payload)
      toast.success('Bank + Account created')
    }
    else {
      await bankService.createBank(payload)
      toast.success('Bank created')
    }


      setTimeout(() => navigate('/banks'), 1200)
    } catch (error) {
      toast.error('Save failed')
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
        <CCardHeader>
          <div className="d-flex justify-content-between">
            <h5 className="fw-semibold">{isEditMode ? 'Edit Bank' : 'Add New Bank'}</h5>

            <CButton
              color="secondary"
              variant="outline"
              onClick={() => navigate('/banks')}
              className="d-flex align-items-center"
            >
              <CIcon icon={cilArrowLeft} className="me-2" />
              Back
            </CButton>
          </div>
        </CCardHeader>

        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-4">
              <CCol md={6}>
                <CFormLabel>Branch Code</CFormLabel>
                <CFormInput
                  type="text"
                  name="branchCode"
                  disabled={!isEditMode}
                  value={isEditMode ? formData.branchCode : nextBankCode}
                  onChange={handleChange}
                />
              </CCol>

              <CCol md={6}>
                <CFormLabel>
                  Bank Name <span className="text-danger">*</span>
                </CFormLabel>
                <CFormSelect
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  invalid={!!errors.bankName}
                >
                  <option value="">Select Bank</option>
                  <option value="Bank of Ceylon">Bank of Ceylon</option>
                  <option value="People's Bank">People's Bank</option>
                  <option value="National Savings Bank">National Savings Bank</option>
                  <option value="HNB">Hatton National Bank</option>
                  <option value="Commercial Bank">Commercial Bank</option>
                  <option value="Sampath Bank">Sampath Bank</option>
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mb-4">
              <CCol md={6}>
                <CFormLabel>
                  Branch Name <span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  type="text"
                  name="branchName"
                  value={formData.branchName}
                  invalid={!!errors.branchName}
                  onChange={handleChange}
                />
              </CCol>
            </CRow>
            <br></br>
            {!showAccountForm ? (
              <CButton color="info" type="button" onClick={() => setShowAccountForm(true)}>
                <CIcon icon={cilPlus} className="me-2" />
                Add Bank Account
              </CButton>
            ):(
              <div className="border rounded p-30 mb-40">
                <div className="d-flex justify-content-between mb-3">
                  <h6 className="fw-bold">Add Bank Account</h6>

                </div>

                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel>Account Number</CFormLabel>
                    <CFormInput
                      name="accountNo"
                      value={accountForm.accountNo}
                      onChange={handleAccountChange}
                    />
                  </CCol>

                  <CCol md={6}>
                    <CFormLabel>Account Holder's Name</CFormLabel>
                    <CFormInput
                      name="accountName"
                      value={accountForm.accountName}
                      onChange={handleAccountChange}
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel>Account Type</CFormLabel>
                    <CFormSelect
                      name="accountType"
                      value={accountForm.accountType}
                      onChange={handleAccountChange}
                    >
                      <option value="">Select Type</option>
                      <option value="Savings">Savings</option>
                      <option value="Current">Current</option>
                      <option value="Fixed Deposit">Fixed Deposit</option>
                    </CFormSelect>
                  </CCol>

                  <CCol md={6}>
                    <CFormLabel>Balance</CFormLabel>
                    <CFormInput
                      type="number"
                      name="balance"
                      value={accountForm.balance}
                      onChange={handleAccountChange}
                    />
                  </CCol>
                </CRow>

                <CFormLabel>Status</CFormLabel>
                <CFormSelect
                  name="status"
                  value={accountForm.status}
                  onChange={handleAccountChange}
                  className="mb-3"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </CFormSelect>

                <CButton color="primary" onClick={() => setShowAccountForm(false)}>
                  CLOSE
                </CButton>
              </div>
            )}

            <div className="d-flex justify-content-end gap-2 mt-3">
              <CButton color="secondary" variant="outline" onClick={() => navigate('/banks')}>
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
                    {isEditMode ? 'Update Bank' : 'Create Bank'}
                  </>
                )}
              </CButton>
            </div>
          </CForm>
        </CCardBody>
      </CCard>

      <ToastContainer position="top-right" autoClose={2300} theme="colored" draggable />
    </>
  )
}

export default BankForm

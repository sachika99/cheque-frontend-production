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
  CSpinner,
  CRow,
  CCol,
} from '@coreui/react'
import { cilArrowLeft, cilSave } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { ToastContainer, toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import bankAccountServices from '../../../api/services/BankAccountServices/bankAccountServices'
import chequeServices from '../../../api/services/ChequeServices/chequeServices'
import vendorService from '../../../api/services/VendorServices/vendorService'
import chequeBookServices from '../../../api/services/ChequeBookServices/chequeBookServices'
import 'react-toastify/dist/ReactToastify.css'

const ChequeForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id

  const [loading, setLoading] = useState(isEditMode)
  const [submitting, setSubmitting] = useState(false)
  const [suppliers, setSuppliers] = useState([])
  const [accounts, setAccounts] = useState([])
  const [ChequeBooks, setChequeBooks] = useState([])
  const [nextChequeId, setNextChequeId] = useState('')
  const [fetchingCode, setFetchingCode] = useState(false)

  const [formData, setFormData] = useState({
    chequeId: '',
    supplierId: 0,
    chequeBookId: 0,
    supplierName: '',
    bankAccountId: 0,
    accountNo: '',
    invoiceNo: '',
    invoiceDate: '',
    invoiceAmount: '',
    chequeNo: '',
    chequeDate: '',
    dueDate: '',
    chequeAmount: '',
    receiptNo: '',
    payeeName: '',
    status: 'Pending',
    isVerified: false,
    isOverdue: false,
  })

  useEffect(() => {
    fetchSuppliers()
    fetchAccounts()

    if (isEditMode) {
      fetchPayment()
    } else {
      generateNextChequeId()
      setLoading(false)
    }
  }, [])

  const generateNextChequeId = async () => {
    setFetchingCode(true)
    try {
      const res = await chequeServices.getAllCheques()
      const items = Array.isArray(res) ? res : res?.data || []

      const validIds = items
        .map(x => x.chequeId)
        .filter(id => typeof id === 'string' && /^CHEQ\d{3,}$/.test(id))

      if (validIds.length === 0) {
        setNextChequeId('CHEQ001')
      } else {
        const numbers = validIds.map(code =>
          parseInt(code.replace('CHEQ', ''))
        )

        const nextNum = Math.max(...numbers) + 1
        setNextChequeId(`CHEQ${String(nextNum).padStart(3, '0')}`)
      }
    } catch {
      setNextChequeId('CHEQ001')
    } finally {
      setFetchingCode(false)
    }
  }

  const fetchSuppliers = async () => {
    const res = await vendorService.getAllVendors()
    setSuppliers(Array.isArray(res) ? res : res?.data || [])
  }

  const fetchAccounts = async () => {
    const res = await bankAccountServices.getAllBankAccounts()
    setAccounts(Array.isArray(res) ? res : res?.data || [])
  }

  const fetchChequeBooks = async (id) => {
    const res = await chequeBookServices.getChequeBookByCheckBookId(id)
    setChequeBooks(Array.isArray(res) ? res : res?.data || [])
  }

  const fetchPayment = async () => {
    try {
      const p = await chequeServices.getChequeById(id)
      setFormData({
        chequeId: p.chequeId,
        supplierId: p.supplierId,
        chequeBookId: p.chequeBookId,
        supplierName: p.supplierName,
        bankAccountId: p.bankAccountId,
        accountNo: p.accountNo,
        invoiceNo: p.invoiceNo,
        invoiceDate: p.invoiceDate?.substring(0, 10),
        invoiceAmount: p.invoiceAmount,
        chequeNo: p.chequeNo,
        chequeDate: p.chequeDate?.substring(0, 10),
        dueDate: p.dueDate?.substring(0, 10),
        chequeAmount: p.chequeAmount,
        receiptNo: p.receiptNo,
        payeeName: p.payeeName,
        status: p.status,
        isVerified: p.isVerified,
        isOverdue: p.isOverdue,
      })
      await fetchChequeBooks(p.bankAccountId)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const payload = {
        ...formData,
        chequeId: isEditMode ? formData.chequeId : nextChequeId,
        invoiceAmount: Number(formData.invoiceAmount),
        chequeAmount: Number(formData.chequeAmount),
      }

      if (isEditMode) {
        await chequeServices.updateCheque(id, payload)
        toast.success('Payment Updated')
      } else {
        await chequeServices.createCheque(payload)
        toast.success('Payment Created')
      }

      setTimeout(() => navigate('/cheque'), 1200)
    } catch (err) {
      toast.error(err.message)
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
      <CCard className="shadow-sm">
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0 d-flex align-items-center gap-3">
              {isEditMode ? 'Edit Cheque Payment' : 'Add Cheque Payment'}

              {!isEditMode ? (
                <span className="badge bg-success px-3 py-2">{nextChequeId}</span>
              ) : (
                <span className="badge bg-warning px-3 py-2">{formData.chequeId}</span>
              )}
            </h4>

            <CButton
              variant="outline"
              color="secondary"
              size="sm"
              onClick={() => navigate('/cheque')}
            >
              <CIcon icon={cilArrowLeft} className="me-2" />
              Back
            </CButton>
          </div>
        </CCardHeader>

        <CCardBody className="pt-4">
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-4">
              <CCol md={4}>
                <CFormLabel className="fw-medium">Supplier <span className="text-danger">*</span></CFormLabel>
                <CFormSelect
                  name="supplierId"
                  required
                  value={formData.supplierId}
                  onChange={(e) => {
                    const s = suppliers.find(x => x.id == e.target.value)
                    setFormData(prev => ({
                      ...prev,
                      supplierId: s?.id,
                      supplierName: s?.vendorName || '',
                      payeeName: s?.vendorName || '',
                    }))
                  }}
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>{s.vendorName}</option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol md={4}>
                <CFormLabel className="fw-medium">Bank Account <span className="text-danger">*</span></CFormLabel>
                <CFormSelect
                  name="bankAccountId"
                  required
                  value={formData.bankAccountId}
                  onChange={(e) => {
                    const a = accounts.find(x => x.id == e.target.value)
                    fetchChequeBooks(a?.id)
                    setFormData(prev => ({
                      ...prev,
                      bankAccountId: a?.id,
                      accountNo: a?.accountNo || '',
                    }))
                  }}
                >
                  <option value="">Select Account</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.accountNo} — {a.bankName}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol md={4}>
                <CFormLabel className="fw-medium">Cheque Book No <span className="text-danger">*</span></CFormLabel>

                <CFormSelect
                  required
                  disabled={isEditMode || !formData.bankAccountId || ChequeBooks.length === 0}
                  name="chequeBookId"
                  value={formData.chequeBookId}
                  onChange={(e) => {
                    if (!isEditMode) {
                      const s = ChequeBooks.find(x => x.id == e.target.value)
                      setFormData(prev => ({ ...prev, chequeBookId: s?.id }))
                    }
                  }}
                >
                  <option value="">Select Cheque Book No</option>
                  {ChequeBooks.map((s) => (
                    <option key={s.id} value={s.id}>{s.chequeBookNo}</option>
                  ))}
                </CFormSelect>

                {!formData.bankAccountId && (
                  <small className="text-danger fw-semibold">
                    Select a bank account first to load cheque books.
                  </small>
                )}
              </CCol>
            </CRow>

            <hr className="my-4" />

            <CRow className="mb-4">
              <CCol md={4}>
                <CFormLabel>Invoice No</CFormLabel>
                <CFormInput required name="invoiceNo" value={formData.invoiceNo} onChange={handleChange} />
              </CCol>

              <CCol md={4}>
                <CFormLabel>Invoice Date</CFormLabel>
                <CFormInput type="date" required name="invoiceDate" value={formData.invoiceDate} onChange={handleChange} />
              </CCol>

              <CCol md={4}>
                <CFormLabel>Invoice Amount</CFormLabel>
                <CFormInput type="number" required name="invoiceAmount" value={formData.invoiceAmount} onChange={handleChange} />
              </CCol>
            </CRow>

            <CRow className="mb-4">
              <CCol md={4}>
                <CFormLabel>Cheque No</CFormLabel>
                <CFormInput required name="chequeNo" value={formData.chequeNo} onChange={handleChange} />
              </CCol>

              <CCol md={4}>
                <CFormLabel>Cheque Date</CFormLabel>
                <CFormInput type="date" required name="chequeDate" value={formData.chequeDate} onChange={handleChange} />
              </CCol>

              <CCol md={4}>
                <CFormLabel>Due Date</CFormLabel>
                <CFormInput type="date" required name="dueDate" value={formData.dueDate} onChange={handleChange} />
              </CCol>
            </CRow>

            <CRow className="mb-4">
              <CCol md={4}>
                <CFormLabel>Cheque Amount</CFormLabel>
                <CFormInput type="number" required name="chequeAmount" value={formData.chequeAmount} onChange={handleChange} />
              </CCol>

              <CCol md={4}>
                <CFormLabel>Receipt No</CFormLabel>
                <CFormInput required name="receiptNo" value={formData.receiptNo} onChange={handleChange} />
              </CCol>

              <CCol md={4}>
                <CFormLabel>Status</CFormLabel>
                <CFormSelect required name="status" value={formData.status} onChange={handleChange}>
                  <option value="Pending">Pending</option>
                  <option value="Issued">Issued</option>
                  <option value="Cleared">Cleared</option>
                  <option value="Bounced">Bounced</option>
                </CFormSelect>
              </CCol>
            </CRow>

            <div className="d-flex justify-content-end gap-2">
              <CButton
                variant="outline"
                color="secondary"
                disabled={submitting}
                onClick={() => navigate('/cheque')}
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
                    {isEditMode ? 'Update Payment' : 'Create Payment'}
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

export default ChequeForm

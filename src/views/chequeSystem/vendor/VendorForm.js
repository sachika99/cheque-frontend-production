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
import vendorService from '../../../api/services/VendorServices/vendorService'
import { useNavigate, useParams } from 'react-router-dom'

const VendorForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id

  const [loading, setLoading] = useState(isEditMode)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const [formData, setFormData] = useState({
    vendorCode: '',
    vendorName: '',
    vendorAddress: '',
    vendorPhoneNo: '',
    vendorEmail: '',
    bankName: '',
    accountNumber: '',
    crediPeriodDays: '',
    contactPerson: '',
    notes: '',
    status: 1, 
  })

  const [errors, setErrors] = useState({})
  const [nextVendorCode, setNextVendorCode] = useState('')
  const [fetchingCode, setFetchingCode] = useState(false)

  useEffect(() => {
    if (isEditMode) {
      fetchVendor()
    } else { 
      fetchNextVendorCode()
    }
  }, [id])

  const fetchNextVendorCode = async () => {
    setFetchingCode(true)
    try { 
      const vendors = await vendorService.getAllVendors()
      
      if (!vendors || vendors.length === 0) {
        setNextVendorCode('VENDOR001')
      } else { 
        const vendorCodes = vendors
          .map(v => v.vendorCode)
          .filter(code => code && code.startsWith('VENDOR'))
        
        if (vendorCodes.length === 0) {
          setNextVendorCode('VENDOR001')
        } else { 
          const numbers = vendorCodes.map(code => {
            const match = code.match(/VENDOR(\d+)/i)
            return match ? parseInt(match[1]) : 0
          })
          
          const maxNumber = Math.max(...numbers)
          const nextNumber = maxNumber + 1
          setNextVendorCode(`VENDOR${String(nextNumber).padStart(3, '0')}`)
        }
      }
    } catch (error) { 
      setNextVendorCode('VENDOR001')
      console.warn('Could not fetch vendor codes, using VENDOR001 as default')
    } finally {
      setFetchingCode(false)
    }
  }

  const fetchVendor = async () => {
    try {
      const vendor = await vendorService.getVendorById(id)
      setFormData({
        vendorCode: vendor.vendorCode || '',
        vendorName: vendor.vendorName || '',
        vendorAddress: vendor.vendorAddress || '',
        vendorPhoneNo: vendor.vendorPhoneNo || '',
        vendorEmail: vendor.vendorEmail || '',
        bankName: vendor.bankName || '',
        accountNumber: vendor.accountNumber || '',
        crediPeriodDays: vendor.crediPeriodDays?.toString() || '',
        contactPerson: vendor.contactPerson || '',
        notes: vendor.notes || '',
        status: vendor.status || 1,
      })
    } catch (error) {
      showMessage('danger', error.message || 'Failed to fetch vendor details')
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
 
    if (isEditMode && formData.vendorCode && formData.vendorCode.trim().length < 3) {
      newErrors.vendorCode = 'Vendor code must be at least 3 characters'
    }
 
    if (!formData.vendorName.trim()) {
      newErrors.vendorName = 'Vendor name is required'
    } else if (formData.vendorName.trim().length < 3) {
      newErrors.vendorName = 'Vendor name must be at least 3 characters'
    }
 
    if (formData.vendorEmail && !isValidEmail(formData.vendorEmail)) {
      newErrors.vendorEmail = 'Invalid email format (e.g., user@example.com)'
    }
 
    if (formData.vendorPhoneNo && !isValidPhone(formData.vendorPhoneNo)) {
      newErrors.vendorPhoneNo = 'Invalid phone number format'
    }
 
    if (formData.accountNumber && formData.accountNumber.trim().length < 3) {
      newErrors.accountNumber = 'Account number must be at least 3 characters'
    }
 
    if (formData.crediPeriodDays && (parseInt(formData.crediPeriodDays) < 0 || parseInt(formData.crediPeriodDays) > 365)) {
      newErrors.crediPeriodDays = 'Credit period must be between 0 and 365 days'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const isValidPhone = (phone) => {
    return /^[0-9+\-\s()]+$/.test(phone)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      showMessage('danger', 'Please correct the errors in the form')
      return
    }

    setSubmitting(true)

    try {
      const payload = {
        ...formData, 
        vendorCode: !isEditMode ? nextVendorCode : formData.vendorCode,
        crediPeriodDays: formData.crediPeriodDays ? parseInt(formData.crediPeriodDays) : null,
      }

      if (isEditMode) {
        payload.id = parseInt(id)
        await vendorService.updateVendor(id, payload)
        showMessage('success', 'Vendor updated successfully')
      } else {
        await vendorService.createVendor(payload)
        showMessage('success', 'Vendor created successfully')
      }

      setTimeout(() => {
        navigate('/vendors')
      }, 1500)
    } catch (error) {
      showMessage('danger', error.message || 'Failed to save vendor')
    } finally {
      setSubmitting(false)
    }
  }

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 5000)
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <CCard className="mb-4">
      <CCardHeader>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{isEditMode ? 'Edit Vendor' : 'Add New Vendor'}</h5>
          <CButton color="secondary" variant="outline" onClick={() => navigate('/vendors')}>
            <CIcon icon={cilArrowLeft} className="me-2" />
            Back to List
          </CButton>
        </div>
      </CCardHeader>
      <CCardBody>
        {message.text && (
          <div className={`alert alert-${message.type} mb-3`} role="alert">
            {message.text}
          </div>
        )}

        <CForm onSubmit={handleSubmit}>
          <CRow>
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel>
                  Vendor Code {isEditMode && <span className="text-danger">*</span>}
                  {!isEditMode && <span className="text-success">Auto-generated</span>}
                </CFormLabel>
                <CFormInput
                  type="text"
                  name="vendorCode"
                  value={!isEditMode ? nextVendorCode : formData.vendorCode}
                  onChange={handleChange}
                  invalid={!!errors.vendorCode}
                  disabled={true}
                  readOnly={true}
                  className="bg-light"
                />
                {!isEditMode && fetchingCode && (
                  <div className="text-muted small mt-1">
                    <CSpinner size="sm" className="me-1" />
                    Fetching next vendor code...
                  </div>
                )}
                {errors.vendorCode && (
                  <div className="text-danger small mt-1">{errors.vendorCode}</div>
                )}
              </div>
            </CCol>

            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel>
                  Vendor Name <span className="text-danger">*</span>
                </CFormLabel>
                <CFormInput
                  type="text"
                  name="vendorName"
                  value={formData.vendorName}
                  onChange={handleChange}
                  invalid={!!errors.vendorName}
                />
                {errors.vendorName && (
                  <div className="text-danger small mt-1">{errors.vendorName}</div>
                )}
              </div>
            </CCol>
          </CRow>

          <CRow>
            <CCol md={12}>
              <div className="mb-3">
                <CFormLabel>Address</CFormLabel>
                <CFormTextarea
                  name="vendorAddress"
                  value={formData.vendorAddress}
                  onChange={handleChange}
                  rows="2"
                />
              </div>
            </CCol>
          </CRow>

          <CRow>
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel>Phone Number</CFormLabel>
                <CFormInput
                  type="text"
                  name="vendorPhoneNo"
                  value={formData.vendorPhoneNo}
                  onChange={handleChange}
                  invalid={!!errors.vendorPhoneNo}
                />
                {errors.vendorPhoneNo && (
                  <div className="text-danger small mt-1">{errors.vendorPhoneNo}</div>
                )}
              </div>
            </CCol>

            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel>Email</CFormLabel>
                <CFormInput
                  type="email"
                  name="vendorEmail"
                  value={formData.vendorEmail}
                  onChange={handleChange}
                  invalid={!!errors.vendorEmail}
                />
                {errors.vendorEmail && (
                  <div className="text-danger small mt-1">{errors.vendorEmail}</div>
                )}
              </div>
            </CCol>
          </CRow>

          <CRow>
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel>Bank Name</CFormLabel>
                <CFormInput
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                />
              </div>
            </CCol>

            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel>Account Number</CFormLabel>
                <CFormInput
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  invalid={!!errors.accountNumber}
                />
                {errors.accountNumber && (
                  <div className="text-danger small mt-1">{errors.accountNumber}</div>
                )}
              </div>
            </CCol>
          </CRow>

          <CRow>
            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel>Credit Period (Days)</CFormLabel>
                <CFormInput
                  type="number"
                  name="crediPeriodDays"
                  value={formData.crediPeriodDays}
                  onChange={handleChange}
                  min="0"
                  max="365"
                  invalid={!!errors.crediPeriodDays}
                />
                {errors.crediPeriodDays && (
                  <div className="text-danger small mt-1">{errors.crediPeriodDays}</div>
                )}
              </div>
            </CCol>

            <CCol md={6}>
              <div className="mb-3">
                <CFormLabel>Contact Person</CFormLabel>
                <CFormInput
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                />
              </div>
            </CCol>
          </CRow>

          {isEditMode && (
            <CRow>
              <CCol md={6}>
                <div className="mb-3">
                  <CFormLabel>Status</CFormLabel>
                  <CFormSelect name="status" value={formData.status} onChange={handleChange}>
                    <option value="1">Active</option>
                    <option value="2">Inactive</option>
                    <option value="3">Suspended</option>
                    <option value="4">Blacklisted</option>
                  </CFormSelect>
                </div>
              </CCol>
            </CRow>
          )}

          <CRow>
            <CCol md={12}>
              <div className="mb-3">
                <CFormLabel>Notes</CFormLabel>
                <CFormTextarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
            </CCol>
          </CRow>

          <div className="d-flex justify-content-end gap-2">
            <CButton
              color="secondary"
              variant="outline"
              onClick={() => navigate('/vendors')}
              disabled={submitting}
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
                  {isEditMode ? 'Update Vendor' : 'Create Vendor'}
                </>
              )}
            </CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default VendorForm

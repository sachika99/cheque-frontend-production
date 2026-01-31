import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CInputGroup,
  CFormInput,
  CFormSelect,
  CBadge,
  CSpinner,
  CPagination,
  CPaginationItem,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import {
  cilSearch,
  cilPlus,
  cilPencil,
  cilTrash,
  cilCheck,
  cilX,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'
import vendorService from '../../../api/services/VendorServices/vendorService'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const VendorList = () => {
  const navigate = useNavigate()

  /* ================= STATE ================= */
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })

  const VENDOR_STATUS = {
    0: { label: 'Unknown', color: 'info' },
    1: { label: 'Active', color: 'success' },
    2: { label: 'Inactive', color: 'secondary' },
    3: { label: 'Suspended', color: 'warning' },
    4: { label: 'Blacklisted', color: 'danger' },
  }

  /* ================= EFFECT ================= */
  useEffect(() => {
    fetchVendors()
  }, [currentPage, pageSize, searchTerm, statusFilter])

  /* ================= FETCH ================= */
  const fetchVendors = async () => {
    setLoading(true)
    try {
      const searchCriteria = {
        searchTerm: searchTerm || null,
        status: statusFilter ? parseInt(statusFilter) : null,
        pageNumber: currentPage,
        pageSize: pageSize,
      }

      const response = await vendorService.searchVendors(searchCriteria)
      setVendors(response.vendors || [])
      setTotalCount(response.totalCount || 0)
      setTotalPages(response.totalPages || 0)
    } catch (error) {
      showMessage('danger', error.message || 'Failed to fetch vendors')
    } finally {
      setLoading(false)
    }
  }

  /* ================= ACTIONS ================= */
  const handleDelete = (vendor) => {
    setSelectedVendor(vendor)
    setDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!selectedVendor) return
    try {
      await vendorService.deleteVendor(selectedVendor.id)
      showMessage('success', 'Vendor deleted successfully')
      setDeleteModal(false)
      fetchVendors()
    } catch (error) {
      showMessage('danger', error.message || 'Failed to delete vendor')
    }
  }

  const handleStatusChange = async (vendorId, action) => {
    try {
      if (action === 'activate') {
        await vendorService.activateVendor(vendorId)
        showMessage('success', 'Vendor activated successfully')
      } else {
        await vendorService.deactivateVendor(vendorId)
        showMessage('success', 'Vendor deactivated successfully')
      }
      fetchVendors()
    } catch (error) {
      showMessage('danger', error.message || 'Failed to update vendor status')
    }
  }

  const showMessage = (type, text) => {
    setMessage({ type, text })
    
    // Toast notification with custom styling
    if (type === 'success') {
      toast.success(text, {
        icon: "✓",
        style: {
          background: '#10b981',
          color: '#ffffff',
          fontWeight: '500',
          fontSize: '15px',
          borderRadius: '8px',
        },
      })
    } else if (type === 'danger') {
      toast.error(text, {
        icon: "✕",
        style: {
          background: '#ef4444',
          color: '#ffffff',
          fontWeight: '500',
          fontSize: '15px',
          borderRadius: '8px',
        },
      })
    }
    
    setTimeout(() => setMessage({ type: '', text: '' }), 4000)
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchVendors()
  }

  const handleReset = () => {
    setSearchTerm('')
    setStatusFilter('')
    setCurrentPage(1)
  }

  /* ================= UI ================= */
  return (
    <>
      <ToastContainer 
        position="top-right" 
        autoClose={2300} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Vendor Management</h5>
          <CButton color="primary" onClick={() => navigate('/vendors/create')}>
            <CIcon icon={cilPlus} className="me-2" />
            Add New Vendor
          </CButton>
        </CCardHeader>

        <CCardBody>
          {/* {message.text && (
            <div className={`alert alert-${message.type}`} role="alert">
              {message.text}
            </div>
          )} */}

          {/* SEARCH & FILTER */}
          <div className="row mb-3">
            <div className="col-md-4">
              <CInputGroup>
                <CFormInput
                  placeholder="Search vendor name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <CButton color="secondary" variant="outline" onClick={handleSearch}>
                  <CIcon icon={cilSearch} />
                </CButton>
              </CInputGroup>
            </div>
            <div className="col-md-3">
              <CFormSelect
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
              >
                <option value="">All Status</option>
                <option value="1">Active</option>
                <option value="2">Inactive</option>
                <option value="3">Suspended</option>
                <option value="4">Blacklisted</option>
              </CFormSelect>
            </div>
            <div className="col-md-2">
              <CButton color="secondary" variant="outline" onClick={handleReset}>
                Reset
              </CButton>
            </div>
          </div>

          {/* TABLE */}
          {loading ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
            </div>
          ) : (
            <>
              <CTable hover responsive className="border">
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Vendor Name</CTableHeaderCell>
                    <CTableHeaderCell>Phone</CTableHeaderCell>
                    <CTableHeaderCell>Credit Period (Days)</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {vendors.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan="5" className="text-center py-4">
                        No vendors found
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    vendors.map((vendor) => (
                      <CTableRow key={vendor.id}>
                        <CTableDataCell className="fw-semibold">
                          {vendor.vendorName}
                        </CTableDataCell>
                        <CTableDataCell>
                          {vendor.vendorPhoneNo || '-'}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color="info">
                            {vendor.crediPeriodDays ?? '-'}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CBadge
                            color={
                              VENDOR_STATUS[vendor.status]?.color || 'secondary'
                            }
                          >
                            {vendor.statusDisplayName ||
                              VENDOR_STATUS[vendor.status]?.label}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CButton
                            size="sm"
                            color="primary"
                            variant="outline"
                            className="me-2"
                            onClick={() =>
                              navigate(`/vendors/edit/${vendor.id}`)
                            }
                          >
                            <CIcon icon={cilPencil} />
                          </CButton>

                          {vendor.status === 1 ? (
                            <CButton
                              size="sm"
                              color="warning"
                              variant="outline"
                              className="me-2"
                              onClick={() =>
                                handleStatusChange(vendor.id, 'deactivate')
                              }
                            >
                              <CIcon icon={cilX} />
                            </CButton>
                          ) : (
                            <CButton
                              size="sm"
                              color="success"
                              variant="outline"
                              className="me-2"
                              onClick={() =>
                                handleStatusChange(vendor.id, 'activate')
                              }
                            >
                              <CIcon icon={cilCheck} />
                            </CButton>
                          )}

                          <CButton
                            size="sm"
                            color="danger"
                            variant="outline"
                            onClick={() => handleDelete(vendor)}
                          >
                            <CIcon icon={cilTrash} />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  )}
                </CTableBody>
              </CTable>

              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div>
                    Showing {(currentPage - 1) * pageSize + 1} to{' '}
                    {Math.min(currentPage * pageSize, totalCount)} of{' '}
                    {totalCount} vendors
                  </div>
                  <CPagination>
                    <CPaginationItem
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </CPaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                      <CPaginationItem
                        key={i + 1}
                        active={currentPage === i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </CPaginationItem>
                    ))}
                    <CPaginationItem
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </CPaginationItem>
                  </CPagination>
                </div>
              )}
            </>
          )}
        </CCardBody>
      </CCard>

      {/* DELETE MODAL */}
      <CModal visible={deleteModal} onClose={() => setDeleteModal(false)}>
        <CModalHeader>
          <CModalTitle>Confirm Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete vendor{' '}
          <strong>{selectedVendor?.vendorName}</strong>? This action cannot be
          undone.
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteModal(false)}>
            Cancel
          </CButton>
          <CButton color="danger" onClick={confirmDelete}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default VendorList
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
import { cilSearch, cilPlus, cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import chequeBookServices from '../../../api/services/ChequeBookServices/chequeBookServices'

const ChequeBookList = () => {
  const navigate = useNavigate()
  const [chequeBooks, setChequeBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedChequeBook, setSelectedChequeBook] = useState(null)

  const CHEQUEBOOK_STATUS = {
    Active: { label: 'Active', color: 'success' },
    Inactive: { label: 'Inactive', color: 'secondary' },
    Used: { label: 'Used', color: 'info' },
    Cancelled: { label: 'Cancelled', color: 'danger' },
  }

  useEffect(() => {
    fetchChequeBooks()
  }, [currentPage, searchTerm, statusFilter])

  const fetchChequeBooks = async () => {
    setLoading(true)
    try {
      const response = await chequeBookServices.getAllChequeBooks()
      const list = Array.isArray(response) ? response : response?.data || []
      setChequeBooks(list)
      setTotalCount(list.length)
      setTotalPages(Math.ceil(list.length / pageSize))
    } catch (error) {
      toast.error(error.message || 'Failed to load cheque books')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (cb) => {
    setSelectedChequeBook(cb)
    setDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!selectedChequeBook) return
    try {
      await chequeBookServices.deleteChequeBook(selectedChequeBook.id)
      setChequeBooks((prev) => prev.filter((x) => x.id !== selectedChequeBook.id))
      toast.success('Cheque book deleted')
      setDeleteModal(false)
      setSelectedChequeBook(null)
    } catch (error) {
      toast.error(error.message || 'Failed to delete cheque book')
    }
  }

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  return (
    <>
      <CCard className="mb-4 shadow-sm">
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">Cheque Book Management</h5>
            <CButton color="primary" onClick={() => navigate('/chequeBook/create')}>
              <CIcon icon={cilPlus} className="me-2" />
              Add Cheque Book
            </CButton>
          </div>
        </CCardHeader>

        <CCardBody>
          <div className="row mb-3">
            <div className="col-md-4">
              <CInputGroup>
                <CFormInput
                  placeholder="Search by account or cheque book"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter'}
                />
                <CButton color="secondary" variant="outline">
                  <CIcon icon={cilSearch} />
                </CButton>
              </CInputGroup>
            </div>

            <div className="col-md-3">
              <CFormSelect
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Used">Used</option>
                <option value="Cancelled">Cancelled</option>
              </CFormSelect>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <CSpinner />
            </div>
          ) : (
            <>
              <CTable hover responsive className="border mt-3">
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Account No</CTableHeaderCell>
                    <CTableHeaderCell>Cheque Book No</CTableHeaderCell>
                    <CTableHeaderCell>Start Cheque No</CTableHeaderCell>
                    <CTableHeaderCell>End Cheque No</CTableHeaderCell>
                    <CTableHeaderCell>Current Cheque No</CTableHeaderCell>
                    <CTableHeaderCell>Remaining</CTableHeaderCell>
                    <CTableHeaderCell>Issued Date</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {chequeBooks.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan={9} className="text-center py-4">
                        No cheque books found
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    chequeBooks.map((cb) => (
                      <CTableRow key={cb.id} className="py-3">
                        <CTableDataCell>{cb.accountNo}</CTableDataCell>
                        <CTableDataCell>{cb.chequeBookNo}</CTableDataCell>
                        <CTableDataCell>{cb.startChequeNo}</CTableDataCell>
                        <CTableDataCell>{cb.endChequeNo}</CTableDataCell>
                        <CTableDataCell>{cb.currentChequeNo}</CTableDataCell>
                        <CTableDataCell>{cb.remainingCheques}</CTableDataCell>
                        <CTableDataCell>
                          {cb.issuedDate
                            ? new Date(cb.issuedDate).toLocaleDateString()
                            : ''}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CBadge color={CHEQUEBOOK_STATUS[cb.status]?.color || 'secondary'}>
                            {CHEQUEBOOK_STATUS[cb.status]?.label || cb.status}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CButton
                            color="primary"
                            size="sm"
                            variant="outline"
                            className="me-2"
                            onClick={() => navigate(`/chequeBooks/edit/${cb.id}`)}
                          >
                            <CIcon icon={cilPencil} />
                          </CButton>
                          <CButton
                            color="danger"
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(cb)}
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
                    {Math.min(currentPage * pageSize, totalCount)} of {totalCount}
                  </div>
                  <CPagination>
                    <CPaginationItem
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </CPaginationItem>
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1
                      return (
                        <CPaginationItem
                          key={page}
                          active={page === currentPage}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </CPaginationItem>
                      )
                    })}
                    <CPaginationItem
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
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

      <CModal visible={deleteModal} onClose={() => setDeleteModal(false)}>
        <CModalHeader>
          <CModalTitle className="fw-bold">Delete Cheque Book</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Delete cheque book <strong>{selectedChequeBook?.chequeBookNo}</strong>? This action
          cannot be undone.
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

      <ToastContainer position="top-right" autoClose={2300} theme="colored" />
    </>
  )
}

export default ChequeBookList

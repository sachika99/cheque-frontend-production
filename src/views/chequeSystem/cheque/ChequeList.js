import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CButton,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CBadge,
  CSpinner,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import { cilPlus, cilSearch, cilTrash, cilPencil } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { ToastContainer, toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import chequeServices from '../../../api/services/ChequeServices/chequeServices'

const ChequeList = () => {
  const navigate = useNavigate()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)

  const STATUS = {
    Pending: { label: 'Pending', color: 'secondary' },
    Issued: { label: 'Issued', color: 'info' },
    Cleared: { label: 'Cleared', color: 'success' },
    Bounced: { label: 'Bounced', color: 'danger' },
  }

  useEffect(() => {
    fetchPayments()
  }, [currentPage, searchTerm, statusFilter])

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const response = await chequeServices.getAllCheques()
      const list = Array.isArray(response) ? response : response?.data || []

      let filtered = list

      if (searchTerm) {
        const s = searchTerm.toLowerCase()
        filtered = filtered.filter(
          (p) =>
            p.chequeNo?.toLowerCase().includes(s) ||
            p.vendor?.toLowerCase().includes(s) ||
            p.accountNo?.toLowerCase().includes(s) ||
            p.invoiceNo?.toLowerCase().includes(s)
        )
      }

      if (statusFilter) {
        filtered = filtered.filter((p) => p.status === statusFilter)
      }

      setPayments(filtered)
      setTotalCount(filtered.length)
      setTotalPages(Math.ceil(filtered.length / pageSize))
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (payment) => {
    setSelectedPayment(payment)
    setDeleteModal(true)
  }

  const confirmDelete = async () => {
    try {
      await chequeServices.deleteCheque(selectedPayment.chequeId)
      setPayments((prev) => prev.filter((x) => x.chequeId !== selectedPayment.chequeId))
      toast.success('Cheque deleted')
      setDeleteModal(false)
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <>
      <CCard className="mb-4 shadow-sm">
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0">Cheque Payments</h5>
            <CButton color="primary" onClick={() => navigate('/cheque/create')}>
              <CIcon icon={cilPlus} className="me-2" />
              Add Cheque
            </CButton>
          </div>
        </CCardHeader>

        <CCardBody>
          <div className="row mb-3">
            <div className="col-md-4">
              <CInputGroup>
                <CFormInput
                  placeholder="Search by cheque, vendor or invoice"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <CButton variant="outline" color="secondary">
                  <CIcon icon={cilSearch} />
                </CButton>
              </CInputGroup>
            </div>

            <div className="col-md-3">
              <CFormSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Issued">Issued</option>
                <option value="Cleared">Cleared</option>
                <option value="Bounced">Bounced</option>
              </CFormSelect>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <CSpinner />
            </div>
          ) : (
            <>
              <CTable hover responsive className="border mt-2">
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Cheque No</CTableHeaderCell>
                    <CTableHeaderCell>Vendor</CTableHeaderCell>
                    <CTableHeaderCell>Account No</CTableHeaderCell>
                    <CTableHeaderCell>Invoice No</CTableHeaderCell>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                    <CTableHeaderCell>Cheque Date</CTableHeaderCell>
                    <CTableHeaderCell>Due Date</CTableHeaderCell>
                    <CTableHeaderCell>Overdue?</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {payments
                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                    .map((p) => (
                      <CTableRow key={p.chequeId}>
                        <CTableDataCell>{p.chequeId}</CTableDataCell>
                        <CTableDataCell>{p.supplierName}</CTableDataCell>
                        <CTableDataCell>{p.accountNo}</CTableDataCell>
                        <CTableDataCell>{p.invoiceNo}</CTableDataCell>
                        <CTableDataCell>{p.chequeAmount}</CTableDataCell>
                        <CTableDataCell>
                          {p.chequeDate ? new Date(p.chequeDate).toLocaleDateString() : ''}
                        </CTableDataCell>
                        <CTableDataCell>
                          {p.dueDate ? new Date(p.dueDate).toLocaleDateString() : ''}
                        </CTableDataCell>
                        <CTableDataCell>
                          {p.isOverdue ? (
                            <CBadge color="danger">Yes</CBadge>
                          ) : (
                            <CBadge color="success">No</CBadge>
                          )}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CBadge color={STATUS[p.status]?.color || 'secondary'}>
                            {STATUS[p.status]?.label || p.status}
                          </CBadge>
                        </CTableDataCell>

                        <CTableDataCell className="text-center">
                          <CButton
                            size="sm"
                            color="primary"
                            variant="outline"
                            className="me-2"
                            onClick={() => navigate(`/cheque/edit/${p.chequeId}`)}
                          >
                            <CIcon icon={cilPencil} />
                          </CButton>
                          <CButton
                            size="sm"
                            color="danger"
                            variant="outline"
                            onClick={() => handleDelete(p)}
                          >
                            <CIcon icon={cilTrash} />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
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

      <CModal visible={deleteModal} onClose={() => setDeleteModal(false)}>
        <CModalHeader>
          <CModalTitle className="fw-bold">Delete Cheque</CModalTitle>
        </CModalHeader>
        <CModalBody>Delete cheque <strong>{selectedPayment?.chequeNo}</strong>?</CModalBody>
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

export default ChequeList

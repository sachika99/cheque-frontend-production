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
import { cilSearch, cilPlus, cilPencil, cilTrash, cilCheck, cilX, cilSave } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import bankAccountServices from '../../../api/services/BankAccountServices/bankAccountServices'

const BankAccountList = () => {
  const navigate = useNavigate()
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [expandedRow, setExpandedRow] = useState(null)

  const ACCOUNT_STATUS = {
    Active: { label: 'Active', color: 'success' },
    Inactive: { label: 'Inactive', color: 'secondary' },
    Suspended: { label: 'Suspended', color: 'warning' },
    Blacklisted: { label: 'Blacklisted', color: 'danger' },
  }

  useEffect(() => {
    fetchAccounts()
  }, [currentPage, searchTerm, statusFilter])

  const fetchAccounts = async () => {
    setLoading(true)
    try {
      const response = await bankAccountServices.getAllBankAccounts()
      const list = Array.isArray(response) ? response : response?.data || []
      setAccounts(list)
      setTotalCount(list.length)
      setTotalPages(Math.ceil(list.length / pageSize))
    } catch (error) {
      toast.error(error.message || 'Failed to load accounts')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (acc) => {
    setSelectedAccount(acc)
    setDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!selectedAccount) return
    try {
      await BankAccountService.deleteBankAccount(selectedAccount.id)
      setAccounts((prev) => prev.filter((x) => x.id !== selectedAccount.id))
      toast.success('Bank Account Deleted')
      setDeleteModal(false)
      setSelectedAccount(null)
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <>
      <CCard className="mb-4 shadow-sm">
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">Bank Account Management</h5>
            <CButton color="primary" onClick={() => navigate('/bankAccounts/create')}>
              <CIcon icon={cilPlus} className="me-2" />
              Add Bank Account
            </CButton>
          </div>
        </CCardHeader>

        <CCardBody>
          <div className="row mb-3">
            <div className="col-md-4">
              <CInputGroup>
                <CFormInput
                  placeholder="Search by account or bank"
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
              <CFormSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </CFormSelect>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <CSpinner />
            </div>
          ) : (
            <CTable hover responsive className="border mt-3">
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>Account No</CTableHeaderCell>
                  <CTableHeaderCell>Account Name</CTableHeaderCell>
                  <CTableHeaderCell>Bank Name</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>Balance</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {accounts.map((acc) => (
                  <React.Fragment key={acc.id}>
                    <CTableRow
                      className="py-3"
                      style={{ cursor: 'pointer' }}
                    >
                      <CTableDataCell>{acc.accountNo}</CTableDataCell>
                      <CTableDataCell>{acc.accountName}</CTableDataCell>
                      <CTableDataCell>{acc.bankName}</CTableDataCell>
                      <CTableDataCell>{acc.accountType}</CTableDataCell>
                      <CTableDataCell>{acc.balance}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CBadge color={ACCOUNT_STATUS[acc.status]?.color}>
                          {ACCOUNT_STATUS[acc.status]?.label || acc.status}
                        </CBadge>
                      </CTableDataCell>

                      <CTableDataCell className="text-center">
                        <CButton
                          color="primary"
                          size="sm"
                          variant="outline"
                          className="me-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/bankAccounts/edit/${acc.id}`)
                          }}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>

                        <CButton
                          color="danger"
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(acc)
                          }}
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  </React.Fragment>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>

      <CModal visible={deleteModal} onClose={() => setDeleteModal(false)}>
        <CModalHeader>
          <CModalTitle className="fw-bold">Delete Bank Account</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Delete <strong>{selectedAccount?.accountName}</strong>? This action cannot be undone.
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

export default BankAccountList

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
} from '@coreui/react'
import { cilSearch, cilPlus, cilPencil, cilTrash, cilCheck, cilX, cilSave } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'
import bankService from '../../../api/services/BankServices/bankService'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import bankAccountServices from '../../../api/services/BankAccountServices/bankAccountServices'

const BankList = () => {
  const navigate = useNavigate()
  const [banks, setBanks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedBank, setSelectedBank] = useState(null)
  const [expandedRow, setExpandedRow] = useState(null)

  const [accounts, setAccounts] = useState([])

  const [editingAccountId, setEditingAccountId] = useState(null)
const [editForm, setEditForm] = useState({
  id: 0,
  bankId: 0,
  bankName: '',
  accountNo: '',
  accountName: '',
  accountType: '',
  balance: 0,
  status: '',
})

  const BANK_STATUS = {
    0: { label: 'Unknown', color: 'info' },
    1: { label: 'Active', color: 'success' },
    2: { label: 'Inactive', color: 'secondary' },
    3: { label: 'Suspended', color: 'warning' },
    4: { label: 'Blacklisted', color: 'danger' },
  }

 
  useEffect(() => {
    fetchBanks()
    fetchBankAccounts()
  }, [currentPage, searchTerm, statusFilter])


    useEffect(() => {
    console.log(editForm)
  }, [editForm])

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id)
  }

  const beginEdit = (acc,bank) => {

  setEditingAccountId(acc.id)
  setEditForm({
    id: acc.id,
    bankId: bank.id,
    bankName: bank.bankName || '',
    accountNo: acc.accountNo,
    accountName: acc.accountName,
    accountType: acc.accountType,
    balance: acc.balance,
    status: acc.status,
  })
}

  const saveEdit = async (id) => {
    const response = await bankAccountServices.updateBankAccount(id,editForm)
    console.log(editForm,id)
    setEditingAccountId(null)
     await fetchBankAccounts()
    toast.success('Account Updated')
   
  }

  const deleteAccount = async (id) => {
    const response = await bankAccountServices.deleteBankAccount(id)
     await fetchBankAccounts()
    toast.success('Account Deleted')
  }

  const fetchBanks = async () => {
    setLoading(true)
    try {
      const response = await bankService.getAllBanks()
      setBanks(response || [])
      setTotalCount(response.totalCount || 0)
      setTotalPages(response.totalPages || 0)
    } catch (error) {
      toast.error(error.message || 'Failed to load banks')
    } finally {
      setLoading(false)
    }
  }
   const fetchBankAccounts = async () => {
    setLoading(true)
    try {
      const response = await bankAccountServices.getAllBankAccounts()
      setAccounts(response || [])
    } catch (error) {
      toast.error(error.message || 'Failed to load banks')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (bank) => {
    setSelectedBank(bank)
    setDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!selectedBank) return
    try {
      await bankService.deleteBank(selectedBank.id)
      toast.success('Bank deleted successfully')
      setDeleteModal(false)
      setSelectedBank(null)
      fetchBanks()
    } catch (error) {
      toast.error(error.message || 'Failed to delete bank')
    }
  }

  const handleStatusChange = async (bankId, action) => {
    try {
      if (action === 'activate') {
        await bankService.activateBank(bankId)
        toast.success('Bank activated')
      } else {
        await bankService.deactivateBank(bankId)
        toast.success('Bank deactivated')
      }
      fetchBanks()
    } catch (error) {
      toast.error(error.message || 'Failed to update status')
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchBanks()
  }

  const handleReset = () => {
    setSearchTerm('')
    setStatusFilter('')
    setCurrentPage(1)
  }

  return (
    <>
      <CCard className="mb-4 shadow-sm">
        <CCardHeader className="py-3 px-4">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">Bank Management</h5>
            <CButton color="primary" className="px-4 py-2" onClick={() => navigate('/banks/create')}>
              <CIcon icon={cilPlus} className="me-2" />
              Add Bank
            </CButton>
          </div>
        </CCardHeader>

        <CCardBody className="px-4 pb-4 pt-3">
          <div className="d-flex gap-3 mb-4">
            <div className="flex-grow-1">
              <CInputGroup>
                <CFormInput
                  placeholder="Search by name or code"
                  className="py-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <CButton color="secondary" variant="outline" onClick={handleSearch}>
                  <CIcon icon={cilSearch} />
                </CButton>
              </CInputGroup>
            </div>

            <div style={{ width: '220px' }}>
              <CFormSelect
                className="py-2"
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

            <CButton color="secondary" variant="outline" className="px-4" onClick={handleReset}>
              Reset
            </CButton>
          </div>

          <CTable hover responsive className="border">
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell className="py-3 px-3">Branch Code</CTableHeaderCell>
                <CTableHeaderCell className="py-3 px-3">Bank Name</CTableHeaderCell>
                <CTableHeaderCell className="py-3 px-3">Branch</CTableHeaderCell>
                <CTableHeaderCell className="text-center py-3 px-3">Status</CTableHeaderCell>
                <CTableHeaderCell className="text-center py-3 px-3">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {banks.map((bank) => {
                const bankAccounts = accounts.filter((a) => a.bankId === bank.id)

                return (
                  <React.Fragment key={bank.id}>
                    <CTableRow
                      onClick={() => toggleRow(bank.id)}
                      className="py-3"
                      style={{ cursor: 'pointer' }}
                    >
                      <CTableDataCell className="py-3 px-3">{bank.branchCode}</CTableDataCell>
                      <CTableDataCell className="py-3 px-3">{bank.bankName}</CTableDataCell>
                      <CTableDataCell className="py-3 px-3">{bank.branchName}</CTableDataCell>
                      <CTableDataCell className="text-center py-3 px-3">
                        <CBadge color={BANK_STATUS[bank.status]?.color}>
                          {BANK_STATUS[bank.status]?.label}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell className="text-center py-3 px-3">
                        <CButton
                          color="primary"
                          size="sm"
                          variant="outline"
                          className="me-2 px-3"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/banks/edit/${bank.id}`)
                          }}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>

                        <CButton
                          color="danger"
                          size="sm"
                          variant="outline"
                          className="px-3"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(bank)
                          }}
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>

                    {expandedRow === bank.id && (
                      <CTableRow>
                        <CTableDataCell colSpan={5} className=" p-4">
                          <h6 className="fw-bold mb-3">Bank Accounts</h6>

                          {bankAccounts.length === 0 ? (
                            <div className="text-muted">No accounts found</div>
                          ) : (
                            <CTable  className="mt-3">
                              <CTableHead>
                                <CTableRow>
                                  <CTableHeaderCell className="py-3 px-3">Account No</CTableHeaderCell>
                                  <CTableHeaderCell className="py-3 px-3">Account Name</CTableHeaderCell>
                                  <CTableHeaderCell className="py-3 px-3">Type</CTableHeaderCell>
                                  <CTableHeaderCell className="py-3 px-3">Balance</CTableHeaderCell>
                                  <CTableHeaderCell className="py-3 px-3">Status</CTableHeaderCell>
                                  <CTableHeaderCell className="py-3 px-3">Actions</CTableHeaderCell>
                                </CTableRow>
                              </CTableHead>

                              <CTableBody>
                                {bankAccounts.map((acc) => (
                                  <CTableRow key={acc.id}>
                                    {editingAccountId === acc.id ? (
                                      <>
                                        <CTableDataCell className="py-3 px-3">
                                          <CFormInput
                                            value={editForm.accountNo}
                                            onChange={(e) =>
                                              setEditForm((p) => ({ ...p, accountNo: e.target.value }))
                                            }
                                          />
                                        </CTableDataCell>

                                        <CTableDataCell className="py-3 px-3">
                                          <CFormInput
                                            value={editForm.accountName}
                                            onChange={(e) =>
                                              setEditForm((p) => ({ ...p, accountName: e.target.value }))
                                            }
                                          />
                                        </CTableDataCell>

                                        <CTableDataCell className="py-3 px-3">
                                          <CFormSelect
                                            value={editForm.accountType}
                                            onChange={(e) =>
                                              setEditForm((p) => ({ ...p, accountType: e.target.value }))
                                            }
                                          >
                                            <option>Savings</option>
                                            <option>Current</option>
                                            <option>Loan</option>
                                            <option>Fixed Deposit</option>
                                          </CFormSelect>
                                        </CTableDataCell>

                                        <CTableDataCell className="py-3 px-3">
                                          <CFormInput
                                            type="number"
                                            value={editForm.balance}
                                            onChange={(e) =>
                                              setEditForm((p) => ({ ...p, balance: e.target.value }))
                                            }
                                          />
                                        </CTableDataCell>

                                        <CTableDataCell className="py-3 px-3">
                                          <CFormSelect
                                            value={editForm.status}
                                            onChange={(e) =>
                                              setEditForm((p) => ({ ...p, status: e.target.value }))
                                            }
                                          >
                                            <option>Active</option>
                                            <option>Inactive</option>
                                          </CFormSelect>
                                        </CTableDataCell>

                                        <CTableDataCell className="py-3 px-3">
                                          <CButton
                                            size="sm"
                                            color="success"
                                            className="px-3"
                                            onClick={() => saveEdit(acc.id,bank)}
                                          >
                                            <CIcon icon={cilSave} />
                                          </CButton>
                                        </CTableDataCell>
                                      </>
                                    ) : (
                                      <>
                                        <CTableDataCell className="py-3 px-3">{acc.accountNo}</CTableDataCell>
                                        <CTableDataCell className="py-3 px-3">{acc.accountName}</CTableDataCell>
                                        <CTableDataCell className="py-3 px-3">{acc.accountType}</CTableDataCell>
                                        <CTableDataCell className="py-3 px-3">{acc.balance}</CTableDataCell>
                                        <CTableDataCell className="py-3 px-3">{acc.status}</CTableDataCell>

                                        <CTableDataCell className="py-3 px-3">
                                          <CButton
                                            size="sm"
                                            color="primary"
                                            variant="outline"
                                            className="me-2 px-3"
                                            onClick={() => beginEdit(acc,bank)}
                                          >
                                            <CIcon icon={cilPencil} />
                                          </CButton>

                                          <CButton
                                            size="sm"
                                            color="danger"
                                            variant="outline"
                                            className="px-3"
                                            onClick={() => deleteAccount(acc.id)}
                                          >
                                            <CIcon icon={cilTrash} />
                                          </CButton>
                                        </CTableDataCell>
                                      </>
                                    )}
                                  </CTableRow>
                                ))}
                              </CTableBody>
                            </CTable>
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </React.Fragment>
                )
              })}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      <ToastContainer position="top-right" autoClose={2300} theme="colored" />
    </>
  )
}

export default BankList

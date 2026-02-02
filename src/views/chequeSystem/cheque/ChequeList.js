import React, { useEffect, useMemo, useState } from 'react'
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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CBadge,
  CSpinner,
  CPagination,
  CPaginationItem,
  CFormCheck,
} from '@coreui/react'
import {
  cilPlus,
  cilTrash,
  cilPrint,
  cilPencil,
  cilCloudDownload,
  cilCalculator,
  cilList,
  cilXCircle,
  cilCheckCircle,
  cilX,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { ToastContainer, toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'
import 'react-toastify/dist/ReactToastify.css'
import chequeServices from '../../../api/services/ChequeServices/chequeServices'
import ChequePrint from '../chequeNew/ChequePrint'

const ChequeList = () => {
  const navigate = useNavigate()
  const currentUser = 'admin'

  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  const [supplierFilter, setSupplierFilter] = useState('')
  const [chequeFilter, setChequeFilter] = useState('')
  const [invoiceFilter, setInvoiceFilter] = useState('')
  const [dueDateFilter, setDueDateFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const [totalPages, setTotalPages] = useState(0)

  const [selectedIds, setSelectedIds] = useState([])

  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)

  const [bulkModal, setBulkModal] = useState(false)
  const [bulkLoading, setBulkLoading] = useState(false)

  const [invoiceModal, setInvoiceModal] = useState(false)
  const [invoiceModalCheque, setInvoiceModalCheque] = useState(null)
  const [editableInvoices, setEditableInvoices] = useState([])
  const [printData, setPrintData] = useState(false)
  const [chequeData, setChequeData] = useState({
    date: '',
    payee: '',
    amount: '',
    cashCheque: false,
  })

  const [cashChequeModal, setCashChequeModal] = useState(false)
  const [pendingPrintData, setPendingPrintData] = useState(null)

  const STATUS = ['Pending', 'Issued', 'Cleared', 'Bounced']

  useEffect(() => {
    fetchPayments()
  }, [supplierFilter, chequeFilter, invoiceFilter, dueDateFilter, statusFilter])

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const res = await chequeServices.getAllCheques()
      let list = Array.isArray(res) ? res : res?.data || []

      if (supplierFilter)
        list = list.filter((p) => p.payeeName?.toLowerCase().includes(supplierFilter.toLowerCase()))

      if (chequeFilter)
        list = list.filter((p) => p.chequeNo?.toLowerCase().includes(chequeFilter.toLowerCase()))

      if (invoiceFilter) {
        const s = invoiceFilter.toLowerCase()
        list = list.filter((p) => {
          const single = p.invoiceNo?.toLowerCase().includes(s)
          const multi =
            Array.isArray(p.invoices) &&
            p.invoices.some((inv) => inv.invoiceNo?.toLowerCase().includes(s))
          return single || multi
        })
      }

      if (dueDateFilter)
        list = list.filter(
          (p) => p.dueDate && new Date(p.dueDate).toISOString().split('T')[0] === dueDateFilter,
        )

      if (statusFilter) list = list.filter((p) => p.status === statusFilter)

      setPayments(list)
      setTotalPages(Math.ceil(list.length / pageSize))
      setCurrentPage(1)
    } catch {
      toast.error('Failed to load cheques')
    } finally {
      setLoading(false)
    }
  }

  const updateInvoiceField = (index, field, value) => {
    setEditableInvoices((prev) =>
      prev.map((inv, i) => (i === index ? { ...inv, [field]: value } : inv)),
    )
  }

  const addInvoiceRow = () => {
    setEditableInvoices((prev) => [
      ...prev,
      { id: `tmp-${Date.now()}`, invoiceNo: '', invoiceAmount: 0 },
    ])
  }

  const deleteInvoiceRow = (index) => {
    setEditableInvoices((prev) => prev.filter((_, i) => i !== index))
  }

  const invoiceModalTotal = useMemo(() => {
    return editableInvoices.reduce((sum, inv) => {
      const n = Number(String(inv.invoiceAmount || 0).replace(/,/g, ''))
      return sum + (Number.isFinite(n) ? n : 0)
    }, 0)
  }, [editableInvoices])

  const updateStatus = async (chequeId, newStatus) => {
    try {
      await chequeServices.updateChequeStatus(chequeId, newStatus, currentUser)
      setPayments((prev) =>
        prev.map((p) => (p.chequeId === chequeId ? { ...p, status: newStatus } : p)),
      )
      toast.success('Status updated')
    } catch {
      toast.error('Failed to update status')
    }
  }

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const toggleSelectAllVisible = (checked, visibleRows) => {
    const visibleIds = visibleRows.map((p) => p.chequeId)

    setSelectedIds((prev) => {
      if (checked) {
        return Array.from(new Set([...prev, ...visibleIds]))
      }
      return prev.filter((id) => !visibleIds.includes(id))
    })
  }

  const selectedCheques = useMemo(
    () => payments.filter((p) => selectedIds.includes(p.chequeId)),
    [payments, selectedIds],
  )

  const totalSelectedAmount = useMemo(
    () =>
      selectedCheques.reduce(
        (sum, p) =>
          sum +
          Number(
            typeof p.chequeAmount === 'number'
              ? p.chequeAmount
              : String(p.chequeAmount).replace(/,/g, ''),
          ),
        0,
      ),
    [selectedCheques],
  )

  const openBulkModal = () => {
    if (!selectedIds.length) {
      toast.warn('Please select at least one cheque')
      return
    }
    setBulkModal(true)
  }

  const printCheque = (payeeName, chequeAmount, dueDate) => {
    setPendingPrintData({
      payeeName,
      chequeAmount,
      dueDate,
    })

    setCashChequeModal(true)
  }

  const handleCashChequeConfirm = (isCashCheque) => {
    if (pendingPrintData) {
      setChequeData({
        payee: pendingPrintData.payeeName,
        amount: String(pendingPrintData.chequeAmount),
        date: pendingPrintData.dueDate.split('T')[0],
        cashCheque: isCashCheque,
      })
      setPrintData(true)
    }
    setCashChequeModal(false)
    setPendingPrintData(null)
  }

  const bulkIssueAll = async () => {
    setBulkLoading(true)
    try {
      await chequeServices.updateChequeStatusBulk(selectedIds, 'Issued', currentUser)

      setPayments((prev) =>
        prev.map((p) => (selectedIds.includes(p.chequeId) ? { ...p, status: 'Issued' } : p)),
      )

      toast.success('Selected cheques issued')
      setBulkModal(false)
      setSelectedIds([])
    } catch {
      toast.error('Bulk issue failed')
    } finally {
      setBulkLoading(false)
    }
  }

  const exportToExcel = (rows, fileName) => {
    if (!rows.length) return toast.warn('No data selected')

    const data = rows.map((p) => ({
      'Cheque No': p.chequeNo,
      Supplier: p.payeeName,
      'Invoice No': p.invoiceNo || '',
      'Invoice Date': p.invoiceDate ? new Date(p.invoiceDate).toLocaleDateString() : '',
      Amount: p.chequeAmount,
      'Cheque Date': p.chequeDate ? new Date(p.chequeDate).toLocaleDateString() : '',
      'Due Date': p.dueDate ? new Date(p.dueDate).toLocaleDateString() : '',
      Status: p.status,
      Overdue: p.isOverdue ? 'Yes' : 'No',
      'Multi Invoices': Array.isArray(p.invoices)
        ? p.invoices.map((x) => x.invoiceNo).join(', ')
        : '',
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Cheques')
    XLSX.writeFile(wb, `${fileName}.xlsx`)
  }

  const confirmDelete = async () => {
    try {
      debugger
      await chequeServices.deleteCheque(selectedPayment.id)
      debugger
      setPayments((p) => p.filter((x) => x.chequeId !== selectedPayment.chequeId))
      toast.success('Cheque deleted')
      setDeleteModal(false)
    } catch {
      toast.error('Delete failed')
    }
  }

  const openInvoiceModal = (cheque) => {
    const list = Array.isArray(cheque?.invoices) ? cheque.invoices : []

    setEditableInvoices(
      list.map((inv) => ({
        id: inv.id,
        invoiceNo: inv.invoiceNo || '',
        invoiceAmount: inv.invoiceAmount || 0,
      })),
    )

    setInvoiceModalCheque(cheque)
    setInvoiceModal(true)
  }

  const invoiceList = useMemo(() => {
    const list = invoiceModalCheque?.invoices
    return Array.isArray(list) ? list : []
  }, [invoiceModalCheque])

  const invoiceTotal = useMemo(() => {
    return invoiceList.reduce((sum, inv) => {
      const raw = inv?.invoiceAmount ?? 0
      const n = typeof raw === 'number' ? raw : parseFloat(String(raw).replace(/,/g, '').trim())
      return sum + (Number.isFinite(n) ? n : 0)
    }, 0)
  }, [invoiceList])

  const paginated = payments.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const allVisibleSelected =
    paginated.length > 0 && paginated.every((p) => selectedIds.includes(p.chequeId))

  const handlePrintClose = (status) => {
    setPrintData(false)
    switch (status) {
      case 'completed':
        console.log('Print dialog was closed (user either printed or cancelled)')
        break
      case 'cancelled':
        console.log('Print was cancelled before dialog opened')
        break
      case 'error':
        console.log('Print encountered an error')
        break
      default:
        console.log('Unknown status:', status)
    }
    setTimeout(() => navigate('/cheque'))
  }

  if (printData) {
    return <ChequePrint data={chequeData} onClose={handlePrintClose} />
  }

  return (
    <>
      <CCard className="mb-4 shadow-sm">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0">Cheque Payments</h5>

          <div className="d-flex gap-2">
            <CButton
              color="warning"
              variant="outline"
              disabled={!selectedIds.length}
              onClick={openBulkModal}
            >
              <CIcon icon={cilCalculator} className="me-2" />
              Calculate & Issue ({selectedIds.length})
            </CButton>

            <CButton
              color="success"
              variant="outline"
              disabled={!selectedIds.length}
              onClick={() => exportToExcel(selectedCheques, 'Selected_Cheques')}
            >
              <CIcon icon={cilCloudDownload} className="me-2" />
              Export Selected
            </CButton>

            <CButton color="success" onClick={() => exportToExcel(payments, 'All_Cheques')}>
              <CIcon icon={cilCloudDownload} className="me-2" />
              Export All
            </CButton>

            <CButton color="primary" onClick={() => navigate('/cheque/create')}>
              <CIcon icon={cilPlus} className="me-2" />
              Add Cheque
            </CButton>
          </div>
        </CCardHeader>

        <CCardBody>
          <div className="row mb-3 g-2">
            <div className="col-md-2">
              <CFormInput
                placeholder="Cheque No"
                value={chequeFilter}
                onChange={(e) => setChequeFilter(e.target.value)}
                style={{
                  borderColor: 'var(--cui-primary)',
                  boxShadow: 'none',
                }}
                onFocus={(e) => (e.target.style.boxShadow = '0 0 0 0.2rem rgba(13,110,253,.25)')}
                onBlur={(e) => (e.target.style.boxShadow = 'none')}
              />
            </div>

            <div className="col-md-2">
              <CFormInput
                placeholder="Supplier"
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
                style={{ borderColor: 'var(--cui-primary)' }}
                onFocus={(e) => (e.target.style.boxShadow = '0 0 0 0.2rem rgba(13,110,253,.25)')}
                onBlur={(e) => (e.target.style.boxShadow = 'none')}
              />
            </div>

            <div className="col-md-2">
              <CFormInput
                placeholder="Invoice No"
                value={invoiceFilter}
                onChange={(e) => setInvoiceFilter(e.target.value)}
                style={{ borderColor: 'var(--cui-primary)' }}
                onFocus={(e) => (e.target.style.boxShadow = '0 0 0 0.2rem rgba(13,110,253,.25)')}
                onBlur={(e) => (e.target.style.boxShadow = 'none')}
              />
            </div>

            <div className="col-md-2">
              <CFormInput
                type="date"
                value={dueDateFilter}
                onChange={(e) => setDueDateFilter(e.target.value)}
                style={{ borderColor: 'var(--cui-primary)' }}
                onFocus={(e) => (e.target.style.boxShadow = '0 0 0 0.2rem rgba(13,110,253,.25)')}
                onBlur={(e) => (e.target.style.boxShadow = 'none')}
              />
            </div>

            <div className="col-md-2">
              <CFormSelect
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ borderColor: 'var(--cui-primary)' }}
                onFocus={(e) => (e.target.style.boxShadow = '0 0 0 0.2rem rgba(13,110,253,.25)')}
                onBlur={(e) => (e.target.style.boxShadow = 'none')}
              >
                <option value="">All Status</option>
                {STATUS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </CFormSelect>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <CSpinner />
            </div>
          ) : (
            <CTable hover responsive bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>
                    <CFormCheck
                      checked={allVisibleSelected}
                      onChange={(e) => toggleSelectAllVisible(e.target.checked, paginated)}
                      title="Select all visible rows"
                    />
                  </CTableHeaderCell>
                  <CTableHeaderCell>Cheque No</CTableHeaderCell>
                  <CTableHeaderCell>Supplier</CTableHeaderCell>
                  <CTableHeaderCell>Invoice</CTableHeaderCell>

                  <CTableHeaderCell>Amount (LKR)</CTableHeaderCell>
                  {/* <CTableHeaderCell>Cheque Date</CTableHeaderCell> */}
                  <CTableHeaderCell>Realised Date</CTableHeaderCell>
                  <CTableHeaderCell>Cheque Type </CTableHeaderCell>
                  {/* <CTableHeaderCell>Overdue?</CTableHeaderCell> */}
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {paginated.map((p) => {
                  const invoiceCount = Array.isArray(p.invoices) ? p.invoices.length : 0

                  return (
                    <CTableRow key={p.chequeId}>
                      <CTableDataCell>
                        <CFormCheck
                          checked={selectedIds.includes(p.chequeId)}
                          onChange={() => toggleSelect(p.chequeId)}
                        />
                      </CTableDataCell>

                      <CTableDataCell>{p.chequeNo}</CTableDataCell>
                      <CTableDataCell>{p.payeeName}</CTableDataCell>

                      <CTableDataCell>
                        <div className="d-flex flex-row align-items-center gap-2">
                          <span
                            className="text-truncate d-none d-sm-inline"
                            style={{ maxWidth: '150px' }}
                          >
                            {p.invoiceNo || ''}
                          </span>

                          {invoiceCount > 0 && (
                            <CButton
                              size="sm"
                              color="primary"
                              onClick={() => openInvoiceModal(p)}
                              title="View multiple invoices"
                              className="d-flex align-items-center justify-content-center px-2 py-1"
                              style={{
                                fontSize: '0.75rem',
                                minWidth: '85px',
                                width: 'fit-content',
                              }}
                            >
                              <CIcon
                                icon={cilList}
                                className="me-1 text-white"
                                style={{ width: '14px', height: '14px' }}
                              />
                              <span>View ({invoiceCount})</span>
                            </CButton>
                          )}
                        </div>
                      </CTableDataCell>

                      <CTableDataCell>
                        {Number(p.chequeAmount).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </CTableDataCell>
                      {/* <CTableDataCell>
                        {p.chequeDate ? new Date(p.chequeDate).toLocaleDateString() : ''}
                      </CTableDataCell> */}

                      <CTableDataCell>
                        {p.dueDate ? new Date(p.dueDate).toLocaleDateString() : ''}
                      </CTableDataCell>
                      <CTableDataCell>{p.receiptNo || ''}</CTableDataCell>
                      {/* <CTableDataCell>
                        {p.isOverdue ? (
                          <CBadge color="danger">Yes</CBadge>
                        ) : (
                          <CBadge color="success">No</CBadge>
                        )}
                      </CTableDataCell> */}

                      <CTableDataCell>
                        <CFormSelect
                          size="sm"
                          value={p.status}
                          onChange={(e) => updateStatus(p.chequeId, e.target.value)}
                        >
                          {STATUS.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </CFormSelect>
                      </CTableDataCell>

                      <CTableDataCell className="text-center">
                        <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                          <CButton
                            size="sm"
                            color="info"
                            variant="outline"
                            onClick={() => printCheque(p.payeeName, p.chequeAmount, p.dueDate)}
                            title="Print Cheque"
                            className="d-flex align-items-center justify-content-center"
                            style={{ minWidth: '36px' }}
                          >
                            <CIcon icon={cilPrint} />
                          </CButton>
                          <CButton
                            size="sm"
                            color="primary"
                            variant="outline"
                            onClick={() => navigate(`/cheque/edit/${p.chequeId}`)}
                            title="Edit Cheque"
                            className="d-flex align-items-center justify-content-center"
                            style={{ minWidth: '36px' }}
                          >
                            <CIcon icon={cilPencil} />
                          </CButton>
                          <CButton
                            size="sm"
                            color="danger"
                            variant="outline"
                            onClick={() => {
                              setSelectedPayment(p)
                              setDeleteModal(true)
                            }}
                            title="Delete Cheque"
                            className="d-flex align-items-center justify-content-center"
                            style={{ minWidth: '36px' }}
                          >
                            <CIcon icon={cilTrash} />
                          </CButton>
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  )
                })}
              </CTableBody>
            </CTable>
          )}

          {totalPages > 1 && (
            <CPagination className="mt-3">
              <CPaginationItem
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </CPaginationItem>
            </CPagination>
          )}
        </CCardBody>
      </CCard>

      <CModal
        visible={cashChequeModal}
        onClose={() => setCashChequeModal(false)}
        alignment="center"
        backdrop="static"
      >
        <CModalBody className="text-center p-5 position-relative">
          <CButton
            color="light"
            variant="ghost"
            className="position-absolute top-0 end-0 m-3"
            onClick={() => setCashChequeModal(false)}
            style={{
              width: '32px',
              height: '32px',
              padding: '0',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
            }}
          >
            <CIcon icon={cilX} size="lg" />
          </CButton>

          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#6c5ce7',
              boxShadow: '0 10px 25px rgba(108, 92, 231, 0.25)',
            }}
          >
            <CIcon icon={cilPrint} size="xl" className="text-white" />
          </div>

          <h4 className="fw-bold mb-3" style={{ color: 'var(--cui-body-color, #2d3748)' }}>
            Cash Cheque Confirmation
          </h4>

          <p
            className="mb-4"
            style={{ fontSize: '1rem', color: 'var(--cui-secondary-color, #64748b)' }}
          >
            Is this a cash cheque?
          </p>

          <div className="d-flex gap-3 justify-content-center">
            <CButton
              color="light"
              onClick={() => handleCashChequeConfirm(false)}
              className="px-4 py-2 fw-semibold"
              style={{
                minWidth: '120px',
                border: '2px solid #e2e8f0',
                color: '#4a5568',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              }}
            >
                <CIcon icon={cilCheckCircle} className="me-2" />
              Yes
            </CButton>

            <CButton
              onClick={() => handleCashChequeConfirm(true)}
              className="px-4 py-2 fw-semibold text-white"
              style={{
                minWidth: '120px',
                backgroundColor: '#6c5ce7',
                border: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(108, 92, 231, 0.3)',
              }}
            >
           
              <CIcon icon={cilXCircle} className="me-2" />
              No
            </CButton>
          </div>
        </CModalBody>
      </CModal>

      {/* BULK MODAL */}
      <CModal visible={bulkModal} onClose={() => setBulkModal(false)} size="lg">
        <CModalHeader>
          <CModalTitle className="fw-bold">Selected Cheques Summary</CModalTitle>
        </CModalHeader>

        <CModalBody>
          {selectedCheques.length === 0 ? (
            <div>No cheques selected.</div>
          ) : (
            <>
              <CTable responsive bordered small>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Cheque No</CTableHeaderCell>
                    <CTableHeaderCell>Supplier</CTableHeaderCell>
                    <CTableHeaderCell>Invoice No</CTableHeaderCell>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                    <CTableHeaderCell>Cheque Date</CTableHeaderCell>
                    <CTableHeaderCell>Due Date</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {selectedCheques.map((p) => (
                    <CTableRow key={p.chequeId}>
                      <CTableDataCell>{p.chequeNo}</CTableDataCell>
                      <CTableDataCell>{p.payeeName}</CTableDataCell>
                      <CTableDataCell>{p.invoiceNo}</CTableDataCell>
                      <CTableDataCell>{p.chequeAmount}</CTableDataCell>
                      <CTableDataCell>
                        {p.chequeDate ? new Date(p.chequeDate).toLocaleDateString() : ''}
                      </CTableDataCell>
                      <CTableDataCell>
                        {p.dueDate ? new Date(p.dueDate).toLocaleDateString() : ''}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>

              <div className="d-flex justify-content-end mt-3">
                <h5 className="mb-0">
                  Total Amount:&nbsp;
                  <span className="fw-bold">{totalSelectedAmount.toLocaleString()}</span>
                </h5>
              </div>

              <div className="mt-2 text-muted">
                Clicking <strong>Issue</strong> will set all selected cheques status to{' '}
                <strong>Issued</strong>.
              </div>
            </>
          )}
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={() => setBulkModal(false)} disabled={bulkLoading}>
            Cancel
          </CButton>
          <CButton
            color="warning"
            onClick={bulkIssueAll}
            disabled={bulkLoading || !selectedCheques.length}
          >
            {bulkLoading ? <CSpinner size="sm" /> : 'Issue (OK)'}
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        visible={invoiceModal}
        onClose={() => setInvoiceModal(false)}
        size="lg"
        alignment="center"
      >
        <CModalHeader
          closeButton={false}
          className="py-3"
          style={{ borderBottom: '1px solid #3c4b64' }}
        >
          <div className="d-flex justify-content-between align-items-center w-100">
            <div>
              <CModalTitle className="fw-semibold fs-5 mb-1">Invoice Details</CModalTitle>

              <div className="text-muted small">
                <span className="fw-medium">Cheque No:</span>{' '}
                {invoiceModalCheque?.chequeNo || 'N/A'}
              </div>

              <div className="text-muted small">
                <span className="fw-medium">Invoice Date:</span>{' '}
                {invoiceModalCheque?.invoiceDate
                  ? new Date(invoiceModalCheque.invoiceDate).toLocaleDateString('en-GB')
                  : 'N/A'}
              </div>
            </div>

            <div className="text-end">
              <div
                className="text-muted text-uppercase fw-semibold mb-1"
                style={{ fontSize: '0.7rem', letterSpacing: '0.6px' }}
              >
                Total Amount
              </div>

              <div
                className="fw-bold text-primary"
                style={{ fontSize: '1.6rem', letterSpacing: '-0.5px' }}
              >
                {invoiceModalTotal.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'LKR',
                })}
              </div>
            </div>
          </div>
        </CModalHeader>

        <CModalBody
          style={{
            maxHeight: '65vh',
            overflowY: 'auto',
            padding: '1.5rem',
          }}
        >
          <div className="shadow-sm rounded" style={{ maxHeight: 280, overflowY: 'auto' }}>
            <CTable hover responsive bordered className="align-middle mb-0">
              <CTableHead className="bg-light">
                <CTableRow>
                  <CTableHeaderCell style={{ width: 50 }} className="text-center fw-semibold">
                    #
                  </CTableHeaderCell>
                  <CTableHeaderCell className="fw-semibold">Invoice Number</CTableHeaderCell>
                  <CTableHeaderCell className="fw-semibold">Amount (LKR)</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {editableInvoices.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={3} className="text-center text-muted py-4">
                      <div className="fw-medium mb-1">No invoices added yet</div>
                      <small>Click "Add Invoice" to get started</small>
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  editableInvoices.map((inv, idx) => (
                    <CTableRow key={inv.id}>
                      <CTableDataCell className="text-center text-muted fw-medium">
                        {idx + 1}
                      </CTableDataCell>

                      <CTableDataCell>
                        <CFormInput
                          size="sm"
                          value={inv.invoiceNo}
                          className="text-start fw-medium border-secondary"
                          style={{ padding: '0.45rem 0.6rem' }}
                        />
                      </CTableDataCell>

                      <CTableDataCell>
                        <CFormInput
                          type="number"
                          size="sm"
                          value={Number(inv.invoiceAmount).toFixed(2)}
                          className="text-start fw-medium border-secondary"
                          style={{ padding: '0.45rem 0.6rem' }}
                        />
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </div>
        </CModalBody>

        <CModalFooter className="py-3 border-top">
          <CButton
            color="secondary"
            size="sm"
            variant="outline"
            onClick={() => setInvoiceModal(false)}
            className="px-4"
          >
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        visible={deleteModal}
        onClose={() => setDeleteModal(false)}
        alignment="center"
        backdrop="static"
      >
        <CModalBody className="text-center p-5">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#ef4444',
              boxShadow: '0 10px 25px rgba(239, 68, 68, 0.25)',
            }}
          >
            <CIcon icon={cilTrash} size="xl" className="text-white" />
          </div>

          <h4 className="fw-bold mb-3" style={{ color: '#2d3748' }}>
            Delete Cheque
          </h4>

          <p className="text-muted mb-4" style={{ fontSize: '1rem' }}>
            Are you sure you want to delete cheque{' '}
            <strong className="text-dark">{selectedPayment?.chequeNo}</strong>?
          </p>

          <div className="d-flex gap-3 justify-content-center">
            <CButton
              color="light"
              onClick={() => setDeleteModal(false)}
              className="px-4 py-2 fw-semibold"
              style={{
                minWidth: '120px',
                border: '2px solid #e2e8f0',
                color: '#4a5568',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              }}
            >
              Cancel
            </CButton>

            <CButton
              onClick={confirmDelete}
              className="px-4 py-2 fw-semibold text-white"
              style={{
                minWidth: '120px',
                backgroundColor: '#ef4444',
                border: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
              }}
            >
              <CIcon icon={cilTrash} className="me-2" />
              Delete
            </CButton>
          </div>
        </CModalBody>
      </CModal>

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  )
}

export default ChequeList

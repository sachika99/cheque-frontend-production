import React, { useEffect, useMemo, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CButton,
  CFormSelect,
  CFormInput,
} from '@coreui/react'
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import CIcon from '@coreui/icons-react'
import { cilCalendar, cilCheckCircle } from '@coreui/icons'
import bankAccountServices from '../../../api/services/BankAccountServices/bankAccountServices'
import chequeServices from '../../../api/services/ChequeServices/chequeServices'

const ChequeStatusSummary = () => {
  const [summaryData, setSummaryData] = useState([])
  const [bankAccounts, setBankAccounts] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedBankAccount, setSelectedBankAccount] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [dateFilterEnabled, setDateFilterEnabled] = useState(false)
  const [animationPhase, setAnimationPhase] = useState('idle') // idle, forward, reverse
//   const [selectedStatus, setSelectedStatus] = useState('All') // Filter by status
  const [selectedStatus, setSelectedStatus] = useState('Pending')

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    const res = await bankAccountServices.getAllBankAccounts()
    setBankAccounts(Array.isArray(res) ? res : res?.data || [])
  }
const fetchCheques = async (selectedBankAccount, startDate,endDate) => {
    try {
      var response = await chequeServices.fetchSumeryCheque(selectedBankAccount, startDate, endDate)
     return response;
    } catch {
      toast.error('Failed to to fet cheque data')
    }
  }
  const loadSummaryData = async () => {
    if (!selectedBankAccount) return

    setLoading(true)
    try {
      //   let url = `/api/Cheques/summary/bank-account/${selectedBankAccount}`
      //   const params = new URLSearchParams()
      
      //   if (dateFilterEnabled && startDate) {
      //     params.append('startDate', startDate)
      //   }
      //   if (dateFilterEnabled && endDate) {
      //     params.append('endDate', endDate)
      //   }
      
      //   if (params.toString()) {
      //     url += '?' + params.toString()
      //   }

        const res = await fetchCheques(selectedBankAccount, startDate,endDate)
        console.log(res)
      setSummaryData(res.data)
    } catch (error) {
      console.error('Error loading summary data:', error)
      setSummaryData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedBankAccount) {
      loadSummaryData()
    }
  }, [selectedBankAccount, startDate, endDate, dateFilterEnabled, selectedStatus])

  useEffect(() => {
    if (summaryData.length > 0) {
      // Start animation sequence
      setAnimationPhase('idle')
      
      // Phase 1: Go forward (full circle)
      setTimeout(() => {
        setAnimationPhase('forward')
      }, 100)
      
      // Phase 2: Reverse back to actual position
      setTimeout(() => {
        setAnimationPhase('reverse')
      }, 1600) // 100ms delay + 1500ms forward animation
    }
  }, [summaryData])

  const handleBankAccountChange = (e) => {
    setSelectedBankAccount(e.target.value)
    debugger
  }

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value)
  }

  const toggleDateFilter = () => {
    setDateFilterEnabled(!dateFilterEnabled)
    if (dateFilterEnabled) {
      setStartDate('')
      setEndDate('')
    }
  }

  /* ================= COMPUTED VALUES ================= */
  const filteredSummaryData = useMemo(
    () => selectedStatus === 'All'
      ? summaryData
      : summaryData.filter(item => item.status === selectedStatus),
    [summaryData, selectedStatus]
  )

  const totalCheques = useMemo(
    () => filteredSummaryData.reduce((sum, item) => sum + item.count, 0),
    [filteredSummaryData]
  )

  const totalAmount = useMemo(
    () => filteredSummaryData.reduce((sum, item) => sum + item.totalAmount, 0),
    [filteredSummaryData]
  )

  const averageAmount = useMemo(
    () => (totalCheques > 0 ? totalAmount / totalCheques : 0),
    [totalAmount, totalCheques]
  )

  /* ================= CHART DATA ================= */
  const pieChartData = useMemo(
    () =>
      filteredSummaryData.map((item) => ({
        name: item.status,
        value: item.count,
      })),
    [filteredSummaryData]
  )

  const barChartData = useMemo(
    () =>
      filteredSummaryData.map((item) => ({
        status: item.status,
        amount: item.totalAmount,
      })),
    [filteredSummaryData]
  )

  /* ================= COLORS ================= */
  const STATUS_COLORS = {
    Pending: '#FFA726', // Orange
    Issued: '#42A5F5', // Blue
    Cleared: '#66BB6A', // Green
    Cancelled: '#EF5350', // Red
  }

  const STATUS_BADGE_COLORS = {
    Pending: 'warning',
    Issued: 'info',
    Cleared: 'success',
    Cancelled: 'danger',
  }

  const getStatusColor = (status) => STATUS_COLORS[status] || '#6b7280'
  const getBadgeColor = (status) => STATUS_BADGE_COLORS[status] || 'secondary'

  /* ================= FORMAT HELPERS ================= */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  /* ================= UI ================= */
  return (
    <>
      {/* ===== FILTERS ===== */}
      <CRow className="mb-4">
        <CCol>
          <CCard>
            <CCardHeader className="fw-bold">Filters</CCardHeader>
            <CCardBody>
              <CRow className="g-3">
                <CCol xs={12} md={3}>
                  <label className="form-label small fw-semibold text-uppercase">
                    Bank Account
                  </label>
                  <CFormSelect
                    value={selectedBankAccount}
                    onChange={handleBankAccountChange}
                  >
                    <option value="">Select Bank Account</option>
                    {bankAccounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.accountNo} - {account?.bankName}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol xs={12} md={2}>
                  <label className="form-label small fw-semibold text-uppercase">
                    Status
                  </label>
                  <CFormSelect
                    value={selectedStatus}
                    onChange={handleStatusChange}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Issued">Issued</option>
                    <option value="Cleared">Cleared</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </CFormSelect>
                </CCol>

                {dateFilterEnabled && (
                  <>
                    <CCol xs={12} md={2}>
                      <label className="form-label small fw-semibold text-uppercase">
                        Start Date
                      </label>
                      <CFormInput
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </CCol>
                    <CCol xs={12} md={2}>
                      <label className="form-label small fw-semibold text-uppercase">
                        End Date
                      </label>
                      <CFormInput
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </CCol>
                  </>
                )}

                <CCol xs={12} md={dateFilterEnabled ? 3 : 7} className="d-flex align-items-end">
                  <CButton
                    color={dateFilterEnabled ? 'warning' : 'secondary'}
                    variant="outline"
                    onClick={toggleDateFilter}
                    className="w-100"
                  >
                    <CIcon icon={dateFilterEnabled ? cilCheckCircle : cilCalendar} className="me-2" />
                    Filter by Date
                  </CButton>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {loading ? (
        <div className="text-center py-5">
          <CSpinner color="primary" />
          <div className="mt-3 text-muted">Loading data...</div>
        </div>
      ) : !selectedBankAccount ? (
        <CCard>
          <CCardBody className="text-center py-5">
            <div className="text-muted">
              <div className="h5">No Bank Account Selected</div>
              <small>Please select a bank account to view the summary</small>
            </div>
          </CCardBody>
        </CCard>
      ) : summaryData.length === 0 || filteredSummaryData.length === 0 ? (
        <CCard>
          <CCardBody className="text-center py-5">
            <div className="text-muted">
              <div className="h5">No Data Available</div>
              <small>There are no cheques for the selected filters</small>
            </div>
          </CCardBody>
        </CCard>
      ) : (
        <>
          {/* ===== STATUS CARDS AND CHART ===== */}
          <CRow className="mb-4">
            {/* Status Cards */}
            {filteredSummaryData.map((item, index) => {
              const percentage = ((item.count / totalCheques) * 100).toFixed(1)
              return (
                <CCol key={index} xs={12} sm={6} lg={4}>
                  <CCard
                    className={`border-top border-top-4 border-top-${getBadgeColor(item.status)} h-100`}
                  >
                    <CCardBody>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="text-muted small text-uppercase fw-semibold">
                          {item.status}
                        </div>
                        <CBadge color={getBadgeColor(item.status)}>
                          {percentage}%
                        </CBadge>
                      </div>
                      <div className="h3 mb-2 fw-bold">
                        {formatCurrency(item.totalAmount)}
                      </div>
                      <div className="small text-muted">Total Amount</div>
                      <div className="border-top mt-3 pt-3">
                        <div className="small text-muted">
                          <strong>{formatNumber(item.count)}</strong> cheques
                        </div>
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
              )
            })}

            {/* Circular Gauge Chart */}
            <CCol xs={12} lg={8}>
  <CCard className="h-100">
    <CCardHeader className="fw-bold">
      <div>Cheque Amount Progress</div>
      <small className="text-muted fw-normal">Out of LKR 10,000,000.00 maximum</small>
    </CCardHeader>
    <CCardBody className="d-flex flex-column align-items-center justify-content-center">
      <style>
        {`
          @keyframes gaugeForward {
            from {
              stroke-dashoffset: -628;
            }
            to {
              stroke-dashoffset: 0;
            }
          }
          
          @keyframes gaugeReverse {
            0% {
              stroke-dashoffset: 0;
            }
            100% {
              stroke-dashoffset: ${-628 * (1 - (totalAmount / 10000000))};
            }
          }
          
          .gauge-progress-forward {
            animation: gaugeForward 1.5s ease-out forwards;
          }
          
          .gauge-progress-reverse {
            animation: gaugeReverse 1.5s ease-in-out forwards;
          }
        `}
      </style>
      
      <div style={{ position: 'relative', width: '350px', height: '350px' }}>
        <svg width="350" height="350" viewBox="0 0 350 350">
          <defs>
            {/* Colorful gradients for each status */}
            <linearGradient id="gradientIssued" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#42A5F5" />
              <stop offset="100%" stopColor="#1E88E5" />
            </linearGradient>
            <linearGradient id="gradientCleared" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#66BB6A" />
              <stop offset="100%" stopColor="#43A047" />
            </linearGradient>
            <linearGradient id="gradientPending" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFA726" />
              <stop offset="100%" stopColor="#FB8C00" />
            </linearGradient>
            <linearGradient id="gradientCancelled" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF5350" />
              <stop offset="100%" stopColor="#E53935" />
            </linearGradient>
            <linearGradient id="gradientAll" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9C27B0" />
              <stop offset="33%" stopColor="#42A5F5" />
              <stop offset="66%" stopColor="#66BB6A" />
              <stop offset="100%" stopColor="#FFA726" />
            </linearGradient>
          </defs>
          
          {/* Background circle (gray) - thinner */}
          <circle
            cx="175"
            cy="175"
            r="110"
            fill="none"
            stroke="#E8E8E8"
            strokeWidth="40"
          />
          
          {/* Progress circle (colored with gradient) - starts from top */}
          <circle
            cx="175"
            cy="175"
            r="110"
            fill="none"
            stroke={`url(#gradient${selectedStatus})`}
            strokeWidth="40"
            strokeDasharray="691"
            strokeDashoffset={animationPhase === 'idle' ? '-691' : '0'}
            strokeLinecap="round"
            transform="rotate(-90 175 175)"
            className={
              animationPhase === 'forward' 
                ? 'gauge-progress-forward' 
                : animationPhase === 'reverse' 
                ? 'gauge-progress-reverse' 
                : ''
            }
          />
        </svg>
        
        {/* Center Text - clearer and larger */}
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            width: '180px'
          }}
        >
          <div className="h2 fw-bold mb-2" style={{ color: '#42A5F5' }}>
            {((totalAmount / 10000000) * 100).toFixed(1)}%
          </div>
          <div className="h5 fw-bold mb-2">{formatCurrency(totalAmount)}</div>
          <div className="text-muted" style={{ fontSize: '13px', fontWeight: '500' }}>
            of {formatCurrency(10000000)}
          </div>
        </div>
      </div>
      
      {/* Status Legend */}
      <div className="d-flex gap-3 mt-3 flex-wrap justify-content-center">
        {filteredSummaryData.map((item, index) => (
          <div key={index} className="d-flex align-items-center gap-2">
            <div 
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: getStatusColor(item.status)
              }}
            />
            <span className="small text-muted">
              {item.status}: {formatCurrency(item.totalAmount)}
            </span>
          </div>
        ))}
      </div>
    </CCardBody>
  </CCard>
</CCol>
          </CRow>
        </>
      )}
    </>
  )
}

export default ChequeStatusSummary
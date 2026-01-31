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
  CButtonGroup,
  CButton,
} from '@coreui/react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import chequeServices from '../../api/services/ChequeServices/chequeServices'

const Dashboard = () => {
  const [cheques, setCheques] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState('today')

  useEffect(() => {
    loadCheques()
  }, [])

  const loadCheques = async () => {
    try {
      const res = await chequeServices.getAllCheques()
      setCheques(Array.isArray(res) ? res : res?.data || [])
    } finally {
      setLoading(false)
    }
  }

  /* ================= DATE HELPERS ================= */
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const startOfTomorrow = new Date(startOfToday)
  startOfTomorrow.setDate(startOfToday.getDate() + 1)

  const endOfWeek = new Date(startOfToday)
  endOfWeek.setDate(startOfToday.getDate() + 7)

  const endOfMonth = new Date(
    startOfToday.getFullYear(),
    startOfToday.getMonth() + 1,
    0
  )

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  /* ================= FILTERED LISTS ================= */
  const dueToday = useMemo(
    () =>
      cheques.filter(
        (c) =>
          c.dueDate &&
          isSameDay(new Date(c.dueDate), startOfToday) &&
          c.status !== 'Cleared'
      ),
    [cheques]
  )

  const dueTomorrow = useMemo(
    () =>
      cheques.filter(
        (c) =>
          c.dueDate &&
          isSameDay(new Date(c.dueDate), startOfTomorrow) &&
          c.status !== 'Cleared'
      ),
    [cheques]
  )

  const dueThisWeek = useMemo(
    () =>
      cheques.filter((c) => {
        if (!c.dueDate || c.status === 'Cleared') return false
        const d = new Date(c.dueDate)
        return d > startOfToday && d <= endOfWeek
      }),
    [cheques]
  )

  const dueThisMonth = useMemo(
    () =>
      cheques.filter((c) => {
        if (!c.dueDate || c.status === 'Cleared') return false
        const d = new Date(c.dueDate)
        return (
          d.getMonth() === startOfToday.getMonth() &&
          d.getFullYear() === startOfToday.getFullYear()
        )
      }),
    [cheques]
  )

  const sumAmount = (list) =>
    list.reduce((a, b) => a + (Number(b.chequeAmount) || 0), 0)

  /* ================= CHART DATA ================= */
  
  // Status Distribution for Pie Chart
  const statusDistribution = useMemo(() => {
    const statusCount = {}
    cheques.forEach((c) => {
      const status = c.status || 'Unknown'
      statusCount[status] = (statusCount[status] || 0) + 1
    })
    return Object.entries(statusCount).map(([name, value]) => ({
      name,
      value,
    }))
  }, [cheques])

  // Weekly Trend Data
  const weeklyTrendData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const data = []
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfToday)
      date.setDate(startOfToday.getDate() + i)
      
      const dayData = cheques.filter((c) => {
        if (!c.dueDate || c.status === 'Cleared') return false
        return isSameDay(new Date(c.dueDate), date)
      })
      
      data.push({
        day: days[date.getDay()],
        count: dayData.length,
        amount: sumAmount(dayData),
      })
    }
    
    return data
  }, [cheques])

  // Amount by Category/Supplier
  const topSuppliers = useMemo(() => {
    const supplierData = {}
    cheques.forEach((c) => {
      const supplier = c.payeeName || 'Unknown'
      if (!supplierData[supplier]) {
        supplierData[supplier] = { name: supplier, total: 0, count: 0 }
      }
      supplierData[supplier].total += Number(c.chequeAmount) || 0
      supplierData[supplier].count += 1
    })
    
    return Object.values(supplierData)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
  }, [cheques])

  // Monthly comparison data
  const monthlyComparison = useMemo(() => {
    const months = []
    for (let i = 2; i >= 0; i--) {
      const date = new Date(startOfToday.getFullYear(), startOfToday.getMonth() - i, 1)
      const monthName = date.toLocaleDateString('en-US', { month: 'short' })
      
      const monthData = cheques.filter((c) => {
        if (!c.dueDate) return false
        const d = new Date(c.dueDate)
        return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear()
      })
      
      months.push({
        month: monthName,
        pending: monthData.filter(c => c.status !== 'Cleared').length,
        cleared: monthData.filter(c => c.status === 'Cleared').length,
        amount: sumAmount(monthData),
      })
    }
    
    return months
  }, [cheques])

  /* ================= ACTIVE DATA ================= */
  const activeData = {
    today: { title: 'Due Today', data: dueToday, color: 'primary' },
    tomorrow: { title: 'Due Tomorrow', data: dueTomorrow, color: 'info' },
    week: { title: 'Due This Week', data: dueThisWeek, color: 'warning' },
    month: { title: 'Due This Month', data: dueThisMonth, color: 'danger' },
  }[activeView]

  const COLORS = ['#321fdb', '#39f', '#f9b115', '#e55353', '#2eb85c']

  /* ================= UI ================= */
  return (
    <>
      {/* ===== DASHBOARD CARDS ===== */}
      

      {/* ===== CHARTS ROW ===== */}
    

      <WidgetsDropdown
        className="mb-4"
        items={[
          {
            title: 'Due Today',
            value: dueToday.length,
            text: `Total: ${sumAmount(dueToday).toLocaleString()}`,
            color: 'primary',
            chartData: dueToday.map((_, i) => i * 10 + 10),
            onClick: () => setActiveView('today'),
          },
          {
            title: 'Due Tomorrow',
            value: dueTomorrow.length,
            text: `Total: ${sumAmount(dueTomorrow).toLocaleString()}`,
            color: 'info',
            chartData: dueTomorrow.map((_, i) => i * 8 + 15),
            onClick: () => setActiveView('tomorrow'),
          },
          {
            title: 'Due This Week',
            value: dueThisWeek.length,
            text: `Total: ${sumAmount(dueThisWeek).toLocaleString()}`,
            color: 'warning',
            chartData: dueThisWeek.map((_, i) => i * 12 + 5),
            onClick: () => setActiveView('week'),
          },
          {
            title: 'Due This Month',
            value: dueThisMonth.length,
            text: `Total: ${sumAmount(dueThisMonth).toLocaleString()}`,
            color: 'danger',
            chartData: dueThisMonth.map((_, i) => i * 7 + 20),
            onClick: () => setActiveView('month'),
          },
        ]}
      />

      {/* ===== TABLE ===== */}
      <CRow>
        <CCol>
          <CCard className={`border-top border-top-4 border-top-${activeData.color}`}>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <span className="fw-bold">{activeData.title}</span>
              <CButtonGroup size="sm">
                <CButton 
                  color="primary" 
                  variant={activeView === 'today' ? 'outline' : 'ghost'}
                  onClick={() => setActiveView('today')}
                >
                  Today
                </CButton>
                <CButton 
                  color="info" 
                  variant={activeView === 'tomorrow' ? 'outline' : 'ghost'}
                  onClick={() => setActiveView('tomorrow')}
                >
                  Tomorrow
                </CButton>
                <CButton 
                  color="warning" 
                  variant={activeView === 'week' ? 'outline' : 'ghost'}
                  onClick={() => setActiveView('week')}
                >
                  Week
                </CButton>
                <CButton 
                  color="danger" 
                  variant={activeView === 'month' ? 'outline' : 'ghost'}
                  onClick={() => setActiveView('month')}
                >
                  Month
                </CButton>
              </CButtonGroup>
            </CCardHeader>

            <CCardBody>
              {loading ? (
                <div className="text-center py-5">
                  <CSpinner />
                </div>
              ) : (
                <>
                  <div className="mb-3 p-3  rounded">
                    <CRow>
                      <CCol xs={6} md={3}>
                        <div className="text-muted small">Total Cheques</div>
                        <div className="h4 mb-0">{activeData.data.length}</div>
                      </CCol>
                      <CCol xs={6} md={3}>
                        <div className="text-muted small">Total Amount</div>
                        <div className="h4 mb-0">
                          {sumAmount(activeData.data).toLocaleString()}
                        </div>
                      </CCol>
                      <CCol xs={6} md={3}>
                        <div className="text-muted small">Average Amount</div>
                        <div className="h4 mb-0">
                          {activeData.data.length > 0
                            ? (sumAmount(activeData.data) / activeData.data.length).toLocaleString(undefined, {
                                maximumFractionDigits: 0,
                              })
                            : 0}
                        </div>
                      </CCol>
                      <CCol xs={6} md={3}>
                        <div className="text-muted small">Status</div>
                        <CBadge color={activeData.color} className="mt-1">
                          {activeData.title}
                        </CBadge>
                      </CCol>
                    </CRow>
                  </div>

                  <CTable hover responsive bordered striped>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Cheque No</CTableHeaderCell>
                        <CTableHeaderCell>Supplier</CTableHeaderCell>
                        <CTableHeaderCell className="text-end">Amount</CTableHeaderCell>
                        <CTableHeaderCell>Due Date</CTableHeaderCell>
                        <CTableHeaderCell>Status</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>

                    <CTableBody>
                      {activeData.data.map((c) => (
                        <CTableRow 
                          key={c.chequeId} 
                          className={c.isOverdue ? 'table-danger' : ''}
                          style={{ cursor: 'pointer' }}
                        >
                          <CTableDataCell>
                            <strong>{c.chequeNo}</strong>
                          </CTableDataCell>
                          <CTableDataCell>{c.payeeName}</CTableDataCell>
                          <CTableDataCell className="text-end">
                            <strong>{Number(c.chequeAmount).toLocaleString()}</strong>
                          </CTableDataCell>
                          <CTableDataCell>
                            {new Date(c.dueDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </CTableDataCell>
                          <CTableDataCell>
                            <CBadge color={activeData.color}>{activeData.title}</CBadge>
                          </CTableDataCell>
                        </CTableRow>
                      ))}

                      {activeData.data.length === 0 && (
                        <CTableRow>
                          <CTableDataCell colSpan={5} className="text-center py-5">
                            <div className="text-muted">
                              <div className="h5">No cheques found</div>
                              <small>There are no cheques matching the selected criteria</small>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      )}
                    </CTableBody>
                  </CTable>
                </>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
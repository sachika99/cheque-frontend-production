import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  CRow,
  CCol,
  CWidgetStatsA,
} from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'

/* fallback animated wave */
const fallbackWave = [12, 28, 22, 35, 26, 32, 18]

const WidgetsDropdown = ({ className, items = [] }) => {
  const chartRefs = useRef([])

  useEffect(() => {
    chartRefs.current.forEach((chart, index) => {
      if (!chart) return

      const color = items[index]?.color || 'primary'

      setTimeout(() => {
        chart.data.datasets[0].pointBackgroundColor =
          getStyle(`--cui-${color}`)
        chart.update()
      }, 150)
    })
  }, [items])

  return (
    <CRow className={className} xs={{ gutter: 3 }}>
      {items.map((item, index) => {
        const data =
          Array.isArray(item.chartData) && item.chartData.length > 0
            ? item.chartData
            : fallbackWave

        return (
          <CCol
            key={index}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
          >
            <CWidgetStatsA
              color={item.color}
              role="button"
              onClick={item.onClick}
              style={{
                cursor: 'pointer',
                minHeight: 100,
                padding: '0.5rem',
              }}
              value={
                <div className="d-flex flex-column lh-sm">
                  {/* COUNT */}
                  <span className="fw-bold fs-5 fs-lg-4">
                    {item.value}
                  </span>

                  {/* TOTAL TEXT */}
                  <span className="fw-medium fs-7">
                    {item.text}
                  </span>
                </div>
              }
              title={
                <span className="fw-semibold fs-7">
                  {item.title}
                </span>
              }
              chart={
                <CChartLine
                  ref={(el) => (chartRefs.current[index] = el)}
                  className="mt-1 mx-1"
                  style={{ height: '45px' }}
                  data={{
                    labels: ['1', '2', '3', '4', '5', '6', '7'],
                    datasets: [
                      {
                        label: item.title,
                        backgroundColor: 'transparent',
                        borderColor: 'rgba(255,255,255,.55)',
                        pointBackgroundColor: getStyle(`--cui-${item.color}`),
                        data,
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: { display: false },
                    },
                    maintainAspectRatio: false,
                    animation: {
                      duration: 1000,
                      easing: 'easeInOutQuart',
                    },
                    scales: {
                      x: { display: false, grid: { display: false } },
                      y: { display: false, grid: { display: false } },
                    },
                    elements: {
                      line: {
                        tension: 0.45,
                        borderWidth: 2,
                      },
                      point: {
                        radius: 2,
                        hitRadius: 6,
                        hoverRadius: 3,
                      },
                    },
                  }}
                />
              }
            />
          </CCol>
        )
      })}
    </CRow>
  )
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  items: PropTypes.array.isRequired,
}

export default WidgetsDropdown

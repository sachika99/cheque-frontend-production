import React, { useState, useEffect, useRef } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CFormLabel,
  CFormInput,
  CFormCheck,
  CAlert,
  CRow,
  CCol,
  CCard,
  CCardBody,
} from '@coreui/react'
import { cilCheck, cilX, cilArrowLeft, cilArrowRight, cilArrowTop, cilArrowBottom, cilReload, cilPrint } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import ChequePrintOverlay from './ChequePrintOverlay'

const PX_PER_MM = 3.7795  

const pxToMm = (px) => +(px / PX_PER_MM).toFixed(2)
const mmToPx = (mm) => mm * PX_PER_MM

const ChequeCalibration = ({ visible, onClose, chequeData, bankCode = 'SEYLAN' }) => {
  const [selectedField, setSelectedField] = useState('payee')
  const [showGrid, setShowGrid] = useState(true)
  const [showBackground, setShowBackground] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const overlayRef = useRef(null)
 
  const getCalibrationKey = () => `cheque_calibration_${bankCode}`
  
  const loadCalibration = () => {
    const saved = localStorage.getItem(getCalibrationKey())
    if (saved) {
      return JSON.parse(saved)
    }
    return {}
  }

  const [calibration, setCalibration] = useState(loadCalibration)
 
  const defaultPositions = {
    date: { x: 144.5, y: 10.5 },  
    payee: { x: 20, y: 25.5 },
    amountWords: { x: 23, y: 36 },
    amountFigures: { x: 127.5, y: 43 },
    signature: { x: 134, y: 67.5 },
  }
 
  const getFieldPosition = (fieldName) => {
    const defaultPos = defaultPositions[fieldName] || { x: 0, y: 0 }
    const offset = calibration[fieldName] || { x: 0, y: 0 }
    return {
      x: defaultPos.x + offset.x,
      y: defaultPos.y + offset.y,
    }
  }
 
  const saveCalibration = () => {
    try {
      localStorage.setItem(getCalibrationKey(), JSON.stringify(calibration))
      alert('Calibration saved successfully!')
      
      window.location.reload()
    } catch (error) {
      console.error('Error saving calibration:', error)
      alert('Error saving calibration. Please try again.')
    }
  }

  const resetCalibration = () => {
    if (window.confirm('Reset all field positions to default?')) {
      try {
        setCalibration({})
        localStorage.removeItem(getCalibrationKey())
        alert('Calibration reset to defaults!')
       
        window.location.reload()
      } catch (error) {
        console.error('Error resetting calibration:', error)
        alert('Error resetting calibration. Please try again.')
      }
    }
  }
 
  const nudgeField = (fieldName, deltaX, deltaY) => {
    setCalibration((prev) => {
      const current = prev[fieldName] || { x: 0, y: 0 }
      return {
        ...prev,
        [fieldName]: {
          x: +(current.x + deltaX).toFixed(2),
          y: +(current.y + deltaY).toFixed(2),
        },
      }
    })
  }
 
  const handleDragStart = (e, fieldName) => {
    e.preventDefault()
    setIsDragging(true)
    setSelectedField(fieldName)
    const rect = overlayRef.current?.getBoundingClientRect()
    if (rect) {
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }
 
  const handleDrag = (e) => {
    if (!isDragging || !overlayRef.current) return

    const rect = overlayRef.current.getBoundingClientRect()
    const currentX = e.clientX - rect.left
    const currentY = e.clientY - rect.top

    const deltaX = pxToMm(currentX - dragStart.x)
    const deltaY = pxToMm(currentY - dragStart.y)

    nudgeField(selectedField, deltaX, deltaY)
    setDragStart({ x: currentX, y: currentY })
  }
 
  const handleDragEnd = () => {
    setIsDragging(false)
  }
 
  const fields = [
    { key: 'date', label: 'Date', color: '#3b82f6' },
    { key: 'payee', label: 'Payee Name', color: '#10b981' },
    { key: 'amountWords', label: 'Amount in Words', color: '#f59e0b' },
    { key: 'amountFigures', label: 'Amount in Figures', color: '#ef4444' },
    { key: 'signature', label: 'Signature', color: '#8b5cf6' },
  ]

  const currentField = fields.find((f) => f.key === selectedField)
  const currentPos = getFieldPosition(selectedField)
 
  const calibratedChequeData = {
    ...chequeData,
    calibration: calibration,
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDrag)
      document.addEventListener('mouseup', handleDragEnd)
      return () => {
        document.removeEventListener('mousemove', handleDrag)
        document.removeEventListener('mouseup', handleDragEnd)
      }
    }
  }, [isDragging, dragStart, selectedField])

  return (
    <CModal
      visible={visible}
      onClose={onClose}
      size="xl"
      backdrop="static"
      className="cheque-calibration-modal"
    >
      <CModalHeader>
        <CModalTitle>Cheque Calibration</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CAlert color="info" className="mb-3">
          <strong>Calibration Mode:</strong> Drag fields or use arrow buttons to fine-tune positions. 
          Positions are saved per bank and printer.
        </CAlert>

        <CRow>
          <CCol md={3}>
            <CCard>
              <CCardBody>
                <h6 className="mb-3">Field Selection</h6>
                {fields.map((field) => (
                  <CButton
                    key={field.key}
                    color={selectedField === field.key ? 'primary' : 'secondary'}
                    variant={selectedField === field.key ? 'solid' : 'outline'}
                    className="w-100 mb-2"
                    onClick={() => setSelectedField(field.key)}
                    style={{
                      borderColor: field.color,
                    }}
                  >
                    {field.label}
                  </CButton>
                ))}

                <hr className="my-3" />

                <h6 className="mb-3">Options</h6>
                <CFormCheck
                  id="show-grid"
                  label="Show Grid (1mm)"
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                  className="mb-2"
                />
                <CFormCheck
                  id="show-background"
                  label="Show Background Cheque"
                  checked={showBackground}
                  onChange={(e) => setShowBackground(e.target.checked)}
                />

                <hr className="my-3" />

                <h6 className="mb-3">Current Position</h6>
                <CFormLabel>X (mm)</CFormLabel>
                <CFormInput
                  type="number"
                  step="0.1"
                  value={currentPos.x.toFixed(2)}
                  readOnly
                  className="mb-2"
                />
                <CFormLabel>Y (mm)</CFormLabel>
                <CFormInput
                  type="number"
                  step="0.1"
                  value={currentPos.y.toFixed(2)}
                  readOnly
                />

                <hr className="my-3" />

                <h6 className="mb-3">Fine Adjustment</h6>
                <div className="text-center mb-2">
                  <CButton
                    color="secondary"
                    size="sm"
                    onClick={() => nudgeField(selectedField, 0, -0.5)}
                    className="mb-1"
                  >
                    <CIcon icon={cilArrowTop} />
                  </CButton>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <CButton
                    color="secondary"
                    size="sm"
                    onClick={() => nudgeField(selectedField, -0.5, 0)}
                  >
                    <CIcon icon={cilArrowLeft} />
                  </CButton>
                  <CButton
                    color="secondary"
                    size="sm"
                    onClick={() => nudgeField(selectedField, 0.5, 0)}
                  >
                    <CIcon icon={cilArrowRight} />
                  </CButton>
                </div>
                <div className="text-center">
                  <CButton
                    color="secondary"
                    size="sm"
                    onClick={() => nudgeField(selectedField, 0, 0.5)}
                  >
                    <CIcon icon={cilArrowBottom} />
                  </CButton>
                </div>
                <small className="text-muted d-block text-center mt-2">
                  ±0.5mm steps
                </small>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol md={9}>
            <div
              className="cheque-calibration-preview"
              style={{
                position: 'relative',
                border: '2px solid #333',
                borderRadius: '8px',
                padding: '20px',
                background: showGrid ? '#f9fafb' : '#fff',
              }}
            >
              {showGrid && (
                <div
                  className="calibration-grid"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `
                      linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: `${mmToPx(1)}px ${mmToPx(1)}px`,
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                />
              )}

              <div ref={overlayRef} style={{ position: 'relative', zIndex: 2 }}>
                <ChequePrintOverlay
                  data={calibratedChequeData}
                  bankCode={bankCode}
                  showPreview={showBackground}
                  side="front"
                  calibration={calibration}
                />
              </div>
 
              {fields.map((field) => {
                const pos = getFieldPosition(field.key)
                const isSelected = selectedField === field.key
                return (
                  <div
                    key={field.key}
                    className="calibration-field-indicator"
                    style={{
                      position: 'absolute',
                      left: `${mmToPx(pos.x)}px`,
                      top: `${mmToPx(pos.y)}px`,
                      width: '100px',
                      height: '30px',
                      border: `2px dashed ${field.color}`,
                      backgroundColor: isSelected ? `${field.color}20` : `${field.color}10`,
                      cursor: 'move',
                      zIndex: 100,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      color: field.color,
                      userSelect: 'none',
                    }}
                    onMouseDown={(e) => handleDragStart(e, field.key)}
                  >
                    {field.label}
                  </div>
                )
              })}
            </div>

            <div className="mt-3">
              <CAlert color="warning">
                <strong>Tip:</strong> Drag the colored boxes to move fields. Use arrow buttons for precise 0.5mm adjustments.
                Print a test to verify alignment on your printer.
              </CAlert>
            </div>
          </CCol>
        </CRow>
      </CModalBody>
      <CModalFooter>
        <CButton 
          color="secondary" 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            resetCalibration()
          }}
        >
          <CIcon icon={cilReload} className="me-2" />
          Reset to Default
        </CButton>
        <CButton 
          color="info" 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            window.print()
          }}
        >
          <CIcon icon={cilPrint} className="me-2" />
          Print Test
        </CButton>
        <CButton 
          color="primary" 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            saveCalibration()
          }}
        >
          <CIcon icon={cilCheck} className="me-2" />
          Save Calibration
        </CButton>
        <CButton 
          color="secondary" 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onClose()
          }}
        >
          <CIcon icon={cilX} className="me-2" />
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default ChequeCalibration


import React from 'react'
import { getBankConfig } from '../configs/bankConfigs'
import { formatChequeDate, splitAmountWords } from '../utils/seylanChequeConfig'
import { amountToWords } from '../utils/amountToWords'
import '../scss/cheque-print-overlay.scss'

 
const ChequePrintOverlay = ({ 
  data, 
  bankCode = 'SEYLAN', 
  showPreview = true,
  side = 'front',
  calibration = {}  
}) => {
  const config = getBankConfig(bankCode)
  const isFront = side === 'front'
   
  const chequeTypeUpper = String(data.chequeType || '').toUpperCase()
  const isCross = chequeTypeUpper === 'CROSS' || 
                  chequeTypeUpper === 'ACCOUNT_PAYEE' || 
                  chequeTypeUpper === 'AC_PAYEE' ||
                  (data.chequeType && data.chequeType !== 'BEARER')
  
 
  if (showPreview) {
    console.log('Cheque type:', {
      input: data.chequeType,
      isCross: isCross,
      chequeTypeUpper: chequeTypeUpper
    })
  }
 
  let dateToFormat = data.formattedDate || data.chequeDate
  if (!dateToFormat && data.chequeDate) {
 
    const d = new Date(data.chequeDate)
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const year = d.getFullYear()
      dateToFormat = `${day}/${month}/${year}`
    }
  }
  
  const dateParts = formatChequeDate(dateToFormat)
 
  let dateDigits = dateParts.digits || []
  while (dateDigits.length < 8) {
    dateDigits.push('')
  }
   
  dateDigits = dateDigits.slice(0, 8)
   
  if (showPreview) {
    console.log('Date formatting:', {
      input: dateToFormat,
      digits: dateDigits,
      full: dateParts.full,
      formatted: `${dateDigits[0]}${dateDigits[1]} ${dateDigits[2]}${dateDigits[3]} ${dateDigits[4]}${dateDigits[5]}${dateDigits[6]}${dateDigits[7]}`
    })
  }
 
  let amountInWords = data.amountInWords
  if (!amountInWords && data.chequeAmount) {
    amountInWords = amountToWords(parseFloat(data.chequeAmount))
  }
 
  const amountWordsLines = splitAmountWords(amountInWords || '', 1400, 38)
 
  let formattedAmount = data.formattedAmount
  if (!formattedAmount && data.chequeAmount) {
    const amount = parseFloat(data.chequeAmount)
    if (!isNaN(amount)) {
      formattedAmount = amount.toFixed(2)
    }
  }
  if (!formattedAmount || formattedAmount === 'NaN' || formattedAmount === '0.00') {
    formattedAmount = data.chequeAmount ? parseFloat(data.chequeAmount).toFixed(2) : ''
  }
   
  if (showPreview) {
    console.log('Amount formatting:', {
      input: data.chequeAmount,
      formatted: formattedAmount,
      words: amountInWords
    })
  }
 
  const containerStyle = {
    position: 'relative',
    width: config.dimensions.physicalWidth,  
    height: config.dimensions.physicalHeight,  
    backgroundColor: showPreview ? '#ffffff' : 'transparent',
    fontFamily: 'Courier New, monospace',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    
    backgroundImage: showPreview && config.backgroundImage 
      ? `url(${config.backgroundImage})` 
      : 'none',
    backgroundSize: showPreview ? '100% 100%' : 'none', 
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top left',  
     
    imageRendering: showPreview ? 'crisp-edges' : 'auto',
     
    transform: 'none',
     
    minWidth: config.dimensions.physicalWidth,
    maxWidth: config.dimensions.physicalWidth,
    minHeight: config.dimensions.physicalHeight,
    maxHeight: config.dimensions.physicalHeight,
  }

  if (!isFront) {
     
    return (
      <div className="cheque-print-overlay" style={containerStyle}>
        <div style={{
          borderBottom: '2px solid #333',
          paddingBottom: '10px',
          marginBottom: '20px',
          textAlign: 'center',
          position: 'absolute',
          top: '50px',
          left: '100px',
          right: '100px',
        }}>
          <h6 style={{ margin: 0, fontSize: '24px' }}>ENDORSEMENT</h6>
        </div>
        <div style={{
          position: 'absolute',
          top: '150px',
          left: '100px',
          right: '100px',
          minHeight: '300px',
          border: '1px dashed #999',
          padding: '20px',
        }}>
          <div style={{ fontSize: '24px', color: '#666', marginBottom: '20px' }}>
            Please sign here:
          </div>
          <div style={{ fontSize: '22px', color: '#999' }}>
            Signature: _________________________
          </div>
          <div style={{ fontSize: '22px', color: '#999', marginTop: '20px' }}>
            Name: {data.payeeName || 'Payee Name'}
          </div>
        </div>
      </div>
    )
  }
 
  return (
    <div className="cheque-print-overlay" style={containerStyle} data-print="true">
      
      {config.fields.date && dateParts.full && dateDigits.length >= 8 && (
        <>
         
          {dateDigits[0] && config.fields.date.d1 && (
            <div
              className="cheque-field cheque-date-d1"
              style={{
                position: 'absolute',
                top: calibration.date?.d1 
                  ? `calc(${config.fields.date.d1.top} + ${calibration.date.d1.y}mm)` 
                  : config.fields.date.d1.top,
                left: calibration.date?.d1 
                  ? `calc(${config.fields.date.d1.left} + ${calibration.date.d1.x}mm)` 
                  : config.fields.date.d1.left,
                fontSize: config.fields.date.d1.fontSize,
                fontWeight: config.fields.date.d1.fontWeight,
                color: config.fields.date.d1.color,
                textAlign: config.fields.date.d1.textAlign || 'center',
                width: '6mm',  
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 20,
              }}
            >
              {dateDigits[0]}
            </div>
          )}
           
          {dateDigits[1] && config.fields.date.d2 && (
            <div
              className="cheque-field cheque-date-d2"
              style={{
                position: 'absolute',
                top: calibration.date?.d2 
                  ? `calc(${config.fields.date.d2.top} + ${calibration.date.d2.y}mm)` 
                  : config.fields.date.d2.top,
                left: calibration.date?.d2 
                  ? `calc(${config.fields.date.d2.left} + ${calibration.date.d2.x}mm)` 
                  : config.fields.date.d2.left,
                fontSize: config.fields.date.d2.fontSize,
                fontWeight: config.fields.date.d2.fontWeight,
                color: config.fields.date.d2.color,
                textAlign: config.fields.date.d2.textAlign || 'center',
                width: '6mm',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 20,
              }}
            >
              {dateDigits[1]}
            </div>
          )}
           
          {dateDigits[2] && config.fields.date.m1 && (
            <div
              className="cheque-field cheque-date-m1"
              style={{
                position: 'absolute',
                top: calibration.date?.m1 
                  ? `calc(${config.fields.date.m1.top} + ${calibration.date.m1.y}mm)` 
                  : config.fields.date.m1.top,
                left: calibration.date?.m1 
                  ? `calc(${config.fields.date.m1.left} + ${calibration.date.m1.x}mm)` 
                  : config.fields.date.m1.left,
                fontSize: config.fields.date.m1.fontSize,
                fontWeight: config.fields.date.m1.fontWeight,
                color: config.fields.date.m1.color,
                textAlign: config.fields.date.m1.textAlign || 'center',
                width: '6mm',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 20,
              }}
            >
              {dateDigits[2]}
            </div>
          )}
           
          {dateDigits[3] && config.fields.date.m2 && (
            <div
              className="cheque-field cheque-date-m2"
              style={{
                position: 'absolute',
                top: calibration.date?.m2 
                  ? `calc(${config.fields.date.m2.top} + ${calibration.date.m2.y}mm)` 
                  : config.fields.date.m2.top,
                left: calibration.date?.m2 
                  ? `calc(${config.fields.date.m2.left} + ${calibration.date.m2.x}mm)` 
                  : config.fields.date.m2.left,
                fontSize: config.fields.date.m2.fontSize,
                fontWeight: config.fields.date.m2.fontWeight,
                color: config.fields.date.m2.color,
                textAlign: config.fields.date.m2.textAlign || 'center',
                width: '6mm',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 20,
              }}
            >
              {dateDigits[3]}
            </div>
          )}
           
          {dateDigits[6] && config.fields.date.y3 && (
            <div
              className="cheque-field cheque-date-y3"
              style={{
                position: 'absolute',
                top: calibration.date?.y3 
                  ? `calc(${config.fields.date.y3.top} + ${calibration.date.y3.y}mm)` 
                  : config.fields.date.y3.top,
                left: calibration.date?.y3 
                  ? `calc(${config.fields.date.y3.left} + ${calibration.date.y3.x}mm)` 
                  : config.fields.date.y3.left,
                fontSize: config.fields.date.y3.fontSize,
                fontWeight: config.fields.date.y3.fontWeight,
                color: config.fields.date.y3.color,
                textAlign: config.fields.date.y3.textAlign || 'center',
                width: '6mm',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 20,
              }}
            >
              {dateDigits[6]}
            </div>
          )}
           
          {dateDigits[7] && config.fields.date.y4 && (
            <div
              className="cheque-field cheque-date-y4"
              style={{
                position: 'absolute',
                top: calibration.date?.y4 
                  ? `calc(${config.fields.date.y4.top} + ${calibration.date.y4.y}mm)` 
                  : config.fields.date.y4.top,
                left: calibration.date?.y4 
                  ? `calc(${config.fields.date.y4.left} + ${calibration.date.y4.x}mm)` 
                  : config.fields.date.y4.left,
                fontSize: config.fields.date.y4.fontSize,
                fontWeight: config.fields.date.y4.fontWeight,
                color: config.fields.date.y4.color,
                textAlign: config.fields.date.y4.textAlign || 'center',
                width: '6mm',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 20,
              }}
            >
              {dateDigits[7]}
            </div>
          )}
        </>
      )}
 
      {isCross && config.fields.chequeType && (
        <> 
          <svg
            className="cheque-field cheque-cross-lines"
            style={{
              position: 'absolute',
              top: config.fields.chequeType.area.top,
              left: config.fields.chequeType.area.left,
              width: config.fields.chequeType.area.width,
              height: config.fields.chequeType.area.height,
              zIndex: 100,
              pointerEvents: 'none',
              overflow: 'visible',
            }}
          >
            <line
              x1="0"
              y1="0"
              x2="100%"
              y2="100%"
              stroke={config.fields.chequeType.crossLines.line1.color}
              strokeWidth={config.fields.chequeType.crossLines.line1.width}
              strokeLinecap="round"
            />
            <line
              x1="0"
              y1="100%"
              x2="100%"
              y2="0"
              stroke={config.fields.chequeType.crossLines.line2.color}
              strokeWidth={config.fields.chequeType.crossLines.line2.width}
              strokeLinecap="round"
            />
          </svg>
           
          {config.fields.chequeType.text && (
            <div
              className="cheque-field cheque-cross-text"
              style={{
                position: 'absolute',
                top: config.fields.chequeType.text.top,
                left: config.fields.chequeType.text.left,
                fontSize: config.fields.chequeType.text.fontSize,
                fontWeight: config.fields.chequeType.text.fontWeight,
                color: '#000000',
                transform: `rotate(${config.fields.chequeType.text.rotation}deg)`,
                transformOrigin: 'center center',
                zIndex: 101,
                whiteSpace: 'nowrap',
                textShadow: '1px 1px 2px rgba(255, 255, 255, 0.9)',
              }}
            >
              A/C PAYEE ONLY
            </div>
          )}
        </>
      )}
 
      {data.payeeName && config.fields.payee && (
        <div
          className="cheque-field cheque-payee"
          style={{
            position: 'absolute',
            top: calibration.payee 
              ? `calc(${config.fields.payee.top} + ${calibration.payee.y}mm)` 
              : config.fields.payee.top,
            left: calibration.payee 
              ? `calc(${config.fields.payee.left} + ${calibration.payee.x}mm)` 
              : config.fields.payee.left,
            width: config.fields.payee.width,
            fontSize: config.fields.payee.fontSize,
            fontWeight: config.fields.payee.fontWeight,
            color: config.fields.payee.color,
            textTransform: config.fields.payee.textTransform,
            whiteSpace: config.fields.payee.whiteSpace || 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            zIndex: 20,
          }}
        >
          {data.payeeName}
        </div>
      )}
 
      {formattedAmount && formattedAmount !== '' && config.fields.amountFigures && (
        <div
          className="cheque-field cheque-amount-figures"
          style={{
            position: 'absolute',
            top: calibration.amountFigures 
              ? `calc(${config.fields.amountFigures.top} + ${calibration.amountFigures.y}mm)` 
              : config.fields.amountFigures.top,
            left: calibration.amountFigures 
              ? `calc(${config.fields.amountFigures.left} + ${calibration.amountFigures.x}mm)` 
              : config.fields.amountFigures.left,
            width: config.fields.amountFigures.width,
            fontSize: config.fields.amountFigures.fontSize,
            fontWeight: config.fields.amountFigures.fontWeight,
            color: config.fields.amountFigures.color,
            textAlign: config.fields.amountFigures.textAlign,
            zIndex: 20,
          }}
        >
          {formattedAmount}
        </div>
      )}
 
      {amountWordsLines && amountWordsLines.length > 0 && amountWordsLines[0] && config.fields.amountWords && (
        <div
          className="cheque-field cheque-amount-words"
          style={{
            position: 'absolute',
            top: calibration.amountWords 
              ? `calc(${config.fields.amountWords.top} + ${calibration.amountWords.y}mm)` 
              : config.fields.amountWords.top,
            left: calibration.amountWords 
              ? `calc(${config.fields.amountWords.left} + ${calibration.amountWords.x}mm)` 
              : config.fields.amountWords.left,
            width: config.fields.amountWords.width,
            fontSize: config.fields.amountWords.fontSize,
            fontWeight: config.fields.amountWords.fontWeight,
            fontStyle: config.fields.amountWords.fontStyle,
            color: config.fields.amountWords.color,
            lineHeight: config.fields.amountWords.lineHeight,
            zIndex: 20,
          }}
        >
          {amountWordsLines.join(' ')}
        </div>
      )}
 
      {data.accountNo && config.fields.accountNumber && (
        <div
          className="cheque-field cheque-account-number"
          style={{
            position: 'absolute',
            top: config.fields.accountNumber.top,
            left: config.fields.accountNumber.left,
            fontSize: config.fields.accountNumber.fontSize,
            fontWeight: config.fields.accountNumber.fontWeight,
            color: config.fields.accountNumber.color,
            zIndex: 20,
          }}
        >
          {data.accountNo}
        </div>
      )} 
      
      {data.accountName && config.fields.companyName && (
        <div
          className="cheque-field cheque-company-name"
          style={{
            position: 'absolute',
            top: config.fields.companyName.top,
            left: config.fields.companyName.left,
            fontSize: config.fields.companyName.fontSize,
            fontWeight: config.fields.companyName.fontWeight,
            color: config.fields.companyName.color,
            textTransform: config.fields.companyName.textTransform,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: config.fields.companyName.maxWidth,
            zIndex: 20,
          }}
        >
          {data.accountName}
        </div>
      )}
    </div>
  )
}

export default ChequePrintOverlay


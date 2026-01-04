import React from 'react'
import { 
  SEYLAN_CHEQUE_DIMENSIONS,
  SEYLAN_CHEQUE_POSITIONS,
  formatChequeDate,
  splitAmountWords
} from '../../utils/seylanChequeConfig'
import { amountToWords } from '../../utils/amountToWords'

const SeylanChequePrintTemplate = ({ side = 'front', data }) => {
  const isFront = side === 'front'
  const isCross = data.chequeType === 'CROSS' || data.chequeType === 'ACCOUNT_PAYEE'

  const dateParts = formatChequeDate(data.formattedDate || data.chequeDate)
  const dateDigits = dateParts.digits || []
  while (dateDigits.length < 8) {
    dateDigits.push('')
  }
  
  let amountInWords = data.amountInWords
  if (!amountInWords && data.chequeAmount) {
    amountInWords = amountToWords(parseFloat(data.chequeAmount))
  }
  
  const amountWordsLines = splitAmountWords(amountInWords || '', 1400, 38)
  
  const formattedAmount = data.formattedAmount || 
    (data.chequeAmount ? parseFloat(data.chequeAmount).toFixed(2) : '0.00')

  const printStyle = {
    width: '2000px',
    height: '1000px',
    position: 'relative',
    backgroundColor: '#fff',
    fontFamily: 'Arial, sans-serif',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
  }

  if (isFront) {
    return (
      <div className="seylan-cheque-print" style={printStyle}>
     
        {SEYLAN_CHEQUE_POSITIONS.DATE.boxes.map((box, index) => {
          const digit = dateDigits[index] || ''
          return (
            <div
              key={index}
              className="cheque-print-field cheque-date-box"
              style={{
                position: 'absolute',
                left: `${box.x}px`,
                top: `${box.y}px`,
                width: `${box.width}px`,
                height: `${box.height}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: `${SEYLAN_CHEQUE_POSITIONS.DATE.FONT_SIZE}px`,
                fontWeight: SEYLAN_CHEQUE_POSITIONS.DATE.FONT_WEIGHT,
                color: '#000',
                textAlign: 'center',
              }}
            >
              {digit}
            </div>
          )
        })}

        
        {isCross && (
          <>
            <svg
              className="cheque-print-field"
              style={{
                position: 'absolute',
                left: `${SEYLAN_CHEQUE_POSITIONS.CHEQUE_TYPE.AREA.x}px`,
                top: `${SEYLAN_CHEQUE_POSITIONS.CHEQUE_TYPE.AREA.y}px`,
                width: `${SEYLAN_CHEQUE_POSITIONS.CHEQUE_TYPE.AREA.width}px`,
                height: `${SEYLAN_CHEQUE_POSITIONS.CHEQUE_TYPE.AREA.height}px`,
                zIndex: 100,
                pointerEvents: 'none',
              }}
            >
              <line
                x1="0"
                y1="0"
                x2={SEYLAN_CHEQUE_POSITIONS.CHEQUE_TYPE.AREA.width}
                y2={SEYLAN_CHEQUE_POSITIONS.CHEQUE_TYPE.AREA.height}
                stroke={SEYLAN_CHEQUE_POSITIONS.CHEQUE_TYPE.CROSS_LINE_1.color}
                strokeWidth={SEYLAN_CHEQUE_POSITIONS.CHEQUE_TYPE.CROSS_LINE_1.width}
              />
              <line
                x1="0"
                y1={SEYLAN_CHEQUE_POSITIONS.CHEQUE_TYPE.AREA.height}
                x2={SEYLAN_CHEQUE_POSITIONS.CHEQUE_TYPE.AREA.width}
                y2="0"
                stroke={SEYLAN_CHEQUE_POSITIONS.CHEQUE_TYPE.CROSS_LINE_2.color}
                strokeWidth={SEYLAN_CHEQUE_POSITIONS.CHEQUE_TYPE.CROSS_LINE_2.width}
              />
            </svg>
            
            <div
              className="cheque-print-field"
              style={{
                position: 'absolute',
                left: `${SEYLAN_CHEQUE_POSITIONS.CHEQUE_TYPE.TEXT.x}px`,
                top: `${SEYLAN_CHEQUE_POSITIONS.CHEQUE_TYPE.TEXT.y}px`,
                fontSize: `${SEYLAN_CHEQUE_POSITIONS.CHEQUE_TYPE.TEXT.fontSize}px`,
                fontWeight: SEYLAN_CHEQUE_POSITIONS.CHEQUE_TYPE.TEXT.fontWeight,
                color: SEYLAN_CHEQUE_POSITIONS.CHEQUE_TYPE.TEXT.color,
                transform: `rotate(${SEYLAN_CHEQUE_POSITIONS.CHEQUE_TYPE.TEXT.rotation}deg)`,
                transformOrigin: 'center',
                zIndex: 101,
                whiteSpace: 'nowrap',
              }}
            >
              A/C PAYEE ONLY
            </div>
          </>
        )}

        {data.payeeName && (
          <div
            className="cheque-print-field"
            style={{
              position: 'absolute',
              left: `${SEYLAN_CHEQUE_POSITIONS.PAYEE.INPUT.x}px`,
              top: `${SEYLAN_CHEQUE_POSITIONS.PAYEE.INPUT.y}px`,
              width: `${SEYLAN_CHEQUE_POSITIONS.PAYEE.INPUT.width}px`,
              height: `${SEYLAN_CHEQUE_POSITIONS.PAYEE.INPUT.height}px`,
              display: 'flex',
              alignItems: 'center',
              fontSize: `${SEYLAN_CHEQUE_POSITIONS.PAYEE.INPUT.fontSize}px`,
              fontWeight: SEYLAN_CHEQUE_POSITIONS.PAYEE.INPUT.fontWeight,
              color: '#000',
              textTransform: SEYLAN_CHEQUE_POSITIONS.PAYEE.INPUT.textTransform,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {data.payeeName}
          </div>
        )}

        {formattedAmount && formattedAmount !== '0.00' && (
          <div
            className="cheque-print-field"
            style={{
              position: 'absolute',
              left: `${SEYLAN_CHEQUE_POSITIONS.AMOUNT_FIGURES.BOX.x}px`,
              top: `${SEYLAN_CHEQUE_POSITIONS.AMOUNT_FIGURES.BOX.y}px`,
              width: `${SEYLAN_CHEQUE_POSITIONS.AMOUNT_FIGURES.BOX.width}px`,
              height: `${SEYLAN_CHEQUE_POSITIONS.AMOUNT_FIGURES.BOX.height}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: '10px',
            }}
          >
            <span
              style={{
                fontSize: `${SEYLAN_CHEQUE_POSITIONS.AMOUNT_FIGURES.INPUT.fontSize}px`,
                fontWeight: SEYLAN_CHEQUE_POSITIONS.AMOUNT_FIGURES.INPUT.fontWeight,
                color: '#000',
              }}
            >
              {formattedAmount}
            </span>
          </div>
        )}

        {amountWordsLines && amountWordsLines.length > 0 && amountWordsLines[0] && (
          amountWordsLines.map((line, index) => {
            if (!line || line.trim() === '') return null
            
            const yPos = index === 0 
              ? SEYLAN_CHEQUE_POSITIONS.AMOUNT_WORDS.INPUT.y 
              : SEYLAN_CHEQUE_POSITIONS.AMOUNT_WORDS.LINE_2.y
            const xPos = index === 0
              ? SEYLAN_CHEQUE_POSITIONS.AMOUNT_WORDS.INPUT.x
              : SEYLAN_CHEQUE_POSITIONS.AMOUNT_WORDS.LINE_2.x
            const width = index === 0
              ? SEYLAN_CHEQUE_POSITIONS.AMOUNT_WORDS.INPUT.width
              : SEYLAN_CHEQUE_POSITIONS.AMOUNT_WORDS.LINE_2.width

            return (
              <div
                key={index}
                className="cheque-print-field"
                style={{
                  position: 'absolute',
                  left: `${xPos}px`,
                  top: `${yPos}px`,
                  width: `${width}px`,
                  height: `${SEYLAN_CHEQUE_POSITIONS.AMOUNT_WORDS.INPUT.height}px`,
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: `${SEYLAN_CHEQUE_POSITIONS.AMOUNT_WORDS.INPUT.fontSize}px`,
                  fontWeight: SEYLAN_CHEQUE_POSITIONS.AMOUNT_WORDS.INPUT.fontWeight,
                  fontStyle: SEYLAN_CHEQUE_POSITIONS.AMOUNT_WORDS.INPUT.fontStyle,
                  color: '#000',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {line}
              </div>
            )
          })
        )}

        {data.accountNo && (
          <div
            className="cheque-print-field"
            style={{
              position: 'absolute',
              left: `${SEYLAN_CHEQUE_POSITIONS.ACCOUNT.ACCOUNT_NUMBER.x}px`,
              top: `${SEYLAN_CHEQUE_POSITIONS.ACCOUNT.ACCOUNT_NUMBER.y}px`,
              fontSize: `${SEYLAN_CHEQUE_POSITIONS.ACCOUNT.ACCOUNT_NUMBER.fontSize}px`,
              fontWeight: SEYLAN_CHEQUE_POSITIONS.ACCOUNT.ACCOUNT_NUMBER.fontWeight,
              color: '#000',
            }}
          >
            {data.accountNo}
          </div>
        )}

        {data.accountName && (
          <div
            className="cheque-print-field"
            style={{
              position: 'absolute',
              left: `${SEYLAN_CHEQUE_POSITIONS.ACCOUNT.COMPANY_NAME.x}px`,
              top: `${SEYLAN_CHEQUE_POSITIONS.ACCOUNT.COMPANY_NAME.y}px`,
              fontSize: `${SEYLAN_CHEQUE_POSITIONS.ACCOUNT.COMPANY_NAME.fontSize}px`,
              fontWeight: SEYLAN_CHEQUE_POSITIONS.ACCOUNT.COMPANY_NAME.fontWeight,
              color: '#000',
              textTransform: SEYLAN_CHEQUE_POSITIONS.ACCOUNT.COMPANY_NAME.textTransform,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '800px',
            }}
          >
            {data.accountName}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="seylan-cheque-print" style={printStyle}>
      <div style={{
        borderBottom: '2px solid #333',
        paddingBottom: '10px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <h6 style={{ margin: 0 }}>ENDORSEMENT</h6>
      </div>
      <div style={{
        minHeight: '150px',
        border: '1px dashed #999',
        padding: '10px',
        marginBottom: '20px',
      }}>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
          Please sign here:
        </div>
        <div style={{ fontSize: '11px', color: '#999' }}>
          Signature: _________________________
        </div>
        <div style={{ fontSize: '11px', color: '#999', marginTop: '10px' }}>
          Name: {data.payeeName || 'Payee Name'}
        </div>
      </div>
      <div style={{
        fontSize: '12px',
        borderTop: '1px solid #ddd',
        paddingTop: '10px',
      }}>
        <div><strong>Bank:</strong> {data.bankName || 'Seylan Bank'}</div>
        <div style={{ marginTop: '5px' }}>
          <strong>Branch:</strong> {data.branchName || 'Branch Name'}
        </div>
        <div style={{ marginTop: '5px' }}>
          <strong>Account:</strong> {data.accountNo || 'Account Number'}
        </div>
      </div>
    </div>
  )
}

export default SeylanChequePrintTemplate


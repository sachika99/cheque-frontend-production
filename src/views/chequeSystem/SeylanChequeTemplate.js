import React from 'react'
import { 
  SEYLAN_CHEQUE_DIMENSIONS,
  SEYLAN_CHEQUE_POSITIONS,
  formatChequeDate,
  splitAmountWords
} from '../../utils/seylanChequeConfig'
import { amountToWords } from '../../utils/amountToWords'


const SeylanChequeTemplate = ({ side = 'front', data }) => {
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
  
  const amountWordsLines = splitAmountWords(amountInWords || '', 708, 11)

  const chequeImagePath = '/images/cheques/seylan-cheque.jpg'
  
  const formattedAmount = data.formattedAmount || 
    (data.chequeAmount ? parseFloat(data.chequeAmount).toFixed(2) : '0.00')
  
  console.log('SeylanChequeTemplate - Full Data:', {
    data,
    dateParts,
    amountWordsLines,
    formattedAmount,
    chequeImagePath,
    isCross,
    payeeName: data.payeeName,
    chequeDate: data.chequeDate,
    formattedDate: data.formattedDate,
    chequeAmount: data.chequeAmount,
    bankName: data.bankName
  })
  
  const scale = SEYLAN_CHEQUE_DIMENSIONS.SCREEN_SCALE
  
  const chequeStyle = {
    width: SEYLAN_CHEQUE_DIMENSIONS.screenWidth,
    height: SEYLAN_CHEQUE_DIMENSIONS.screenHeight,
    margin: '0 auto',
    position: 'relative',
    backgroundColor: '#fff',
    backgroundImage: `url('${chequeImagePath}')`,
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    fontFamily: 'Arial, sans-serif',
    overflow: 'hidden',
    minHeight: SEYLAN_CHEQUE_DIMENSIONS.screenHeight,
  }
  
  const handleImageError = (e) => {
    console.error('Failed to load Seylan cheque image:', chequeImagePath)
    console.error('Trying alternative paths...')
    
    e.target.style.backgroundImage = `url('./images/cheques/seylan-cheque.jpg')`
  }

  if (isFront) {
    return (
      <div className="cheque-template-front seylan-cheque" style={chequeStyle}>
        
        <img 
          src={chequeImagePath} 
          alt="Seylan Cheque Background" 
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            opacity: 1,
          }}
          onError={(e) => {
            console.error('Image failed to load:', chequeImagePath)
            e.target.style.display = 'none'
          }}
          onLoad={() => {
            console.log('Seylan cheque image loaded successfully')
          }}
        />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 1,
        }}>
          
          {SEYLAN_CHEQUE_POSITIONS.DATE.boxes.map((box, index) => {
            const digit = dateDigits[index] || ''
         
            const scaledX = box.x * scale
            const scaledY = box.y * scale
            const scaledWidth = box.width * scale
            const scaledHeight = box.height * scale
            const scaledFontSize = SEYLAN_CHEQUE_POSITIONS.DATE.FONT_SIZE * scale
            
            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: `${scaledX}px`,
                  top: `${scaledY}px`,
                  width: `${scaledWidth}px`,
                  height: `${scaledHeight}px`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: `${scaledFontSize}px`,
                  fontWeight: SEYLAN_CHEQUE_POSITIONS.DATE.FONT_WEIGHT,
                  color: '#000',
                  textAlign: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(0, 0, 0, 0.3)',
                  zIndex: 10,
                }}
              >
                {digit}
              </div>
            )
          })}

          {isCross && (() => {
            const scale = SEYLAN_CHEQUE_DIMENSIONS.SCREEN_SCALE
            const area = SEYLAN_CHEQUE_POSITIONS.CHEQUE_TYPE.AREA
            const text = SEYLAN_CHEQUE_POSITIONS.CHEQUE_TYPE.TEXT
            const line1 = SEYLAN_CHEQUE_POSITIONS.CHEQUE_TYPE.CROSS_LINE_1
            const line2 = SEYLAN_CHEQUE_POSITIONS.CHEQUE_TYPE.CROSS_LINE_2
            
            return (
              <>
               
                <svg
                  style={{
                    position: 'absolute',
                    left: `${area.x * scale}px`,
                    top: `${area.y * scale}px`,
                    width: `${area.width * scale}px`,
                    height: `${area.height * scale}px`,
                    zIndex: 100,
                    pointerEvents: 'none',
                  }}
                >
                
                  <line
                    x1="0"
                    y1="0"
                    x2={area.width * scale}
                    y2={area.height * scale}
                    stroke={line1.color}
                    strokeWidth={line1.width}
                  />
                 
                  <line
                    x1="0"
                    y1={area.height * scale}
                    x2={area.width * scale}
                    y2="0"
                    stroke={line2.color}
                    strokeWidth={line2.width}
                  />
                </svg>
                
              
                <div
                  style={{
                    position: 'absolute',
                    left: `${text.x * scale}px`,
                    top: `${text.y * scale}px`,
                    fontSize: `${text.fontSize * scale}px`,
                    fontWeight: text.fontWeight,
                    color: text.color,
                    transform: `rotate(${text.rotation}deg)`,
                    transformOrigin: 'center',
                    zIndex: 101,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    padding: '2px 5px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  A/C PAYEE ONLY
                </div>
              </>
            )
          })()}

          
          {data.payeeName && (() => {
            const scale = SEYLAN_CHEQUE_DIMENSIONS.SCREEN_SCALE
            const pos = SEYLAN_CHEQUE_POSITIONS.PAYEE.INPUT
            return (
              <div
                style={{
                  position: 'absolute',
                  left: `${pos.x * scale}px`,
                  top: `${pos.y * scale}px`,
                  width: `${pos.width * scale}px`,
                  height: `${pos.height * scale}px`,
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: `${pos.fontSize * scale}px`,
                  fontWeight: pos.fontWeight,
                  color: '#000',
                  textTransform: pos.textTransform,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  paddingLeft: '3px',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                }}
              >
                {data.payeeName}
              </div>
            )
          })()}

        
          {formattedAmount && formattedAmount !== '0.00' && (() => {
            const scale = SEYLAN_CHEQUE_DIMENSIONS.SCREEN_SCALE
            const box = SEYLAN_CHEQUE_POSITIONS.AMOUNT_FIGURES.BOX
            const input = SEYLAN_CHEQUE_POSITIONS.AMOUNT_FIGURES.INPUT
            return (
              <div
                style={{
                  position: 'absolute',
                  left: `${box.x * scale}px`,
                  top: `${box.y * scale}px`,
                  width: `${box.width * scale}px`,
                  height: `${box.height * scale}px`,
                  border: `${box.borderWidth}px ${box.borderStyle} ${box.borderColor}`,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: '5px',
                }}
              >
                <span
                  style={{
                    fontSize: `${input.fontSize * scale}px`,
                    fontWeight: input.fontWeight,
                    color: '#000',
                  }}
                >
                  {formattedAmount}
                </span>
              </div>
            )
          })()}

          {amountWordsLines && amountWordsLines.length > 0 && amountWordsLines[0] && (() => {
            const scale = SEYLAN_CHEQUE_DIMENSIONS.SCREEN_SCALE
            const input = SEYLAN_CHEQUE_POSITIONS.AMOUNT_WORDS.INPUT
            return amountWordsLines.map((line, index) => {
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
                  style={{
                    position: 'absolute',
                    left: `${xPos * scale}px`,
                    top: `${yPos * scale}px`,
                    width: `${width * scale}px`,
                    height: `${input.height * scale}px`,
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: `${input.fontSize * scale}px`,
                    fontWeight: input.fontWeight,
                    fontStyle: input.fontStyle,
                    color: '#000',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    paddingLeft: '3px',
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  }}
                >
                  {line}
                </div>
              )
            })
          })()}

          
          {data.accountNo && (() => {
            const scale = SEYLAN_CHEQUE_DIMENSIONS.SCREEN_SCALE
            const pos = SEYLAN_CHEQUE_POSITIONS.ACCOUNT.ACCOUNT_NUMBER
            return (
              <div
                style={{
                  position: 'absolute',
                  left: `${pos.x * scale}px`,
                  top: `${pos.y * scale}px`,
                  fontSize: `${pos.fontSize * scale}px`,
                  fontWeight: pos.fontWeight,
                  color: '#000',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  paddingLeft: '2px',
                }}
              >
                {data.accountNo}
              </div>
            )
          })()}

         
          {data.accountName && (() => {
            const scale = SEYLAN_CHEQUE_DIMENSIONS.SCREEN_SCALE
            const pos = SEYLAN_CHEQUE_POSITIONS.ACCOUNT.COMPANY_NAME
            return (
              <div
                style={{
                  position: 'absolute',
                  left: `${pos.x * scale}px`,
                  top: `${pos.y * scale}px`,
                  fontSize: `${pos.fontSize * scale}px`,
                  fontWeight: pos.fontWeight,
                  color: '#000',
                  textTransform: pos.textTransform,
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  paddingLeft: '2px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: `${500 * scale}px`,
                }}
              >
                {data.accountName}
              </div>
            )
          })()}
        </div>
      </div>
    )
  }

  return (
    <div className="cheque-template-back" style={{
      ...chequeStyle,
      backgroundImage: 'none',
      padding: '20px',
    }}>
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

export default SeylanChequeTemplate


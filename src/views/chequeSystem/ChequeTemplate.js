import React from 'react'
import { 
  CHEQUE_DIMENSIONS, 
  SAMPATH_CHEQUE_POSITIONS, 
  CHEQUE_TYPES, 
  SRI_LANKAN_BANKS,
  splitAmountIntoRows 
} from '../../utils/chequeTemplates'
import SeylanChequeTemplate from './SeylanChequeTemplate'

const ChequeTemplate = ({ side = 'front', data }) => {
  const isFront = side === 'front'
  const isCross = data.chequeType === CHEQUE_TYPES.CROSS || data.chequeType === 'CROSS'
  const isSampath = data.bankName?.toLowerCase().includes('sampath')
  
  const bankNameLower = (data.bankName || '').toLowerCase()
  const isSeylan = bankNameLower.includes('seylan') || 
                   bankNameLower.includes('seylan bank') ||
                   bankNameLower === 'seylan' ||
                   bankNameLower.includes('seyland')  
   
  console.log('🔍 ChequeTemplate - Bank Detection:', {
    bankName: data.bankName,
    bankNameLower,
    isSeylan,
    isSampath,
    allData: data
  })
   
  if (isSeylan) {
    console.log('✅ Using SeylanChequeTemplate')
    return <SeylanChequeTemplate side={side} data={data} />
  }
  
  console.log('⚠️ Using default template (not Seylan)')
 
  const parseDate = (dateString) => {
    if (!dateString) return { day: '', month: '', year: '' }
    const parts = dateString.split('/')
    if (parts.length === 3) {
      return {
        day: parts[0].padStart(2, '0'),
        month: parts[1].padStart(2, '0'),
        year: parts[2],
      }
    } 
    const date = new Date(dateString)
    return {
      day: String(date.getDate()).padStart(2, '0'),
      month: String(date.getMonth() + 1).padStart(2, '0'),
      year: String(date.getFullYear()),
    }
  }

  const dateParts = parseDate(data.formattedDate)
   
  const amountRows = splitAmountIntoRows(data.amountInWords || '')
 
  const chequeImagePath = isSampath ? '/images/cheques/seylan-cheque.jpg' : null
  
  const chequeStyle = {
    width: CHEQUE_DIMENSIONS.screenWidth,
    height: CHEQUE_DIMENSIONS.screenHeight,
    margin: '0 auto',
    position: 'relative',
    backgroundColor: '#fff',
    backgroundImage: chequeImagePath ? `url('${chequeImagePath}')` : 'none',
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    fontFamily: 'Arial, sans-serif',
    overflow: 'hidden',
  }

  if (isFront) {
    return (
      <div className="cheque-template-front" style={chequeStyle}> 
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
        }}> 
          <div style={{
            position: 'absolute',
            ...SAMPATH_CHEQUE_POSITIONS.dateBox1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#000',
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(0, 0, 0, 0.2)',
          }}>
            {dateParts.day[0] || ''}
          </div>
          <div style={{
            position: 'absolute',
            ...SAMPATH_CHEQUE_POSITIONS.dateBox2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#000',
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(0, 0, 0, 0.2)',
          }}>
            {dateParts.day[1] || ''}
          </div>
          <div style={{
            position: 'absolute',
            ...SAMPATH_CHEQUE_POSITIONS.dateBox3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#000',
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(0, 0, 0, 0.2)',
          }}>
            {dateParts.month[0] || ''}
          </div>
          <div style={{
            position: 'absolute',
            ...SAMPATH_CHEQUE_POSITIONS.dateBox4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#000',
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(0, 0, 0, 0.2)',
          }}>
            {dateParts.month[1] || ''}
          </div> 
          <div style={{
            position: 'absolute',
            ...SAMPATH_CHEQUE_POSITIONS.dateBox5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#000',
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(0, 0, 0, 0.2)',
          }}>
            2
          </div>
          <div style={{
            position: 'absolute',
            ...SAMPATH_CHEQUE_POSITIONS.dateBox6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#000',
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(0, 0, 0, 0.2)',
          }}>
            0
          </div>
          <div style={{
            position: 'absolute',
            ...SAMPATH_CHEQUE_POSITIONS.dateBox7,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#000',
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(0, 0, 0, 0.2)',
          }}>
            {dateParts.year[2] || ''}
          </div>
          <div style={{
            position: 'absolute',
            ...SAMPATH_CHEQUE_POSITIONS.dateBox8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#000',
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(0, 0, 0, 0.2)',
          }}>
            {dateParts.year[3] || ''}
          </div>
 
          {isCross && (
            <> 
              <div style={{
                position: 'absolute',
                top: '18px',
                left: '18px',
                width: '110px',
                height: '1.5px',
                backgroundColor: '#000',
                transform: 'rotate(-32deg)',
                transformOrigin: 'top left',
                zIndex: 100,
              }} />
               
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                width: '115px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                fontSize: '11px',
                fontWeight: 'bold',
                color: '#000',
                textTransform: 'uppercase',
                letterSpacing: '0.3px',
                transform: 'rotate(-32deg)',
                transformOrigin: 'top left',
                paddingLeft: '2px',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                zIndex: 101,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}>
                A/C PAYEE ONLY
              </div>
               
              <div style={{
                position: 'absolute',
                top: '28px',
                left: '18px',
                width: '110px',
                height: '1.5px',
                backgroundColor: '#000',
                transform: 'rotate(-32deg)',
                transformOrigin: 'top left',
                zIndex: 100,
              }} />
            </>
          )}
 
          <div style={{
            position: 'absolute',
            ...SAMPATH_CHEQUE_POSITIONS.payeeLine,
            display: 'flex',
            alignItems: 'center',
            fontSize: '15px',
            fontWeight: 'bold',
            color: '#000',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            paddingLeft: '5px',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
          }}>
            {data.payeeName || ''}
          </div>
 
          {amountRows.map((row, index) => {
            const rowPositions = [
              SAMPATH_CHEQUE_POSITIONS.amountInWordsRow1,
              SAMPATH_CHEQUE_POSITIONS.amountInWordsRow2,
              SAMPATH_CHEQUE_POSITIONS.amountInWordsRow3,
            ]
            const position = rowPositions[index] || rowPositions[rowPositions.length - 1]
            
            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  ...position,
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '13px',
                  fontStyle: 'italic',
                  color: '#000',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  paddingLeft: '5px',
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                }}
              >
                {row}
              </div>
            )
          })}
 
          <div style={{
            position: 'absolute',
            ...SAMPATH_CHEQUE_POSITIONS.amountInFiguresBox,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#000',
            paddingRight: '8px',
            border: '1px dashed #999',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          }}>
            Rs. {data.formattedAmount || '0.00'}
          </div>
 
          <div style={{
            position: 'absolute',
            ...SAMPATH_CHEQUE_POSITIONS.signatureArea,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            fontSize: '11px',
            color: '#666',
            border: '1px dashed #ccc',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            paddingBottom: '5px',
          }}>
            Signature
          </div>
 
          <div style={{
            position: 'absolute',
            ...SAMPATH_CHEQUE_POSITIONS.accountNumber,
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#000',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            paddingLeft: '2px',
          }}>
            {data.accountNo || ''}
          </div>
 
          <div style={{
            position: 'absolute',
            ...SAMPATH_CHEQUE_POSITIONS.accountName,
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#000',
            textTransform: 'uppercase',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            paddingLeft: '2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {data.accountName || ''}
          </div>
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
        <div><strong>Bank:</strong> {data.bankName || 'Bank Name'}</div>
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

export default ChequeTemplate

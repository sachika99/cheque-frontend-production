 
export const SEYLAN_CONFIG = {
  bankCode: 'SEYLAN',
  bankName: 'Seylan Bank',
   
  dimensions: { 
    physicalWidth: '210mm',
    physicalHeight: '99mm', 
    previewScale: 1.0,
  },
   
  backgroundImage: '/images/cheques/seylan-cheque.jpg',
   
  fields: { 
    date: {
      d1: { top: '10mm', left: '141.5mm', fontSize: '16pt', fontWeight: 'bold', color: '#000000', textAlign: 'center' },
      
      d2: { top: '10mm', left: '148.5mm', fontSize: '16pt', fontWeight: 'bold', color: '#000000', textAlign: 'center' },
      
      m1: { top: '10mm', left: '157mm', fontSize: '16pt', fontWeight: 'bold', color: '#000000', textAlign: 'center' },
    
      m2: { top: '10mm', left: '164mm', fontSize: '16pt', fontWeight: 'bold', color: '#000000', textAlign: 'center' },
    
      y3: { top: '10mm', left: '186mm', fontSize: '16pt', fontWeight: 'bold', color: '#000000', textAlign: 'center' },
      
      y4: { top: '10mm', left: '193.5mm', fontSize: '16pt', fontWeight: 'bold', color: '#000000', textAlign: 'center' },
    },
    
    chequeType: {
      area: { top: '4mm', left: '4mm', width: '23mm', height: '8mm' },
      crossLines: {
        line1: { startX: '4mm', startY: '4mm', endX: '27mm', endY: '12mm', color: '#0000FF', width: '0.2mm' },
        line2: { startX: '4mm', startY: '12mm', endX: '27mm', endY: '4mm', color: '#0000FF', width: '0.2mm' },
      },
      text: {
        top: '8mm',
        left: '15mm',
        fontSize: '4pt',
        fontWeight: 'bold',
        rotation: -35,
        color: '#000000',
      },
    },
    
    signature: {
      top: '67.5mm',
      left: '134mm',
      fontSize: '10pt',
      fontWeight: 'normal',
      color: '#000000',
    },
    
    payee: {
      top: '30mm',
      left: '20mm',
      width: '160mm',
      fontSize: '11pt',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      color: '#000000',
      whiteSpace: 'nowrap',
    },
    
    amountFigures: {
      top: '30mm',
      left: '160mm',
      width: '35mm',
      fontSize: '12pt',
      fontWeight: 'bold',
      textAlign: 'right',
      color: '#000000',
    },
    
    amountWords: {
      top: '42mm',
      left: '23mm',
      width: '160mm',
      fontSize: '11pt',
      fontWeight: 'normal',
      fontStyle: 'italic',
      color: '#000000',
      lineHeight: 1.3,
      maxLines: 2,
    },
    
    accountNumber: {
      top: '64.35mm', 
      left: '21mm',
      fontSize: '10pt', 
      fontWeight: 'normal',
      color: '#000000',
    },
    
    companyName: {
      top: '68.31mm', 
      left: '21mm', 
      fontSize: '10pt', 
      fontWeight: 'bold',
      textTransform: 'uppercase',
      color: '#000000',
      maxWidth: '84mm', 
    },
    
    signature: {
      top: '31.086mm',  
      left: '65.835mm',  
      fontSize: '9pt',
      fontWeight: 'normal',
      color: '#000000',
    },
  },
}

export const getBankConfig = (bankCodeOrName) => {
  const code = String(bankCodeOrName || '').toUpperCase()
  
  if (code === 'SEYLAN' || code.includes('SEYLAN')) {
    return SEYLAN_CONFIG
  }
  
  return SEYLAN_CONFIG
}

export const getAllBankConfigs = () => {
  return [SEYLAN_CONFIG]
}

export const hasBankConfig = (bankCodeOrName) => {
  const config = getBankConfig(bankCodeOrName)
  return config !== null
}


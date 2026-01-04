
export const SEYLAN_CHEQUE_DIMENSIONS = {
 
  WIDTH_MM: 177.8,  
  HEIGHT_MM: 88.9,  
  
  IMAGE_WIDTH: 2000,  
  IMAGE_HEIGHT: 1000, 
  
  SCREEN_WIDTH: '900px',
  SCREEN_HEIGHT: '450px',
  SCREEN_SCALE: 0.45,
  
  PRINT_WIDTH: '177.8mm',
  PRINT_HEIGHT: '88.9mm',
  
  ASPECT_RATIO: 177.8 / 88.9, 
}

export const SEYLAN_CHEQUE_POSITIONS = {
  DATE: {
    AREA: {
      x: 1340,  
      y: 80,    
      width: 520,  
      height: 95,  
    },
    
    BOX_WIDTH: 65,   
    BOX_HEIGHT: 85, 
    SPACING: 0,     
    LETTER_SPACING: 40, 
    
    boxes: [
      { x: 1340, y: 80, width: 65, height: 85 }, 
      { x: 1405, y: 80, width: 65, height: 85 }, 
      { x: 1470, y: 80, width: 65, height: 85 }, 
      { x: 1535, y: 80, width: 65, height: 85 }, 
      { x: 1600, y: 80, width: 65, height: 85 }, 
      { x: 1665, y: 80, width: 65, height: 85 }, 
      { x: 1730, y: 80, width: 65, height: 85 }, 
      { x: 1795, y: 80, width: 65, height: 85 }, 
    ],
    
    FONT_SIZE: 42,        
    FONT_WEIGHT: 'bold',
  },

  CHEQUE_TYPE: {
    AREA: {
      x: 40,            
      y: 40,              
      width: 220,         
      height: 80,        
    },
    
    CROSS_LINE_1: {
      startX: 40,
      startY: 40,
      endX: 260,         
      endY: 120,         
      width: 2,
      color: '#0000FF',  
    },
    
    CROSS_LINE_2: {
      startX: 40,
      startY: 120,       
      endX: 260,        
      endY: 40,
      width: 2,
      color: '#0000FF',
    },
    
    TEXT: {
      x: 150,             
      y: 80,            
      fontSize: 40,      
      fontWeight: 'bold',
      rotation: -35,     
      color: '#000000',
    },
    
    BEARER_TEXT: {
      x: 1000,           
      y: 330,          
      fontSize: 10,
      fontWeight: 'normal',
      color: '#666666',
    },
  },

  PAYEE: {
    LABEL: {
      x: 200,         
      y: 300,       
      fontSize: 14,
      fontWeight: 'normal',
    },
    
    INPUT: {
      x: 200,          
      y: 300,           
      width: 1600,      
      height: 50,       
      fontSize: 38,      
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
  },
 
  AMOUNT_FIGURES: { 
    LABEL: {
      x: 1400,           
      y: 420,            
      fontSize: 14,
      fontWeight: 'normal',
    },
     
    BOX: {
      x: 1450,           
      y: 420,            
      width: 450,        
      height: 150,      
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#000000',
    },
     
    INPUT: {
      x: 1900,          
      y: 495,            
      fontSize: 48,     
      fontWeight: 'bold',
      align: 'right',
    },
  },
 
  AMOUNT_WORDS: { 
    LABEL: {
      x: 200,            
      y: 400,            
      fontSize: 12,
      fontWeight: 'normal',
    }, 

    INPUT: {
      x: 200,            
      y: 400,            
      width: 1400,      
      height: 50,         
      fontSize: 38,      
      fontWeight: 'normal',
      fontStyle: 'italic',
      maxLines: 2,        
      lineHeight: 50,    
    },
     
    LINE_2: {
      x: 200,             
      y: 450,             
      width: 1400,       
      height: 50,      
    },
  },
 
  ACCOUNT: { 
    ACCOUNT_NUMBER: {
      x: 200,            
      y: 650,            
      fontSize: 34,      
      fontWeight: 'normal',
    },
     
    COMPANY_NAME: {
      x: 200,           
      y: 690,            
      fontSize: 34,    
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
  },
 
  MICR: { 
    WARNING_Y: 380,     
    HEIGHT: 70,       
     
    WARNING_TEXT: {
      x: 450,
      y: 415,
      fontSize: 9,
      fontWeight: 'bold',
      color: '#FF0000',
      text: 'PLEASE DO NOT WRITE BELOW THE LINE',
    },
  },
 
  SIGNATURE: {
    x: 627,              
    y: 314,              
    width: 238,         
    height: 50,
    fontSize: 9,
    color: '#666666',
    text: 'Signature',
  },
}

 
export const pixelsToMM = (pixels) => {
  return (pixels / 900) * 177.8
}

 
export const mmToPixels = (mm) => {
  return (mm / 177.8) * 900
}
 
export const CHEQUE_TYPE_CONFIG = {
  BEARER: {
    showCrossLines: false,
    showText: false,
    text: '',
  },
  CROSS: {
    showCrossLines: true,
    showText: true,
    text: 'A/C PAYEE ONLY',
    textPosition: SEYLAN_CHEQUE_POSITIONS.CHEQUE_TYPE.TEXT,
  },
  ACCOUNT_PAYEE: {
    showCrossLines: true,
    showText: true,
    text: 'A/C PAYEE ONLY',
    textPosition: SEYLAN_CHEQUE_POSITIONS.CHEQUE_TYPE.TEXT,
  },
  NOT_NEGOTIABLE: {
    showCrossLines: true,
    showText: true,
    text: 'NOT NEGOTIABLE',
    textPosition: SEYLAN_CHEQUE_POSITIONS.CHEQUE_TYPE.TEXT,
  },
}
 
export const getSeylanChequeTemplate = (chequeType = 'BEARER') => {
  return {
    dimensions: SEYLAN_CHEQUE_DIMENSIONS,
    positions: SEYLAN_CHEQUE_POSITIONS,
    type: CHEQUE_TYPE_CONFIG[chequeType] || CHEQUE_TYPE_CONFIG.BEARER,
    bank: {
      name: 'Seylan Bank',
      code: 'SEYLAN',
      logo: '/images/cheques/seylan-cheque.jpg',
      backgroundImage: '/images/cheques/seylan-cheque.jpg',
    },
  }
}
 
export const formatChequeDate = (dateString) => {
  if (!dateString) {
    return { 
      day: '', 
      month: '', 
      year: '', 
      full: '', 
      digits: ['', '', '', '', '', '', '', ''] 
    }
  }
  
  let date
  
  if (dateString.includes('/')) {
    const parts = dateString.split('/')
    if (parts.length === 3) {
     
      const day = parseInt(parts[0], 10)
      const month = parseInt(parts[1], 10) - 1  
      const year = parseInt(parts[2], 10)
      date = new Date(year, month, day)
    } else {
      date = new Date(dateString)
    }
  } else {
    
    date = new Date(dateString)
  }
  
  
  if (isNaN(date.getTime())) {
    console.error('❌ Invalid date format:', dateString)
    return { 
      day: '', 
      month: '', 
      year: '', 
      full: '', 
      digits: ['', '', '', '', '', '', '', ''] 
    }
  }
  
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear())
  
  
  const fullDate = `${day}${month}${year}`
  
  return {
    day,
    month,
    year,
    full: fullDate,
    digits: fullDate.split(''),  
  }
}

 
export const splitAmountWords = (amountInWords, maxWidth = 750, fontSize = 11) => {
  if (!amountInWords) return ['']
  
  
  const charWidth = fontSize * 0.6
  const maxCharsPerLine = Math.floor(maxWidth / charWidth)
  
  const words = amountInWords.split(' ')
  const lines = []
  let currentLine = ''
  
  words.forEach(word => {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine
    } else {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    }
  })
  
  if (currentLine) lines.push(currentLine)
  
  return lines.length > 0 ? lines : [amountInWords]
}


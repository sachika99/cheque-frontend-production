 

import { formatChequeDate, splitAmountWords } from './seylanChequeConfig'

export const SEYLAN_CHEQUE_DIMENSIONS = {
  
  WIDTH_MM: 177.8,   
  HEIGHT_MM: 88.9,    
   
  screenWidth: '900px',
  screenHeight: '450px',
   
  printWidth: '177.8mm',
  printHeight: '88.9mm',
   
  aspectRatio: 177.8 / 88.9,  
}

 
export const SEYLAN_CHEQUE_POSITIONS = {
  
  dateBoxes: [
    { x: 610, y: 50, width: 28, height: 30 },  
    { x: 641, y: 50, width: 28, height: 30 },  
    { x: 672, y: 50, width: 28, height: 30 },  
    { x: 703, y: 50, width: 28, height: 30 },  
    { x: 734, y: 50, width: 28, height: 30 },  
    { x: 765, y: 50, width: 28, height: 30 },  
    { x: 796, y: 50, width: 28, height: 30 },  
    { x: 827, y: 50, width: 28, height: 30 },  
  ],
   
  payee: {
    x: 90,   
    y: 160,   
    width: 500,
    height: 20,
  },
   
  amountFigures: {
    boxX: 760,
    boxY: 145,
    boxWidth: 120,
    boxHeight: 30,
    textX: 870,   
    textY: 163,
  },
   
  amountWords: {
    x: 110,  
    y: 190,  
    y2: 208,  
    width: 750,
    maxLines: 2,
  },
   
  chequeType: {
    areaX: 40,
    areaY: 100,
    areaWidth: 180,
    areaHeight: 120,
   
    line1Start: { x: 40, y: 100 },
    line1End: { x: 220, y: 220 },
    
    line2Start: { x: 40, y: 220 },
    line2End: { x: 220, y: 100 },
    
    textX: 130,
    textY: 160,
  },
   
  accountNumber: {
    x: 40,
    y: 340,
  },
   
  companyName: {
    x: 40,
    y: 365,
  },
   
  signature: {
    x: 760,
    y: 250,
    width: 120,
    height: 50,
  },
}

 
export const renderSeylanCheque = (data, isCross = false) => {
  const dateParts = formatChequeDate(data.formattedDate || data.chequeDate)
  const amountWords = splitAmountWords(data.amountInWords || '', 750, 11)
  
  return {
    dimensions: SEYLAN_CHEQUE_DIMENSIONS,
    positions: SEYLAN_CHEQUE_POSITIONS,
    data: {
      dateDigits: dateParts.digits,
      payeeName: data.payeeName || '',
      amountFigures: data.formattedAmount || data.chequeAmount || '0.00',
      amountWords: amountWords,
      isCross: isCross,
      accountNumber: data.accountNo || '',
      companyName: data.accountName || '',
    },
  }
}


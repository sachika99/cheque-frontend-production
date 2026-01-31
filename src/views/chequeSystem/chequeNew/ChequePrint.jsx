import React, { useEffect } from 'react';
import './ChequePrint.css';

function ChequePrint({ data, onClose }) {
  if (!data) return null;

  useEffect(() => {
    let printDialogOpened = false;
    let printCompleted = false;

    const timer = setTimeout(() => {
      try {
        window.print();
      } catch (error) {
        console.error('Print error:', error);
        if (onClose) {
          onClose('error');
        }
      }
    }, 100);

    const handleBeforePrint = () => {
      printDialogOpened = true;
    };

    const handleAfterPrint = () => {
      printCompleted = true;
      if (onClose) {
        onClose('completed');
      }
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
      
      if (!printDialogOpened && !printCompleted && onClose) {
        onClose('cancelled');
      }
    };
  }, [onClose]);

  const fieldPositions = {
    payeeOnlyLeft: 0,
    payeeOnlyBottom: 59,
    dateLeft: 120,
    dateBottom: 67,
    dateBoxWidth: 6.5,
    dateMiddleGap: 12,
    payeeLeft: 15,
    payeeBottom: 53,
    amountWordsLeft: 16,
    amountWordsBottom: 38,
    amountWordsWidth: 115,
    amountFiguresLeft: 131,
    amountFiguresBottom: 34,
    rupeeSymbolLeft: 145,
    rupeeSymbolBottom: 46
  };

  // Fixed cheque position (ORIGINAL VALUE - 295)
  const chequePosition = {
    left: 8,
    bottom: 295,
    rotation: 90
  };

  // Number to words conversion
  const numberToWords = (num) => {
    if (!num || isNaN(num)) return '';

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen',
      'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty',
      'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const convertHundreds = (n) => {
      let str = '';
      if (n >= 100) {
        str += ones[Math.floor(n / 100)] + ' Hundred';
        n %= 100;
        if (n > 0) str += ' And ';
      }
      if (n >= 20) {
        str += tens[Math.floor(n / 10)];
        if (n % 10) str += ' ' + ones[n % 10];
      } else if (n >= 10) {
        str += teens[n - 10];
      } else if (n > 0) {
        str += ones[n];
      }
      return str;
    };

    let n = parseInt(num, 10);
    let result = '';

    if (n >= 1_000_000_000) {
      result += convertHundreds(Math.floor(n / 1_000_000_000)) + ' Billion ';
      n %= 1_000_000_000;
    }

    if (n >= 1_000_000) {
      result += convertHundreds(Math.floor(n / 1_000_000)) + ' Million ';
      n %= 1_000_000;
    }

    if (n >= 1000) {
      result += convertHundreds(Math.floor(n / 1000)) + ' Thousand ';
      n %= 1000;
    }

    if (n > 0) {
      result += convertHundreds(n);
    }

    return result.trim();
  };

  // Format amount with commas
  const formatAmount = (amt) => {
    if (!amt) return '';
    return amt.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Get formatted date digits
  const getDateDigits = () => {
    if (!data.date) {
      return ['', '', '', '', '', ''];
    }
    const parts = data.date.split('-');
    const day = parts[2] || '';
    const month = parts[1] || '';
    const year = parts[0] || '';
    return [
      day[0] || '',
      day[1] || '',
      month[0] || '',
      month[1] || '',
      year.slice(-2)[0] || '',
      year.slice(-2)[1] || ''
    ];
  };

  const dateDigits = getDateDigits();
  const amountInWords = data.amount ? `${numberToWords(data.amount.split('.')[0])} Only` : '';
  const amountFormatted = formatAmount(data.amount.split('.')[0]);

  return (
    <div className="cheque-print-wrapper cheque-hidden-preview">
      {/* Printable cheque */}
      <div className="cheque-printable-area">
        <div style={{ width: '210mm', height: '297mm', position: 'relative' }}>
          {/* Cheque wrapper */}
          <div
            style={{
              position: 'absolute',
              width: '180mm',
              height: '80mm',
              left: `${chequePosition.left}mm`,
              bottom: `${chequePosition.bottom}mm`,
              transform: `rotate(${chequePosition.rotation}deg)`,
              transformOrigin: 'bottom left'
            }}
          >
            
            {/* AC PAYEE'S ONLY */}
            <div
              style={{
                position: 'absolute',
                left: `${fieldPositions.payeeOnlyLeft}mm`,
                bottom: `${fieldPositions.payeeOnlyBottom}mm`,
                transform: 'rotate(-32deg)',
                transformOrigin: 'left center',
                fontFamily: 'Arial, Helvetica, sans-serif',
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                WebkitPrintColorAdjust: 'exact',
                printColorAdjust: 'exact'
              }}
            >
              <div style={{ width: '80px', borderTop: '0.6mm solid #000', marginBottom: '3px' }} />
              <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.6px', whiteSpace: 'nowrap', lineHeight: '1' }}>
                AC PAYEE ONLY
              </div>
              <div style={{ width: '120px', borderTop: '0.6mm solid #000', marginTop: '3px' }} />
            </div>

            {/* Date Field */}
            <div
              style={{
                position: 'absolute',
                left: `${fieldPositions.dateLeft}mm`,
                bottom: `${fieldPositions.dateBottom}mm`,
                fontFamily: "'Courier New', monospace"
              }}
            >
              <div style={{ display: 'flex', fontSize: '20px', fontFamily: 'monospace', color: 'black', gap: '0' }}>
                {/* Day digits */}
                <span style={{ display: 'inline-block', width: `${fieldPositions.dateBoxWidth}mm`, textAlign: 'center' }}>
                  {dateDigits[0]}
                </span>
                <span style={{ display: 'inline-block', width: `${fieldPositions.dateBoxWidth}mm`, textAlign: 'center' }}>
                  {dateDigits[1]}
                </span>
                {/* Month digits */}
                <span style={{ display: 'inline-block', width: `${fieldPositions.dateBoxWidth}mm`, textAlign: 'center' }}>
                  {dateDigits[2]}
                </span>
                <span style={{ display: 'inline-block', width: `${fieldPositions.dateBoxWidth}mm`, textAlign: 'center' }}>
                  {dateDigits[3]}
                </span>
                {/* Gap */}
                <span style={{ display: 'inline-block', width: `${fieldPositions.dateMiddleGap}mm`, textAlign: 'center' }}>
                </span>
                {/* Year digits */}
                <span style={{ display: 'inline-block', width: `${fieldPositions.dateBoxWidth}mm`, textAlign: 'center' }}>
                  {dateDigits[4]}
                </span>
                <span style={{ display: 'inline-block', width: `${fieldPositions.dateBoxWidth}mm`, textAlign: 'center' }}>
                  {dateDigits[5]}
                </span>
              </div>
            </div>

            {/* Payee Name */}
            <div
              style={{
                position: 'absolute',
                left: `${fieldPositions.payeeLeft}mm`,
                bottom: `${fieldPositions.payeeBottom}mm`,
                fontFamily: "'Courier New', monospace",
                fontSize: '15px',
                fontWeight: 'bold',
                color: 'black',
                maxWidth: '140mm'
              }}
            >
              **{data.payee}**
            </div>

            {/* Amount in Words */}
            <div
              style={{
                position: 'absolute',
                left: `${fieldPositions.amountWordsLeft}mm`,
                bottom: `${fieldPositions.amountWordsBottom}mm`,
                fontFamily: "'Courier New', monospace",
                fontSize: '14px',
                fontWeight: 'bold',
                color: 'black',
                maxWidth: `${fieldPositions.amountWordsWidth}mm`,
                lineHeight: '1.7',
                minHeight: '20mm'
              }}
            >
              <span style={{ display: 'inline-block', maxWidth: '95mm', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                **{amountInWords}**
              </span>
            </div>

            {/* Rupees Symbol Box */}
            <div
              style={{
                position: 'absolute',
                left: `${fieldPositions.rupeeSymbolLeft}mm`,
                bottom: `${fieldPositions.rupeeSymbolBottom}mm`,
                fontFamily: "'Courier New', monospace",
                textAlign: 'center',
                color: 'black',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              XX
            </div>

            {/* Amount in Figures */}
            <div
              style={{
                position: 'absolute',
                left: `${fieldPositions.amountFiguresLeft}mm`,
                bottom: `${fieldPositions.amountFiguresBottom}mm`,
                fontFamily: "'Courier New', monospace",
                fontSize: '18px',
                fontWeight: 'bold',
                color: 'black'
              }}
            >
              **{amountFormatted}**
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ChequePrint;
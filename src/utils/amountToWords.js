
const ones = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
]

const tens = [
  '',
  '',
  'Twenty',
  'Thirty',
  'Forty',
  'Fifty',
  'Sixty',
  'Seventy',
  'Eighty',
  'Ninety',
]

const convertHundreds = (num) => {
  let result = ''
  if (num >= 100) {
    result += ones[Math.floor(num / 100)] + ' Hundred '
    num %= 100
  }
  if (num >= 20) {
    result += tens[Math.floor(num / 10)] + ' '
    num %= 10
  }
  if (num > 0) {
    result += ones[num] + ' '
  }
  return result.trim()
}

export const amountToWords = (amount) => {
  if (amount === 0) return 'Zero Rupees Only'

  const parts = amount.toString().split('.')
  let rupees = parseInt(parts[0], 10)
  const cents = parts[1] ? parseInt(parts[1].padEnd(2, '0').substring(0, 2), 10) : 0

  if (rupees === 0 && cents === 0) return 'Zero Rupees Only'

  let result = ''

  if (rupees >= 10000000) {
    const crores = Math.floor(rupees / 10000000)
    result += convertHundreds(crores) + ' Crore '
    rupees %= 10000000
  }

  if (rupees >= 100000) {
    const lakhs = Math.floor(rupees / 100000)
    result += convertHundreds(lakhs) + ' Lakh '
    rupees %= 100000
  }

  if (rupees >= 1000) {
    const thousands = Math.floor(rupees / 1000)
    result += convertHundreds(thousands) + ' Thousand '
    rupees %= 1000
  }

  if (rupees > 0) {
    result += convertHundreds(rupees)
  }

  result = result.trim() + (result ? ' Rupees' : '')

  if (cents > 0) {
    result += (result ? ' and ' : '') + convertHundreds(cents) + ' Cents'
  }

  return result + ' Only'
}

export const formatAmount = (amount) => {
  if (!amount && amount !== 0) return '0.00'
  const num = parseFloat(amount)
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}


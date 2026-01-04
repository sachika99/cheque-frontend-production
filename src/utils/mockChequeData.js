

export const mockBanks = [
  {
    id: 1,
    bankName: 'Bank of Ceylon',
    branchName: 'Colombo Fort',
    branchCode: 'COL001',
    code: 'BOC',
  },
  {
    id: 2,
    bankName: 'People\'s Bank',
    branchName: 'Kandy',
    branchCode: 'KAN001',
    code: 'PEOPLES',
  },
  {
    id: 3,
    bankName: 'Commercial Bank',
    branchName: 'Galle',
    branchCode: 'GAL001',
    code: 'COMMERCIAL',
  },
]

export const mockBankAccounts = [
  {
    id: 1,
    bankId: 1,
    accountNo: '1234567890',
    accountName: 'Janasiri Motor Stores',
    accountType: 'Current',
    bankName: 'Bank of Ceylon',
    branchName: 'Colombo Fort',
  },
  {
    id: 2,
    bankId: 2,
    accountNo: '9876543210',
    accountName: 'Janasiri Motor Stores',
    accountType: 'Savings',
    bankName: 'People\'s Bank',
    branchName: 'Kandy',
  },
]

export const mockChequeBooks = [
  {
    id: 1,
    bankAccountId: 1,
    checkBookNo: 'CB001',
    startChequeNo: '000001',
    endChequeNo: '000050',
    currentCheque: '000001',
    status: 'ACTIVE',
    bankName: 'Bank of Ceylon',
    accountNo: '1234567890',
  },
  {
    id: 2,
    bankAccountId: 2,
    checkBookNo: 'CB002',
    startChequeNo: '000051',
    endChequeNo: '000100',
    currentCheque: '000051',
    status: 'ACTIVE',
    bankName: 'People\'s Bank',
    accountNo: '9876543210',
  },
]

export const mockSuppliers = [
  {
    id: 1,
    supplierCode: 'SUP001',
    supplierName: 'ABC Motors Pvt Ltd',
    supplierAddress: '123 Main Street, Colombo 05',
    supplierPhoneNo: '+94 11 2345678',
    supplierEmail: 'contact@abcmotors.lk',
    bankName: 'Commercial Bank',
    accountNumber: '111222333444',
  },
  {
    id: 2,
    supplierCode: 'SUP002',
    supplierName: 'XYZ Auto Parts',
    supplierAddress: '456 Galle Road, Colombo 03',
    supplierPhoneNo: '+94 11 8765432',
    supplierEmail: 'info@xyzautoparts.lk',
    bankName: 'Hatton National Bank',
    accountNumber: '555666777888',
  },
]
 
export const createDefaultChequeData = () => ({
  chequeId: null,
  supplierId: null,
  supplierName: '',
  invoiceNo: '',
  invoiceDate: new Date().toISOString().split('T')[0],
  invoiceAmount: '',
  chequeNo: '',
  chequeDate: new Date().toISOString().split('T')[0],
  chequeAmount: '',
  payeeName: '',
  chequeType: 'BEARER', 
  bankId: null,
  bankName: '',
  branchName: '',
  bankAccountId: null,
  accountNo: '',
  accountName: '',
  chequeBookId: null,
  notes: '',
})


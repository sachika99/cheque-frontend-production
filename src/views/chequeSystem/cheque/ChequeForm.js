import React, { useEffect, useState,useRef } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CButton,
  CSpinner,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormCheck,
} from '@coreui/react'
import { cilArrowLeft, cilSave, cilPlus, cilTrash, cilPaint, cilMoney, cilXCircle, cilPrint } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { ToastContainer, toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import bankAccountServices from '../../../api/services/BankAccountServices/bankAccountServices'
import chequeServices from '../../../api/services/ChequeServices/chequeServices'
import vendorService from '../../../api/services/VendorServices/vendorService'
import chequeBookServices from '../../../api/services/ChequeBookServices/chequeBookServices'
import 'react-toastify/dist/ReactToastify.css'
import ChequePrint from '../chequeNew/ChequePrint'

const ChequeForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id

  const [loading, setLoading] = useState(isEditMode)
  const [submitting, setSubmitting] = useState(false)
  const [suppliers, setSuppliers] = useState([])
  const [accounts, setAccounts] = useState([])
  const [ChequeBooks, setChequeBooks] = useState([])
  const [nextChequeId, setNextChequeId] = useState('')
  const [paymentTime, setPaymentTime] = useState(0)
  const [paymentTimee, setPaymentTimee] = useState(0)
   const printRef = useRef(null);
  const [printData, setPrintData] = useState(false)
  // New state for multiple invoices
  const [invoices, setInvoices] = useState([
    { invoiceNo: '', invoiceAmount: '' }
  ])
const [selectedAccountId, setSelectedAccountId] = useState("");
const [previousAccountId, setPreviousAccountId] = useState("");
const [confirmVisible, setConfirmVisible] = useState(false);
const [pendingAccountId, setPendingAccountId] = useState(null);
const [tickBox, setTickBox] = useState(true);
const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    chequeId: '',
    supplierId: 0,
    chequeBookId: 0,
    supplierName: '',
    bankAccountId: 0,
    accountNo: '',
    invoiceNo: '',
    invoiceDate: '',
    invoiceAmount: '',
    chequeNo: '',
    chequeDate: '',
    dueDate: '',
    chequeAmount: '',
    receiptNo: '00000',
    payeeName: '',
    status: 'Pending',
    isVerified: false,
    isOverdue: false,
  })

   const [chequeData, setChequeData] = useState({
    date: '',
    payee: '',
    amount: '',
    cashCheque:true,
    
  })

  useEffect(() => {
    const initializeForm = async () => {
      await fetchSuppliers()
      await fetchAccounts()

      if (isEditMode) {
        await fetchPayment()
      } else {
        generateNextChequeId()
        setLoading(false)
      }
    }
    
    initializeForm()
  }, [])

  const generateNextChequeId = async () => {
    try {
      const res = await chequeServices.getAllCheques()
      const items = Array.isArray(res) ? res : res?.data || []
      const validIds = items
        .map(x => x.chequeId)
        .filter(id => typeof id === "string" && /^CHEQ\d{3,}$/.test(id))

      if (validIds.length === 0) {
        setNextChequeId('CHEQ001')
      } else {
        const numbers = validIds.map(code => parseInt(code.replace("CHEQ", "")))
        const next = Math.max(...numbers) + 1
        setNextChequeId(`CHEQ${String(next).padStart(3, "0")}`)
      }
    } catch {
      setNextChequeId('CHEQ001')
    }
  }

  const fetchSuppliers = async () => {
    const res = await vendorService.getAllVendors()
    setSuppliers(Array.isArray(res) ? res : res?.data || [])
  }

  const fetchAccounts = async () => {
    const res = await bankAccountServices.getAllBankAccounts()
    setAccounts(Array.isArray(res) ? res : res?.data || [])
  }

  const fetchChequeBooks = async (id) => {
    const res = await chequeBookServices.getChequeBookByCheckBookId(id)
    const list = Array.isArray(res) ? res : res?.data || []
    const checkId = list.length > 0 ? list[0].id:0
     var chequeNo = list.length > 0 ? list[0].currentChequeNo:0
if (!isEditMode) {
     setFormData(prev => ({
        ...prev,
        chequeNo: String(chequeNo+1),
        chequeBookId:checkId
      }))
  setChequeBooks(list.length > 0 ? [list[0]] : [])
    }
   setChequeBooks(list)
 
  }

  const fetchPayment = async () => {
    try {
      const p = await chequeServices.getChequeById(id)
      
      setFormData({
        chequeId: p.chequeId,
        supplierId: p.supplierId,
        chequeBookId: p.chequeBookId,
        supplierName: p.supplierName,
        bankAccountId: p.bankAccountId,
        accountNo: p.accountNo,
        invoiceNo: p.invoiceNo,
        invoiceDate: p.invoiceDate?.substring(0, 10),
        invoiceAmount: p.invoiceAmount,
        chequeNo: p.chequeNo,
        chequeDate: p.chequeDate?.substring(0, 10),
        dueDate: p.dueDate?.substring(0, 10),
        chequeAmount: p.chequeAmount,
        receiptNo: p.receiptNo,
        payeeName: p.payeeName,
        status: p.status,
        isVerified: p.isVerified,
        isOverdue: p.isOverdue,
      })

      // Load invoices if they exist - THIS IS THE KEY PART
      if (p.invoices && Array.isArray(p.invoices) && p.invoices.length > 0) {
        const loadedInvoices = p.invoices.map(inv => ({
          id: inv.id || 0,
          invoiceNo: inv.invoiceNo || '',
          invoiceAmount: inv.invoiceAmount || ''
        }))
        setInvoices(loadedInvoices)
        console.log('Loaded invoices:', loadedInvoices) // Debug log
      } else {
        // If no invoices array, create one from main invoice fields
        setInvoices([{
          invoiceNo: p.invoiceNo || '',
          invoiceAmount: p.invoiceAmount || ''
        }])
        console.log('No invoices array found, using main fields') // Debug log
      }

      await fetchChequeBooks(p.bankAccountId)

      const sup = suppliers.find(x => x.id === p.supplierId)
      setPaymentTime(sup?.crediPeriodDays ?? 0)
      setPaymentTimee(sup?.crediPeriodDays ?? 0)

    } catch (e) {
      console.error('Error fetching payment:', e)
      toast.error(e.message || 'Failed to load payment data')
    } finally {
      setLoading(false)
    }
  }

  // Add new invoice row
  const handleAddInvoice = () => {
    setInvoices([...invoices, { invoiceNo: '', invoiceAmount: '' }])
  }

  // Remove invoice row
  const handleRemoveInvoice = (index) => {
    if (invoices.length > 1) {
      const updated = invoices.filter((_, i) => i !== index)
      setInvoices(updated)
      updateChequeAmount(updated)
    }
  }

  // Handle invoice field changes
  const handleInvoiceChange = (index, field, value) => {
    const updated = [...invoices]
    updated[index][field] = value
    setInvoices(updated)
    
    if (field === 'invoiceAmount') {
      updateChequeAmount(updated)
    }
  } 
  
  const updateStatus = async (chequeId) => {
  try {
    await bankAccountServices.updateBankAccountStatus(
      chequeId
    )

    toast.success('Status updated')
  } catch (error) {
    toast.error('Failed to update status')
  }
}


  // Update cheque amount based on total of all invoices
  const updateChequeAmount = (invoiceList) => {
    const total = invoiceList.reduce((sum, inv) => {
      const amount = parseFloat(inv.invoiceAmount) || 0
      return sum + amount
    }, 0)
    
    setFormData(prev => ({
      ...prev,
      chequeAmount: total
    }))
  }

   const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "invoiceDate") {
    const days = paymentTime || 0;

    const invoiceDate = new Date(value);
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(invoiceDate.getDate() + days);

    setFormData(prev => ({
      ...prev,
      invoiceDate: value,
      dueDate: dueDate.toISOString().substring(0, 10),
    }));

    return;
  }

  // Default handler for other fields
  setFormData(prev => ({
    ...prev,
    [name]: value,
  }));
};


 const handleChangeDueDate = (e) => {
  debugger
  const { name, value } = e.target;

  if (name === "dueDateCount") {
    // Remove leading zeros (but allow single "0")
    const cleanedValue = value.replace(/^0+(?=\d)/, '');

    const intValue = parseInt(cleanedValue, 10) || 0;
    setPaymentTime(intValue);

    const due = new Date(formData.invoiceDate);
    due.setDate(due.getDate() + intValue);

    const formatted = due.toISOString().substring(0, 10);

    setFormData(prev => ({
      ...prev,
      dueDate: formatted,
      dueDateCount: cleanedValue, // keep input clean
    }));
  }
};


  // const handleSubmit = async (e) => {
  //  setPrintData(true)
  // }
   const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const payload = {
        ...formData,
        chequeId: isEditMode ? formData.chequeId : nextChequeId,
        invoiceAmount: Number(formData.invoiceAmount),
        chequeAmount: Number(formData.chequeAmount),
        invoices:invoices,
      }

      if (isEditMode) {
        var response = await chequeServices.updateCheque(id, payload)
        setChequeData(prev => ({
        ...prev,
       payee: response.payeeName,
        amount: String(response.chequeAmount),
        date: response.dueDate.split("T")[0]
      }))
      setPrintData(true)
        toast.success("Payment Updated")
      } else {

        var response = await chequeServices.createCheque(payload)
      setChequeData(prev => ({
        ...prev,
        payee: response.payeeName,
        amount: String(response.chequeAmount),
        date: response.dueDate.split("T")[0]
      }))
       console.log("cretae"+chequeData)

   
       
        toast.success("Payment Created")
      }
if(tickBox){
    setPrintData(true)
}
else{setTimeout(() => navigate("/cheque"))}
     
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }


  useEffect(() => {
    if (!isEditMode) {
      const today = new Date().toISOString().substring(0, 10)

      setFormData(prev => ({
        ...prev,
        chequeDate: prev.chequeDate || today,
      }))
    }
  }, [isEditMode])

  if (loading) {
    return (
      <div className="text-center py-5">
        <CSpinner />
      </div>
    )
  }

const handlePrintClose = (status) => {
    setPrintData(false);
    // Handle different statuses
    switch(status) {
      case 'completed':
        console.log('Print dialog was closed (user either printed or cancelled)');
        
        // Show success message or log the action
        break;
      case 'cancelled':
        console.log('Print was cancelled before dialog opened');
        // Handle cancellation
        break;
      case 'error':
        console.log('Print encountered an error');
        // Handle error
        break;
      default:
        console.log('Unknown status:', status);
    }
     setTimeout(() => navigate("/cheque"))
  };
  useEffect(() => { 
  if (accounts?.length) {
    const activeAccount = accounts.find(a => a.status === "Active");

    if (activeAccount) {
      setSelectedAccountId(activeAccount.id);
      setPreviousAccountId(activeAccount.id);

      fetchChequeBooks(activeAccount.id);

      setFormData(prev => ({
        ...prev,
        bankAccountId: activeAccount.id,
        accountNo: activeAccount.accountNo
      }));
    }
  }
}, [accounts]);
   if (printData&& tickBox) {
     console.log("cretae"+chequeData)
     debugger
    return <ChequePrint data={chequeData} onClose={handlePrintClose}/>;
  }
 

 return (
    <>
      <div className="screen-only">
        <CCard className="shadow-sm">
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0 d-flex align-items-center gap-3">
                {isEditMode ? "Edit Cheque Payment" : "Add Cheque Payment"}

                {!isEditMode ? (
                  <span className="badge bg-success px-3 py-2">CHEQ - {formData.chequeNo}</span>
                ) : (
                  <span className="badge bg-warning px-3 py-2">CHEQ - {formData.chequeNo}</span>
                )}
              </h4>

              <CButton
                variant="outline"
                color="secondary"
                size="sm"
                onClick={() => navigate("/cheque")}
              >
                <CIcon icon={cilArrowLeft} className="me-2" />
                Back
              </CButton>
            </div>
          </CCardHeader>

          <CCardBody className="pt-4">
            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-4">
                <CCol md={4}>
                  <CFormLabel className="fw-medium">
                    Supplier <span className="text-danger">*</span>
                  </CFormLabel>

                  <CFormSelect
                    name="supplierId"
                    required
                    value={formData.supplierId}
                    onChange={(e) => {
                      const s = suppliers.find(x => x.id == e.target.value);
                      setPaymentTime(s?.crediPeriodDays ?? 0);
                      setPaymentTimee(s?.crediPeriodDays ?? 0);

                      setFormData(prev => ({
                        ...prev,
                        supplierId: s?.id,
                        supplierName: s?.vendorName || "",
                        payeeName: s?.vendorName || "",
                      }));
                    }}
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>{s.vendorName}</option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol md={4}>
                 <CFormLabel className="fw-medium">
  Bank Account <span className="text-danger">*</span>
</CFormLabel>

<CFormSelect
  required
  value={selectedAccountId}
  onChange={(e) => {
    const newId = Number(e.target.value);

    if (newId !== previousAccountId) {
      setPendingAccountId(newId);
      setConfirmVisible(true);
    }
  }}
>
  <option value="">Select Account</option>
  {accounts.map((a) => (
    <option key={a.id} value={a.id}>
      {a.accountNo} — {a.bankName}
      {a.status === "Active" ? " (Primary)" : ""}
    </option>
  ))}
</CFormSelect>

                </CCol>
                
                <CCol md={2}>
                  <CFormLabel>Due Days</CFormLabel>
                  <CFormInput
                    type="number"
                    required
                    name="dueDateCount"
                    value={paymentTime}
                    min={0}
                    onChange={handleChangeDueDate}
                    disabled={!formData.invoiceDate}
                    className="border border-danger"
                  />
                  {!formData.invoiceDate && (
                    <small className="text-danger fw-semibold">
                      Select invoice date first
                    </small>
                  )}
                </CCol>
              </CRow>

              <hr className="my-4" />

              <CRow className="mb-4">
                <CCol md={4}>
                  <CFormLabel>Cheque No</CFormLabel>
                  <CFormInput required name="chequeNo" value={formData.chequeNo} onChange={handleChange} />
                </CCol>

                <CCol md={4}>
                  <CFormLabel>Invoice Date</CFormLabel>
                  <CFormInput 
                    type="date" 
                    required 
                    name="invoiceDate" 
                    value={formData.invoiceDate} 
                    onChange={handleChange} 
                    disabled={!formData.supplierId}
                  />
                  {!formData.supplierId && (
                    <small className="text-danger fw-semibold">
                      Select a supplier first to enable Invoice date.
                    </small>
                  )}
                </CCol>

                <CCol md={4}>
                  <CFormLabel>
                    Due Date{" "}
                    {paymentTime > 0 && (
                      <small className="text-success fw-semibold">
                        Due date will set in {paymentTime} days
                      </small>
                    )}
                  </CFormLabel>
                  <CFormInput
                    type="date"
                    required
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-4">
  <CCol md={4}>
    <CFormLabel>Cheque Date</CFormLabel>
    <CFormInput
      type="date"
      required
      name="chequeDate"
      value={formData.chequeDate}
      onChange={handleChange}
    />
  </CCol>

  <CCol md={4}>
    <CFormLabel>Status</CFormLabel>
    <CFormSelect 
      required 
      name="status" 
      value={formData.status} 
      onChange={handleChange}
    >
      <option value="Pending">Pending</option>
      <option value="Issued">Issued</option>
      <option value="Cleared">Cleared</option>
      <option value="Bounced">Bounced</option>
    </CFormSelect>
  </CCol>
  
{/* <CCol md={4} className="d-flex justify-content-end align-items-end">
  <div 
    className="d-flex align-items-center" 
    style={{ 
      height: '36px',
      // border: '2px solid #28A745',
      borderRadius: '6px',
      padding: '0 10px',
      // backgroundColor: '#dfece2'
    }}
  >
    <input
      type="checkbox"
      id="printCheque" 
      name="printCheque"
      checked={tickBox}
      onChange={(e) => setTickBox(e.target.checked)}
      style={{
        width: '20px',
        height: '20px',
        cursor: 'pointer',
        accentColor: '#28A745',
        borderRadius: '4px'
      }}
    />
    <label 
      htmlFor="printCheque" 
      style={{ 
        marginLeft: '10px', 
        cursor: 'pointer',
        color: '#28A745',
        fontWeight: '600',
        fontSize: '15px',
        userSelect: 'none'
      }}
    >
      Print Cheque While Submit
    </label>
  </div>
</CCol> */}
</CRow>

              <hr className="my-4" />

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <h5 className="mb-0">Invoice Details</h5>
                    <CButton
                      color="success"
                      size="sm"
                      onClick={handleAddInvoice}
                      className="text-white"
                    >
                      <CIcon icon={cilPlus} className="me-1" />
                      Add Invoice
                    </CButton>
                  </div>
                  <div className="border border-primary rounded px-3 py-1">
                    <small className="text-muted me-2">Total:</small>
                    <span className="fw-bold text-primary">
                      LKR {invoices.reduce((sum, inv) => sum + (parseFloat(inv.invoiceAmount) || 0), 0).toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {invoices.map((invoice, index) => (
                  <CRow key={index} className="mb-3 pb-3 border-bottom align-items-end">
                    <CCol md={1}>
                      <CFormLabel className="fw-semibold">No.</CFormLabel>
                      <div className="p-2 text-center">
                        <span className="badge bg-primary">{index + 1}</span>
                      </div>
                    </CCol>

                    <CCol md={5}>
                      <CFormLabel className="fw-semibold">Invoice Number</CFormLabel>
                      <CFormInput
                        required
                        value={invoice.invoiceNo}
                        onChange={(e) => handleInvoiceChange(index, 'invoiceNo', e.target.value)}
                        placeholder="Enter invoice number"
                      />
                    </CCol>

                    <CCol md={4}>
                      <CFormLabel className="fw-semibold">Invoice Amount (LKR)</CFormLabel>
                      <CFormInput
                        type="number"
                        required
                        value={invoice.invoiceAmount}
                        onChange={(e) => handleInvoiceChange(index, 'invoiceAmount', e.target.value)}
                        placeholder="0.00"
                      />
                    </CCol>

                    <CCol md={2} className="text-center">
                      {invoices.length > 1 && (
                        <CButton
                          color="danger"
                          variant="outline"
                          onClick={() => handleRemoveInvoice(index)}
                          size="sm"
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>
                      )}
                    </CCol>
                  </CRow>
                ))}
              </div>

            <div className="d-flex justify-content-end gap-3 align-items-center">
  <div 
    className="d-flex align-items-center gap-2 px-3 py-2 rounded-3" 
    style={{ 
      // backgroundColor: '#f8f9fa',
      border: '1px solid #0080ff',
      transition: 'all 0.2s ease'
    }}
  >
    <CIcon 
      icon={cilPrint} 
      style={{ 
        color: '#0080ff',
        fontSize: '18px'
      }} 
    />
    <label 
      htmlFor="printCheque" 
      className="mb-0"
      style={{ 
        cursor: 'pointer',
        // color: '#0080ff',
        fontWeight: '600',
        fontSize: '14px',
        userSelect: 'none'
      }}
    >
      Print Cheque
    </label>
    <input
      type="checkbox"
      id="printCheque" 
      name="printCheque"
      checked={tickBox}
      onChange={(e) => setTickBox(e.target.checked)}
      className="form-check-input"
      style={{
        width: '20px',
        height: '20px',
        cursor: 'pointer',
        marginTop: '0',
          border: '1px solid #0080ff',
      }}
    />
  </div>

  <div 
    className="d-flex align-items-center gap-2 px-3 py-2 rounded-3" 
    style={{ 
      // backgroundColor: '#f8f9fa',
      border: '1px solid #0d9700',
      transition: 'all 0.2s ease'
    }}
   
  >
    <CIcon 
      icon={cilMoney} 
      style={{ 
        color: '#0d9700',
        fontSize: '18px'
      }} 
    />
    <label 
      htmlFor="cashCheque" 
      className="mb-0"
      style={{ 
        cursor: 'pointer',
        // color: '#15ff00',
        fontWeight: '600',
        fontSize: '14px',
        userSelect: 'none'
      }}
    >
      Cash Cheque
    </label>
    <input
      type="checkbox"
      id="cashCheque" 
      name="cashCheque"
      checked={!chequeData.cashCheque}
      onChange={(e) => setChequeData(prev => ({
        ...prev,
        cashCheque: !e.target.checked
      }))}
      className="form-check-input"
      style={{
        width: '20px',
        height: '20px',
        cursor: 'pointer',
        marginTop: '0',
         border: '1px solid #0d9700',
      }}
    />
  </div>

  <div 
    style={{ 
      width: '1px', 
      height: '36px', 
      backgroundColor: '#dee2e6' 
    }} 
  />

  <CButton
    variant="outline"
    color="secondary"
    disabled={submitting}
    onClick={() => navigate("/cheque")}
    className="px-4 fw-semibold d-flex align-items-center"
    style={{
      height: '40px',
      transition: 'all 0.2s ease'
    }}
  >
    {/* <CIcon icon={cilXCircle} className="me-2" /> */}
    Cancel
  </CButton>

  <CButton 
    color="primary" 
    type="submit" 
    disabled={submitting}
    className="px-4 fw-semibold d-flex align-items-center"
    style={{
      height: '40px',
      minWidth: '160px',
      boxShadow: submitting ? 'none' : '0 2px 8px rgba(13, 110, 253, 0.25)',
      transition: 'all 0.2s ease'
    }}
  >
    {submitting ? (
      <>
        <CSpinner size="sm" className="me-2" />
        Saving...
      </>
    ) : (
      <>
        <CIcon icon={cilSave} className="me-2" />
        {isEditMode ? "Update Payment" : "Create Payment"}
      </>
    )}
  </CButton>
</div>
            </CForm>       
          </CCardBody>
        </CCard>
      </div>


      <ToastContainer position="top-right" autoClose={2300} theme="colored" />


      <CModal visible={confirmVisible} onClose={() => setConfirmVisible(false)}>
  <CModalHeader>
    <CModalTitle>Change Primary Account</CModalTitle>
  </CModalHeader>

  <CModalBody>
    Do you want to make this account the primary bank account?
  </CModalBody>

  <CModalFooter>
    <CButton
      color="secondary"
      onClick={() => {
        setSelectedAccountId(previousAccountId);
        setConfirmVisible(false);
      }}
    >
      No
    </CButton>

  <CButton
  color="primary"
  onClick={async () => {
    setIsSubmitting(true);
    try {
      await updateStatus(pendingAccountId);

      const acc = accounts.find(a => a.id === pendingAccountId);

      setSelectedAccountId(pendingAccountId);
      setPreviousAccountId(pendingAccountId);

      fetchChequeBooks(pendingAccountId);

      setFormData(prev => ({
        ...prev,
        bankAccountId: pendingAccountId,
        accountNo: acc?.accountNo || ""
      }));

      setConfirmVisible(false);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsSubmitting(false);
    }
  }}
  disabled={isSubmitting}
>
  {isSubmitting ? (
    <>
      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      Processing...
    </>
  ) : (
    'Yes, Make Primary'
  )}
</CButton>
  </CModalFooter>
</CModal>

    </>
  );

}

export default ChequeForm   
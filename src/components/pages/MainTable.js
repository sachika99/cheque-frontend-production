import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CPagination,
  CPaginationItem,
} from '@coreui/react'

const MainTable = () => {
const tableData = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    class: `Class ${i + 1}`,
    heading1: `Heading ${i + 1}`,
    heading2: `@user${i + 1}`,
  }))
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 50
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = tableData.slice(startIndex, endIndex)

  const totalPages = Math.ceil(tableData.length / itemsPerPage)
  

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Cheque Transactions Table </strong> <small>Janasiri Motors Kandy</small>
          </CCardHeader>

          <CCardBody>
            {/* Dropdown with spacing */}
            <CDropdown className="mb-3">
              <CDropdownToggle color="secondary">Dropdown button</CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem href="#">Action</CDropdownItem>
                <CDropdownItem href="#">Another action</CDropdownItem>
                <CDropdownItem href="#">Something else here</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>

            {/* Table */}
            <CTable striped hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Class</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Heading</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Heading</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {currentData.map((item) => (
                  <CTableRow key={item.id}>
                    <CTableHeaderCell scope="row">{item.id}</CTableHeaderCell>
                    <CTableDataCell>{item.class}</CTableDataCell>
                    <CTableDataCell>{item.heading1}</CTableDataCell>
                    <CTableDataCell>{item.heading2}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-center mt-3">
              <CPagination align="center" aria-label="Pagination example">
                {Array.from({ length: totalPages }, (_, i) => (
                  <CPaginationItem
                    key={i}
                    active={i + 1 === currentPage}
                    onClick={() => setCurrentPage(i + 1)}
                    style={{ cursor: 'pointer' }}
                  >
                    {i + 1}
                  </CPaginationItem>
                ))}
              </CPagination>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default MainTable

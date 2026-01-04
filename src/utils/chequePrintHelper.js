
import React from 'react'
import { createRoot } from 'react-dom/client'
import SeylanChequePrintTemplate from '../views/chequeSystem/SeylanChequePrintTemplate'

export const renderSeylanChequePrint = (chequeData) => {
  
  const printContainer = document.createElement('div')
  printContainer.id = 'cheque-print-container'
  printContainer.className = 'seylan-cheque-print-container'
  printContainer.style.position = 'absolute'
  printContainer.style.left = '-9999px'
  printContainer.style.top = '-9999px'
  printContainer.style.width = '2000px'
  printContainer.style.height = '1000px'
  
  const printDiv = document.createElement('div')
  printDiv.className = 'seylan-cheque-print'
  
  const root = createRoot(printDiv)
  root.render(
    <SeylanChequePrintTemplate
      side="front"
      data={chequeData}
    />
  )
  
  printContainer.appendChild(printDiv)
  document.body.appendChild(printContainer)
  
  return printContainer
}

export const cleanupPrintContainer = () => {
  const container = document.getElementById('cheque-print-container')
  if (container) {
    container.remove()
  }
}


export const printCheque = (chequeData) => {
  const container = renderSeylanChequePrint(chequeData)
  
  setTimeout(() => {
    window.print()
    
    setTimeout(() => {
      cleanupPrintContainer()
    }, 1000)
  }, 200)
}


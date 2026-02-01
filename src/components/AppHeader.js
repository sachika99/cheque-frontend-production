import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'

const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const username = localStorage.getItem("username") || "";
  
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning ' + username
    if (hour < 17) return 'Good Afternoon ' + username
    return 'Good Evening ' + username
  }

  const quotes = [
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The only way to do great work is to love what you do.",
    "Believe you can and you're halfway there.",
    "Quality is not an act, it is a habit.",
    "Excellence is not a skill, it is an attitude.",
    "The secret of getting ahead is getting started.",
    "Success doesn't come from what you do occasionally, it comes from what you do consistently.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Strive not to be a success, but rather to be of value.",
    "Innovation distinguishes between a leader and a follower."
  ]

  const isGreeting = (message) => {
    return message.startsWith('Good Morning') || 
           message.startsWith('Good Afternoon') || 
           message.startsWith('Good Evening')
  }

  const [currentMessage, setCurrentMessage] = useState(getGreeting())
  const [key, setKey] = useState(0)
  const [showGreeting, setShowGreeting] = useState(true)

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (showGreeting) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
        setCurrentMessage(randomQuote)
        setShowGreeting(false)
      } else {
        setCurrentMessage(getGreeting())
        setShowGreeting(true)
      }
      setKey(prevKey => prevKey + 1)
    }, 30000)

    return () => clearInterval(interval)
  }, [showGreeting, username])

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <div style={{ 
          flex: 1, 
          overflow: 'hidden', 
          whiteSpace: 'nowrap', 
          position: 'relative', 
          height: '40px', 
          display: 'flex', 
          alignItems: 'center',
          background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 100%)',
          padding: '0 20px'
        }}>
          <div key={key} style={{ 
            display: 'inline-block', 
            animation: 'scroll-right 30s linear forwards',
            paddingLeft: '10px'
          }}>
            <span style={{ 
              fontSize: '14px', 
              fontWeight: '500', 
              color: 'var(--cui-header-color, #333)',
              letterSpacing: '0.5px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              textTransform: isGreeting(currentMessage) ? 'uppercase' : 'none',
              opacity: 0.85
            }}>
              {currentMessage}
            </span>
          </div>
          <style>{`
            @keyframes scroll-right {
              0% { transform: translateX(-100%); opacity: 0; }
              5% { opacity: 1; }
              95% { opacity: 1; }
              100% { transform: translateX(100vw); opacity: 0; }
            }
          `}</style>
        </div>
        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      {/* <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer> */}
    </CHeader>
  )
}

export default AppHeader
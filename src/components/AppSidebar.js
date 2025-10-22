import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
   
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >

      <CSidebarHeader className="border-bottom">
        {/* <CSidebarBrand to="/"> */}
          <div>
    <h1
      style={{
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#ffffff',
        letterSpacing: '1px',
        marginBottom: '4px',
      }}
    >
      JANASIRI MOTORS
    </h1>
    <h3
      style={{
        fontSize: '0.8rem',
        fontWeight: '400',
        color: '#38bdf8',
        letterSpacing: '1px',
        margin: 0,
      }}
    >
      Authorized Isuzu Genuine
    </h3>
     <h3
      style={{
        fontSize: '0.8rem',
        fontWeight: '400',
        color: '#38bdf8',
        letterSpacing: '1px',
        margin: 0,
      }}
    >
      Parts Dealer
    </h3>
  </div>
        {/* </CSidebarBrand> */}
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)

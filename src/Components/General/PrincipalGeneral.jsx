import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import Nav from '../../Components/General/Nav'

const Principal = () => {
  return (
    <div>
        <Header />
        <Outlet />
        <Nav/>
    </div>
  )
}

export default Principal
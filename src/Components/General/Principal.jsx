import React from 'react'
import Header from './Header'
import Nav from './Nav'
import { Outlet } from 'react-router-dom'

const Principal = () => {
  return (
    <div>
        <Header />
        <Outlet />
        <Nav />
    </div>
  )
}

export default Principal
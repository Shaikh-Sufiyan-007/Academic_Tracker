import React from 'react'
import { Outlet } from 'react-router-dom'

const School = () => {
  return (
    <>
        <div>School</div>
        <Outlet />
    </>
  )
}

export default School
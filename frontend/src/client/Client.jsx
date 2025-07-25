import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './utility_components/nabar/Navbar'
import Footer from './utility_components/footer/Footer'
import Box from '@mui/material/Box'

const Client = () => {
  return (
    <>
        <Navbar />
        <Box sx={{minHeight: '80vh'}} component={'div'}>
            <Outlet />
        </Box>
        <Footer />
    </>

  )
}

export default Client
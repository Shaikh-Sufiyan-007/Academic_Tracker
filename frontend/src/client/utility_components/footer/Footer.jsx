import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React from 'react'

const Footer = () => {
  return (
    <>
      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: "20px", marginBottom: "10px" }} component={'div'}>

        <Typography variant='h5'>Academic Tracker</Typography>
        <Typography variant='p'>Copyright@2025</Typography>

      </Box>
    </>
  )
}

export default Footer
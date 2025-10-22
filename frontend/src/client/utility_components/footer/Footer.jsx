import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React from 'react'

const Footer = () => {
  return (
    <>
      <Box 
            sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                flexDirection: 'column', 
                padding: '30px 20px',
                backgroundColor: '#f8f9fa',
                marginTop: '40px'
            }}
        >
            <Typography 
                variant="h6" 
                sx={{ 
                    fontWeight: '600',
                    color: '#2c3e50',
                    marginBottom: '8px',
                    fontSize: '1.3rem'
                }}
            >
                Academic Tracker
            </Typography>
            
            <Typography 
                variant="body2" 
                sx={{ 
                    color: '#7f8c8d',
                    fontSize: '0.9rem'
                }}
            >
                © 2025 - All Rights Reserved
            </Typography>
        </Box>
    </>
  )
}

export default Footer
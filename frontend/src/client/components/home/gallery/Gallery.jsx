import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from 'react';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function Gallery() {

    const [open, setOpen] = useState(false);
    const [selectedSchool, setSelectedSchool] = useState(null)
    const [schools, setSchools] = useState([])

    const handleOpen = (school) => {
        setOpen(true);
        setSelectedSchool(school);
    };
    
    const handleClose = () => {
        setOpen(false);
        setSelectedSchool(null)
    }


    useEffect(() => {
        axios.get(`http://localhost:5000/api/school/all`).then(res => {
        setSchools(res.data.schools)
        // setMessage(res.data.message)
        // setMessageType('success')
        // Formik.resetForm();
      }).catch(e => {
        // setMessage(e.response.data.message)
        // setMessageType("error")
        console.log("Error in register: ", e)
      })
    }, [])
  return (
    <Box>
        <Typography variant='h4' sx={{textAlign: 'center', marginTop: '40px', marginBottom: '40px'}}>Registered Schools</Typography>
        <ImageList sx={{ width: "100%", height: 'auto' }}>
        {schools.map((school) => (
            <ImageListItem key={school.school_image}>
            <img
                srcSet={`./images/uploaded/school/${school.school_image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                src={`./images/uploaded/school/${school.school_image}?w=248&fit=crop&auto=format`}
                alt={school.school_name}
                loading="lazy"
                onClick={() => {handleOpen(school)}}
            />
            <ImageListItemBar
                title={school.school_name}
                position="below"
            />
            </ImageListItem>
        ))}
        </ImageList>

      <Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(2px)'
  }}
>
  <Box 
    sx={{
      position: 'relative',
      maxWidth: '90vw',
      maxHeight: '90vh',
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: 24,
      p: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2,
      overflow: 'hidden'
    }}
  >
    {/* Close Button */}
    <IconButton
      onClick={handleClose}
      sx={{
        position: 'absolute',
        top: 8,
        right: 8,
        bgcolor: 'rgba(0,0,0,0.1)',
        '&:hover': {
          bgcolor: 'rgba(0,0,0,0.2)'
        }
      }}
    >
      <CloseIcon />
    </IconButton>

    {/* School Name */}
    <Typography 
      id="modal-modal-title" 
      variant="h5" 
      component="h2"
      sx={{
        fontWeight: 'bold',
        color: 'primary.main',
        textAlign: 'center'
      }}
    >
      {selectedSchool?.school_name}
    </Typography>

    {/* School Image */}
    <Box
      sx={{
        borderRadius: 1,
        overflow: 'hidden',
        boxShadow: 2,
        maxWidth: '100%'
      }}
    >
      <img 
        src={selectedSchool && `./images/uploaded/school/${selectedSchool.school_image}`}
        style={{
          maxHeight: '70vh',
          maxWidth: '100%',
          objectFit: 'contain',
          display: 'block'
        }}
        alt={selectedSchool?.school_name || "School image"}
      />
    </Box>

    {/* Additional Info (agar available ho toh) */}
    {selectedSchool?.description && (
      <Typography 
        id="modal-modal-description" 
        sx={{ 
          mt: 1,
          textAlign: 'center',
          color: 'text.secondary',
          lineHeight: 1.6
        }}
      >
        {selectedSchool.description}
      </Typography>
    )}
  </Box>
</Modal>


    </Box>
  );
}


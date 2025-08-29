import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from 'react';
import axios from 'axios';

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
        console.log("School ",res)
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
      >
        <Box sx={{position: 'absolute', top: '50%', left: '50%', 
            transform: 'translate(-50%, -50%)', 
            background: 'white',
            padding: '10px',
            border: 'none',
            outline: 'none',
          }}>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {selectedSchool && selectedSchool.school_name}
          </Typography>

          <img
                // srcSet={`./images/uploaded/school/${ selectedSchool && selectedSchool.img}`}
                src={selectedSchool && `./images/uploaded/school/${selectedSchool.school_image}`}
                style={{maxHeight: '80vh'}}
                alt={"alt"}
            />
        </Box>
      </Modal>


    </Box>
  );
}


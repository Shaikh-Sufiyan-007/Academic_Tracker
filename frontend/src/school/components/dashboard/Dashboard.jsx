import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { baseApi } from '../../../environment'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardMedia from '@mui/material/CardMedia'
import MessageSnackbar from '../../../basic-utility-components/snackbar/MessageSnackbar'

const Dashboard = () => {
  const [school, setSchool] = useState(null)
  const [schoolName, setSchoolName] = useState(null)
  const [edit, setEdit] = useState(false)

    //Image Handling
    const [file, setFile] = useState(null)
    const [imageUrl, setImageUrl] = useState(null)
    const addImage = (e) => {
      const file = e.target.files[0]
      setImageUrl(URL.createObjectURL(file))
      setFile(file)
    }
  
    const fileInputRef = useRef(null)
    const handleClearFile = () => {
      if(fileInputRef.current){
        fileInputRef.current.value = '';
      }
      setFile(null)
      setImageUrl(null)
    }

    //MESSAGE
    const [message, setMessage] = useState('')
      const [messageType, setMessageType] = useState('')
    
      const handleMessageClose = () => {
        setMessage('')
      }

    const handleEditSubmit = () => {
      const fd = new FormData();
      fd.append('school_name', schoolName)
      if(file) {
        fd.append('image', file, file.name)
      }

      axios.patch(`${baseApi}/school/update`, fd).then(res => {
        setMessage(res.data.message)
        setMessageType('success')
        cancelEdit()
      }).catch(e => {
        setMessage(e.response.data.message)
        setMessageType("error")
        console.log("Error in register: ", e)
      })
    }
    
    const cancelEdit = () => {
      setEdit(false)
      handleClearFile()
    }

  const fetchSchool = () => {
    axios.get(`${baseApi}/school/fetch-single`).then(res => {
      setSchool(res.data.school)
      setSchoolName(res.data.school.school_name)
    }).catch(e => {
      console.log('Error in fetching school', e)
    })
  }

  useEffect(() => {
    fetchSchool();
  },[message])
  return (
    <>

    {message &&
        <MessageSnackbar message={message} messageType={messageType} handleClose={handleMessageClose} />}

      {edit && 
        <>
          <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1 },
          display: "flex",
          flexDirection: "column",
          width: "50vw",
          minWidth: "230px",
          margin: 'auto',
          background: '#fff'
        }}
        noValidate
        autoComplete="off"
      >
        <Typography variant="h2" sx={{textAlign: "center"}}>Register</Typography>

        <Typography>Add College Picture</Typography>
        <TextField
        inputRef={fileInputRef}
        type="file"
        onChange={(e) => addImage(e)}
        />
        {imageUrl && <Box>
          
            <CardMedia component={'img'} height={'240px'} image={imageUrl} />
          </Box>}

        <TextField
          label="School Name"
          value={schoolName}
          onChange={(e) => {
            setSchoolName(e.target.value)
          }}
        />
        
        <Button variant='contained' sx={{background: 'rgb(91, 182, 94)', color: '#FFFFFF'}} onClick={handleEditSubmit}>Submit Edit</Button>
        <Button variant='contained' sx={{background: 'rgba(233, 88, 83, 0.82)', color: '#FFFFFF'}} onClick={cancelEdit}>Cancel</Button>
        </Box>
        </>
      }
      {school && 
        <Box sx={{height: '500px', width: 'auto',
          position: 'relative',
          background: `url(/images/uploaded/school/${school.school_image})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',

        }}>

          <Typography variant='h3'>{school.school_name}</Typography>

          <Box component={'div'} sx={{position: 'absolute', bottom: '10px', right: '10px', height: '50px', width: '50px'}}>
            <Button variant='outlined' sx={{color: 'black', borderRadius: '50%', background: 'white', height: '60px'}} onClick={() => {
              setEdit(true)
            }}>
              <EditIcon />
            </Button>
          </Box>

        </Box>
      }
    </>
    
  )
}

export default Dashboard
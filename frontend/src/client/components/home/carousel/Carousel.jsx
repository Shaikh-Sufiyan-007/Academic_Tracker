import Box from '@mui/material/Box';
import SwipeableViews from 'react-swipeable-views';
import React, { useState } from 'react'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import kennyImage from '../../../../assets/kenny-eliason-zFSo6bnZJTw-unsplash.jpg';
import serwinImage from '../../../../assets/serwin365-avMyDRq-9fU-unsplash.jpg';
import CarolinImage from '../../../../assets/caroline-andrade-rocha-hjIEGNvb5uA-unsplash.jpg';

const carouselItems = [
    {
        image: kennyImage,
        title: 'Explore Our Classrooms',
        description: 'Engaging and inspiring enviroments for every student.'
    },
    {
        image: serwinImage,
        title: 'Expowering Students',
        description: 'We believe in fostering the potential of every student.'
    },
    {
        image: CarolinImage,
        title: 'Learning Tools',
        description: 'Providing the right tools for effective learning.'
    },
];

const Carousel = () => {
    const [activeIndex, setActiveIndex] = useState(0)

    const handleNext = () => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % carouselItems.length)
    };

    const handleBack = () => {
        setActiveIndex((prevIndex) => 
            prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
        )
    }
  return (
    <Box sx={{position: 'relative', width: '100%' }}>
        <SwipeableViews index={activeIndex} onChangeIndex={(index) => setActiveIndex(index)}>
            {carouselItems.map((item, index) => (
                <Box key={index} sx={{position: 'relative', textAlign: 'center', color: 'white'}}>
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '70vh', minHeight: '400px', objectFit: 'cover' }} />
                    <Box 
                        sx={{
                            position: 'absolute',
                            bottom: 20,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            bgcolor: 'rgba(0,0,0,0.6)',
                            padding: '10px 20px',
                            borderRadius: 1,
                        }}
                    >
                        <Typography variant='h5'>{item.title}</Typography>
                        <Typography variant='body1'>{item.description}</Typography>
                    </Box>
                </Box>
            ))}
        </SwipeableViews>

        <Box sx={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', zIndex: 1 }}>
            <Button variant='contained' onClick={handleBack}>
                <ArrowBackIosIcon />
            </Button>
        </Box>
        <Box sx={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', zIndex: 1 }}>
            <Button variant='contained' onClick={handleNext}>
                <ArrowForwardIosIcon />
            </Button>
        </Box>
    </Box>
  )
}

export default Carousel
import React, { useState, useEffect } from 'react';
import { Box, Paper, Fade } from '@mui/material';
import '../Styles/Home.css'; // Asegúrate de crear este archivo para estilos
import img1 from '../assets/react.svg';
import img2 from '../assets/camaleon.jpg';

const images = [
  { name: "First Company", src: img1 },
  { name: "Second Company", src: img2 },
  // Agrega más imágenes según sea necesario
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Cambia cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <Box className="carousel">
      {images.map((image, index) => (
        <Fade
          key={image.name}
          in={index === currentIndex}
          timeout={{ enter: 500, exit: 500 }}
        >
          <Paper elevation={3} className="carousel-item">
            <img src={image.src} alt={image.name} />
          </Paper>
        </Fade>
      ))}
    </Box>
    
  );
};

export default Carousel;

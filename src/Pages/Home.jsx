import React from 'react';
import FormHome from '../Components/formHome'
import { Columna,Formulario2 } from "../Components/Formularios";
import Carousel from '../Components/carousel';

const Home=() =>{
    return (
        <Formulario2>
            <Carousel/>
            <br />
            <FormHome/>
        </Formulario2>
    );
}

export default Home;
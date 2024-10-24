import React from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";


import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Cliente from "../Pages/Cliente";
import Navbar from "../Components/navBar";
import Categorias from "../Pages/Categorias"
import Subcategorias from "../Pages/Subcategorias"
import Busqueda from "../Pages/Busqueda"

function Router () {
    return(
        
     <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/Home" exact element={<Home/>} />
        <Route path="/" exact element={<Login/>} />
        <Route path="/Cliente" exact element={<Cliente/>} />
        <Route path="/Categorias" exact element={<Categorias/>} />
        <Route path="/Subcategorias" exact element={<Subcategorias/>} />
        <Route path="/Busqueda" exact element={<Busqueda/>} />
      </Routes>
    </BrowserRouter>
    );
};

export default Router;
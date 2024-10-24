import React,{lazy,Suspense} from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/navBar';


const Cliente =lazy(()=>import('../pages/Cliente'));
const Login =lazy(()=>import('../pages/Login'));
const Home =lazy(()=>import('../pages/Home'));
const Categoria =lazy(()=>import('../pages/Categorias'));
const Subcategoria =lazy(()=>import('../pages/Subcategorias'));

function App() {

  return (
    <Suspense fallback={<p>Cargando</p>}>
      <BrowserRouter>
        <Navbar />
        <Routes>
        <Route path="/Home" exact element={<Home/>} />
        <Route path="/" exact element={<Login/>} />
        <Route path="/Cliente" exact element={<Cliente/>} />
        <Route path="/Categoria" exact element={<Categoria/>} />
        <Route path="/Subcategoria" exact element={<Subcategoria/>} />
        <Route path="/Busqueda" exact element={<Busqueda/>} />
        </Routes>
      </BrowserRouter>
   </Suspense>
  )
}

export default App

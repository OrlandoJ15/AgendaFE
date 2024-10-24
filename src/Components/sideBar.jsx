import React from 'react';

import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import { BiCategoryAlt } from "react-icons/bi";
import { TbCategoryPlus } from "react-icons/tb";
import { FaSearch } from "react-icons/fa";

////////////////SUB MENUS LATERALES//////////////////
//  AQUI: Se agregan todas las opciones del menu.  // 

export const SidebarData = [
  {
    title: 'Home',
    path: '/Home',
    icon: <AiIcons.AiFillHome/>,
    cName: 'nav-text'
  }, 

  {
    title: 'Login',
    path: '/',
    icon: <AiIcons.AiOutlineTeam/>,
    cName: 'nav-text'
  },  
  {
    title: 'Cliente',
    path: '/Cliente',
    icon: <IoIcons.IoMdConstruct />,
    cName: 'nav-text'
  },

  {
    title: 'Categorias',
    path: '/Categorias',
    icon: <BiCategoryAlt />,
    cName: 'nav-text'
  },

  {
    title: 'SubCategorias',
    path: '/Subcategorias',
    icon: <TbCategoryPlus />,
    cName: 'nav-text'
  },

  {
    title: 'Busqueda',
    path: '/Busqueda',
    icon: <FaSearch />,
    cName: 'nav-text'
  },
];
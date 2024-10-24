//importaciones
import React, { useState, useEffect } from "react";
import axios from "axios";
import MaterialTable from "@material-table/core";
import { Modal, Paper, TextField, Button, Box, useTheme } from "@mui/material";
import { AddBox, DeleteOutline, Edit, Email, Facebook } from "@mui/icons-material";
import { styled } from "@mui/system";
import Swal from "sweetalert2";
import InputGeneral from "../Components/InputGeneral";
import { Columna, ColumnaCenter,Formulario } from "../Components/Formularios";
import "../Styles/Cliente.modal.css";
import { MensajeError } from "../Components/Formularios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';




//////////////////////////INICIA GRID INICIAL//////////////////////////
//////////////////////////INICIA SECCION COLUMNAS///////////////////////////
//columnas que se muestran en el 
const columnas = [
  { title: "Codigo", field: "idCliente" },
  { title: "Nombre", field: "nombre" },
  { title: "Cedula", field: "cedula" },
  { title: "Telefono", field: "telefono" },
  { title: "Telefono 2", field: "telefono2" },
  { title: "Email", field: "email" },
  { title: "Faceboook", field: "facebook" },
  { title: "Instagram", field: "instagram" },
  { title: "Tiktok", field: "tiktok" },
  { title: "LinkedIn", field: "linkedIn" },
  { title: "Pagina Web", field: "website" },
  { title: "Strikes", field: "strikes" },
  { title: "Estado", field: "estado" },
  { title: "Estado Azure", field: "estadoAzure" },
  { title: "Azure URL", field: "azureUrl" },
  { title: "ID Provincia", field: "idProvincia" },
  { title: "Categoria", field: "idCategoria" }
];

//////////////////////////TERMINA SECCION COLUMNAS///////////////////////////
//////////////////////////TERMINA GRID INICIAL//////////////////////////

//////////////////////////INICIA URLs///////////////////////////

const baseUrl = "https://localhost:44366/Cliente/recClientePA";
const baseUrlPost = "https://localhost:44366/Cliente/insClientePA";
const baseUrlPut = "https://localhost:44366/Cliente/modClientePA";
const baseUrlDel = "https://localhost:44366/Cliente/delCliente";
// const baseUrlPostKardex = "https://localhost:44365/api/Cliente/insCliente";

//////////////////////////TERMINA URLs///////////////////////////

//////////////////////////INICIA STYLE///////////////////////////

const StyledModal = styled(Box)(({ theme }) => ({
  position: "absolute",
  width: 400,
  backgroundColor: theme.palette.background.paper,
  border: "2px solid #000",
  boxShadow: theme.shadows[5],
  padding: theme.spacing(2, 4, 3),
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
}));

const StyledInput = styled(TextField)({
  width: "100%",
});

// const useStyles = makeStyles((theme) => ({
//   modal: {
//     position: "absolute",
//     width: 400,
//     backgroundColor: theme.palette.background.paper,
//     border: "2px solid #000",
//     boxShadow: theme.shadows[5],
//     padding: theme.spacing(2, 4, 3),
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//   },
//   iconos: {
//     cursor: "pointer",
//   },
//   inputMaterial: {
//     width: "100%",
//   },
// }));

//////////////////////////TERMINA STYLE///////////////////////////

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

const Cliente = () => {
  //////////////////////////INICIA CONSTANTES - STATE///////////////////////////

  //Agregar los mismos campos de la base de datos
  const [idCliente, setIdCliente] = useState({ campo: "", valido: null });
  const [nombre, setNombre] = useState({ campo: "", valido: null });
  const [cedula, setCedula] = useState({campo: 0, valido: null});
  const [telefono, setTelefono] = useState({ campo: 0, valido: null });
  const [telefono2, setTelefono2] = useState({ campo: 0, valido: null });
  const [email, setEmail] = useState({ campo: "", valido: null });
  const [facebook, setFacebook] = useState({ campo: "", valido: null });
  const [instagram, setInstagram] = useState({ campo: "", valido: null });
  const [tiktok, setTiktok] = useState({ campo: "", valido: null });
  const [linkedIn, setLinkedIn] = useState({ campo: "", valido: null });
  const [website, setWebsite] = useState({ campo: "", valido: null });
  const [strikes, setStrikes] = useState({ campo: 0, valido: null });
  const [estado, setEstado] = useState({ campo: 0, valido: null });
  const [estadoAzure, setEstadoAzure] = useState({ campo: 0, valido: null });
  const [azureURL, setAzureURL] = useState({ campo: "", valido: null });  
  const [idProvincia, setIdProvincia] = useState({ campo: "", valido: null });
  const [idCategoria, setIdCategoria] = useState({ campo: 0, valido: null });

  const [data, setData] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [ClienteSeleccionado, setClienteSeleccionado] = useState({
    idCliente: "",
    nombre: "",
    telefono: "",
    telefono2: "",
    email: "",
    facebook: "",
    instagram:"",
    tiktok:"",
    linkedIn:"",
    website:"",
    strikes: "",
    estado:"",
    estadoAzure:"",
    azureURL:"",
    idProvincia: "",
    idCategoria:"",

  });
  const [formularioValido, setFormularioValido] = useState(null);

  //////////////////////////TERMINA CONSTANTES - STATE///////////////////////////

  /////////////////////////////////////EXPRESIONES//////////////////////////////////

  const expresionesRegulares = {
    idCliente: /^[0-9]{1,40}$/, // solo numero del 0-9
    nombre: /^[a-zA-Z0-9_-\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    cedula: /^[0-9]{1,15}$/, // solo numero del 0-9
    telefono: /^[0-9]{1,40}$/, // solo numero del 0-9
    telefono2: /^[0-9]{1,40}$/, // solo numero del 0-9
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, //formato de  Email electronico
    facebook: /^https:\/\/www\.facebook\.com\/[a-zA-Z0-9.]+(\?mibextid=[a-zA-Z0-9]+)?$/,
    instagram: /^[a-zA-Z0-9_-\s]{1,40}$/,
    tiktok: /^[a-zA-Z0-9_-\s]{1,40}$/,
    linkedIn: /^[a-zA-Z0-9_-\s]{1,40}$/,
    website: /^[a-zA-Z0-9_-\s]{1,40}$/,
    strikes: /^[0-9]{1,}$/,
    estado: /^[0-9]{1,}$/,
    estadoAzure: /^[0-9]{1,}$/,
    azureURL: /^[a-zA-Z0-9_-\s]{1,40}$/,  
    idProvincia: /^[a-zA-Z0-9_-\s]{1,40}$/,
    idCategoria:/^[0-9]{1,15}$/
  };

  /////////////////////////////////////EXPRESIONES//////////////////////////////////

  const theme = useTheme(); // Obteniendo el tema para usar con sx si es necesario

  //MANEJO DEL CAMBIO DE CUALQUIERO PROPIEDAD DEL FORMULARIO
  const handleChange = (e) => {
    const { name, value } = e.target;
    setClienteSeleccionado((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  //MANEJO DEL A OPCION DE SUBMIT DEL FORMULARIO PARA AGREGAR UN NUEVO Cliente

    const onSubmit = (e) => {
      e.preventDefault();

      if (
          idCliente.valido === "true" &&
          nombre.valido === "true" &&
          telefono.valido === "true" &&
          telefono2.valido === "true" &&
          email.valido === "true" &&
          facebook.valido === "true" &&
          instagram.valido === "true" &&
          tiktok.valido === "true" &&
          website.valido === "true" &&
          linkedIn.valido === "true" &&
          strikes.valido === "true" &&
          estado.valido === "true" &&
          estadoAzure.valido === "true" &&
          azureURL.valido === "true" &&        
          idProvincia.valido === "true"&&
          idCategoria.valido === "true"
      ) {
        setFormularioValido(true);
        setIdCliente({ campo: "", valido: "" });
        setNombre({ campo: "", valido: null });
        setCedula({ campo: "", valido: null });
        setTelefono({ campo: "", valido: null });
        setTelefono2({ campo: "", valido: null });
        setEmail({ campo: "", valido: null });
        setFacebook({ campo: "", valido: null });
        setInstagram({ campo: "", valido: null });
        setTiktok({ campo: "", valido: null });
        setLinkedIn({ campo: "", valido: null });
        setWebsite({ campo: "", valido: null });
        setStrikes({ campo: "", valido: null });
        setEstado({ campo: "", valido: null });
        setEstadoAzure({ campo: "", valido: null });
        setAzureURL({ campo: "", valido: null });
        setIdProvincia({ campo: "", valido: null });
        setIdCategoria({ campo: "", valido: null });
      } else {
        setFormularioValido(false);
      }
    };

  ///////////////////////////////////AXIOS FUNCIONES//////////////////////////////

   const endPointClienteXId = "https://localhost:44365/api/Cliente/modCliente" + idCliente.campo;

  ///////////////////////////////////FINALIZA AXIOS FUNCIONES//////////////////////////////

  ////////////////////////////////VALIDACIONES ID/////////////////////////////////

  function ValidarExistenciClienteId() {
    function showError() {
      Swal.fire({
        icon: "error",
        title: "Cuidado",
        text: "Codigo cliente Existente, Intente Nevamente",
      });
    }

    const MetodoValidar = async () => {
      await axios.get(endPointClienteXId).then((response) => {
        const data = response.data;
        if (data === null) {
          setIdCliente({ campo: idCliente.campo, valido: "true" });
        } else {
          setIdCliente({ campo: "", valido: "false" });
          showError();
        }
      });
    };

    MetodoValidar();
  }

  ////////////////////////////////FINALIZA VALIDACIONES ID/////////////////////////////////

  ////////////////////////////PETICION POST/////////////////////////

  function showQuestionPost() {
    Swal.fire({
      title: "Desea Guardar Los Cambios Efectuados?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Guardar",
      denyButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Guardado Correctamente!", "", "success");
        peticionPost();
        //peticionPostKardex();
      } else if (result.isDenied) {
        Swal.fire("Cambios No Guardados", "", "info");
      }
    });
  }

  // const peticionPostKardex = async () => {
  //   const options = {
  //     Serie: Serie.campo,
  //     Numero: Numero.campo,
  //     Nombre: Nombre.campo,
  //     Monto: Monto.campo,
  //     IdCliente: IdCliente.campo,
  //   };

  //   await axios.post(baseUrlPostKardex, options).then((response) => {
  //     setData(data.concat(response.data));
  //     abrirCerrarModalInsertar();
  //   });
  // };

  const peticionPost = async () => {
    const options = {
      nombre: nombre.campo,
      cedula: cedula.campo,
      telefono: telefono.campo,
      telefono2: telefono2.campo,
      email:  email.campo,
      facebook: facebook.campo,
      instagram: instagram.campo,
      tiktok: tiktok.campo,
      linkedIn: linkedIn.campo,
      website: website.campo,
      strikes: strikes.campo,
      estado: estado.campo,
      estadoAzure: estadoAzure.campo,
      azureURL: azureURL.campo,
      idProvincia: idProvincia.campo,
      idCategoria: idCategoria.campo,
    };

    console.log(options); // Agrega esta línea antes de la petición POST

    await axios
      .post(baseUrlPost, options)
      .then((response) => {
        setData(data.concat(response.data));
        abrirCerrarModalInsertar();
      })
      .catch((error) => {
        console.error("Error en la petición POST:", error); // Log para ver detalles del error
      });
  };

  ////////////////////////////FINALIZA PETICION POST/////////////////////////

  ////////////////////////////PETICION PUT//////////////////////////

  function showQuestionPut() {
    Swal.fire({
      title: "Desea Guardar Los Cambios Efectuados?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      denyButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Guardado Correctamente!", "", "success");
        peticionPut();
        //peticionPutKardex();
      } else if (result.isDenied) {
        Swal.fire("Cambios No Guardados", "", "info");
      }
    });
  }

  const peticionPut = async () => {
    const options = {
      idCliente: idCliente.campo,
      nombre: nombre.campo,
      cedula: cedula.campo,
      telefono: telefono.campo,
      telefono2: telefono2.campo,
      email:  email.campo,
      facebook: facebook.campo,
      instagram: instagram.campo,
      tiktok: tiktok.campo,
      linkedIn: tiktok.campo,
      website: website.campo,
      strikes: strikes.campo,
      estado: estado.campo,
      estadoAzure: estadoAzure.campo,
      azureURL: azureURL.campo,
      idProvincia: idProvincia.campo,
      idCategoria: idCategoria.campo,
    };
  console.log(options)

    await axios
      .put(baseUrlPut, options)
      .then((response) => {
        var dataNueva = data;
        dataNueva.map((cliente) => {
          if (cliente.idCliente === options.idCliente) {
            cliente.idCliente = options.idCliente;
            cliente.nombre = options.nombre;
            cliente.cedula = options.cedula;
            cliente.telefono = options.telefono;
            cliente.telefono2 = options.telefono2;
            cliente.email = options.email;
            cliente.facebook = options.facebook;
            cliente.instagram = options.instagram;
            cliente.tiktok= options.tiktok;
            cliente.linkedIn= options.linkedIn;
            cliente.website= options.website;
            cliente.strikes= options.strikes;
            cliente.estado= options.estado;
            cliente.estadoAzure= options.estadoAzure;
            cliente.azureURL= options.azureURL;
            cliente.idProvincia= options.idProvincia;
            cliente.idCategoria= options.idCategoria;
          }
          return dataNueva;
          console.log(dataNueva)
        });

        setData(dataNueva);
        abrirCerrarModalEditar();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  ////////////////////////////FINALIZA PETICION PUT//////////////////////////

  ////////////////////////PETICION DELETE////////////////////////
  function showQuestionDel() {

    Swal.fire({
      title: 'Seguro que desea Eliminar el Articulo?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire('Eliminado Correctamente!', '', 'success')
        peticionDelete();
        //peticionDeleteKardex();
      } else if (result.isDenied) {
        Swal.fire('Cambios NO Guardados', '', 'info')
      }
    });

  }

  const peticionDelete = async () => {
    const options = {
      idCliente: idCliente.campo,
      nombre: nombre.campo,
      cedula: cedula.campo,
      telefono: telefono.campo,
      telefono2: telefono2.campo,
      email:  email.campo,
      facebook: facebook.campo,
      instagram: instagram.campo,
      tiktok: tiktok.campo,
      website: website.campo,
      linkedIn: linkedIn.campo,
      strikes: strikes.campo,
      estado: estado.campo,
      estadoAzure: estadoAzure.campo,
      azureURL: azureURL.campo,
      idProvincia: idProvincia.campo,
      idCategoria: idCategoria.campo,
    };

    const payload = {
      headers: { Authorization: "" },
      data: options,
    };

    await axios
      .delete(baseUrlDel, payload)
      .then((response) => {
        setData(
          data.filter((cliente) => Cliente.idCliente !== options.idCliente)
        );
        abrirCerrarModalEliminar();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  ////////////////////////////FINALIZA PETICION DELETE////////////////////////

  //////////////////////////PETICION SELECT////////////////////////

    const seleccionarCliente = async (Cliente, caso) => {

      
    
      const XCliente = Object.values(...Cliente);
      setIdCliente({ campo: XCliente[0], valido: "true" });
      setNombre({ campo: XCliente[1], valido: "true" });
      setCedula({ campo: XCliente[2], valido: "true" });
      setTelefono({ campo: XCliente[3], valido: "true" });
      setTelefono2({ campo: XCliente[4], valido: "true" });
      setEmail({ campo: XCliente[5], valido: "true" });
      setFacebook({ campo: XCliente[6], valido: "true" });
      setInstagram({ campo: XCliente[7], valido: "true" });
      setTiktok({ campo: XCliente[8], valido: "true" });
      setLinkedIn({ campo: XCliente[9], valido: "true" });
      setWebsite({ campo: XCliente[10], valido: "true" });
      setStrikes({ campo: XCliente[11], valido: "true" });
      setEstado({ campo: XCliente[12], valido: "true" });
      setEstadoAzure({ campo: XCliente[13], valido: "true" });
      setAzureURL({ campo: XCliente[14], valido: "true" });
      setIdProvincia({ campo: XCliente[15], valido: "true" });
      setIdCategoria({ campo: XCliente[16], valido: "true" });
      caso === "Editar" ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
    };

  const peticionGet = async () => {
    await axios.get(baseUrl).then((response) => {
      setData(response.data);
    });
  };



  useEffect(() => {
    peticionGet();
  }, []);

  //////////////////////////FINALIZA PETICION SELECT////////////////////////

  //////////////////////////MODALES////////////////////////

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
  };

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  };

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  };

  //////////////////////////MODALES////////////////////////

  ////////////////////////////CSS SCROLL, MODAL////////////////////////////

  const scrollVertical = {
    width: "70%",
    height: "100%",
    overflowX: "hidden",
    overflowY: "scroll",
    position: "relative",
    backgroundColor: "rgb(255, 255, 255)",
  };

  const modalStyles = {
    position: "fixed",
    top: "50%",
    left: "50%",
    width: "100%",
    height: "100%",
    transform: "translate(-50%, -50%)",
    zIndex: 1040,
    padding: "0 0 0 25%",
  };

  const modalStylesDelete = {
    position: "fixed",
    top: "50%",
    left: "50%",
    width: "100%",
    height: "100%",
    transform: "translate(-50%, -50%)",
    zIndex: 1040,
    padding: "0 0 0 25%",
  };

  const ListStyleButton = {
    margin: "20px 0px 0px 0px",
  };

  const StyleLabelAfterButton = {
    margin: "0px 0px 10px 0px",
  };

  const Text = {
    fontweight: "bold",
  };

  ////////////////////////////CSS SCROLL, MODAL////////////////////////////

  // // const peticionGet = async () => {
  // //   try {
  // //     const response = await axios.get(baseUrl);
  // //     setData(response.data);
  // //   } catch (error) {
  // //     console.error("Error fetching data: ", error);
  // //   }
  // // };

  // const peticionGet = async () => {
  //   await axios.get(baseUrl).then((response) => {
  //     setData(response.data);
  //   });
  // };

  // const peticionPost = async () => {
  //   await axios.post(baseUrl, clienteSeleccionado).then((response) => {
  //     setData(data.concat(response.data));
  //     abrirCerrarModalInsertar();
  //   });
  // };

  // const peticionPut = async () => {
  //   await axios
  //     .put(baseUrl + clienteSeleccionado.IdCliente, clienteSeleccionado)
  //     .then((response) => {
  //       var dataNueva = data;
  //       dataNueva.map((Cliente) => {
  //         if (Cliente.IdCliente === clienteSeleccionado.IdCliente) {
  //           Cliente.Nombre = clienteSeleccionado.Nombre;
  //           Cliente.Cedula = clienteSeleccionado.Cedula;
  //           Cliente.Telefono = clienteSeleccionado.Telefono;
  //           Cliente   Email = clienteSeleccionado   Email;
  //           Cliente.Facebook = clienteSeleccionado.Facebook;
  //         }
  //         return dataNueva;
  //       });
  //       setData(dataNueva);
  //       abrirCerrarModalEditar();
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  // const peticionDelete = async () => {
  //   const payload = {
  //     headers: { Authorization: "" },
  //     data: clienteSeleccionado,
  //   };
  //   await axios
  //     .delete(baseUrl + clienteSeleccionado.IdCliente, payload)
  //     .then((response) => {
  //       setData(
  //         data.filter(
  //           (Cliente) => Cliente.IdCliente !== clienteSeleccionado.IdCliente
  //         )
  //       );
  //       abrirCerrarModalEliminar();
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  /////////////////////////INCLUIR Clientes////////////////////////////

  const bodyInsertar = (
    <div style={scrollVertical} action="" onSubmit={onSubmit}>
      <h3>Incluir Cliente</h3>
      <div className="relleno-general">
        {" "}
        General
        <div className="container-fluid">
          
          <Formulario>
            <Columna>              
              <InputGeneral
                estado={nombre}
                cambiarEstado={setNombre}
                tipo="text"
                label="Nombre"
                placeholder="Introduzca El Nombre De Cliente"
                name="Nombre"
                leyendaError="El Nombre del Cliente solo puede contener letras y espacios."
                expresionRegular={expresionesRegulares.nombre}
                />
              
              <InputGeneral
                estado={cedula}
                cambiarEstado={setCedula}
                tipo="text" label="Cedula" placeholder="Introduzca El Numero de cedula"
                name= "Cedula"
                leyendaError="El numero de cedula debe contener todos los numeros"
                expresionRegular={expresionesRegulares.cedula}
              />

              <InputGeneral
                estado={telefono}
                cambiarEstado={setTelefono}
                tipo="text" label="Telefono" placeholder="Introduzca El Numero de Telefono"
                name= "Telefono"
                leyendaError="El numero de telefono solo puede contener numeros"
                expresionRegular={expresionesRegulares.telefono}
              />

              <InputGeneral
                estado={telefono2}
                cambiarEstado={setTelefono2}
                tipo="text" label="Telefono2" placeholder="Introduzca otro numero de Telefono"
                name= "Telefono2"
                leyendaError="El numero de telefono solo puede contener numeros"
                expresionRegular={expresionesRegulares.telefono}
              />

              <InputGeneral
                estado={email}
                cambiarEstado={setEmail}
                tipo="text" label="Email" placeholder="Introduzca El  Email"
                name= "Email"
                leyendaError="Formato incorrecto"
                expresionRegular={expresionesRegulares.email}
              />

            </Columna>   
            <Columna>   
                                
              <InputGeneral
                estado={facebook}
                cambiarEstado={setFacebook}
                tipo="text" label="Facebook link" placeholder="Introduzca El link de su pagina de Facebook"
                name= "Facebook"
                leyendaError="Formato incorrecto"
                expresionRegular={expresionesRegulares.facebook}
              />   

              <InputGeneral
                estado={instagram}
                cambiarEstado={setInstagram}
                tipo="text" label="Instagram link" placeholder="Introduzca El link de su pagina de Instagram"
                name= "Instagram"
                leyendaError="Formato incorrecto"
                expresionRegular={expresionesRegulares.instagram}
              /> 

              <InputGeneral
                estado={tiktok}
                cambiarEstado={setTiktok}
                tipo="text" label="Tiktok link" placeholder="Introduzca El link de su pagina de Tiktok"
                name= "Tiktok"
                leyendaError="Formato incorrecto"
                expresionRegular={expresionesRegulares.tiktok}
              />   

              <InputGeneral
                estado={linkedIn}
                cambiarEstado={setLinkedIn}
                tipo="text" label="LinkedIn link" placeholder="Introduzca El link de su pagina de LinkedIn"
                name= "LinkedIn"
                leyendaError="Formato incorrecto"
                expresionRegular={expresionesRegulares.LinkedIn}
              /> 

              <InputGeneral
                estado={website}
                cambiarEstado={setWebsite}
                tipo="text" label="Website link" placeholder="Introduzca El link de su pagina Web"
                name= "Website"
                leyendaError="Formato incorrecto"
                expresionRegular={expresionesRegulares.website}
              />   

            </Columna>   
            <Columna>   
              <InputGeneral
                estado={strikes}
                cambiarEstado={setStrikes}
                tipo="text" label="Strikes" placeholder="Introduzca el numero de strikes"
                name= "Strikes"
                leyendaError="Formato incorrecto"
                expresionRegular={expresionesRegulares.strikes}
              />   
              <InputGeneral
                estado={estado}
                cambiarEstado={setEstado}
                tipo="text" label="Estado" placeholder="Introduzca El Estado del usuario"
                name= "Estado"
                leyendaError="Formato incorrecto"
                expresionRegular={expresionesRegulares.estado}
              />   

              <InputGeneral
                estado={estadoAzure}
                cambiarEstado={setEstadoAzure}
                tipo="text" label="Estado de Azure" placeholder="Introduzca El Estado de Azure"
                name= "Estado Azure"
                leyendaError="Formato incorrecto"
                expresionRegular={expresionesRegulares.estadoAzure}
              />   

              <InputGeneral
                estado={azureURL}
                cambiarEstado={setAzureURL}
                tipo="text" label="Azure link" placeholder="Introduzca El link de Azure"
                name= "Azure URL"
                leyendaError="Formato incorrecto"
                expresionRegular={expresionesRegulares.azureURL}
              />   

            </Columna>

            <InputGeneral
                estado={idProvincia}
                cambiarEstado={setIdProvincia}
                tipo="text" label="Provincia" placeholder="Introduzca El nombre de la Provincia"
                name= "Provincia"
                leyendaError="Formato incorrecto"
                expresionRegular={expresionesRegulares.idProvincia}
              />   

            <InputGeneral
                estado={idCategoria}
                cambiarEstado={setIdCategoria}
                tipo="text" label="Categoria" placeholder="Introduzca El Nombre de la categoria"
                name= "Categoria"
                leyendaError="Formato incorrecto"
                expresionRegular={expresionesRegulares.idCategoria}
            />   
          </Formulario>
        </div>
      </div>
      {
      formularioValido === false && <MensajeError>
        <p>
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <b>Error:</b> Por favor rellena el formulario correctamente.
        </p>
      </MensajeError>
      }

      <div align="right">
        <Button color="success" onClick={() => abrirCerrarModalInsertar()}> Cancelar </Button>
        <Button color="success" onClick={() => showQuestionPost()} type="submit">
          Insertar
        </Button>
        {formularioValido === true && <MensajeExito>Formulario enviado exitosamente!</MensajeExito>}
      </div>
    </div>
  );

  const bodyEditar = (

    <div style={scrollVertical} action="" onSubmit={onSubmit}>

      <h3>Modificar Cliente</h3>

      <div className="relleno-general" > General

        <div className="container-fluid">

          <Formulario>

           <Columna>

             <InputGeneral
               estado={idCliente}
               cambiarEstado={setIdCliente}
               tipo="text"
               label="Id"
               placeholder="Identificador"
               name="IdCliente"
               leyendaError="El Id del Cliente solo contiene numeros"
               expresionRegular={expresionesRegulares.idCliente}
               value={idCliente.campo}
              />

              <InputGeneral
               estado={nombre}
               cambiarEstado={setNombre}
               tipo="text"
               label="Nombre"
               placeholder="Nombre"
               name="Nombre"
               leyendaError="El Nombre del Cliente solo contiene letras"
               expresionRegular={expresionesRegulares.nombre}
               value={nombre.campo}
              />

              <InputGeneral
               estado={cedula}
               cambiarEstado={setCedula}
               tipo="text"
               label="Cedula"
               placeholder="Cedula"
               name="Cedula"
               leyendaError="El Numero De Cedula Solo Contiene Numeros"
               expresionRegular={expresionesRegulares.cedula}
               value={cedula.campo}
              />

              <InputGeneral
               estado={telefono}
               cambiarEstado={setTelefono}
               tipo="text"
               label="Telefono"
               placeholder="Telefono"
               name="Telefono"
               leyendaError="El numero de telefono solo contiene numeros"
               expresionRegular={expresionesRegulares.telefono}
               value={telefono.campo}
              />

              <InputGeneral
                estado={telefono2}
                cambiarEstado={setTelefono2}
                tipo="text" 
                label="Telefono2" 
                placeholder="Introduzca otro numero de Telefono"
                name= "Telefono2"
                leyendaError="El numero de telefono solo puede contener numeros"
                expresionRegular={expresionesRegulares.telefono2}
                value={telefono2.campo}
              />

              <InputGeneral
               estado={email}
               cambiarEstado={setEmail}
               tipo="text"
               label="Email"
               placeholder="Email"
               name="Email"
               leyendaError="Digite el correo correctamente"
               expresionRegular={expresionesRegulares.email}
               value={email.campo}
              />

              <InputGeneral
               estado={facebook}
               cambiarEstado={setFacebook}
               tipo="text"
               label="Facebook"
               placeholder="Facebook"
               name="Facebook"
               leyendaError="Digite el link correctamente"
               expresionRegular={expresionesRegulares.facebook}
               value={facebook.campo}
              />

              <InputGeneral
                estado={instagram}
                cambiarEstado={setInstagram}
                tipo="text" 
                label="Instagram link" 
                placeholder="Introduzca El link de su pagina de Instagram"
                name= "Instagram"
                leyendaError="Formato incorrecto"
                expresionRegular={expresionesRegulares.instagram}
                value={instagram.campo}
              /> 

              <InputGeneral
                estado={tiktok}
                cambiarEstado={setTiktok}
                tipo="text" 
                label="Tiktok link" 
                placeholder="Introduzca El link de su pagina de Tiktok"
                name= "Tiktok"
                leyendaError="Formato incorrecto"
                expresionRegular={expresionesRegulares.tiktok}
                value={tiktok.campo}
              />   

              <InputGeneral
                estado={linkedIn}
                cambiarEstado={setLinkedIn}
                tipo="text" 
                label="LinkedIn link" 
                placeholder="Introduzca El link de su pagina de LinkedIn"
                name= "LinkedIn"
                leyendaError="Formato incorrecto"
                expresionRegular={expresionesRegulares.linkedIn}
                value={linkedIn.campo}
              /> 

              <InputGeneral
                estado={website}
                cambiarEstado={setWebsite}
                tipo="text" 
                label="Website link" 
                placeholder="Introduzca El link de su pagina Web"
                name= "Website"
                leyendaError="Formato incorrecto"
                expresionRegular={expresionesRegulares.website}
                value={website.campo}
              />   
              <InputGeneral
                estado={strikes}
                cambiarEstado={setStrikes}
                tipo="text" 
                label="Strikes" 
                placeholder="Introduzca el numero de strikes"
                name= "Strikes"
                leyendaError="Formato incorrecto"
                expresionRegular={expresionesRegulares.strikes}
                value={strikes.campo}
              />   
              <InputGeneral
                estado={estado}
                cambiarEstado={setEstado}
                tipo="text" 
                label="Estado" 
                placeholder="Introduzca El Estado del usuario"
                name= "Estado"
                leyendaError="Formato incorrecto"
                expresionRegular={expresionesRegulares.estado}
                value={estado.campo}
              />   

              <InputGeneral
                estado={estadoAzure}
                cambiarEstado={setEstadoAzure}
                tipo="text" 
                label="Estado de Azure" 
                placeholder="Introduzca El Estado de Azure"
                name= "Estado Azure"
                leyendaError="Formato incorrecto"
                expresionRegular={expresionesRegulares.estadoAzure}
                value={estadoAzure.campo}
              />   

              <InputGeneral
                estado={azureURL}
                cambiarEstado={setAzureURL}
                tipo="text" 
                label="Azure link" 
                placeholder="Introduzca El link de Azure"
                name= "Azure URL"
                leyendaError="Formato incorrecto"
                expresionRegular={expresionesRegulares.azureURL}
                value={azureURL.campo}
              />   

              <InputGeneral
                estado={idCategoria}
                cambiarEstado={setIdCategoria}
                tipo="text" 
                label="Categoria" 
                placeholder="Introduzca El Nombre de la categoria"
                name= "Categoria"
                leyendaError="Formato incorrecto"
                expresionRegular={expresionesRegulares.idCategoria}
                value={idCategoria.campo}
              />              

              <InputGeneral
                estado={idProvincia}
                cambiarEstado={setIdProvincia}
                tipo="text" 
                label="Provincia" 
                placeholder="Introduzca El nombre de la Provincia"
                name= "Provincia"
                leyendaError="Formato incorrecto"
                expresionRegular={expresionesRegulares.idProvincia}
                value={idProvincia.campo}
              />   
           </Columna>
            
          </Formulario>

        </div>

      </div>

    {formularioValido === false && <MensajeError>
        <p>
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <b>Error:</b> Por favor rellena el formulario correctamente.
        </p>
      </MensajeError>}

      <div align="right">
        <Button onClick={() => abrirCerrarModalEditar()}> Cancelar </Button>
        <Button color="primary" onClick={() => showQuestionPut()}>
         Editar
        </Button>
      </div>
    </div >
 );
  
  

   const bodyEliminar = (
    <div action="" onSubmit={onSubmit}>

      <h3>Eliminar Articulo</h3>

      <div className="relleno-general" > General

        <div className="container-fluid">

          <Formulario>

            <Columna>

              <InputGeneral
                estado={idCliente}
                cambiarEstado={setIdCliente}
                tipo="text"
                label="Id del Cliente"
                placeholder="Identifier"
                name="IdCliente"
                leyendaError="El Codigo del Articulo NO puede ser repetido y solo puede contener numeros, letras y guion bajo. (Maximo 16 caracteres)"
                expresionRegular={expresionesRegulares.idCliente}
                value={idCliente.campo}
              />
            </Columna>
          </Formulario>
        </div>
      </div>
      {formularioValido === false && <MensajeError>
        <p>
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <b>Error:</b> Por favor rellena el formulario correctamente.
        </p>
      </MensajeError>}

      <div align="right">
        <Button onClick={() => abrirCerrarModalEliminar()}  color="success"> Cancelar </Button>
        <Button color="success" onClick={() => showQuestionDel()}>
          Eliminar
        </Button>
      </div>
    </div>
  );

  return (

    <div className="Cliente">
      <div className="banner">
        <h3>
          <b>Clientes</b>
        </h3>
      </div>
      <div className="btn-accion">
        <Button
          startIcon={<AddBox />}
          onClick={() => abrirCerrarModalInsertar()}
        >
          Agregar Cliente
        </Button>    
      </div>

      <br />
      <br />
      
      <MaterialTable
        columns={columnas}
        data={data}
        title="Clientes"
        actions={[
          {
            icon: Edit,
            tooltip: "Modificar Cliente",
            onClick: (event, rowData) => seleccionarCliente(rowData, "Editar"),
          },
          {
            icon: DeleteOutline,
            tooltip: "Eliminar Articulo",
            onClick: (event, rowData) => seleccionarCliente(rowData, "Eliminar"),
          },
        ]}
        options={{
          actionsColumnIndex: -1,
          exportButton: true,
          columnsButton: true,
          headerStyle: { backgroundColor: "green" },
          selection: true,
        }}
        localization={{
          header: { actions: "Acciones" },
          toolbar: { searchPlaceholder: "Busqueda" },
        }}
        
      />

      <Modal open={modalInsertar} onClose={abrirCerrarModalInsertar} style={modalStyles}>
        {bodyInsertar}
      </Modal>
      <Modal open={modalEditar} onClose={abrirCerrarModalEditar} style={modalStyles}>
        {bodyEditar}
      </Modal>
      <Modal open={modalEliminar} onClose={abrirCerrarModalEliminar} style={modalStylesDelete}>
        {bodyEliminar}
      </Modal>
    </div>
  );
};

export default Cliente;

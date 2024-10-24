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


  return (

    <div className="Cliente">
      <div className="banner">
        <h3>
          <b>Clientes</b>
        </h3>
      </div>

      <br />
      <br />
      
      <MaterialTable
        columns={columnas}
        data={data}
        title="Clientes"
        actions={[
          
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
    </div>
  );
};

export default Cliente;

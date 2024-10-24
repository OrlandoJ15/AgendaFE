import React, { useState, useEffect } from "react";
import InputGeneral from "../Components/InputGeneral";
import { Columna, ColumnaCenter,Formulario } from "../Components/Formularios";
import { Modal, Paper, TextField, Button, Box, useTheme } from "@mui/material";
import MaterialTable from "@material-table/core";
import { AddBox, DeleteOutline, Edit, Email, Facebook } from "@mui/icons-material";
import { styled } from "@mui/system";
import axios from "axios";
import Swal from "sweetalert2";

const columnas = [
    { title: "Id Categoria", field: "idCategoria" },
    { title: "Nombre", field: "nombre" },
  ];


  const baseUrl = "https://localhost:44366/Catergoria/recCategoriaPA";
  const baseUrlPost = "https://localhost:44366/Catergoria/insCategoriaPA";
  const baseUrlPut = "https://localhost:44366/Catergoria/modCategoriaPA";
  const baseUrlDel = "https://localhost:44366/Catergoria/delCategoriaPA";
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
  
  const Categorias=() =>{ 
    //////////////////////////INICIA CONSTANTES - STATE///////////////////////////
  
    //Agregar los mismos campos de la base de datos
    const [idCategoria, setIdCategoria] = useState({ campo: "", valido: null });
    const [nombre, setNombre] = useState({ campo: "", valido: null });
  
    const [data, setData] = useState([]);
    const [modalInsertar, setModalInsertar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [CategoriaSeleccionada, setCategoriaSeleccionada] = useState({
      idCategoria: "",
      nombre: "",
    });
    const [formularioValido, setFormularioValido] = useState(null);
  
    //////////////////////////TERMINA CONSTANTES - STATE///////////////////////////
  
    /////////////////////////////////////EXPRESIONES//////////////////////////////////
  
    const expresionesRegulares = {
      idCategoria: /^[0-9]{1,40}$/, // solo numero del 0-9
      nombre: /^[a-zA-Z0-9_-\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    };
  
    /////////////////////////////////////EXPRESIONES//////////////////////////////////
  
    const theme = useTheme(); // Obteniendo el tema para usar con sx si es necesario
  
    //MANEJO DEL CAMBIO DE CUALQUIERO PROPIEDAD DEL FORMULARIO
    const handleChange = (e) => {
      const { name, value } = e.target;
      setCategoriaSeleccionada((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
  
    //MANEJO DEL A OPCION DE SUBMIT DEL FORMULARIO PARA AGREGAR UN NUEVO Cliente
  
      const onSubmit = (e) => {
        e.preventDefault();
  
        if (
            idCategoria.valido === "true" &&
            nombre.valido === "true"
        ) {
          setFormularioValido(true);
          setIdCategoria({ campo: "", valido: "" });
          setNombre({ campo: "", valido: null });
        } else {
          setFormularioValido(false);
        }
      };
  
    ///////////////////////////////////AXIOS FUNCIONES//////////////////////////////
  
     const endPointCategoriaXId = "https://localhost:44366/Catergoria/modCategoriaPA" + idCategoria.campo;
  
    ///////////////////////////////////FINALIZA AXIOS FUNCIONES//////////////////////////////
  
    ////////////////////////////////VALIDACIONES ID/////////////////////////////////
  
    function ValidarExistenciCategoriaId() {
      function showError() {
        swal.fire({
          icon: "error",
          title: "Cuidado",
          text: "Codigo categoria Existente, Intente Nevamente",
        });
      }
  
      const MetodoValidar = async () => {
        await axios.get(endPointCategoriaXId).then((response) => {
          const data = response.data;
          if (data === null) {
            setIdCategoria({ campo: idCategoria.campo, valido: "true" });
          } else {
            setIdCategoria({ campo: "", valido: "false" });
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
        nombre: nombre.campo
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
        idCategoria: idCategoria.campo,
        nombre: nombre.campo,        
      };
    console.log(options)
  
      await axios
        .put(baseUrlPut, options)
        .then((response) => {
          var dataNueva = data;
          dataNueva.map((Categoria) => {
            if (Categoria.idCategoria === options.idCategoria) {
              Categoria.idCategoria = options.idCategoria;
              Categoria.nombre = options.nombre;
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
        idCategoria: idCategoria.campo,
        nombre: nombre.campo,       
      };
  
      const payload = {
        headers: { Authorization: "" },
        data: options,
      };
  
      await axios
        .delete(baseUrlDel, payload)
        .then((response) => {
          setData(
            data.filter((Categoria) => Categoria.idCategoria !== options.idCategoria)
          );
          abrirCerrarModalEliminar();
        })
        .catch((error) => {
          console.log(error);
        });
    };
  
    ////////////////////////////FINALIZA PETICION DELETE////////////////////////
  
    //////////////////////////PETICION SELECT////////////////////////
  
      const seleccionarCategoria = async (Categoria, caso) => {
  
        
      
        const XCategoria = Object.values(...Categoria);
        setIdCategoria({ campo: XCategoria[0], valido: "true" });
        setNombre({ campo: XCategoria[1], valido: "true" });
        caso === "Editar" ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
      };
  
    const peticionGet = async () => {
      await axios.get(baseUrl).then((response) => {
        setData(response.data);
      });
    };
  
    useEffect(() => {
      peticionGet();
    }, [data]);
  
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
  
    /*const scrollVertical = {
      width: "70%",
      height: "100%",
      overflowX: "hidden",
      overflowY: "scroll",
      position: "relative",
      backgroundColor: "rgb(255, 255, 255)",
    };*/
  
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
  
    /////////////////////////INCLUIR ARTICULOS////////////////////////////
  
    const bodyInsertar = (
      <div action="" onSubmit={onSubmit}>
        <h3>Incluir Categoria</h3>
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
                  placeholder="Introduzca El Nombre De la categoria"
                  name="Nombre"
                  leyendaError="El Nombre de la categoria solo puede contener letras y espacios."
                  expresionRegular={expresionesRegulares.nombre}
                  />             
                 
              </Columna>
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
  
      <div action="" onSubmit={onSubmit}>
  
        <h3>Modificar Categoria</h3>
  
        <div className="relleno-general" > General
  
          <div className="container-fluid">
  
            <Formulario>
  
             <Columna>
  
               <InputGeneral
                 estado={idCategoria}
                 cambiarEstado={setIdCategoria}
                 tipo="text"
                 label="Id"
                 placeholder="Identificador"
                 name="Id_Categoria"
                 leyendaError="El Id de la categoria solo contiene numeros"
                 expresionRegular={expresionesRegulares.idCategoria}
                 value={idCategoria.campo}
                />
  
                <InputGeneral
                 estado={nombre}
                 cambiarEstado={setNombre}
                 tipo="text"
                 label="Nombre"
                 placeholder="Nombre"
                 name="Nombre"
                 leyendaError="El Nombre de la categoria solo contiene letras"
                 expresionRegular={expresionesRegulares.nombre}
                 value={nombre.campo}
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
                  estado={idCategoria}
                  cambiarEstado={setIdCategoria}
                  tipo="text"
                  label="Id de la categoria"
                  placeholder="Identifier"
                  name="IdCategoria"
                  leyendaError="El Codigo del Articulo NO puede ser repetido y solo puede contener numeros, letras y guion bajo. (Maximo 16 caracteres)"
                  expresionRegular={expresionesRegulares.idCategoria}
                  value={idCategoria.campo}
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
      <div className="Categorias">
        <div className="banner">
          <h3>
            <b>Categorias</b>
          </h3>
        </div>
        <div className="btn-accion">
        <Button
          startIcon={<AddBox />}
          onClick={() => abrirCerrarModalInsertar()}
        >
          Agregar Categoria
        </Button>    
      </div>
      <br />
      <br />
      
      <MaterialTable
        columns={columnas}
        data={data}
        title="Categoria"
        actions={[
          {
            icon: Edit,
            tooltip: "Modificar Categoria",
            onClick: (event, rowData) => seleccionarCategoria(rowData, "Editar"),
          },
          {
            icon: DeleteOutline,
            tooltip: "Eliminar Articulo",
            onClick: (event, rowData) => seleccionarCategoria(rowData, "Eliminar"),
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
      <Modal open={modalInsertar} onClose={abrirCerrarModalInsertar}>
      {bodyInsertar}
      </Modal>
      <Modal open={modalEditar} onClose={abrirCerrarModalEditar}>
      {bodyEditar}
      </Modal>
      <Modal open={modalEliminar} onClose={abrirCerrarModalEliminar}>
      {bodyEliminar}
      </Modal>
    </div>

  
    );
};

export default Categorias;
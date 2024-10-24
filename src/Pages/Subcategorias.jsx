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
    { title: "Id Subcategoria", field: "idSubCategoria" },
    { title: "Nombre", field: "nombre" },
    { title: "Id Categoria", field: "idCategoria" },
  ];


  const baseUrl = "https://localhost:44366/SubCatergoria/recSubCategoriaPA";
  const baseUrlPost = "https://localhost:44366/SubCatergoria/insSubCategoriaPA";
  const baseUrlPut = "https://localhost:44366/SubCatergoria/modSubCategoriaPA";
  const baseUrlDel = "https://localhost:44365/api/Cliente/delCliente";
  const baseUrlPostKardex = "https://localhost:44366/SubCatergoria/delSubCategoriaPA";
  
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
  
  const Subcategorias=() =>{ 
    //////////////////////////INICIA CONSTANTES - STATE///////////////////////////
  
    //Agregar los mismos campos de la base de datos
    const [idSubCategoria, setIdSubCategoria] = useState({ campo: "", valido: null });
    const [nombre, setNombre] = useState({ campo: "", valido: null });
    const [idCategoria, setIdCategoria] = useState({ campo: "", valido: null });
  
    const [data, setData] = useState([]);
    const [modalInsertar, setModalInsertar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [SubCategoriaSeleccionada, setSubCategoriaSeleccionada] = useState({
      idSubCategoria: "",
      nombre: "",
      idCategoria: "",
    });
    const [formularioValido, setFormularioValido] = useState(null);
  
    //////////////////////////TERMINA CONSTANTES - STATE///////////////////////////
  
    /////////////////////////////////////EXPRESIONES//////////////////////////////////
  
    const expresionesRegulares = {
      idSubCategoria: /^[0-9]{1,40}$/, // solo numero del 0-9
      nombre: /^[a-zA-Z0-9_-\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
      idCategoria: /^[0-9]{1,40}$/,
    };
  
    /////////////////////////////////////EXPRESIONES//////////////////////////////////
  
    const theme = useTheme(); // Obteniendo el tema para usar con sx si es necesario
  
    //MANEJO DEL CAMBIO DE CUALQUIERO PROPIEDAD DEL FORMULARIO
    const handleChange = (e) => {
      const { name, value } = e.target;
      setSubCategoriaSeleccionada((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
  
    //MANEJO DEL A OPCION DE SUBMIT DEL FORMULARIO PARA AGREGAR UN NUEVO Cliente
  
      const onSubmit = (e) => {
        e.preventDefault();
  
        if (
            idSubCategoria.valido === "true" &&
            nombre.valido === "true"&&
            idCategoria.valido === "true"
        ) {
          setFormularioValido(true);
          setIdSubCategoria({ campo: "", valido: "" });
          setNombre({ campo: "", valido: null });
          setIdCategoria({ campo: "", valido: "" });
        } else {
          setFormularioValido(false);
        }
      };
  
    ///////////////////////////////////AXIOS FUNCIONES//////////////////////////////
  
     const endPointSubCategoriaXId = "https://localhost:44365/api/Cliente/modCliente" + idSubCategoria.campo;
  
    ///////////////////////////////////FINALIZA AXIOS FUNCIONES//////////////////////////////
  
    ////////////////////////////////VALIDACIONES ID/////////////////////////////////
  
    function ValidarExistenciSubCategoriaId() {
      function showError() {
        Swal.fire({
          icon: "error",
          title: "Cuidado",
          text: "Codigo Subcategoria Existente, Intente Nevamente",
        });
      }
  
      const MetodoValidar = async () => {
        await axios.get(endPointSubCategoriaXId).then((response) => {
          const data = response.data;
          if (data === null) {
            setIdSubCategoria({ campo: idSubCategoria.campo, valido: "true" });
          } else {
            setIdSubCategoria({ campo: "", valido: "false" });
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
        idCategoria: idCategoria.campo
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
        idSubCategoria: idSubCategoria.campo,
        nombre: nombre.campo,        
        idCategoria: idCategoria.campo,
      };
    console.log(options)
  
      await axios
        .put(baseUrlPut, options)
        .then((response) => {
          var dataNueva = data;
          dataNueva.map((SubCategoria) => {
            if (SubCategoria.idSubCategoria === options.idSubCategoria) {
              SubCategoria.idSubCategoria = options.idSubCategoria;
              SubCategoria.nombre = options.nombre;
              SubCategoria.idCategoria = options.idCategoria;
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
        idSubCategoria: idSubCategoria.campo,
        nombre: nombre.campo,
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
            data.filter((SubCategoria) => SubCategoria.idSubCategoria !== options.idSubCategoria)
          );
          abrirCerrarModalEliminar();
        })
        .catch((error) => {
          console.log(error);
        });
    };
  
    ////////////////////////////FINALIZA PETICION DELETE////////////////////////
  
    //////////////////////////PETICION SELECT////////////////////////
  
      const seleccionarSubCategoria = async (SubCategoria, caso) => {
  
        
      
        const XSubCategoria = Object.values(...SubCategoria);
        setIdSubCategoria({ campo: XSubCategoria[0], valido: "true" });
        setNombre({ campo: XSubCategoria[1], valido: "true" });
        setIdCategoria({ campo: XSubCategoria[2], valido: "true" });
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
        <h3>Incluir SubCategoria</h3>
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
                  placeholder="Introduzca El Nombre De la Subcategoria"
                  name="Nombre"
                  leyendaError="El Nombre de la Subcategoria solo puede contener letras y espacios."
                  expresionRegular={expresionesRegulares.nombre}
                  />

                <InputGeneral
                  estado={idCategoria}
                  cambiarEstado={setIdCategoria}
                  tipo="text"
                  label="ID Categoria"
                  placeholder="Introduzca El ID de la categoria"
                  name="Id Categoria"
                  leyendaError="El ID solo puede contener numeros"
                  expresionRegular={expresionesRegulares.idCategoria}
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
  
        <h3>Modificar SubCategoria</h3>
  
        <div className="relleno-general" > General
  
          <div className="container-fluid">
  
            <Formulario>
  
             <Columna>
  
               <InputGeneral
                 estado={idSubCategoria}
                 cambiarEstado={setIdSubCategoria}
                 tipo="text"
                 label="Id sub categoia"
                 placeholder="Identificador"
                 name="Id_SubCategoria"
                 leyendaError="El Id de la Subcategoria solo contiene numeros"
                 expresionRegular={expresionesRegulares.idSubCategoria}
                 value={idSubCategoria.campo}
                />
  
                <InputGeneral
                 estado={nombre}
                 cambiarEstado={setNombre}
                 tipo="text"
                 label="Nombre"
                 placeholder="Nombre"
                 name="Nombre"
                 leyendaError="El Nombre de la subcategoria solo contiene letras"
                 expresionRegular={expresionesRegulares.nombre}
                 value={nombre.campo}
                />

                <InputGeneral
                 estado={idCategoria}
                 cambiarEstado={setIdCategoria}
                 tipo="text"
                 label="Id categoria"
                 placeholder="Identificador"
                 name="Id Categoria"
                 leyendaError="El Id de la categoria solo contiene numeros"
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
                  estado={idSubCategoria}
                  cambiarEstado={setIdSubCategoria}
                  tipo="text"
                  label="Id de la Subcategoria"
                  placeholder="Identifier"
                  name="IdSubCategoria"
                  leyendaError="El Codigo del Articulo NO puede ser repetido y solo puede contener numeros, letras y guion bajo. (Maximo 16 caracteres)"
                  expresionRegular={expresionesRegulares.idSubCategoria}
                  value={idSubCategoria.campo}
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
      <div className="SubCategorias">
        <div className="banner">
          <h3>
            <b>Subcategorias</b>
          </h3>
        </div>
        <div className="btn-accion">
        <Button
          startIcon={<AddBox />}
          onClick={() => abrirCerrarModalInsertar()}
        >
          Agregar SubCategoria
        </Button>    
      </div>
      <br />
      <br />
      
      <MaterialTable
        columns={columnas}
        data={data}
        title="SubCategoria"
        actions={[
          {
            icon: Edit,
            tooltip: "Modificar SubCategoria",
            onClick: (event, rowData) => seleccionarSubCategoria(rowData, "Editar"),
          },
          {
            icon: DeleteOutline,
            tooltip: "Eliminar Articulo",
            onClick: (event, rowData) => seleccionarSubCategoria(rowData, "Eliminar"),
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

export default Subcategorias;
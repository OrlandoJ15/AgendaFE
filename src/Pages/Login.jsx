// src/components/Login.jsx
import React from "react";
import "../Styles/Login.css";
import logo from "../Img/Agenda.png";
import axios from "axios";
import Cookies from "universal-cookie";

const baseUrl = "http://localhost/ApiBabilonia/api/Usuario/";
const cookies = new Cookies();

class Login extends React.Component {
  state = {
    form: {
      Cod_Usuario: "",
      Clave: "",
    },
    error: false,
    errorMsj: "",
  };

  manejadorSubmit = (e) => {
    e.preventDefault();
    this.iniciarSesion();
  };

  handleChange = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  iniciarSesion = async () => {
    try {
      const response = await axios.get(baseUrl, {
        params: {
          Cod_Usuario: this.state.form.Cod_Usuario,
          Clave: this.state.form.Clave,
        },
      });

      if (response.data.length > 0) {
        const respuesta = response.data[0];
        cookies.set("Cod_Usuario", respuesta.Cod_Usuario, { path: "/" });
        cookies.set("Clave", respuesta.Clave, { path: "/" });
        alert("Bienvenido");
        window.location.href = "./Home";
      } else {
        alert("El usuario o la contraseña no son correctos");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Ocurrió un error. Por favor, inténtalo de nuevo.");
    }
  };

  componentDidMount() {
    if (cookies.get("Cod_Usuario")) {
      window.location.href = "./Home";
    }
  }

  render() {
    return (
      <div className="wrapper fadeInDown">
        <div id="formContent">
          <div className="fadeIn first">
            <img src={logo} width="100px" alt="User Icon" />
          </div>

          <form onSubmit={this.manejadorSubmit}>
            <input
              type="text" // Changed to "text" for the username input
              className="fadeIn second"
              name="Cod_Usuario"
              placeholder="Usuario"
              onChange={this.handleChange}
            />
            <input
              type="password"
              className="fadeIn third"
              name="Clave"
              placeholder="Password"
              onChange={this.handleChange}
            />
            <input type="submit" className="fadeIn fourth" value="Log In" />
          </form>
        </div>
      </div>
    );
  }
}

export default Login;

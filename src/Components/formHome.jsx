import React from 'react';
import '../Styles/home.css'
import MaterialTable from "@material-table/core";
import ReactImg from'../assets/react.svg'

const columnas = [
    { title: "Empresa", field: "empresa1", image: ReactImg },
    { title: "Empresa", field: "empresa2" },
    { title: "Empresa", field: "empresa3" },
  ];

const FormHome= () => {
    return (
    <div className="Cliente">
          
      <MaterialTable
        columns={columnas}
        title="Empresas sugeridas"
        options={{
          headerStyle: { backgroundColor: "green"},
        }}
               
      />
      
    </div>

    );
}
export default FormHome;

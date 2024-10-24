// src/components/ListaCliente.jsx
import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import MaterialTable from '@material-table/core';

function ListaCliente({ ListaClienteIdSeleccionado }) {
    const [state, setState] = useState({ abierto: false });
    const [products, setProducts] = useState([]);
    const [productsCant, setProductsCant] = useState(0);
    const [rowSelection, setRowSelection] = useState([]);

    const abrirModal = () => {
        setState({ abierto: !state.abierto });
    };

    const enviar = () => {
        ListaClienteIdSeleccionado(rowSelection[0]?.id_cliente);
        abrirModal();
    };

    const endpoint = 'https://localhost:44392/api/Cliente/recClientes';

    const getData = async () => {
        try {
            const response = await axios.get(endpoint);
            const data = response.data;
            setProducts(data);
            setProductsCant(data.length);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const columns = [
        { field: "id_cliente", title: "Cliente", width: 100, textalign: 'center' },
        { field: "nombre", title: "Nombre", width: 250 },
    ];

    const modalStyles = {
        width: '50%',
        height: '75%',
        position: 'fixed',
        top: '75%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    };

    const ListStyleButton = {
        margin: '5% 0px 0px 30%',
    };

    return (
        <div>
            <div className="principal">
                <div className="secundario">
                    <Button style={ListStyleButton} color="success" onClick={abrirModal}>Clientes</Button>
                </div>
            </div>

            <div>
                <Modal isOpen={state.abierto} style={modalStyles}>
                    <ModalHeader>
                        Lista de Clientes
                    </ModalHeader>
                    <ModalBody>
                        <MaterialTable
                            columns={columns}
                            data={products}
                            getRowId={(row) => row.id_cliente}
                            options={{
                                actionsColumnIndex: -1,
                                exportButton: true,
                                exportAllData: true,
                                columnsButton: true,
                                headerStyle: { backgroundColor: "lightgrey" },
                                selection: true,
                                showTextRowsSelected: false,
                                showSelectAllCheckbox: false,
                                showTitle: false,
                                searchFieldAlignment: "left",
                                paging: false,
                                maxBodyHeight: 300,
                            }}
                            localization={{
                                toolbar: {
                                    searchPlaceholder: "Busqueda",
                                    addRemoveColumns: "Agrega o remover columnas",
                                },
                            }}
                            onSelectionChange={(rows) => {
                                setRowSelection(rows);
                            }}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Label>Total: {productsCant}</Label>
                        <Button color="secondary" onClick={enviar}>Enviar</Button>
                        <Button color="secondary" onClick={abrirModal}>Cerrar</Button>
                    </ModalFooter>
                </Modal>
            </div>
        </div>
    );
}

export default ListaCliente;

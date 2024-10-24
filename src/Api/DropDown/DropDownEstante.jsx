// src/components/DropDownEstante.jsx
import React, { Fragment, useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { CircularProgress } from '@material-ui/core';
import { fetchData } from '../fetchData';

function sleep(delay = 0) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

const DropDownEstante = ({ actualizarEstante }) => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const loading = open && options.length === 0;

    const apiData = fetchData("https://localhost:44392/api/Estante/recEstantes");

    const data = apiData.read();

    useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            await sleep(1000); // For demo purposes.

            if (active) {
                setOptions([...data]);
            }
        })();

        return () => {
            active = false;
        };
    }, [loading]);

    useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    return (
        <Autocomplete
            id="Estante"
            sx={{ width: 300 }}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            isOptionEqualToValue={(option, value) => option.nombre === value.nombre}
            getOptionLabel={(option) => option.nombre}
            options={options}
            loading={loading}
            onChange={(event, value) => actualizarEstante(value && value)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Estante"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </Fragment>
                        ),
                    }}
                />
            )}
        />
    );
};

export default DropDownEstante;

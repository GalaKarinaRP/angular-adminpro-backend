require('dotenv').config();

const express = require('express');
const cors = require('cors');


const { dbConnection } = require('./database/config');

//Crear servidor express

const app = express();

//Conexion a la base de datos

dbConnection();

//Configurar CORS
app.use( cors() );

//Parseo y lectura del body

app.use( express.json());

//Rutas

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/upload', require('./routes/uploads'));


//Directorio publico

app.use( express.static('public') );




app.listen(process.env.PORT, () =>{
    console.log('servidor corriendo en puerto ' + process.env.PORT);
});


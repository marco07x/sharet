const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

//Crear el servidor
const app = express();

//Restrinir acceso api
const opcionesCors = {
    origin: process.env.FRONTEND_URL
}
//Habilitar cors
app.use( cors({opcionesCors, origin: true}) );
//Conectar a la base de datos 
conectarDB();

//Asignar puerto de la app
const port = process.env.PORT || 4120;

//Habilitar leer los valores de un body
app.use( express.json() );

//Habilitar carpeta publica
app.use( express.static('uploads'));

//Rutas de la app
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/enlaces', require('./routes/enlaces'));
app.use('/api/archivos', require('./routes/archivos'));

//Arrancar la app
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando ${port}`);
})
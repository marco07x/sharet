const Enlace = require('../models/Enlace');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.nuevoEnlace = async (req, res) => {
    
    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()});
    }
    //Crear un objeto de Enlace
    const { nombre_original, nombre } = req.body;


    const enlace = new Enlace();
    enlace.url = shortid.generate();
    enlace.nombre = nombre;
    enlace.nombre_original = nombre_original;
    
    //Si el usuario esta autenticado
    if(req.usuario) {
        const {password, descargas} = req.body;

        //Asignar a enlace el numero de descargas
        if(descargas) {
            enlace.descargas = descargas;
        }

        //Asignar un password
        if(password) {
            const salt = await bcrypt.genSalt(10);
            enlace.password = await bcrypt.hash( password, salt );
        }

        //Asignar el autor
        enlace.autor = req.usuario.id;
    }

    //Amacenar en la base de datos
    try {
        await enlace.save();
        return res.json({ msg: `${enlace.url}` });
        next();
    } catch (error) {
        console.log(error);
    }

    console.log(req.body);
    console.log(enlace);
}

//Obtiene un listado de todos los enlaces
exports.todosEnlaces = async (req, res) => {
    try {
        const enlaces = await Enlace.find({}).select('url -_id');
        res.json({enlaces});
    } catch (error) {
        console.log(error);
    }
}

//Retorna si el enlace tiene un password o no
exports.tienePassword = async (req, res, next) => {
    const {url} = req.params;
    console.log(url);

    //Verificar si existe el enlace
    const enlace = await Enlace.findOne({url});

    if(!enlace) {
        res.status(404).json({msg: 'Este enlace no existe'});
        return next();
    }

    if(enlace.password) {
        return res.json({ archivo: enlace.nombre,
             password: true, enlace: enlace.url })
    }

    next();

}

//Verificar si el password es correto
exports.verificarPassword = async (req, res, next) => {
    const {url} = req.params;
    const {password} = req.body;
    //console.log(req.params);
    //console.log(req.body);
    //Consultar pot el enlace
    const enlace = await Enlace.findOne({ url });

    //Verificar el password
    if(bcrypt.compareSync(password, enlace.password)) {
        //Permite la descarga del archivo
       next();
    } else {
        return res.status(401).json({msg: 'Contraseña incorrecta'})
    }

    
}

//Obtener el enlace
exports.obtenerEnlace = async (req, res, next) => {
    
    const {url} = req.params;
    //Verificar si existe el enlace
    const enlace = await Enlace.findOne({url});

    if(!enlace) {
        res.status(404).json({msg: 'Este enlace no existe'});
        return next();
    }

    //Si el enlace existe
    res.json({archivo: enlace.nombre, password: false});

    next();

    
}
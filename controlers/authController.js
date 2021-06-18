const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
require('dotenv').config({ path: 'variable.env'});

exports.autenticardUsuario = async (req, res, next) => {
    //Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()});
    }

    //Buscar el usuario si se encuentra registrado
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });
    console.log(usuario);

    if(!usuario) {
        res.status(401).json({msg: 'El usuario no existe'});
        return next();
    }

    //Verificar el password y autenticar el usuario
    if(bcrypt.compareSync(password, usuario.password)) {
        //const JWT
        const token = jwt.sign({
            id: usuario._id,
            nombre: usuario.nombre
        }, process.env.PSJTW, {
            expiresIn: '8h'
        });
        
        res.json({token});

    } else {
        res.status(401).json({msg: 'La contraseña es incorrecta'});
        return next();
    }
}

exports.usuarioAutenticado = (req, res, next) => {
    res.json({usuario: req.usuario});
}
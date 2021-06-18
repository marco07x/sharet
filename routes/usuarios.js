const express = require('express');
const usuarioController = require('../controlers/usuarioController');
const router = express.Router();
const {check} = require('express-validator');

router.post('/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Agrega un email valido').isEmail(),
        check('password', 'Ingresa una contraseña de almenos 8 caracteres').isLength({min: 8})
    ],
    usuarioController.nuevoUsuario
);

module.exports = router;
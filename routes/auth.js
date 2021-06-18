const express = require('express');
const authController = require('../controlers/authController');
const router = express.Router();
const {check} = require('express-validator');
const auth = require('../middleware/auth');

router.post('/',
    [
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'La contraseña no puede ir vacia').not().isEmpty()
    ],
    authController.autenticardUsuario
);

router.get('/', 
    auth,
    authController.usuarioAutenticado
);

module.exports = router;
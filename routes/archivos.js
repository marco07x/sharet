const express = require('express');
const archivosController = require('../controlers/archivosController');
const router = express.Router();
const {check} = require('express-validator');
const auth = require('../middleware/auth');


router.post('/',
    archivosController.subirArchivo
);

router.get('/:archivo',
    archivosController.descargar,
    archivosController.eliminarArchivo
)
/*
router.delete('/:id',
    archivosController.eliminarArchivo
);*/

module.exports = router;
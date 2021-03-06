const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const { arch } = require('os');
const Enlace = require ('../models/Enlace');


exports.subirArchivo = async (req, res, next) => {
    const configuracionMulter = {
        limits : { fileSize : req.usuario ? 2048 * 2048 * 10 : 2048 * 2048 },
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname+'/../uploads')
            },
            filename: (req, file, cb) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortid.generate()}${extension}`);
            }
        })
    }
    
    const upload = multer(configuracionMulter).single('archivo');

    upload(req, res, async (error) => {
        console.log(req.file);

        if(!error) {
            res.json({archivo: req.file.filename});
        } else {
            console.log(error);
            return next();
        }
    });
}

exports.eliminarArchivo = async (req, res) => {
    console.log(req.archivo);

    try {
        fs.unlinkSync(__dirname+`../uploads/${req.archivo}`);
        console.log('Archivo Eliminado');
    } catch (error) {
        console.log(error);
    }
}

//descargar un archivo
exports.descargar = async (req, res, next) => {
    
    //Obtiene el enlace
    const { archivo } = req.params;
    const enlace = await Enlace.findOne({nombre: archivo})

    console.log(enlace);

    const archivoDescarga = __dirname + '/../uploads/' + archivo;
    res.download(archivoDescarga);

    //Eliminar el archivo de la base de datos una vez dercargado
    const { descargas, nombre } = enlace;

    if(descargas === 1) {

        //Eliminar el archivo
        req.archivo = nombre;

        //Eliminar la entrada de base de datos
        await Enlace.findOneAndRemove(enlace.id);
        next();
    } else {
        //Si las descargas son > a 1 - Restar 1
        enlace.descargas--;
        await enlace.save();
        console.log('Aun hay descargas');
    }
}


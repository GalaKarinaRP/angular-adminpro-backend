/*
    Ruta: /api/upload/medicos/123
*/


const { Router } = require('express');
const  expressFileUpload  = require('express-fileupload');

const { fileUploads, retortaImagen, } = require('../controllers/uploads');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();

router.use( expressFileUpload() );

router.put('/:tipo/:id', validarJWT, fileUploads);

router.get('/:tipo/:foto', retortaImagen);

module.exports = router;
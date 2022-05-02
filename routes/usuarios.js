/*
    Ruta: /api/usuarios
*/

const { Router } = require('express');

const { check } = require('express-validator');
const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario} = require('../controllers/usuarios');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, validarAdminRole, validarAdminRole_o_MismoUsuario } = require('../middlewares/validar-jwt');


const router = Router();

router.get('/', validarJWT, getUsuarios);

router.post('/',
 [
     check('nombre', 'El nombre es obligatorio').not().isEmpty(),
     check('password','La contraseña es obligatoria').not().isEmpty(),
     check('email','El email es obligatorio').isEmail(),
     validarCampos,
 ], 
 crearUsuario);
 
router.put('/:id'
,
 [
     validarJWT,
     validarAdminRole_o_MismoUsuario,
     check('nombre', 'El nombre es obligatorio').not().isEmpty(),
     check('email','El email es obkigatorio').isEmail(),    
     validarCampos
 ],  actualizarUsuario);

 router.delete('/:id',
    [validarJWT,
    validarAdminRole],
    borrarUsuario
 );

module.exports = router;
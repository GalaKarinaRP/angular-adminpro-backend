const { respose } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const usuario = require('../models/usuario');
const { getMenuFrontEnd } = require('../helpers/menu-fronend');

const login = async(req, res = response) =>{ 

    const {email, password } = req.body; 

    try {

        //Verificar email
        const usuarioDB = await Usuario.findOne({email});

        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:' Email no valido'
            });
        }

        //Verificar contraseña
        const validPassword = bcrypt.compareSync( password , usuarioDB.password );

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no valida'
            });
        }

        //Generar el token

        const token =await generarJWT(usuarioDB.id);

        res.json({
            ok:true,
            token,
            menu:getMenuFrontEnd(usuarioDB.role)
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const googleSignIn = async(req, res = response) =>{

    const googletoken = req.body.token;
    try {

        const { name , email, picture } = await googleVerify( googletoken );  

        const usuarioDb = await Usuario.findOne({ email });

        let usuario;

        if( !usuarioDb ){
            usuario = new Usuario({
                //no existe el usuario
                nombre: name,
                email,
                password:'@@@',
                img:picture,
                google:true
            });
        }else {
            //existe usuario
            usuario = usuarioDb;
            usuario.google =  true;
        }

        //Guardar usuario en DB
        await usuario.save();

         //Generar el token

         const token =await generarJWT(usuario.id);

        res.json({
            ok:true,
            token,
            menu:getMenuFrontEnd(usuario.role)
        })
    } catch (error) {
       console.log('token no es correcto');
       res.status(401).json({
           ok:false,
           msg:'Token no es correcto'
       });
    }
}


const renewToken = async(req, res= response) => {

    const uid= req.uid;

    if (!uid) {
        console.log(uid);
        return res.status(401).json({
            ok: false,
            msg: 'el _id especificado no es correcto',
        });
    }
  
     //Generar el token
     const token = await generarJWT(uid);    
     const usuario = await Usuario.findById(uid);     
     
     res.json({
        ok:true,
        token,
        usuario,
        menu:getMenuFrontEnd(usuario.role)
    })
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}
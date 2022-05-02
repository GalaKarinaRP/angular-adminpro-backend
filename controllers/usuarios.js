const { res } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const Usuario = require('../models/usuario');


const getUsuarios = async (req, res) => {

    const desde = Number(req.query.desde) || 0;

    const [ usuarios, total ] = await Promise.all([
        Usuario
        .find({},'nombre email role google img ')
        .skip( desde )
        .limit( 5 ),

        Usuario.countDocuments()
    ]);

    res.json({
        ok : true,
        usuarios,
        uid: req.uid,
        total
    })
}


const crearUsuario = async(req, res) => {


    const { email, password } = req.body;    

    try {

        const existeEmail = await Usuario.findOne({email});

        if(existeEmail){
            return res.status(400).json({
                ok:false,
                msg:'El correo ya está registrado'
            });
        }

        const usuario = new Usuario(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt);

        //espera a que esta promesa termine
       await usuario.save();

        //Generar token

        const token =await generarJWT(usuario.id);

        res.json({
            ok : true,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            mdg: 'Error inesperado... revisar logs'
        });
    }

    
}

const actualizarUsuario = async (req, res = response) => {

//TODO: Validar token y comprobar si es el usuario correcto
      
    const uid = req.params.id;


    try {

        const usuarioDB = await Usuario.findById(uid);

         if(!usuarioDB){
            return res.status(400).json({
                ok:false,
                msg:'No existe un usuario por ese id'
            });
        }       

        //ACTUALIZACIONES

        const {password, google,email,  ...campos} = req.body;

            if(usuarioDB.email !== email){         
                const existeEmail =await Usuario.findOne({ email });
                if(existeEmail){
                return res.status(400).json({
                    ok:false,
                    msg:'El correo ya está registrado con otro usuario'
                });
            }
        }
        
        if( !usuarioDB.google){
        campos.email = email;
        }else if( usuarioDB.email !== email){
            return res.status(400).json({
                ok:false,
                msg:'Usuarios de google no pueden modificar su correo'
            });
        }
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid , campos , { new: true});

       
        res.json({
            ok : true,
            usuario : usuarioActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            mdg: 'Error inesperado... revisar logs'
        });
    }

   
}

const borrarUsuario = async( req, res = response) => {
  const uid = req.params.id;
    try {

        const usuarioDB = await Usuario.findById(uid);

         if(!usuarioDB){
            return res.status(400).json({
                ok:false,
                msg:'No existe un usuario por ese id'
            });
        }    

        await Usuario.findByIdAndDelete( uid );   


        res.json({
            ok:true,
            msg: 'Usuario eliminado'
        });
        
    } catch (error) {
        console.log(error);
            res.status(500).json({
                ok:false,
                mdg: 'Error inesperado... hable con el administrador'
            });
    }
   
}


module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}
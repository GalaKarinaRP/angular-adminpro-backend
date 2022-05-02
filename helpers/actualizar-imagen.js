const fs = require('fs');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const borrarImagen = (path) => {

  
    if(fs.existsSync( path )){
        //Borrar la imagen anterior
        fs.unlinkSync( path );
    }
}

const  actualizarImagen = async (tipo, id, nombreArchivo) => {
   
    let pathViejo = '';
        switch ( tipo ) {
            case 'medicos':
                const medico = await Medico.findById( id );
                if(!medico){
                    console.log('no se encontro medico por id');
                    return false;                

                }

                 pathViejo = `./uploads/medicos/${medico.img}`;
                borrarImagen(pathViejo);

                medico.img = nombreArchivo;
                medico.save();
                return true;
                
                break;
            case 'usuarios':

                const usuario = await Usuario.findById( id );
                if(!usuario){
                    console.log('no se encontro usuario por id');
                    return false; 
                }

                 pathViejo = `./uploads/usuarios/${usuario.img}`;
                borrarImagen(pathViejo);

                usuario.img = nombreArchivo;
                usuario.save();
                return true;
                
            
                break;

            case 'hospitales':

                const hospital = await Hospital.findById( id );
                if(!hospital){
                    console.log('no se encontro hospital por id');
                    return false; 
                }

                 pathViejo = `./uploads/hospitales/${hospital.img}`;
                borrarImagen(pathViejo);

                hospital.img = nombreArchivo;
                hospital.save();
                return true;
                
            
                break;
        
            default:
                break;
        }



}

module.exports = {
    actualizarImagen
}

/*
var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads'));
*/
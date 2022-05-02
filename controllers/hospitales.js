const { response } = require('express');
const  Hospital  = require('../models/hospital');


const getHospitales = async(req, res = response) => {

    const hospitales = await Hospital.find()
                                     .populate('usuario','nombre img');

    res.json({
        ok: true,
        hospitales
    });
}

const crearHospital = async(req, res = response) => {

    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body 
    });  

    try {

        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg:'Hable con el administrador'
        });
    }   
}

const actualizarHospital = async (req, res = response) => {
 
    const uid = req.uid;    
    const id = req.params.id;

    try {

        if( !uid.match(/^[0-9a-fA-F]{24}$/)){
            return res.status(404).json({
                ok: false,
                msg: 'id no valido'
            });
        }
        
        const hospital = await Hospital.findById(id);

        if( !hospital){
            return res.status(404).json({
                ok: true,           
                msg:'Hospital no econtrado por id'
            });    
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, {new :true});
        
        res.json({
            ok: true,           
            id,
            hospital:hospitalActualizado
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'hable con el administrador'
        });
    }
   
}

const borrarHospital = async(req, res = response) => {
     
    const id = req.params.id;

    try {


        if( !id.match(/^[0-9a-fA-F]{24}$/)){
            return res.status(404).json({
                ok: false,
                msg: 'id no valido'
            });
        } 
        const hospital = await Hospital.findById(id);

        if( !hospital ){
            return res.status(404).json({
                ok: true,           
                msg:'Hospital no econtrado por id'
            });    
        }
      
        await Hospital.findByIdAndDelete(id);
      
        res.json({
            ok: true,
            msg:'hospital eliminado',
            id
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'hable con el administrador'
        });
    }
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}
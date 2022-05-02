const {response} = require('express');
const Medico = require('../models/medico');

 const getMedicos = async (req, res = response) =>{

   const medicos = await Medico.find()
                               .populate([
                                 {path: 'usuario', model: 'Usuario',select:'nombre'},
                                 {path: 'hospital',model: 'Hospital',select:'nombre'}]);

    res.json({
        ok: true,
        medicos
    });

 }


 const getMedicoById = async (req, res = response) =>{

   const id = req.params.id;
   
   try {

      const medico = await Medico.findById(id)
                               .populate([
                                 {path: 'usuario', model: 'Usuario',select:'nombre'},
                                 {path: 'hospital',model: 'Hospital',select:'nombre'}]);

    res.json({
        ok: true,
        medico
    });

      
   } catch (error) {
      console.log(error);
      res.status(500).json({
         ok: false,
         msg: 'Hable con el administrador'
      });
   }

   
 }
 const crearMedico = async(req, res = response) =>{

   const uid = req.uid;
   
   const medico = new Medico({
      usuario: uid,
      ...req.body
   });

   try {

      const medicoDB = await medico.save();

      res.json({
         ok: true,
         medico: medicoDB
     });
      
   } catch (error) {
      console.log(error);
      res.status(500).json({
         ok: false,
         msg: 'Hable con el administrador'
      });
   }

   

 }

 const actualizarMedico = async(req, res = response) =>{

   const id = req.params.id;
   const uid = req.uid;
   try{

      if( !uid.match(/^[0-9a-fA-F]{24}$/)){
         return res.status(404).json({
             ok: false,
             msg: 'id no valido'
         });
     }

      const medico = await Medico.findById(id);

      if( !medico ){
         return res.status(404).json({
            ok:true, 
            msg: 'id no encontrado'
         });
      }

      const medicoActualizado = {
         ...req.body,
         usuario:uid
      }

     const medicoEditado = await Medico.findByIdAndUpdate(id, medicoActualizado, {new:true});
      
      res.json({
         ok: true,
         msg:'actualizarMedico',
         medico: medicoEditado
         
     });
      
   }catch(error){
      console.log(error);
      res.status(401).json({        
         ok:false,
         msg:'habla con el administrador'
      });
   }   
 }


 const borrarMedico = async(req, res = response) =>{  

   const id = req.params.id;
 
   try{

      if( !id.match(/^[0-9a-fA-F]{24}$/)){
         return res.status(404).json({
             ok: false,
             msg: 'id no valido'
         });
     }

      const medico = await Medico.findById(id);

      if( !medico ){
         return res.status(404).json({
            ok:true, 
            msg: 'id no encontrado'
         });
      }

      await Medico.findByIdAndDelete( id );
      
      
      res.json({
         ok: true,
         msg:'Medico eliminado',
         
     });
      
   }catch(error){
      console.log(error);
      res.status(401).json({        
         ok:false,
         msg:'habla con el administrador'
      });
   }

 }

 module.exports = {
    getMedicos,
    actualizarMedico,
    crearMedico,
    borrarMedico,
    getMedicoById
 }
const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        //espera a que haga esto
        await mongoose.connect(process.env.DB_CNN,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Db online');
        
    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la BD, ver Logs');
    }

  
}

module.exports = {
    dbConnection
}

const Sequelize = require('sequelize');
const database = require('../database/database');


const userModel = database.define("users",{

    
    
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },

    password:{
        type: Sequelize.STRING,
        allowNull: false
    }

});

userModel
    .sync({force:false})
    .then()
    .catch((msgErro)=>{
        console.log('Erro ao  criar category model -- '+ msgErro)
    })


module.exports = userModel;
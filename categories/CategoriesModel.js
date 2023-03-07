const Sequelize = require('sequelize');
const database = require('../database/database');


const categoriesModel = database.define("categories",{

    id:{

        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true

    },
    
    
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },

    slug:{
        type: Sequelize.STRING,
        allowNull: false
    }

});

/*categoriesModel
    .sync()
    .then()
    .catch((msgErro)=>{
        console.log('Erro ao  criar category model -- '+ msgErro)
    })*/


module.exports = categoriesModel;
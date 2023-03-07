const Sequelize = require('sequelize');
const database = require('../database/database');
const categoriesModel = require('../categories/CategoriesModel');


const articlesModel = database.define("articles",{

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
    },
    body:{
        type: Sequelize.TEXT,
        allowNull:false
    },

    //categorieId:{
    //    type: Sequelize.INTEGER,
    //    allowNull: false,        
        
   // }

});

categoriesModel.hasMany(articlesModel);
articlesModel.belongsTo(categoriesModel);
//articlesModel.belongsTo(categoriesModel);

/*
include:[{
            attributes: ['title'],
            model: categoriesModel
        }]
*/

/*articlesModel
    .sync({force:true})
    .then()
    .catch()*/




module.exports = articlesModel;
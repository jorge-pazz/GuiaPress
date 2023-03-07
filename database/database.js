const Sequelize  = require('sequelize');

const connection = new Sequelize('guiapress','root','Vital20',{

    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'

});

connection
    .authenticate()
    .then(()=>{
        console.log('SUCESSO AO CONECTAR NO BANCO DE DADOS')
    })
    .catch((msgErro)=>{
        console.log('ERRO AO CONECTAR NO BANDO DE DADOS -- ' + msgErro);
    })

module.exports = connection;    
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');


//SESSION
app.use(session({
    secret: 'VamosTestar', cookie: {maxAge:30000}
}))

//Controller
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const userController = require('./user/UserController');

//Model
const categoriesModel = require('./categories/CategoriesModel');
const articlesModel = require('./articles/ArticlesModel');
const userModel = require('./user/UserModel');


//DataBase
const connection = require('./database/database');


//ENGENI EJS
app.set('view engine','ejs');

//BODY PARSER
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//FOLDER PUBLIC
app.use(express.static('public'));




//ROUTER

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", userController);


app.get("/",(req,res)=>{

    articlesModel
        .findAll({
           order:[
            ['id','DESC']
        ],
        limit: 4
        })
        .then((articles)=>{

            categoriesModel
                .findAll()
                .then((categories)=>{
                
                        res.render('index',{
                            articles:articles,
                            categories: categories
                        })
               
            })
            .catch();

        })
        .catch((msgErro)=>{
            console.log('Erro ao acessar a Home');
        })

    

});


app.get("/:slug",(req,res)=>{

    let slug = req.params.slug;

    articlesModel
        .findAll({
            where: {
                slug: slug
            },
            include: {model: categoriesModel}
        })
        .then((articles)=>{

            if(articles){
                
                categoriesModel
                .findAll()
                .then((categories)=>{
                
                        res.render('article',{
                            articles:articles,
                            categories: categories
                        })
               
            })
            .catch();


            }else{
                res.redirect("/");
            }
            //res.json({articles});
        })
        .catch((msgErro)=>{
            res.redirect("/");
        })                      


});

    
app.get("/categories/:id", (req,res)=>{

    let categoryId = req.params.id;
  

    articlesModel
        .findAll({
            where: {
                categoryId:categoryId
            },
            include: {model: categoriesModel}
        })
        .then((articles)=>{
            

            categoriesModel
                .findAll()
                .then((categories)=>{
                        res.render('categories',{
                         articles:articles,
                         categories: categories
                        })
                })
                .catch()


            
        })
       .catch() 
        

    
    

})



//SERVER
app.listen(8080, (msgError)=>{

    if(msgError){
        console.log('Erro ao conectar o SERVIDOR -- ' + msgError);
    }else{
        console.log('Conectado Servidor com Sucesso... PORT 8080')
    }


});
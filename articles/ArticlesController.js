const Express = require('express');
const router = Express.Router();
const categoriesModel = require('../categories/CategoriesModel');
const articlesModel = require('./ArticlesModel');
const slugify = require('slugify');
const adminAuth = require('../mid/adminAuth')


router.get('/admin/articles', adminAuth,(req,res)=>{


    articlesModel.findAll({
        include: { model: categoriesModel }
    })
    .then((articles)=>{
       res.render('admin/articles/index',{
            articles:articles });
           //res.json({articles})
        })
   
 
});

router.get("/admin/articles/new", adminAuth, (req,res)=>{

    categoriesModel
        .findAll({raw:true})
        .then((categories)=>{
            res.render('admin/articles/new',{
                categories:categories
            })
        })
        .catch((msgErro)=>{
            console.log('Erro ao Redirecionar PAG CRIAR Artico -- ' +msgErro);
        })

    

});

router.post("/articles/save", adminAuth,(req,res)=>{

    let title = req.body.title;
    let body = req.body.body;
    let categoryId = req.body.categorie;

    articlesModel
        .create({
            title:title,
            slug: slugify(title),
            body: body,
            categoryId: categoryId
        })
        .then(()=>{
            res.redirect('/admin/articles/new')
        })
        .catch((msgErro)=>{
            console.log('Erro ao Salvar Artigo -- ' +msgErro);
        })
    

});


router.post("/articles/delete", adminAuth,(req,res)=>{

    let id = req.body.id;

    if(id != undefined){
        if(!isNaN(id)){

            articlesModel
                .destroy({
                    where:{
                        id:id
                    }
                })
                .then(()=>{
                    res.redirect("/admin/articles");
                })
                .catch((msgErro)=>{
                    console.log('Erro ao Deletar uma Artigo do Banco de Dados -- ' +msgErro);
                })

        }
    }else{
        res.redirect("/admin/articles");
    }

    
});


router.get("/admin/articles/edit/:id", adminAuth, (req,res)=>{
    
    let id = Number(req.params.id);
    //res.send(typeof(id))

    
    if(isNaN(id)){
        res.send("okk");
    }else{


        articlesModel
            .findAll({
                where:{
                    id: id
                }
            })
            .then((articles)=>{
                //res.render("admin/articles/edit",{
                //    articles:articles
                //})
                categoriesModel
                    .findAll({
                        model: articlesModel
                    })
                    .then((categories)=>{
                       res.render("admin/articles/edit",{
                       articles:articles,
                       categories: categories 
                    })
                })
                    
            })
            .catch()



    }//FIM ELSE

});


router.post("/articles/updade", adminAuth,(req,res)=>{

   let id = req.body.id;
    let title = req.body.title;
    let body = req.body.body;
    let categorie = req.body.categorie;
    
    
    articlesModel.update({title:title, body: body, slug: slugify(title), categoryId: categorie }, {where:{ id:id}})
    .then(()=>{
        res.redirect('/admin/articles');
    })
    .catch()

    

});

router.get("/articles/page/:num", (req,res)=>{

    let page = Number(req.params.num);
    let offset = 0;

    if(isNaN(page) || page == 1){
        offset = 0
    }else{
        offset = (page - 1) + 4;
    }

    articlesModel
        .findAndCountAll({
            limit: 4,
            offset: offset,
            order:[
                ['id','DESC']
            ]
        })
        .then((articles)=>{

            let next;

            if(offset + 4 >= articles.count){
                next = false;
            }else{
                next = true
            }

            let result  = {
                next: next,
                articles: articles,
                page: page
            }

           categoriesModel
                .findAll()
                .then((categories)=>{
                    res.render("admin/articles/page",{
                        result:result,
                        categories: categories
                    })
                })
                .catch()

        })
        .catch()

})


module.exports = router;
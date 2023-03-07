const Express = require('express');
const router = Express.Router();
const CategoriesModel = require('./CategoriesModel');
const slugify = require('slugify');
const adminAuth = require('../mid/adminAuth')


router.get("/admin/categories/new", adminAuth, (req,res)=>{

    res.render('admin/categories/new')

});

router.post("/categories/save", adminAuth,(req,res)=>{

    let title = req.body.title;

    if(title == '' || title == undefined){
        res.redirect("/admin/categories/new")
    }else{

        CategoriesModel
            .create({
                title:title,
                slug: slugify(title)
            })
            .then(()=>{
                res.redirect("/admin/categories/new")
            })
            .catch((msgErro)=>{
                console.log('Erro ao cadastrar uma Cadegoria do Banco de Dados -- ' +msgErro);
            })

    }


});

router.get("/admin/categories", adminAuth, (req,res) =>{

    CategoriesModel
        .findAll({raw:true})
        .then((categories)=>{
            res.render("admin/categories",{
                categories:categories
            });
        })
        .catch((msgErro)=>{
            console.log('Erro ao listar as Cadegoria do Banco de Dados -- ' +msgErro);
        })

    

});

router.post("/categories/delete", adminAuth,(req,res)=>{

    let id = req.body.id;

    if(id != undefined){
        if(!isNaN(id)){

            CategoriesModel
                .destroy({
                    where:{
                        id:id
                    }
                })
                .then(()=>{
                    res.redirect("/admin/categories");
                })
                .catch((msgErro)=>{
                    console.log('Erro ao Deletar uma Cadegoria do Banco de Dados -- ' +msgErro);
                })

        }
    }else{
        res.redirect("/admin/categories");
    }

    
});


router.get("/admin/categories/edit/:id", adminAuth, (req,res)=>{

    let id = req.params.id;


    if(isNaN(id)){
        res.redirect("/admin/categories");
    }else{

    

    CategoriesModel
        .findAll({raw: true, where:{id:id}})
        .then((categories)=>{

            res.render("admin/categories/edit", {
                categories: categories
            })

        })
        .catch()
        
    }
     

});

router.post('/admin/categories/update', adminAuth, (req,res)=>{

        let id = req.body.id;
        let title = req.body.title;
       
        CategoriesModel
            .update({title:title, slug: slugify(title)},{
                where:{
                    id:id
                }
            })
            .then(()=>{
                res.redirect("/admin/categories");
            })
            .catch()
    

})


module.exports = router;
const Express = require('express');
const router = Express.Router();
const userModel = require('./UserModel');
const bcrypt = require('bcryptjs');
const adminAuth = require('../mid/adminAuth')



router.get("/admin/users", adminAuth,(req, res)=>{

    userModel
        .findAll()
        .then((users)=>{
            res.render("admin/users/index",{
                users:users
            })
        })
        .catch()

   

});

router.get("/admin/users/create", adminAuth,(req,res)=>{

    res.render("admin/users/create");

});

router.post("/user/create", (req,res)=>{

    let email = req.body.email;
    let password = req.body.password;

    let salt =  bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);

   userModel
        .create({email: email, password: hash})
        .then(()=>{
            res.redirect("/admin/users/create")
        })
        .catch()



    //res.json({email, password, junto, hash})

});


router.get("/login",(req, res)=>{

  res.render("admin/users/login");
   

});

router.post("/authenticate",(req, res)=>{

   let email = req.body.email;
   let password = req.body.password;

   userModel
    .findOne({
        where:{
            email:email
        }
    })
    .then((users)=>{


        if(users){

            if(users != undefined){
                let correct = bcrypt.compareSync(password, users.password);

                if(correct){
                   req.session.user = {
                   id: users.id,
                   email: users.email
                  }

                  res.redirect('/admin/categories') 

               }else{
                res.redirect('login')
               }
                     
            }
         
              
        }else{
            res.redirect('/login')
        }
        
    })
    .catch((msgErro)=>{
        res.send('ERRRO - ' + email)
    })
     
  
});

router.get('/logout',(req,res)=>{

    req.session.user = undefined;
    res.redirect('/login')

})


module.exports = router;
const { Router } = require('express');
const { db } = require('../firebase')
const UserDAO = require('../controller/userdao');
const UserDTO = require('../model/userdto');

const router = Router();
const userDAO = new UserDAO();

router.get('/', async (req, res) => {

    res.render('index')
})

router.post('/firstmodule/:id', async (req, res) => {

    const  user = req.params;

    res.render('firstmodule', {user});
})

router.post('/menuadmin/:id', async (req, res) => {

    const  user = req.params;

    res.render('menuadmin', {user});
})

router.post('/login', async (req, res) => {

    const { email , password} = req.body; 
    const isAuthenticated = await userDAO.authenticateUser(email, password);
    if( isAuthenticated){

        const type = await userDAO.getUserTypeByEmail(email);
        const user = await userDAO.getUserByEmail(email);

        if(type === 'admin'){
            res.render('menuadmin', {user});
        }

        if(type === 'securityhouse'){
            res.render('fithmodule', {user});
        }

        if(type === 'investor'){
            res.render('fourthmodule', {user});
        }
    
    }else{

    }


})


module.exports = router;
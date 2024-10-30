const { Router } = require('express');
const { db } = require('../firebase')
const UserDAO = require('../controller/userdao');
const UserDTO = require('../model/userdto');

const router = Router();
const userDAO = new UserDAO();

router.get('/', async (req, res) => {

    res.render('index')
})

router.get('/firstmodule', async (req, res) => {

    res.render('firstmodule')
})

router.post('/login', async (req, res) => {

    const { email , password} = req.body; 
    const isAuthenticated = await userDAO.authenticateUser(email, password);
    if( isAuthenticated){

        const type = await userDAO.getUserTypeByEmail(email);

        if(type === 'admin'){
            res.render('menuadmin');
        }
    
    }else{

    }


})


module.exports = router;
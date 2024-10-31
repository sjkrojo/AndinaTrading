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
    console.log(user);

    res.render('firstmodule', {user});
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
    
    }else{

    }


})


module.exports = router;
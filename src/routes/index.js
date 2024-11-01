const { Router } = require('express');
const { db } = require('../firebase')
const UserDAO = require('../controller/userdao');
const InvestorDAO = require('../controller/investordao');
const TradingContractDAO = require('../controller/tradingcontractdao');
const CountryDAO = require('../controller/countrydao');

const router = Router();
const userDAO = new UserDAO();
const countryDAO = new CountryDAO();
const investorDAO = new InvestorDAO();
const tradingContractDAO = new TradingContractDAO();

router.get('/', async (req, res) => {


    const countries = await countryDAO.getAllCountries();

    const data = {
        countries: countries
    }

    res.render('secondmodule', {data});
})

router.get('/lg', async (req, res) => {

    res.render('index');
})

router.post('/backtomenu/:id', async (req, res) => {
    const userId = req.params.id; // Extrae el ID del parámetro
    const user = await userDAO.getUserById(userId); // Pasa solo el ID a la función

    if (!user) {
        return res.status(404).send('User not found'); // Manejo de caso en que no se encuentra el usuario
    }

    const typeuser = user.type; // Accede al tipo de usuario desde el objeto retornado

    console.log(user); // Imprime el usuario completo

    if (typeuser === 'admin') {
        res.render('menuadmin', { user });
    } else if (typeuser === 'securityhouse') {
        res.render('fithmodule', { user });
    } else if (typeuser === 'investor') {
        res.render('fourthmodule', { user });
    } else {
        res.status(400).send('Invalid user type'); // Manejo de tipos de usuario no válidos
    }
});


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

            const tradindgcontracts = await tradingContractDAO.getContractsBySecurityHouseId(user.idtype);
            console.log(tradindgcontracts);


            res.render('fithmodule', {user});
        }

        if(type === 'investor'){
            res.render('fourthmodule', {user});
        }
    
    }else{

    }


})


module.exports = router;
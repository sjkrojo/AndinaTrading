const { Router } = require('express');
const securityHouseDAO = require('../controller/securityhousedao');

const router = Router();
const securityHousesDAO = new securityHouseDAO();

router.post('/crud/:id', async (req, res) => {

    const  user  = req.params;

    const houses = await securityHousesDAO.getSecurityHouses();

    const data = {
        user: user,
        houses: houses
    }
    res.render('crudsecurityhouse', {data})
})


router.post('/showhouse/:id', async (req, res) => {

    const  user  = req.params;
    const { mostrar } = req.body;

    const houseshow = await securityHousesDAO.getSecurityHouseById(mostrar);
    const houses = await securityHousesDAO.getSecurityHouses();

    const data = {
        user: user,
        houseshow:  houseshow,
        houses: houses
    }
    res.render('crudsecurityhouse', {data})
})


router.post('/createhouse/:id', async (req, res) => {

    const  user  = req.params;

    
    const {house_name, house_city, house_country} = req.body;

    const namecheck = await securityHousesDAO.isNameInUse(house_name);

    if(namecheck){

        const houses = await securityHousesDAO.getSecurityHouses();
        const data = {
            user: user,
            houses: houses,
            message: "ERROR"
        }
        res.render('crudsecurityhouse',  {data})
    }else{
    const house = await securityHousesDAO.createSecurityHouse(house_name,house_city,house_country);
    const houses = await securityHousesDAO.getSecurityHouses();
    const data = {
        user: user,
        countries: houses
    }
    res.render('crudsecurityhouse',  {data})
    }
})

router.post('/deletehouse/:id', async (req, res) => {

    const  user  = req.params;
    const { eliminar } = req.body;
    console.log(eliminar);
    const deletehouse = await securityHousesDAO.deleteSecurityHouse(eliminar);
    const houses = await securityHousesDAO.getSecurityHouses();
    const data = {
        user: user,
        houses: houses
    }
    res.render('crudsecurityhouse', {data})

})

router.post('/edithouse/:id', async (req, res) => {

    const  user  = req.params;
    const { editar } = req.body;
    const house = await securityHousesDAO.getSecurityHouseById(editar);
    const data = {
        user: user,
        house: house
    }
    res.render('crudsecurityhouse', {data})

})


router.post('/update/:id', async (req, res) => {

    const  user  = req.params;
    const {idhouse,house_name, house_city, house_country} = req.body;

    const namecheck = await securityHousesDAO.isNameInUse(house_name);

    if(namecheck){

        const houses = await securityHousesDAO.getSecurityHouses();
        const data = {
            user: user,
            houses: houses,
            message: "ERROR"
        }
        res.render('crudsecurityhouse',  {data})
    }else{
    const updateHouse = await securityHousesDAO.updateSecurityHouse(idhouse, house_name, house_city, house_country);
    const houses = await securityHousesDAO.getSecurityHouses();
    const data = {
        user: user,
        houses: houses
    }
    res.render('crudsecurityhouse',  {data})
}
})

module.exports = router;
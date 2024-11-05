const { Router } = require('express');
const securityHouseDAO = require('../controller/securityhousedao');
const CountryDAO = require('../controller/countrydao');


const countryDAO = new CountryDAO();
const router = Router();
const securityHousesDAO = new securityHouseDAO();

router.post('/crud/:id', async (req, res) => {

    const  user  = req.params;

    const houses = await securityHousesDAO.getSecurityHouses();
    const countries = await countryDAO.getAllCountries();
    const data = {
        user: user,
        countries: countries,
        houses: houses
    }
    res.render('crudsecurityhouse', {data})
})


router.post('/showhouse/:id', async (req, res) => {

    const  user  = req.params;
    const { mostrar } = req.body;

    const houseshow = await securityHousesDAO.getSecurityHouseById(mostrar);
    const countriesshow = await countryDAO.getCountryById(houseshow.location)
    const houses = await securityHousesDAO.getSecurityHouses();
    const countries = await countryDAO.getAllCountries();
    const data = {
        user: user,
        houseshow:  houseshow,
        countriesshow: countriesshow,
        countries: countries,
        houses: houses
    }
    res.render('crudsecurityhouse', {data})
})


router.post('/createhouse/:id', async (req, res) => {

    const  user  = req.params;

    
    const {house_name, location} = req.body;

    const namecheck = await securityHousesDAO.isNameInUse(house_name);
    const countries = await countryDAO.getAllCountries();
    if(namecheck){

        const houses = await securityHousesDAO.getSecurityHouses();
        const data = {
            user: user,
            houses: houses,
            countries: countries,
            message: "ERROR"
        }
        res.render('crudsecurityhouse',  {data})
    }else{
    const house = await securityHousesDAO.createSecurityHouse(house_name,location);
    const houses = await securityHousesDAO.getSecurityHouses();
    const data = {
        user: user,
        countries: countries,
        houses: houses
    }
    res.render('crudsecurityhouse',  {data})
    }
})

router.post('/deletehouse/:id', async (req, res) => {

    const  user  = req.params;
    const { eliminar } = req.body;
    console.log(eliminar);
    const countries = await countryDAO.getAllCountries();
    const deletehouse = await securityHousesDAO.deleteSecurityHouse(eliminar);
    const houses = await securityHousesDAO.getSecurityHouses();
    const data = {
        user: user,
        countries: countries,
        houses: houses
    }
    res.render('crudsecurityhouse', {data})

})

router.post('/edithouse/:id', async (req, res) => {

    const  user  = req.params;
    const countries = await countryDAO.getAllCountries();
    const { editar } = req.body;
    const house = await securityHousesDAO.getSecurityHouseById(editar);
    const data = {
        user: user,
        countries: countries,
        house: house
    }
    res.render('crudsecurityhouse', {data})

})


router.post('/update/:id', async (req, res) => {

    const  user  = req.params;
    const {idhouse,house_name, location} = req.body;
    const countries = await countryDAO.getAllCountries();
    const namecheck = await securityHousesDAO.isNameInUse(house_name);

    if(namecheck){

        const houses = await securityHousesDAO.getSecurityHouses();
        const data = {
            user: user,
            houses: houses,
            countries: countries,
            message: "ERROR"
        }
        res.render('crudsecurityhouse',  {data})
    }else{
    const updateHouse = await securityHousesDAO.updateSecurityHouse(idhouse, house_name, location);
    const houses = await securityHousesDAO.getSecurityHouses();
    const data = {
        user: user,
        countries: countries,
        houses: houses
    }
    res.render('crudsecurityhouse',  {data})
}
})

module.exports = router;
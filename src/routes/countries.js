const { Router } = require('express');
const CountryDAO = require('../controller/countrydao');

const router = Router();
const countryDAO = new CountryDAO();

router.post('/crud/:id', async (req, res) => {

    const  user  = req.params;

    const countries = await countryDAO.getAllCountries();

    const data = {
        user: user,
        countries: countries
    }
    res.render('crudcountry', {data})
})


router.post('/showcountry/:id', async (req, res) => {

    const  user  = req.params;
    const { mostrar } = req.body;

    const countryshow = await countryDAO.getCountryById(mostrar);
    const countries = await countryDAO.getAllCountries();

    const data = {
        user: user,
        countryshow:  countryshow,
        countries: countries
    }
    res.render('crudcountry', {data})
})


router.post('/createcountry/:id', async (req, res) => {

    const  user  = req.params;

    
    const {country_name, country_city, country_description} = req.body;

    const namecheck = await countryDAO.isCountryNameInUse(country_name);
    const citycheck = await countryDAO.isCityNameInUse(country_city);

    if(namecheck||citycheck){

        const countries = await countryDAO.getAllCountries();
        const data = {
            user: user,
            countries: countries,
            message: "ERROR"
        }
        res.render('crudcountry',  {data})
    }else{
    const country = await countryDAO.createCountry(country_name,country_city,country_description);
    const countries = await countryDAO.getAllCountries();
    const data = {
        user: user,
        countries: countries
    }
    res.render('crudcountry',  {data})
    }
})

router.post('/deletecountry/:id', async (req, res) => {

    const  user  = req.params;
    const { eliminar } = req.body;
    console.log(eliminar);
    const deleteCountry = await countryDAO.deleteCountry(eliminar);
    const countries = await countryDAO.getAllCountries();
    const data = {
        user: user,
        countries: countries
    }
    res.render('crudcountry', {data})

})

router.post('/editcountry/:id', async (req, res) => {

    const  user  = req.params;
    const { editar } = req.body;
    const country = await countryDAO.getCountryById(editar);
    const data = {
        user: user,
        country: country
    }
    res.render('crudcountry', {data})

})


router.post('/update/:id', async (req, res) => {

    const  user  = req.params;
    
    const {idcountry, country_name, country_city, country_description} = req.body;

    const namecheck = await countryDAO.isCountryNameInUse(country_name);
    const citycheck = await countryDAO.isCityNameInUse(country_city);

    if(namecheck||citycheck){

        const countries = await countryDAO.getAllCountries();
        const data = {
            user: user,
            countries: countries,
            message: "ERROR"
        }
        res.render('crudcountry',  {data})
}else{
    const updatecountry = await countryDAO.updateCountry(idcountry, country_name, country_city, country_description)
    const countries = await countryDAO.getAllCountries();
    const data = {
        user: user,
        countries: countries
    }
    res.render('crudcountry',  {data})
}
})

module.exports = router;
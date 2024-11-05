const { Router } = require('express');
const InvestorDAO = require('../controller/investordao'); 
const LogsDAO = require('../controller/logdao');
const logsdao = new LogsDAO();
const router = Router();
const investorDAO = new InvestorDAO();

router.post('/crud/:id', async (req, res) => {
    const user = req.params;

    const investors = await investorDAO.getInvestors();

    const data = {
        user: user,
        investors: investors
    };

    res.render('crudinvestor', { data });
});

router.post('/deleteinvestor/:id', async (req, res) => {
    const user = req.params;
    const { eliminar } = req.body;

    const deleteInvestor = await investorDAO.deleteInvestor(eliminar);
    const investors = await investorDAO.getInvestors();

    const data = {
        user: user,
        investors: investors
    };
    logsdao.createLog("DELETE_INVESTOR", "Eliminación del inversionista con ID " + eliminar, new Date(), "El usuario con ID " + user.id + " eliminó al inversionista con ID " + eliminar + ".");
    res.render('crudinvestor', { data });
});


router.post('/showinvestor/:id', async (req, res) => {
    const user = req.params;
    const { mostrar } = req.body;

    const investorShow = await investorDAO.getInvestorById(mostrar);
    const investors = await investorDAO.getInvestors();

    const data = {
        user: user,
        investorShow: investorShow,
        investors: investors
    };
    res.render('crudinvestor', { data });
});


// Ruta para editar un inversionista
router.post('/editinvestor/:id', async (req, res) => {
    const user = req.params; // Obtiene los parámetros del usuario
    const { idInvestor } = req.body; // ID del inversionista a editar

    // Obtener el inversionista por su ID
    const investor = await investorDAO.getInvestorById(idInvestor);

    const data = {
        user: user,
        investor: investor,
        investors: await investorDAO.getInvestors() // Obtener la lista de inversionistas
    };

    // Renderizar la vista con los datos del inversionista
    res.render('crudinvestor', { data });
});



router.post('/updateinvestor/:id', async (req, res) => {
    
    const user = req.params; 
    const {id, name, address, phone, investmentCapacity } = req.body;

        const updatedInvestor = await investorDAO.updateInvestor(id,
            name,
            address,
            phone,
            investmentCapacity
        );

        const investors = await investorDAO.getInvestors();

        const data = {
            user: user,
            investors: investors,
        };

        logsdao.createLog("UPDATE_INVESTOR", "Actualización del inversionista con ID " + id, new Date(), "El usuario con ID " + user.id + " actualizó al inversionista con ID " + id + ".");
        res.render('crudinvestor', { data });
  
});

router.post('/createinvestor/:id', async (req, res) => {
    const { name, address, phone, investmentCapacity } = req.body;

        const newInvestor = await investorDAO.createInvestor({
            name,
            address,
            phone,
            investmentCapacity,
        });

        const investors = await investorDAO.getInvestors();

        const data = {
            investors,
            newInvestor 
        };

        logsdao.createLog("CREATE_INVESTOR", "Creación de un nuevo inversionista", new Date(), "El usuario con ID " + user.id + " creó un nuevo inversionista: " + name + ".");
        res.render('crudinvestor', { data });

});


module.exports = router;

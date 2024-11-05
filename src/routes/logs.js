const { Router } = require('express');
const LogsDAO = require('../controller/logdao');
const logsdao = new LogsDAO();

const router = Router();


router.post('/:id', async (req, res) => {

    const user = req.params;

    const data = {
        user: user,
    }
    res.render('viewlogs', { data })
})


router.post('/showlogs/:id', async (req, res) => {
    const user = req.params;
    const { fechaInicio, fechaFin } = req.body;

    // Convertir las fechas de cadena a objetos Date
    const startDate = new Date(fechaInicio);
    const endDate = new Date(fechaFin);

    // Verificación para asegurarse de que las fechas son válidas
    if (isNaN(startDate) || isNaN(endDate)) {
        return res.status(400).send('Fecha inválida');
    }

    const logs = await logsdao.getLogsBetweenDates(startDate, endDate);

    const data = {
        logs: logs,
        user: user
    };

    res.render('viewlogs', { data });
});


module.exports = router;

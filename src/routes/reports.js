const express = require('express');
const router = express.Router();
const GeneratePDFReport = require('../controller/generatePDFReport');

const generatePDFReport = new GeneratePDFReport();

router.post('/generate-report/:id', async (req, res) => {
    const userId = req.params.id;
    const { reportType, riskProfile, country } = req.body;

    // Si el tipo de reporte es "Valor de la Acción", no necesita filtros
    if (reportType !== 'Valor de la Acción' && !riskProfile && !country) {
        console.error("No se han proporcionado filtros");
        return res.status(400).send('Filtros no proporcionados');
    }

    // Solo proporciona filtros si no es "Valor de la Acción"
    const filters = reportType !== 'Valor de la Acción' ? {
        riskProfile: riskProfile || null,
        country: country || null
    } : null;

    await generatePDFReport.generatePDF(reportType, filters, res);
});


module.exports = router;

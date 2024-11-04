const { db } = require('../firebase');
const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const InvestorDAO = require('./investordao');
const SecurityHouseDAO = require('./securityhousedao');
const StockDAO = require('./stockdao');
const fs = require('fs');
const path = require('path');

const investorDAO = new InvestorDAO();
const securityHouseDAO = new SecurityHouseDAO();
const stockDAO = new StockDAO();

class GeneratePDFReport {
    constructor() { }


    async generatePDF(reportType, filters, res) {
        let data;
        try {
            data = await this.fetchReportData(reportType, filters);
            if (!data) {
                res.status(400).send('Tipo de reporte no válido');
                return;
            }

            const reportDir = path.join(__dirname, '..', 'reports');
            const reportPath = path.join(reportDir, `${reportType}.pdf`);

            if (!fs.existsSync(reportDir)) {
                fs.mkdirSync(reportDir, { recursive: true });
            }

            const doc = new PDFDocument();
            const writeStream = fs.createWriteStream(reportPath);
            doc.pipe(writeStream);

            doc.fontSize(18).text(`Reporte: ${reportType}`, { align: 'center' });
            doc.moveDown();

            data.forEach((item, index) => {
                doc.fontSize(14).text(`Registro ${index + 1}`, { underline: true });
                doc.moveDown();

                // Convertir el objeto a una cadena JSON legible
                const formattedItem = JSON.stringify(item, null, 2) // Agrega indentación para mejorar la legibilidad
                    .replace(/^{|}$/g, '') // Eliminar llaves de inicio y fin
                    .replace(/:/g, ': ') // Espaciado después de los dos puntos
                    .replace(/,/g, ',\n'); // Salto de línea después de cada coma

                doc.fontSize(12).text(formattedItem);
                doc.moveDown();
            });

            doc.end();

            writeStream.on('finish', () => {
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=${reportType}.pdf`);
                fs.createReadStream(reportPath).pipe(res);
            });

            writeStream.on('error', (error) => {
                console.error("Error al escribir el PDF en el archivo:", error);
                res.status(500).send('Error al generar el reporte');
            });

        } catch (error) {
            console.error("Error al generar el PDF:", error);
            res.status(500).send('Error al generar el reporte');
        }
    }


    // Función para obtener los datos filtrados según el tipo de reporte
    async fetchReportData(reportType, filters) {
        switch (reportType) {
            case 'Reporte de Inversionistas':
                const investors = await investorDAO.getInvestors();
                return investors.filter(investor => investor.riskProfile === filters.riskProfile);

            case 'Reporte de Comisionistas':
                const comisionistas = await securityHouseDAO.getSecurityHouses();
                return comisionistas.filter(house => house.location.country === filters.country);

            case 'Valor de la Acción':
                return await stockDAO.getStocks();

            default:
                return null;
        }
    }
}

module.exports = GeneratePDFReport;

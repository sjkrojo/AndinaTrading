const { Router } = require('express');
const { db } = require('../firebase')

const router = Router();

router.get('/', async (req, res) => {

    res.render('index')
})

module.exports = router;
const router = require("express").Router()
const Service = require("../model/services");
const jwt = require('jsonwebtoken');

// JWT Secret Key
const JWT_SECRET = 'abcdefghijklmnopqrstuvwxyz1234567890';

// Middleware to verify JWT
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Forbidden' });
        req.user = user;
        next();
    });
};

router.post('/category/:categoryId/service', authenticateJWT, async (req, res) => {
    try {
        const { categoryId } = req.params;
        const serviceData = { ...req.body, categoryID: categoryId };
        const newService = await Service.create(serviceData);
        res.json(newService);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.get('/category/:categoryId/services', authenticateJWT, async (req, res) => {
    try {
        const { categoryId } = req.params;
        const services = await Service.find({ categoryID: categoryId });
        res.json(services);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.put('/category/:categoryId/service/:serviceId', authenticateJWT, async (req, res) => {
    try {
        const { categoryId, serviceId } = req.params;
        const updatedService = await Service.findByIdAndUpdate(serviceId, req.body, { new: true });
        res.json(updatedService);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.delete('/category/:categoryId/service/:serviceId', authenticateJWT, async (req, res) => {
    try {
        const { categoryId, serviceId } = req.params;
        await Service.findByIdAndDelete(serviceId);
        res.json({ message: 'Service deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;
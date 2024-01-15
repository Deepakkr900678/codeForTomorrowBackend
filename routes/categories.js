const router = require("express").Router()
const Category = require("../model/categories");
const jwt = require('jsonwebtoken');
const Service = require("../model/services");


// Sample User for authentication
const user = {
    email: 'admin@codesfortomorrow.com',
    password: 'Admin123!@#',
};

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

// Login API
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (email === user.email && password === user.password) {
        const token = jwt.sign({ email }, JWT_SECRET);
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

router.post('/category', authenticateJWT, async (req, res) => {
    try {
        const newCategory = await Category.create(req.body);
        res.json(newCategory);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.get('/categories', authenticateJWT, async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.put('/category/:categoryId', authenticateJWT, async (req, res) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(req.params.categoryId, req.body, { new: true });
        res.json(updatedCategory);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.delete('/category/:categoryId', authenticateJWT, async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const servicesCount = await Service.countDocuments({ categoryID: categoryId });
        if (servicesCount === 0) {
            await Category.findByIdAndDelete(categoryId);
            res.json({ message: 'Category deleted successfully' });
        } else {
            res.status(400).json({ error: 'Cannot delete category with services' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;
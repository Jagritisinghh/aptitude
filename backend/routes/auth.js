const express = require('express');
const User = require('../models/User');
const multer = require('multer');
const router = express.Router();

// File Upload Setup
const upload = multer({ dest: 'uploads/' });

router.post('/register', upload.single('document'), async (req, res) => {
  try {
    const { name,email, password, role,file} = req.body;
    const user = new User({name, email, password, role,file });
    await user.save();
    // Send email notification for approval
    res.status(201).json({ message: 'Sign-up successful. Await admin approval.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/signup', upload.single('document'), async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = new User({ email, password, role });
    await user.save();
    // Send email notification for approval
    res.status(201).json({ message: 'Sign-up successful. Await admin approval.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/admin/pending', async (req, res) => {
    const pendingUsers = await User.find({ status: 'Pending' });
    res.json(pendingUsers);
  });
  
  router.post('/admin/approve/:id', async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { status: 'Approved' });
    // Send approval email
    res.json({ message: 'User approved' });
  });


  const jwt = require('jsonwebtoken');
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  
    if (user.status !== 'Approved') return res.status(403).json({ message: 'Awaiting approval' });
  
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token });
  });
  
  

module.exports = router;


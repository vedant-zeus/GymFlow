require('dotenv').config();
const express = require('express');
const cors = require('cors');
const foodRoutes = require('./routes/foodRoutes');
const authRoutes = require('./routes/authRoutes');
const userFoodRoutes = require('./routes/userFoodRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/food', foodRoutes);
app.use('/auth', authRoutes);
app.use('/user-foods', userFoodRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

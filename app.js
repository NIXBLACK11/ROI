const express = require('express');
const sequelize = require('./config/database');
const emiRoutes = require('./routes/emiRoutes');
require('dotenv').config();

const app = express();

app.use(express.json());

app.use('/api', emiRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
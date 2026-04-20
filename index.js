const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Rutas
const authRoutes = require('./src/routes/auth.routes');
const taskRoutes = require('./src/routes/task.routes');
const adminRoutes = require('./src/routes/admin.routes');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
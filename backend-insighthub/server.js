const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const projectRoutes = require('./routes/Projects');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/insighthub')
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.log('Mongo error: ', err));

app.use('/projects', projectRoutes); // Mount route

app.get('/', (req, res) => {
  res.send('API running...');
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

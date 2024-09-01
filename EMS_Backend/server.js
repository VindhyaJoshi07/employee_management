const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000; // Or any port you prefer

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const employeeRoutes = require('./routes/employees-routes');
app.use('/api/employees', employeeRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

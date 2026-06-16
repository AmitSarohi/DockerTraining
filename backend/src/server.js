const express = require('express');
const cors = require('cors');
require('dotenv').config();

const employeesRouter = require('./routes/employees');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/employees', employeesRouter);

app.get('/', (req, res) => res.send('Employee API is running'));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

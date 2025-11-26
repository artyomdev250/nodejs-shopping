const express = require('express');
const connectDB = require('./mongodb/connect');

const authRoutes = require('./routes/authRoutes');

const app = express();

connectDB();
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('API running...');
});

const PORT = 3000;
app.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}`)
);

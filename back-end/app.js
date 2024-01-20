const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add this line

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(cors()); // Enable CORS

// Connect to MongoDB
async function connectDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/CalculatorDatabase11', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("DB Connected");
    } catch (error) {
        console.log(error);
    }
}

connectDB();

// Define a Mongoose Schema for calculations
const calculationSchema = new mongoose.Schema({
    expression: String,
    result: Number,
});

const Calculation = mongoose.model('Calculation', calculationSchema);

// Routes
app.post('/history', async (req, res) => {
    const { expression, result } = req.body;

    try {
        const newCalculation = new Calculation({ expression, result });
        await newCalculation.save();
        res.status(201).send('Calculation saved successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving calculation');
    }
});

app.get('/getAllCalculations', async (req, res) => {
    try {
        const calculations = await Calculation.find({});
        res.json(calculations);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching calculations');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

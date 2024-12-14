const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Constants
const TICKET_PRICE = 10;
const SERVICE_CHARGE = 5; // Fixed amount; you can change to percentage if needed

// Routes

// Serve Booking Form
app.get('/', (req, res) => {
    res.render('form');
});

// Handle Form Submission
app.post('/submit', (req, res) => {
    const { name, email, phone, creditCard, movie, showtime, seats } = req.body;
    const errors = [];

    // Validations
    if (!name) errors.push("Name is required.");
    if (!email || !/^[\w-.]+@[\w-]+\.[a-z]{2,}$/.test(email)) errors.push("Invalid email address.");
    if (!phone || !/^\d{10}$/.test(phone)) errors.push("Phone number must be in 5198201234 format.");
    if (!creditCard || !/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(creditCard)) errors.push("Credit card must be in xxxx-xxxx-xxxx-xxxx format.");
    if (!seats || isNaN(seats) || seats <= 0) errors.push("Seat quantity must be a positive number.");

    // Return Errors if Validation Fails
    if (errors.length > 0) {
        res.render('form', { errors });
        return;
    }

    // Calculate Total Price
    const total = TICKET_PRICE * seats + SERVICE_CHARGE;

    // Render Receipt
    res.render('receipt', {
        name,
        email,
        phone: phone.replace(/(\d{6})(\d{4})/, '******$2'),
        creditCard: creditCard.replace(/(\d{4}-\d{4}-\d{4})-(\d{4})/, '****-****-****-$2'),
        movie,
        showtime,
        seats,
        serviceCharge: SERVICE_CHARGE,
        total
    });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

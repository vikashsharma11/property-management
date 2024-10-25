/* eslint-disable no-undef */
/* eslint-disable no-unused-vars*/
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const errorHandler = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes')

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));  // Serve uploaded images

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin',adminRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
/* eslint-enable no-undef */
/* eslint-enable no-unused-vars */
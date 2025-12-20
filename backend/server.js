require('dotenv').config();
const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');
const mongoose = require('mongoose');
const resourceRouter = require('./routes/resourceRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const pricingRouter = require('./routes/pricingRoutes');

app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api', resourceRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/pricing-rules', pricingRouter);

// Connect to MongoDB before starting the server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB")
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err)
  })

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

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Connected to MongoDB")
}).catch((err) => {
  console.log(err)
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api', resourceRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/pricing-rules', pricingRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

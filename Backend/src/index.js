const express = require("express");
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const AuthRoutes= require('./Routes/auth');
const WorkRoutes = require('./Routes/work');
const EmployeRoutes = require('./Routes/employee');
const BankRoutes= require('./Routes/bank');
const BankDetailRoutes=require('./Routes/bankdetails');
const PanRoutes=require('./Routes/pan');
const AadharRoutes=require('./Routes/aadhar');
const UserRoutes=require('./Routes/user');


const app = express();
dotenv.config();

app.use(cors({
  origin: process.env.FRONTEND_URL,
      credentials: true,

}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(AuthRoutes);
app.use(WorkRoutes);
app.use(EmployeRoutes);
app.use(BankDetailRoutes);
app.use(BankRoutes);
app.use(PanRoutes);
app.use(AadharRoutes);
app.use(UserRoutes);

app.use('/uploads', express.static(path.resolve(__dirname, '../public/uploads')));
app.use(express.static(path.join(__dirname, '../../frontend/dist')));
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    }).then(() =>
        console.log('Connected to MongoDB')
        ).catch(err =>
            console.log('Error connecting to MongoDB:', err)
            );

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
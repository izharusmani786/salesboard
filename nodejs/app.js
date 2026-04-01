const express = require('express');
const app = express();
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');  

app.use(express.static('public'));
app.use(cors());

app.use('/api', apiRoutes);

app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
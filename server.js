const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 3500;
const corsOptions = require('./config/corsOptions');

// custom middleware logger
app.use(logger);

app.use(cors(corsOptions));

// applying built-in middlewares to all routes
app.use(express.urlencoded({extended: false})); // for handling form data
app.use(express.json()); // for handling json sent to server

app.use(express.static(path.join(__dirname, 'public'))); // serve static files
app.use('/subdir', express.static(path.join(__dirname, 'public'))); // serve static files

// routes
app.use('/', require ('./routes/root'));
app.use('/subdir', require('./routes/subdir'));
app.use('/employees', require('./routes/api/employees'));
app.use('/register', require('./routes/register'));

app.all('/*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ error: '404 Not Found' });
    } else {
        res.type('txt').send('404 Not Found');
    }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

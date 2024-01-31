const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const PORT = process.env.PORT || 3500;
const corsOptions = require('./config/corsOptions');

// custom middleware logger
app.use(logger);

app.use(cors(corsOptions));

// applying built-in middlewares to all routes
app.use(express.urlencoded({extended: false})); // for handling form data
app.use(express.json()); // for handling json sent to server

// middleware for cookies
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public'))); // serve static files
app.use('/subdir', express.static(path.join(__dirname, 'public'))); // serve static files

// routes
app.use('/', require ('./routes/root'));
app.use('/subdir', require('./routes/subdir'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

// apply verifyJWT middleware only to api endponits
app.use('/employees', verifyJWT, require('./routes/api/employees'));

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

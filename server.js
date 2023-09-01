const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

// cross origin resource sharing
const whiteList = ['https://www.test.com', 'http://localhost:3500'];
const corOptions = {
    origin: (origin, callback) => {
        console.log('origin:', origin);
        // added !origin for development, remove in production
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200

}
app.use(cors(corOptions));

// applying built-in middlewares to all routes
app.use(express.urlencoded({extended: false})); // for handling form data
app.use(express.json()); // for handling json sent to server
app.use(express.static(path.join(__dirname, 'public'))); // serve static files

app.get('^/$|index(.html)?', (req, res) => {
    //res.sendFile('./views/index.html', {root: __dirname});
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

app.get('/old-page(.html)?', (req, res) => {
    res.redirect(301, '/new-page.html'); //302 by default
});

app.get('/hello(.html)?', (req, res, next) => {
    console.log('request for hello page');
    next();
}, (req, res) => {
    res.send('hello');
});

const one = (req, res, next) => {
    console.log('one');
    next();
}

const two = (req, res) => {
    console.log('two');
    res.send('hello');
}

app.get('/chain(.html)?', [one, two]);

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

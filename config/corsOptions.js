const whiteList = [
    'https://www.test.com',
    'http://localhost:3500'
];

const corsOptions = {
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

module.exports = corsOptions;

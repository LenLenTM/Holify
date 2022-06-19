const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');

const router = require('./api/routes/router.js');

const app = express();
const port = 3456;

app.use(session({
    secret: 'cats',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 3600,
        httpOnly: false
    }
}))

app.use(express.static(path.join(__dirname, 'files')));

// Parse urlencoded bodies (for form data)
app.use(bodyParser.urlencoded({ extended: true }));
// Parse JSON bodies (from requests)
app.use(bodyParser.json());

// Include the book routes
app.use('/api', router);

app.listen(port, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`Server listening at http://localhost:${port}`)
    }
});


const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');

const bookRouter = require('./api/routes/book-router');
const feedbackRouter = require('./api/routes/feedback-router');

const app = express();
const port = process.env.PORT ?? 3000;

// Serving static files from folder 'files'
app.use(express.static(path.join(__dirname, 'files')));

// Parse urlencoded bodies (for form data)
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON bodies (from requests)
app.use(bodyParser.json());

// Include the book routes
app.use('/api', bookRouter);

// Include the feedback routes
app.use('/api', feedbackRouter);

app.listen(port, (error) => {
    if (error) {
        console.log(error);
    } else {
        console.log(`Server listening at http://localhost:${port}`)
    }
});


const express = require('express');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

//middleware: herokuapp.com subdomain redirection (handles http->https as well)
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.hostname.includes('track-my-warranties')) {
            res.redirect(301, 'https://trackmywarranties.mjfelix.dev')
        }
        else
            next()
    })
}

app.all('*', (req, res) => {
    res.render('home');
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port} ...`)
})
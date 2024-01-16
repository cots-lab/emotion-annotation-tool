const express = require('express');
var path = require('path')
const mainRoutes = require('./routes/main');

const router = express.Router();
const app = express();


app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use( express.static( "public" ) );
app.use(mainRoutes);
app.listen("3000");
console.log('Listening on port 3000');

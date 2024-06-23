const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const database = require("./database/database");
const port = 3000;

database.connect((error) => {
    if (error) {
        console.log(`Error while connecting to the database: ${error}`);
    } else {
        console.log(`Connected to the database ${database?.config?.database} with id ${database?.threadId}!`);
    }
});

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get("/",(req, res) => {
    res.render("index", {});
});

app.listen(port, console.log(`Running on port ${port}.`));

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

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.render("index", {});
});

app.get("/clientes", (req, res) => {
    try {
        database.query("SELECT * FROM clientes", (error, results, fields) => {
            if (error) {
                console.log(`Error while querying the database: ${error}`);
            } else {
                res.render("clientes", { clientes: results });
            }
        });
    } catch (error) {
        console.log(`Error while querying the database: ${error}`);
        res.render("clientes", { clientes: [] });
    }
});

app.get("/clientes/:id/edit", (req, res) => {
    const id = req.params.id;
    try {
        database.query(`SELECT * FROM clientes WHERE id = ${id}`, (error, results, fields) => {
            if (error) {
                console.log(`Error while querying the database: ${error}`);
            } else {
                res.render("clientesEdit", { cliente: results[0] });
            }
        });
    } catch (error) {
        console.log(`Error while querying the database: ${error}`);
        res.render("clientesEdit", { cliente: {} });
    }
});

app.get("/clientes/add", (req, res) => {
    res.render("clientesAdd", {});
});

app.post("/clientes", (req, res) => {
    const { nome, email, telefone } = req.body;
    try {
        database.query(`INSERT clientes (nome, email, telefone) VALUES ('${nome}', '${email}', '${telefone}')`, (error, results, fields) => {
            if (error) {
                console.log(`Error while querying the database: ${error}`);
            } else {
                res.redirect("/clientes");
            }
        });
    } catch (error) {
        console.log(`Error while querying the database: ${error}`);
        res.redirect("/clientes");
    }
});

app.post("/clientes/:id", (req, res) => {
    const { nome, email, telefone } = req.body;
    try {
        database.query(`UPDATE clientes SET nome = '${nome}', email = '${email}', telefone = '${telefone}' WHERE id = ${req.params.id}`, (error, results, fields) => {
            if (error) {
                console.log(`Error while querying the database: ${error}`);
            } else {
                res.redirect("/clientes");
            }
        });
    } catch (error) {
        console.log(`Error while querying the database: ${error}`);
        res.redirect("/clientes");
    }
});

app.delete("/clientes/:id", (req, res) => {
    try {
        database.query(`DELETE FROM clientes WHERE id = ${req.params.id}`, (error, results, fields) => {
            if (error) {
                console.log(`Error while querying the database: ${error}`);
            } else {
                res.redirect("/clientes");
            }
        });
    } catch (error) {
        console.log(`Error while querying the database: ${error}`);
        res.redirect("/clientes");
    }
});

app.get("/barbeiros", (req, res) => {
    try {
        database.query("SELECT * FROM barbeiros", (error, results, fields) => {
            if (error) {
                console.log(`Error while querying the database: ${error}`);
            } else {
                res.render("barbeiros", { barbeiros: results });
            }
        });
    } catch (error) {
        console.log(`Error while querying the database: ${error}`);
        res.render("barbeiros", { barbeiros: [] });
    }
});

app.get("/barbeiros/:id/edit", (req, res) => {
    const id = req.params.id;
    try {
        database.query(`SELECT * FROM barbeiros WHERE id = ${id}`, (error, results, fields) => {
            if (error) {
                console.log(`Error while querying the database: ${error}`);
            } else {
                res.render("barbeirosEdit", { barbeiro: results[0] });
            }
        });
    } catch (error) {
        console.log(`Error while querying the database: ${error}`);
        res.render("barbeirosEdit", { barbeiro: {} });
    }
});

app.get("/barbeiros/add", (req, res) => {
    res.render("barbeirosAdd", {});
});

app.post("/barbeiros", (req, res) => {
    const { nome, email, telefone } = req.body;
    try {
        database.query(`INSERT barbeiros (nome, email, telefone) VALUES ('${nome}', '${email}', '${telefone}')`, (error, results, fields) => {
            if (error) {
                console.log(`Error while querying the database: ${error}`);
            } else {
                res.redirect("/barbeiros");
            }
        });
    } catch (error) {
        console.log(`Error while querying the database: ${error}`);
        res.redirect("/barbeiros");
    }
});

app.post("/barbeiros/:id", (req, res) => {
    const { nome, email, telefone } = req.body;
    try {
        database.query(`UPDATE barbeiros SET nome = '${nome}', email = '${email}', telefone = '${telefone}' WHERE id = ${req.params.id}`, (error, results, fields) => {
            if (error) {
                console.log(`Error while querying the database: ${error}`);
            } else {
                res.redirect("/barbeiros");
            }
        });
    } catch (error) {
        console.log(`Error while querying the database: ${error}`);
        res.redirect("/barbeiros");
    }
});

app.delete("/barbeiros/:id", (req, res) => {
    try {
        database.query(`DELETE FROM barbeiros WHERE id = ${req.params.id}`, (error, results, fields) => {
            if (error) {
                console.log(`Error while querying the database: ${error}`);
            } else {
                res.redirect("/barbeiros");
            }
        });
    } catch (error) {
        console.log(`Error while querying the database: ${error}`);
        res.redirect("/barbeiros");
    }
});

app.listen(port, console.log(`Running on port ${port}.`));

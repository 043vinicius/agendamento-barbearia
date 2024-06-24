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

app.get("/agendamentos", async (req, res) => {
    try {
        const getAgendamentos = new Promise((resolve, reject) => {
            database.query("SELECT * FROM agendamentos", (error, results, fields) => {
                if (error) {
                    console.log(`Error while querying the database: ${error}`);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        const agendamentos = await getAgendamentos;

        const getClienteById = (clienteId) => {
            return new Promise((resolve, reject) => {
                database.query("SELECT * FROM clientes WHERE id = ?", [clienteId], (error, results, fields) => {
                    if (error) {
                        console.log(`Error while querying the database: ${error}`);
                        reject(error);
                    } else {
                        resolve(results[0]);
                    }
                });
            });
        };

        const getBarbeiroById = (barbeiroId) => {
            return new Promise((resolve, reject) => {
                database.query("SELECT * FROM barbeiros WHERE id = ?", [barbeiroId], (error, results, fields) => {
                    if (error) {
                        console.log(`Error while querying the database: ${error}`);
                        reject(error);
                    } else {
                        resolve(results[0]);
                    }
                });
            });
        };

        const agendamentosFull = await Promise.all(
            agendamentos.map(async (agendamento) => {
                const cliente = await getClienteById(agendamento.clienteId);
                const barbeiro = await getBarbeiroById(agendamento.barbeiroId);
                return { 
                    ...agendamento, 
                    cliente, 
                    barbeiro 
                };
            })
        );

        res.render("agendamentos", { agendamentos: agendamentosFull });
    } catch (error) {
        console.log(`Error while querying the database: ${error}`);
        res.render("agendamentos", { agendamentos: [] });
    }
});

app.get("/agendamentos/:id/edit", async (req, res) => {
    const id = req.params.id;
    try {
        const getAgendamento = new Promise((resolve, reject) => {
            database.query(`SELECT * FROM agendamentos WHERE id = ${id}`, (error, results, fields) => {
                if (error) {
                    console.log(`Error while querying the database: ${error}`);
                    reject(error);
                } else {
                    resolve(results[0]);
                }
            });
        });

        const getClientes = new Promise((resolve, reject) => {
            database.query("SELECT * FROM clientes", (error, results, fields) => {
                if (error) {
                    console.log(`Error while querying the database: ${error}`);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        const getBarbeiros = new Promise((resolve, reject) => {
            database.query("SELECT * FROM barbeiros", (error, results, fields) => {
                if (error) {
                    console.log(`Error while querying the database: ${error}`);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        const [agendamento, clientes, barbeiros] = await Promise.all([getAgendamento, getClientes, getBarbeiros]);

        res.render("agendamentoEdit", { agendamento, clientes, barbeiros });
    } catch (error) {
        console.log(`Error while querying the database: ${error}`);
        res.render("agendamentoEdit", { agendamento: {}, clientes: [], barbeiros: [] });
    }
});

app.get("/agendamentos/add", async (req, res) => {
    try {
        const getClientes = new Promise((resolve, reject) => {
            database.query("SELECT * FROM clientes", (error, results, fields) => {
                if (error) {
                    console.log(`Error while querying the database: ${error}`);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        const getBarbeiros = new Promise((resolve, reject) => {
            database.query("SELECT * FROM barbeiros", (error, results, fields) => {
                if (error) {
                    console.log(`Error while querying the database: ${error}`);
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        const [clientes, barbeiros] = await Promise.all([getClientes, getBarbeiros]);

        res.render("agendamentoAdd", { clientes, barbeiros });
    } catch (error) {
        console.log(`Error while querying the database: ${error}`);
        res.render("agendamentoAdd", { clientes: [], barbeiros: [] });
    }
});

app.post("/agendamentos", (req, res) => {
    const { clienteId, barbeiroId, data, hora } = req.body;
    try {
        database.query(`INSERT agendamentos (clienteId, barbeiroId, data, hora) VALUES ('${clienteId}', '${barbeiroId}', '${data}', '${hora}')`, (error, results, fields) => {
            if (error) {
                console.log(`Error while querying the database: ${error}`);
            } else {
                res.redirect("/agendamentos");
            }
        });
    } catch (error) {
        console.log(`Error while querying the database: ${error}`);
        res.redirect("/agendamentos");
    }
});

app.post("/agendamentos/:id", (req, res) => {
    const { clienteId, barbeiroId, data, hora } = req.body;
    try {
        database.query(`UPDATE agendamentos SET clienteId = '${clienteId}', barbeiroId = '${barbeiroId}', data = '${data}', hora = '${hora}' WHERE id = ${req.params.id}`, (error, results, fields) => {
            if (error) {
                console.log(`Error while querying the database: ${error}`);
            } else {
                res.redirect("/agendamentos");
            }
        });
    } catch (error) {
        console.log(`Error while querying the database: ${error}`);
        res.redirect("/agendamentos");
    }
});

app.delete("/agendamentos/:id", (req, res) => {
    try {
        database.query(`DELETE FROM agendamentos WHERE id = ${req.params.id}`, (error, results, fields) => {
            if (error) {
                console.log(`Error while querying the database: ${error}`);
            } else {
                res.redirect("/agendamentos");
            }
        });
    } catch (error) {
        console.log(`Error while querying the database: ${error}`);
        res.redirect("/agendamentos");
    }
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

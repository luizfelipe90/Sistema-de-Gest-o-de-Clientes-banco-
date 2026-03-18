const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();
app.use(cors());
app.use(express.json());

let db;

// Inicializa o Banco de Dados Relacional (Persistência)
(async () => {
    db = await open({
        filename: './database.db',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            empresa TEXT,
            email TEXT
        )
    `);
    console.log("Cozinha pronta! Banco de dados SQLite ativo na porta 3001.");
})();

// ROTAS DA API (REST)
app.get('/clientes', async (req, res) => {
    const { busca } = req.query;
    let query = "SELECT * FROM clientes";
    if (busca) {
        query += ` WHERE nome LIKE '%${busca}%' OR empresa LIKE '%${busca}%'`;
    }
    const rows = await db.all(query);
    res.json(rows);
});

app.post('/clientes', async (req, res) => {
    const { nome, empresa, email } = req.body;
    await db.run("INSERT INTO clientes (nome, empresa, email) VALUES (?, ?, ?)", [nome, empresa, email]);
    res.status(201).json({ mensagem: "Salvo com sucesso!" });
});

app.put('/clientes/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, empresa, email } = req.body;
    await db.run("UPDATE clientes SET nome=?, empresa=?, email=? WHERE id=?", [nome, empresa, email, id]);
    res.json({ mensagem: "Atualizado!" });
});

app.delete('/clientes/:id', async (req, res) => {
    await db.run("DELETE FROM clientes WHERE id=?", [req.params.id]);
    res.json({ mensagem: "Excluído!" });
});

app.listen(3001);
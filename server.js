const express = require("express");
const app = express();

const cors = require("cors");
require("dotenv").config();

const pool = require("./database");

app.use(express.json());
app.use(cors());

const PORT = 3000;

app.get("/api/frota", async (req, res) => {

    const [viaturas] = await pool.execute(
        "SELECT * FROM viaturas"
    );

    res.status(200).json(viaturas);

});

app.get("/api/frota/:id", async (req, res) => {

    const id = Number(req.params.id);

    const [viatura] = await pool.execute(
        "SELECT * FROM viaturas WHERE id = ?",
        [id]
    );

    if (viatura.length === 0) {
        return res.status(404).json({
            mensagem: "Viatura não encontrada"
        });
    }

    res.status(200).json(viatura[0]);

});
app.post("/api/frota", async (req, res) => {

    const { Matricula, Marca, Modelo, Ano, VIN, Tipo } = req.body;

    if (!Matricula || !Marca || !Modelo || !Ano || !VIN || !Tipo) {
        return res.status(400).json({
            mensagem: "Preencher todos os campos"
        });
    }

    await pool.execute(
        `INSERT INTO viaturas
        (Matricula, Marca, Modelo, Ano, VIN, Tipo)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [Matricula, Marca, Modelo, Ano, VIN, Tipo]
    );

    res.status(201).json({
        mensagem: "Viatura criada com sucesso"
    });

});


app.listen(PORT, () => {
    console.log("Servidor a correr na porta 3000");
});
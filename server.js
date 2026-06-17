const express = require("express");
const app = express();

const cors = require("cors");
require("dotenv").config();

const pool = require("./database");

app.use(express.json());
app.use(cors());

const PORT = 3000;

const queryViaturas = `
    SELECT
        id,
        Matricula,
        Marca,
        Modelo,
        Ano,
        VIN,
        Tipo,
        Imagem,
        ultima_revisao,
        quilometros,
        troca_pneus,
        mudanca_oleo,
        proxima_inspecao,
        observacoes,
        CASE
            WHEN ativo = 1 THEN "Sim"
            ELSE "Nao"
        END AS ativo
    FROM viaturas
`;

app.get("/api/estado", (req, res) => {
    res.status(200).json({
        mensagem: "API da Gestão de Frota a funcionar",
        estado: "OK"
    });
});

app.get("/api/frota", async (req, res) => {
    const [viaturas] = await pool.execute(queryViaturas);
    res.status(200).json(viaturas);
});

app.get("/api/frota/:id", async (req, res) => {
    const id = Number(req.params.id);

    const [viatura] = await pool.execute(
        `${queryViaturas} WHERE id = ?`,
        [id]
    );

    if (viatura.length === 0) {
        return res.status(404).json({
            mensagem: "Viatura nao encontrada"
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

app.put("/api/frota/:id", async (req, res) => {
    const id = Number(req.params.id);

    const { Matricula, Marca, Modelo, Ano, VIN, Tipo } = req.body;

    const [viatura] = await pool.execute(
        "SELECT * FROM viaturas WHERE id = ?",
        [id]
    );

    if (viatura.length === 0) {
        return res.status(404).json({
            mensagem: "Viatura nao encontrada"
        });
    }

    await pool.execute(
        `UPDATE viaturas
        SET Matricula = ?, Marca = ?, Modelo = ?, Ano = ?, VIN = ?, Tipo = ?
        WHERE id = ?`,
        [Matricula, Marca, Modelo, Ano, VIN, Tipo, id]
    );

    res.status(200).json({
        mensagem: "Viatura atualizada com sucesso"
    });
});

app.delete("/api/frota/:id", async (req, res) => {
    const id = Number(req.params.id);

    const [viatura] = await pool.execute(
        "SELECT * FROM viaturas WHERE id = ?",
        [id]
    );

    if (viatura.length === 0) {
        return res.status(404).json({
            mensagem: "Viatura nao encontrada"
        });
    }

    await pool.execute(
        "DELETE FROM viaturas WHERE id = ?",
        [id]
    );

    res.status(200).json({
        mensagem: "Viatura eliminada com sucesso"
    });
});

app.patch("/api/frota/:id", async (req, res) => {
    const id = Number(req.params.id);

    const { ativo } = req.body;

    const [viatura] = await pool.execute(
        "SELECT * FROM viaturas WHERE id = ?",
        [id]
    );

    if (viatura.length === 0) {
        return res.status(404).json({
            mensagem: "Viatura nao encontrada"
        });
    }

    await pool.execute(
        "UPDATE viaturas SET ativo = ? WHERE id = ?",
        [ativo, id]
    );

    res.status(200).json({
        mensagem: "Estado atualizado com sucesso"
    });
});

app.put("/api/frota/:id/informacao", async (req, res) => {
    const id = Number(req.params.id);

    const {
        ultima_revisao,
        quilometros,
        troca_pneus,
        mudanca_oleo,
        proxima_inspecao,
        observacoes
    } = req.body;

    const [viatura] = await pool.execute(
        "SELECT * FROM viaturas WHERE id = ?",
        [id]
    );

    if (viatura.length === 0) {
        return res.status(404).json({
            mensagem: "Viatura nao encontrada"
        });
    }

    await pool.execute(
        `UPDATE viaturas
        SET ultima_revisao = ?,
            quilometros = ?,
            troca_pneus = ?,
            mudanca_oleo = ?,
            proxima_inspecao = ?,
            observacoes = ?
        WHERE id = ?`,
        [
            ultima_revisao,
            quilometros,
            troca_pneus,
            mudanca_oleo,
            proxima_inspecao,
            observacoes,
            id
        ]
    );

    res.status(200).json({
        mensagem: "Informacao da viatura atualizada com sucesso"
    });
});

app.listen(PORT, () => {
    console.log("Servidor a correr na porta 3000");
});
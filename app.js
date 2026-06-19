const listaFrota = document.getElementById("lista-frota");
const estatisticasFrota = document.getElementById("estatisticas-frota");

let todasAsViaturas = [];

async function carregarFrota() {
    const resposta = await fetch("http://localhost:3000/api/frota");
    todasAsViaturas = await resposta.json();

    const total = todasAsViaturas.length;
    const ativas = todasAsViaturas.filter(viatura => viatura.ativo === "Sim").length;
    const inativas = todasAsViaturas.filter(viatura => viatura.ativo === "Nao").length;

    estatisticasFrota.innerHTML = `
        <div class="estatisticas">
            <div>
                <h3>${total}</h3>
                <p>Total de viaturas</p>
            </div>

            <div>
                <h3>${ativas}</h3>
                <p>Ativas</p>
            </div>

            <div>
                <h3>${inativas}</h3>
                <p>Inativas</p>
            </div>
        </div>
    `;

    const marcas = [];

    todasAsViaturas.forEach(viatura => {
        if (!marcas.includes(viatura.Marca)) {
            marcas.push(viatura.Marca);
        }
    });

    listaFrota.innerHTML = `
        <div class="filtros-marcas">
            <button onclick="mostrarTodas()">🚛 Todas</button>

            ${marcas.map(marca => `
                <button onclick="mostrarMarca('${marca}')">${marca}</button>
            `).join("")}
        </div>

        <div id="area-viaturas">
            <p class="mensagem-frota">
                Selecione uma marca ou clique em "🚛 Todas" para visualizar toda a frota.
            </p>
        </div>
    `;
}

function mostrarMarca(marca) {
    const areaViaturas = document.getElementById("area-viaturas");

    areaViaturas.innerHTML = "";

    const viaturasFiltradas = todasAsViaturas.filter(viatura => viatura.Marca === marca);

    viaturasFiltradas.forEach(viatura => {
        areaViaturas.innerHTML += criarCard(viatura);
    });
}

function mostrarTodas() {
    const areaViaturas = document.getElementById("area-viaturas");

    areaViaturas.innerHTML = "";

    todasAsViaturas.forEach(viatura => {
        areaViaturas.innerHTML += criarCard(viatura);
    });
}

function pesquisarMatricula() {
    const pesquisa = document
        .getElementById("pesquisa-matricula")
        .value
        .toLowerCase()
        .trim();

    const areaViaturas = document.getElementById("area-viaturas");

    areaViaturas.innerHTML = "";

    const viaturasFiltradas = todasAsViaturas.filter(viatura =>
        viatura.Matricula.toLowerCase().includes(pesquisa)
    );

    if (pesquisa === "") {
        areaViaturas.innerHTML = `
            <p class="mensagem-frota">
                Selecione uma marca ou clique em "🚛 Todas" para visualizar toda a frota.
            </p>
        `;
        return;
    }

    if (viaturasFiltradas.length === 0) {
        areaViaturas.innerHTML = `
            <p class="mensagem-frota">
                Nenhuma viatura encontrada com essa matrícula.
            </p>
        `;
        return;
    }

    viaturasFiltradas.forEach(viatura => {
        areaViaturas.innerHTML += criarCard(viatura);
    });
}

function criarCard(viatura) {
    return `
        <div class="card-frota ${viatura.ativo === "Nao" ? "viatura-inativa" : ""}">
            <h3>${viatura.Marca} ${viatura.Modelo || ""}</h3>

            <p><strong>Matrícula:</strong> ${viatura.Matricula}</p>
            <p><strong>Ano:</strong> ${new Date(viatura.Ano).getFullYear()}</p>
            <p><strong>VIN:</strong> ${viatura.VIN || ""}</p>
            <p><strong>Tipo:</strong> ${viatura.Tipo || ""}</p>

            <p>
                <strong>Estado:</strong>
                ${viatura.ativo === "Sim" ? "🟢 Ativo" : "🔴 Inativo"}
            </p>

            <button onclick="alterarEstado(${viatura.id})">Alterar Estado</button>
            <button onclick="mostrarInformacao(${viatura.id})">Informação</button>

            <div id="info-${viatura.id}"></div>
        </div>
    `;
}

async function alterarEstado(id) {
    const viatura = todasAsViaturas.find(v => v.id === id);
    const marcaAtual = viatura.Marca;

    await fetch(`http://localhost:3000/api/frota/${id}/ativo`, {
        method: "PATCH"
    });

    await carregarFrota();

    mostrarMarca(marcaAtual);
}

function mostrarInformacao(id) {
    const viatura = todasAsViaturas.find(v => v.id === id);
    const areaInfo = document.getElementById(`info-${id}`);

    areaInfo.innerHTML = `
        <div class="tabela-info">
            <h4>Informação da Viatura</h4>

            <table>
                <tr>
                    <th>Última revisão</th>
                    <td>${viatura.ultima_revisao || "Sem informação"}</td>
                </tr>

                <tr>
                    <th>Quilómetros</th>
                    <td>${viatura.quilometros || "Sem informação"}</td>
                </tr>

                <tr>
                    <th>Troca de pneus</th>
                    <td>${viatura.troca_pneus || "Sem informação"}</td>
                </tr>

                <tr>
                    <th>Mudança de óleo</th>
                    <td>${viatura.mudanca_oleo || "Sem informação"}</td>
                </tr>

                <tr>
                    <th>Próxima inspeção</th>
                    <td>${viatura.proxima_inspecao || "Sem informação"}</td>
                </tr>

                <tr>
                    <th>Observações</th>
                    <td>${viatura.observacoes || "Sem informação"}</td>
                </tr>
            </table>

            <button onclick="editarInformacao(${viatura.id})">Editar Informação</button>
            <button onclick="fecharInformacao(${viatura.id})">Fechar</button>
        </div>
    `;
}

function fecharInformacao(id) {
    const areaInfo = document.getElementById(`info-${id}`);
    areaInfo.innerHTML = "";
}

function editarInformacao(id) {
    const viatura = todasAsViaturas.find(v => v.id === id);
    const areaInfo = document.getElementById(`info-${id}`);

    areaInfo.innerHTML = `
        <div class="form-info">
            <h4>Editar Informação</h4>

            <label>Última revisão</label>
            <input id="ultima_revisao-${id}" type="text" value="${viatura.ultima_revisao || ""}">

            <label>Quilómetros</label>
            <input id="quilometros-${id}" type="text" value="${viatura.quilometros || ""}">

            <label>Troca de pneus</label>
            <input id="troca_pneus-${id}" type="text" value="${viatura.troca_pneus || ""}">

            <label>Mudança de óleo</label>
            <input id="mudanca_oleo-${id}" type="text" value="${viatura.mudanca_oleo || ""}">

            <label>Próxima inspeção</label>
            <input id="proxima_inspecao-${id}" type="text" value="${viatura.proxima_inspecao || ""}">

            <label>Observações</label>
            <textarea id="observacoes-${id}">${viatura.observacoes || ""}</textarea>

            <button onclick="guardarInformacao(${id})">Guardar</button>
            <button onclick="mostrarInformacao(${id})">Cancelar</button>
        </div>
    `;
}

async function guardarInformacao(id) {
    const dados = {
        ultima_revisao: document.getElementById(`ultima_revisao-${id}`).value,
        quilometros: document.getElementById(`quilometros-${id}`).value,
        troca_pneus: document.getElementById(`troca_pneus-${id}`).value,
        mudanca_oleo: document.getElementById(`mudanca_oleo-${id}`).value,
        proxima_inspecao: document.getElementById(`proxima_inspecao-${id}`).value,
        observacoes: document.getElementById(`observacoes-${id}`).value
    };

    await fetch(`http://localhost:3000/api/frota/${id}/informacao`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    });

    alert("Informação guardada com sucesso!");

    await carregarFrota();
}

window.onload = carregarFrota;
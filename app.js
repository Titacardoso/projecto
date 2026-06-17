const listaFrota = document.getElementById("lista-frota");

let todasAsViaturas = [];

async function carregarFrota() {
    const resposta = await fetch("http://localhost:3000/api/frota");
    todasAsViaturas = await resposta.json();

    listaFrota.innerHTML = "";

    const marcas = [];

    todasAsViaturas.forEach(viatura => {
        if (!marcas.includes(viatura.Marca)) {
            marcas.push(viatura.Marca);
        }
    });

    listaFrota.innerHTML = `
        <div class="filtros-marcas">
            ${marcas.map(marca => `
                <button onclick="mostrarMarca('${marca}')">${marca}</button>
            `).join("")}
        </div>

        <div id="area-viaturas">
            <p class="mensagem-frota">
                Selecione uma marca para visualizar as viaturas.
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

function criarCard(viatura) {
    return `
        <div class="card-frota">
            <h3>${viatura.Marca} ${viatura.Modelo}</h3>

            <p><strong>Matrícula:</strong> ${viatura.Matricula}</p>
            <p><strong>Ano:</strong> ${new Date(viatura.Ano).getFullYear()}</p>
            <p><strong>VIN:</strong> ${viatura.VIN}</p>
            <p><strong>Tipo:</strong> ${viatura.Tipo}</p>
            <p><strong>Ativo:</strong> ${viatura.ativo}</p>

            <button onclick="alterarEstado(${viatura.id})">
                Alterar Estado
            </button>

            <button onclick="mostrarInformacao(${viatura.id})">
                Informação
            </button>
        </div>
    `;
}

async function alterarEstado(id) {
    await fetch(`http://localhost:3000/api/frota/${id}/ativo`, {
        method: "PATCH"
    });

    await carregarFrota();
}

async function mostrarInformacao(id) {
    const viatura = todasAsViaturas.find(v => v.id === id);

    const revisao = prompt("Última revisão:", viatura.ultima_revisao || "");
    const kms = prompt("Quilómetros:", viatura.quilometros || "");
    const pneus = prompt("Troca de pneus:", viatura.troca_pneus || "");
    const oleo = prompt("Mudança de óleo:", viatura.mudanca_oleo || "");
    const inspecao = prompt("Próxima inspeção:", viatura.proxima_inspecao || "");
    const observacoes = prompt("Observações:", viatura.observacoes || "");

    await fetch(`http://localhost:3000/api/frota/${id}/informacao`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ultima_revisao: revisao,
            quilometros: kms,
            troca_pneus: pneus,
            mudanca_oleo: oleo,
            proxima_inspecao: inspecao,
            observacoes: observacoes
        })
    });

    alert("Informação guardada com sucesso!");

    await carregarFrota();
}

carregarFrota();
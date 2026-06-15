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
            <button onclick="mostrarTodas()">Todas</button>
            ${marcas.map(marca => `
                <button onclick="mostrarMarca('${marca}')">${marca}</button>
            `).join("")}
        </div>

        <div id="area-viaturas"></div>
    `;

    mostrarTodas();
}

function mostrarTodas() {
    const areaViaturas = document.getElementById("area-viaturas");

    areaViaturas.innerHTML = "";

    todasAsViaturas.forEach(viatura => {
        areaViaturas.innerHTML += criarCard(viatura);
    });
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
            <p><strong>Ano:</strong> ${viatura.Ano}</p>
            <p><strong>VIN:</strong> ${viatura.VIN}</p>
            <p><strong>Tipo:</strong> ${viatura.Tipo}</p>
            <p><strong>Ativo:</strong> ${viatura.ativo}</p>

            <button onclick="alterarEstado(${viatura.id})">
                Alterar Estado
            </button>

            <button onclick="apagarViatura(${viatura.id})">
                Apagar
            </button>
        </div>
    `;
}

async function alterarEstado(id) {
    await fetch(`http://localhost:3000/api/frota/${id}/ativo`, {
        method: "PATCH"
    });

    carregarFrota();
}

async function apagarViatura(id) {
    await fetch(`http://localhost:3000/api/frota/${id}`, {
        method: "DELETE"
    });

    carregarFrota();
}

carregarFrota();
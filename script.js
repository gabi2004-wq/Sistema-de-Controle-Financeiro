let movimentacoes = JSON.parse(
    localStorage.getItem("movimentacoes")
) || [];

const formulario = document.getElementById("formFinanceiro");
const lista = document.getElementById("listaMovimentacoes");

const formatarMoeda = (valor) => {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
};

function salvarDados() {
    localStorage.setItem(
        "movimentacoes",
        JSON.stringify(movimentacoes)
    );
}

function atualizarIndicadores() {
    const receitas = movimentacoes
        .filter(item => item.tipo === "receita")
        .reduce((total, item) => total + item.valor, 0);

    const despesas = movimentacoes
        .filter(item => item.tipo === "despesa")
        .reduce((total, item) => total + item.valor, 0);

    const saldo = receitas - despesas;

    document.getElementById("saldo").textContent =
        formatarMoeda(saldo);

    document.getElementById("receitas").textContent =
        formatarMoeda(receitas);

    document.getElementById("despesas").textContent =
        formatarMoeda(despesas);
}

function mostrarMovimentacoes() {
    lista.innerHTML = "";

    if (movimentacoes.length === 0) {
        lista.textContent = "Nenhuma movimentação cadastrada.";
        return;
    }

    movimentacoes.forEach((item, indice) => {
        const card = document.createElement("div");
        card.className = "movimentacao";

        const informacoes = document.createElement("div");

        const descricao = document.createElement("h3");
        descricao.textContent = item.descricao;

        const categoria = document.createElement("p");
        categoria.textContent = "Categoria: " + item.categoria;

        const tipo = document.createElement("p");
        tipo.textContent =
            item.tipo === "receita" ? "Receita" : "Despesa";

        informacoes.append(descricao, categoria, tipo);

        const valor = document.createElement("strong");
        valor.textContent =
            (item.tipo === "receita" ? "+ " : "- ") +
            formatarMoeda(item.valor);

        valor.className =
            item.tipo === "receita"
                ? "valor-receita"
                : "valor-despesa";

        const botao = document.createElement("button");
        botao.textContent = "Excluir";

        botao.addEventListener("click", () => {
            movimentacoes.splice(indice, 1);
            salvarDados();
            mostrarMovimentacoes();
            atualizarIndicadores();
        });

        card.append(informacoes, valor, botao);
        lista.appendChild(card);
    });
}

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const descricao = document
        .getElementById("descricao").value.trim();

    const valor = Number(
        document.getElementById("valor").value
    );

    const tipo = document.getElementById("tipo").value;
    const categoria = document.getElementById("categoria").value;

    if (!descricao || !Number.isFinite(valor) || valor <= 0) {
        alert("Informe uma descrição e um valor válido.");
        return;
    }

    const novaMovimentacao = {
        descricao,
        valor,
        tipo,
        categoria
    };

    movimentacoes.push(novaMovimentacao);

    salvarDados();
    mostrarMovimentacoes();
    atualizarIndicadores();

    formulario.reset();
});

mostrarMovimentacoes();
atualizarIndicadores();
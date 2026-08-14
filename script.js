/* =========================================================
   ZYRO® — SISTEMA PRINCIPAL
   Carrinho + Produtos + Login + Frete + CEP + Mapa
   + Checkout + Pagamento + Persistência
========================================================= */


/* =========================================================
   CONFIGURAÇÕES
========================================================= */

const CONFIG = {

    /* CEP de origem da loja */
    CEP_ORIGEM: "12345678",

    /* Faixa de frete */
    FRETE_MINIMO: 12.90,
    FRETE_MAXIMO: 49.90,

    /* Prazo estimado */
    PRAZO_MINIMO: 3,
    PRAZO_MAXIMO: 8,

    /* LocalStorage */
    CARRINHO_KEY: "zyroCart",
    USUARIO_KEY: "usuarioZYRO",
    LOGIN_KEY: "usuarioLogado",
    FRETE_KEY: "zyroFrete",
    ENDERECO_KEY: "zyroEndereco"

};


/* =========================================================
   VARIÁVEIS GLOBAIS
========================================================= */

let carrinho = carregarCarrinho();

let freteAtual = 0;

let enderecoAtual = null;

let produtoAtual = {
    nome: "",
    preco: 0,
    imagem: "",
    descricao: "",
    estoque: 0
};

let tamanhoSelecionado = "";

let quantidadeProduto = 1;

let mapa = null;


/* =========================================================
   FORMATAÇÃO DE PREÇO
========================================================= */

function formatarPreco(valor) {

    valor = Number(valor) || 0;

    return valor.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

}


/* =========================================================
   CONVERTER NÚMERO
========================================================= */

function converterNumero(valor) {

    if (typeof valor === "number") {
        return valor;
    }

    if (!valor) {
        return 0;
    }

    let texto = String(valor)
        .replace(/[^\d,.-]/g, "");

    if (texto.includes(",")) {

        texto = texto
            .replace(/\./g, "")
            .replace(",", ".");

    }

    return Number(texto) || 0;

}


/* =========================================================
   CARRINHO
========================================================= */

function carregarCarrinho() {

    try {

        const salvo = localStorage.getItem(
            CONFIG.CARRINHO_KEY
        );

        if (!salvo) {
            return [];
        }

        const dados = JSON.parse(salvo);

        return Array.isArray(dados)
            ? dados
            : [];

    } catch (erro) {

        console.error(
            "Erro ao carregar carrinho:",
            erro
        );

        return [];

    }

}


function salvarCarrinho() {

    try {

        localStorage.setItem(
            CONFIG.CARRINHO_KEY,
            JSON.stringify(carrinho)
        );

    } catch (erro) {

        console.error(
            "Erro ao salvar carrinho:",
            erro
        );

    }

}


/* =========================================================
   MENU MOBILE
========================================================= */

function menuMobile() {

    const menu = document.getElementById("menu");

    if (!menu) return;

    menu.classList.toggle("mobileActive");

}


/* =========================================================
   FAVORITOS
========================================================= */

function favoritar(elemento) {

    if (!elemento) return;

    if (
        elemento.classList.contains("favorited")
    ) {

        elemento.classList.remove("favorited");

        elemento.innerHTML = "♡";

    } else {

        elemento.classList.add("favorited");

        elemento.innerHTML = "♥";

    }

}


/* =========================================================
   ABRIR PRODUTO
========================================================= */

function abrirProduto(
    nome,
    preco,
    imagem,
    descricao,
    estoque
) {

    produtoAtual = {

        nome: nome || "",

        preco: converterNumero(preco),

        imagem: imagem || "",

        descricao: descricao || "",

        estoque: Number(estoque) || 0

    };

    quantidadeProduto = 1;

    tamanhoSelecionado = "";


    const modal = document.getElementById(
        "productModal"
    );

    const detailImage = document.getElementById(
        "detailImage"
    );

    const detailName = document.getElementById(
        "detailName"
    );

    const detailPrice = document.getElementById(
        "detailPrice"
    );

    const detailDescription =
        document.getElementById(
            "detailDescription"
        );

    const detailStock =
        document.getElementById(
            "detailStock"
        );


    if (detailImage) {

        detailImage.src = imagem || "";

        detailImage.alt = nome || "Produto ZYRO";

    }


    if (detailName) {

        detailName.textContent = nome || "";

    }


    if (detailPrice) {

        detailPrice.textContent =
            "R$ " +
            formatarPreco(
                produtoAtual.preco
            );

    }


    if (detailDescription) {

        detailDescription.textContent =
            descricao || "";

    }


    if (detailStock) {

        if (produtoAtual.estoque > 0) {

            detailStock.textContent =
                produtoAtual.estoque +
                " unidades disponíveis";

        } else {

            detailStock.textContent =
                "Produto sem estoque";

        }

    }


    const quantidade =
        document.getElementById(
            "productQuantity"
        );

    const quantidade2 =
        document.getElementById(
            "quantidadeProduto"
        );


    if (quantidade) {
        quantidade.textContent = "1";
    }

    if (quantidade2) {
        quantidade2.textContent = "1";
    }


    document
        .querySelectorAll(".sizes button")
        .forEach(botao => {

            botao.classList.remove("selected");

        });


    if (modal) {

        modal.classList.add("active");

        document.body.style.overflow = "hidden";

    }


    const frete =
        document.getElementById(
            "freteResultado"
        );

    if (frete) {
        frete.innerHTML = "";
    }


    const mapaContainer =
        document.getElementById(
            "mapaContainer"
        );

    if (mapaContainer) {
        mapaContainer.style.display = "none";
    }

}


/* =========================================================
   FECHAR PRODUTO
========================================================= */

function fecharProduto() {

    const modal =
        document.getElementById(
            "productModal"
        );

    if (modal) {

        modal.classList.remove("active");

    }

    document.body.style.overflow = "";

}


/* =========================================================
   SELECIONAR TAMANHO
========================================================= */

function selecionarTamanho(botao) {

    if (!botao) return;

    document
        .querySelectorAll(".sizes button")
        .forEach(item => {

            item.classList.remove("selected");

        });


    botao.classList.add("selected");

    tamanhoSelecionado =
        botao.textContent.trim();

}


/* =========================================================
   QUANTIDADE DO PRODUTO
========================================================= */

function alterarQuantidadeProduto(valor) {

    let novaQuantidade =
        quantidadeProduto +
        Number(valor);


    if (novaQuantidade < 1) {
        novaQuantidade = 1;
    }


    if (
        produtoAtual.estoque > 0 &&
        novaQuantidade >
        produtoAtual.estoque
    ) {

        novaQuantidade =
            produtoAtual.estoque;

    }


    quantidadeProduto =
        novaQuantidade;


    const campo1 =
        document.getElementById(
            "productQuantity"
        );

    const campo2 =
        document.getElementById(
            "quantidadeProduto"
        );


    if (campo1) {
        campo1.textContent =
            quantidadeProduto;
    }

    if (campo2) {
        campo2.textContent =
            quantidadeProduto;
    }

}


/* =========================================================
   ADICIONAR PRODUTO DOS CARDS
========================================================= */

function addCart(
    nome,
    preco,
    imagem = "",
    tamanho = "M",
    estoque = 999
) {

    preco = converterNumero(preco);

    estoque = Number(estoque) || 999;


    const produtoExistente =
        carrinho.find(item =>
            item.nome === nome &&
            item.tamanho === tamanho
        );


    if (produtoExistente) {

        if (
            produtoExistente.quantidade >=
            estoque
        ) {

            alert(
                "Quantidade máxima disponível em estoque."
            );

            return;

        }

        produtoExistente.quantidade++;

    } else {

        carrinho.push({

            nome: nome,

            preco: preco,

            imagem: imagem,

            tamanho: tamanho,

            quantidade: 1,

            estoque: estoque

        });

    }


    salvarCarrinho();

    atualizarCarrinho();

    abrirCarrinho();

}


/* =========================================================
   ADICIONAR PRODUTO DOS DETALHES
========================================================= */

function adicionarProdutoDetalhes() {

    if (!produtoAtual.nome) {

        alert(
            "Selecione um produto."
        );

        return;

    }


    if (!tamanhoSelecionado) {

        alert(
            "Escolha um tamanho antes de continuar."
        );

        return;

    }


    if (produtoAtual.estoque <= 0) {

        alert(
            "Produto sem estoque."
        );

        return;

    }


    const produtoExistente =
        carrinho.find(item =>
            item.nome === produtoAtual.nome &&
            item.tamanho === tamanhoSelecionado
        );


    if (produtoExistente) {

        const novaQuantidade =
            produtoExistente.quantidade +
            quantidadeProduto;


        if (
            novaQuantidade >
            produtoAtual.estoque
        ) {

            alert(
                "Quantidade superior ao estoque disponível."
            );

            return;

        }


        produtoExistente.quantidade =
            novaQuantidade;

    } else {

        carrinho.push({

            nome: produtoAtual.nome,

            preco: produtoAtual.preco,

            imagem: produtoAtual.imagem,

            tamanho: tamanhoSelecionado,

            quantidade: quantidadeProduto,

            estoque: produtoAtual.estoque

        });

    }


    salvarCarrinho();

    atualizarCarrinho();

    alert(
        "Produto adicionado ao carrinho!"
    );

    fecharProduto();

}


/* =========================================================
   SUBTOTAL
========================================================= */

function calcularSubtotal() {

    return carrinho.reduce(
        (total, item) => {

            return total +
                (
                    Number(item.preco) *
                    Number(item.quantidade)
                );

        },
        0
    );

}


/* =========================================================
   TOTAL
========================================================= */

function calcularTotal() {

    return (
        calcularSubtotal() +
        Number(freteAtual || 0)
    );

}


/* =========================================================
   ATUALIZAR VALORES
========================================================= */

function atualizarValoresFrete() {

    const subtotal =
        calcularSubtotal();

    const total =
        calcularTotal();


    const subtotalElement =
        document.getElementById(
            "subtotal"
        );

    const freteElement =
        document.getElementById(
            "frete"
        );

    const totalElement =
        document.getElementById(
            "total"
        );


    if (subtotalElement) {

        subtotalElement.textContent =
            formatarPreco(subtotal);

    }


    if (freteElement) {

        freteElement.textContent =
            freteAtual > 0
                ? "R$ " +
                  formatarPreco(freteAtual)
                : "Calcular";

    }


    if (totalElement) {

        totalElement.textContent =
            formatarPreco(total);

    }

}


/* =========================================================
   ATUALIZAR CARRINHO
========================================================= */

function atualizarCarrinho() {

    const cartItems =
        document.getElementById(
            "cartItems"
        );

    const cartCount =
        document.getElementById(
            "cartCount"
        );


    let quantidadeTotal = 0;


    carrinho.forEach(item => {

        quantidadeTotal +=
            Number(item.quantidade) || 0;

    });


    if (cartCount) {

        cartCount.textContent =
            quantidadeTotal;

    }


    atualizarValoresFrete();


    if (!cartItems) return;


    if (carrinho.length === 0) {

        cartItems.innerHTML = `

            <div class="emptyCart">

                <div class="emptyCartIcon">
                    🛒
                </div>

                <h3>
                    SEU CARRINHO ESTÁ VAZIO
                </h3>

                <p>
                    Adicione produtos da coleção ZYRO.
                </p>

                <a
                    href="#drop"
                    onclick="fecharCarrinho()">

                    VER PRODUTOS

                </a>

            </div>

        `;

        return;

    }


    cartItems.innerHTML = "";


    carrinho.forEach((item, index) => {

        const div =
            document.createElement("div");

        div.className = "cartProduct";


        div.innerHTML = `

            <div class="cartProductImage">

                ${
                    item.imagem
                    ?
                    `<img
                        src="${item.imagem}"
                        alt="${item.nome}"
                    >`
                    :
                    `<div class="noImage">
                        ZYRO
                    </div>`
                }

            </div>


            <div class="cartProductInfo">

                <h3>
                    ${item.nome}
                </h3>

                <p>
                    Tamanho: ${item.tamanho}
                </p>

                <strong>
                    R$ ${formatarPreco(item.preco)}
                </strong>


                <div class="cartQuantity">

                    <button
                        type="button"
                        onclick="
                            alterarQuantidadeCarrinho(
                                ${index},
                                -1
                            )
                        ">

                        −

                    </button>


                    <span>
                        ${item.quantidade}
                    </span>


                    <button
                        type="button"
                        onclick="
                            alterarQuantidadeCarrinho(
                                ${index},
                                1
                            )
                        ">

                        +

                    </button>

                </div>


                <button
                    type="button"
                    class="removeCart"
                    onclick="
                        removerProduto(${index})
                    ">

                    REMOVER

                </button>

            </div>

        `;


        cartItems.appendChild(div);

    });

}


/* =========================================================
   ALTERAR QUANTIDADE DO CARRINHO
========================================================= */

function alterarQuantidadeCarrinho(
    index,
    valor
) {

    if (!carrinho[index]) return;


    const novaQuantidade =
        Number(carrinho[index].quantidade) +
        Number(valor);


    if (novaQuantidade <= 0) {

        carrinho.splice(index, 1);

    } else {

        if (
            carrinho[index].estoque &&
            novaQuantidade >
            carrinho[index].estoque
        ) {

            alert(
                "Quantidade máxima disponível em estoque."
            );

            return;

        }


        carrinho[index].quantidade =
            novaQuantidade;

    }


    salvarCarrinho();

    atualizarCarrinho();

}


/* =========================================================
   REMOVER PRODUTO
========================================================= */

function removerProduto(index) {

    if (!carrinho[index]) return;

    carrinho.splice(index, 1);

    salvarCarrinho();

    atualizarCarrinho();

}


/* =========================================================
   ABRIR CARRINHO
========================================================= */

function abrirCarrinho() {

    const cartBox =
        document.getElementById(
            "cartBox"
        );

    if (!cartBox) return;

    cartBox.classList.add("active");

}


/* =========================================================
   FECHAR CARRINHO
========================================================= */

function fecharCarrinho() {

    const cartBox =
        document.getElementById(
            "cartBox"
        );

    if (!cartBox) return;

    cartBox.classList.remove("active");

}


/* =========================================================
   LOGIN
========================================================= */

function abrirLogin() {

    const modal =
        document.getElementById(
            "loginModal"
        );

    if (modal) {

        modal.classList.add("active");

    }

}


function fecharLogin() {

    const modal =
        document.getElementById(
            "loginModal"
        );

    if (modal) {

        modal.classList.remove("active");

    }

}


/* =========================================================
   CADASTRO
========================================================= */

function abrirCadastro() {

    fecharLogin();

    const modal =
        document.getElementById(
            "cadastroModal"
        );

    if (modal) {

        modal.classList.add("active");

    }

}


function fecharCadastro() {

    const modal =
        document.getElementById(
            "cadastroModal"
        );

    if (modal) {

        modal.classList.remove("active");

    }

}


/* =========================================================
   CRIAR CONTA
========================================================= */

function criarConta() {

    const nomeElement =
        document.getElementById(
            "cadastroNome"
        );

    const emailElement =
        document.getElementById(
            "cadastroEmail"
        );

    const senhaElement =
        document.getElementById(
            "cadastroSenha"
        );


    if (
        !nomeElement ||
        !emailElement ||
        !senhaElement
    ) {

        alert(
            "Formulário de cadastro não encontrado."
        );

        return;

    }


    const nome =
        nomeElement.value.trim();

    const email =
        emailElement.value.trim().toLowerCase();

    const senha =
        senhaElement.value;


    if (!nome || !email || !senha) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {

        alert(
            "Digite um e-mail válido."
        );

        return;

    }


    if (senha.length < 6) {

        alert(
            "A senha precisa ter pelo menos 6 caracteres."
        );

        return;

    }


    const usuario = {

        nome: nome,

        email: email,

        senha: senha

    };


    localStorage.setItem(
        CONFIG.USUARIO_KEY,
        JSON.stringify(usuario)
    );


    alert(
        "Conta criada com sucesso!"
    );


    fecharCadastro();

    abrirLogin();

}


/* =========================================================
   LOGIN
========================================================= */

function fazerLogin() {

    const emailElement =
        document.getElementById(
            "loginEmail"
        );

    const senhaElement =
        document.getElementById(
            "loginSenha"
        );


    if (
        !emailElement ||
        !senhaElement
    ) {

        return;

    }


    const email =
        emailElement.value.trim().toLowerCase();

    const senha =
        senhaElement.value;


    if (!email || !senha) {

        alert(
            "Digite seu e-mail e sua senha."
        );

        return;

    }


    const usuarioSalvo =
        localStorage.getItem(
            CONFIG.USUARIO_KEY
        );


    if (!usuarioSalvo) {

        alert(
            "Nenhuma conta encontrada. Crie uma conta primeiro."
        );

        return;

    }


    try {

        const usuario =
            JSON.parse(usuarioSalvo);


        if (
            email ===
            String(usuario.email).toLowerCase() &&
            senha === usuario.senha
        ) {

            localStorage.setItem(
                CONFIG.LOGIN_KEY,
                "true"
            );


            alert(
                "Login realizado com sucesso! Bem-vindo(a), " +
                usuario.nome +
                "!"
            );


            fecharLogin();

            atualizarLogin();

        } else {

            alert(
                "E-mail ou senha incorretos."
            );

        }

    } catch (erro) {

        console.error(erro);

        alert(
            "Erro ao verificar a conta."
        );

    }

}


/* =========================================================
   ATUALIZAR LOGIN
========================================================= */

function atualizarLogin() {

    const botoes =
        document.querySelectorAll(
            ".icons button"
        );


    const logado =
        localStorage.getItem(
            CONFIG.LOGIN_KEY
        );


    if (!botoes.length) return;


    botoes.forEach(botao => {

        const texto =
            botao.textContent
                .trim()
                .toUpperCase();


        if (
            logado === "true" &&
            texto.startsWith("LOGIN")
        ) {

            botao.textContent =
                "MINHA CONTA";

            botao.onclick =
                mostrarConta;

        }

    });

}


/* =========================================================
   MINHA CONTA
========================================================= */

function mostrarConta() {

    const usuarioSalvo =
        localStorage.getItem(
            CONFIG.USUARIO_KEY
        );


    if (!usuarioSalvo) {

        abrirLogin();

        return;

    }


    try {

        const usuario =
            JSON.parse(usuarioSalvo);


        const sair =
            confirm(

                "Olá, " +
                usuario.nome +
                "!\n\n" +

                "E-mail: " +
                usuario.email +
                "\n\n" +

                "Deseja sair da conta?"

            );


        if (sair) {

            localStorage.removeItem(
                CONFIG.LOGIN_KEY
            );

            location.reload();

        }

    } catch (erro) {

        console.error(erro);

    }

}


/* =========================================================
   CEP
========================================================= */

function limparCEP(cep) {

    return String(cep || "")
        .replace(/\D/g, "")
        .substring(0, 8);

}


function aplicarMascaraCEP(valor) {

    let cep = limparCEP(valor);


    if (cep.length > 5) {

        cep =
            cep.substring(0, 5) +
            "-" +
            cep.substring(5);

    }


    return cep;

}


/* =========================================================
   DISTÂNCIA ESTIMADA
========================================================= */

function calcularDistanciaCEP(
    cepOrigem,
    cepDestino
) {

    const origem =
        Number(
            limparCEP(cepOrigem)
                .substring(0, 3)
        ) || 0;


    const destino =
        Number(
            limparCEP(cepDestino)
                .substring(0, 3)
        ) || 0;


    return Math.abs(
        origem - destino
    );

}


/* =========================================================
   VALOR DO FRETE
========================================================= */

function calcularValorFrete(
    cepDestino
) {

    const distancia =
        calcularDistanciaCEP(
            CONFIG.CEP_ORIGEM,
            cepDestino
        );


    let valor =
        CONFIG.FRETE_MINIMO +
        (
            distancia *
            0.35
        );


    valor =
        Math.min(
            valor,
            CONFIG.FRETE_MAXIMO
        );


    return Math.round(
        valor * 100
    ) / 100;

}


/* =========================================================
   CALCULAR FRETE + CEP
========================================================= */

async function calcularFrete() {

    const input =
        document.getElementById(
            "cepInput"
        );

    const resultado =
        document.getElementById(
            "freteResultado"
        );


    if (!input || !resultado) {

        return;

    }


    const cep =
        limparCEP(input.value);


    if (cep.length !== 8) {

        resultado.innerHTML = `

            <p class="freteErro">
                Digite um CEP válido com 8 números.
            </p>

        `;

        return;

    }


    input.value =
        aplicarMascaraCEP(cep);


    resultado.innerHTML = `

        <div class="freteLoading">

            <p>
                Consultando endereço...
            </p>

        </div>

    `;


    try {

        const resposta =
            await fetch(
                `https://viacep.com.br/ws/${cep}/json/`
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro na consulta do CEP."
            );

        }


        const dados =
            await resposta.json();


        if (
            dados.erro
        ) {

            resultado.innerHTML = `

                <p class="freteErro">
                    CEP não encontrado.
                </p>

            `;

            esconderMapa();

            return;

        }


        /* =========================================
           CALCULA FRETE
        ========================================= */

        freteAtual =
            calcularValorFrete(cep);


        localStorage.setItem(
            CONFIG.FRETE_KEY,
            String(freteAtual)
        );


        /* =========================================
           SALVA ENDEREÇO
        ========================================= */

        enderecoAtual = {

            cep: cep,

            logradouro:
                dados.logradouro || "",

            complemento:
                dados.complemento || "",

            bairro:
                dados.bairro || "",

            cidade:
                dados.localidade || "",

            estado:
                dados.uf || "",

            estadoCompleto:
                dados.estado || "",

            regiao:
                dados.regiao || "",

            ibge:
                dados.ibge || "",

            gia:
                dados.gia || "",

            ddd:
                dados.ddd || ""

        };


        localStorage.setItem(
            CONFIG.ENDERECO_KEY,
            JSON.stringify(enderecoAtual)
        );


        atualizarValoresFrete();


        /* =========================================
           MOSTRA ENDEREÇO
        ========================================= */

        resultado.innerHTML = `

            <div class="freteSucesso">

                <strong>
                    ENDEREÇO ENCONTRADO
                </strong>

                <p>
                    ${
                        dados.logradouro ||
                        "Endereço não informado"
                    }
                    ${
                        dados.complemento
                        ? ", " + dados.complemento
                        : ""
                    }
                </p>

                <p>
                    ${
                        dados.bairro ||
                        "Bairro não informado"
                    }
                </p>

                <p>
                    ${
                        dados.localidade
                    }
                    -
                    ${
                        dados.uf
                    }
                </p>

                <p>
                    CEP:
                    ${
                        aplicarMascaraCEP(cep)
                    }
                </p>

                <hr>

                <p>
                    Frete:
                    <strong>
                        R$ ${formatarPreco(freteAtual)}
                    </strong>
                </p>

                <p>
                    Prazo estimado:
                    <strong>
                        ${CONFIG.PRAZO_MINIMO}
                        a
                        ${CONFIG.PRAZO_MAXIMO}
                        dias úteis
                    </strong>
                </p>

                <p>
                    Total com frete:
                    <strong>
                        R$ ${formatarPreco(calcularTotal())}
                    </strong>
                </p>

            </div>


            <button
                type="button"
                class="paymentRedirect"
                onclick="irParaPagamento()">

                CONTINUAR PARA PAGAMENTO
                →

            </button>

        `;


        /* =========================================
           MOSTRA MAPA
        ========================================= */

        await mostrarMapa(
            dados,
            cep
        );


    } catch (erro) {

        console.error(
            "Erro no cálculo do frete:",
            erro
        );


        resultado.innerHTML = `

            <p class="freteErro">

                Não foi possível consultar
                o CEP agora.

                <br><br>

                Tente novamente.

            </p>

        `;

        esconderMapa();

    }

}


/* =========================================================
   ESCONDER MAPA
========================================================= */

function esconderMapa() {

    const container =
        document.getElementById(
            "mapaContainer"
        );


    if (container) {

        container.style.display =
            "none";

    }


    if (mapa) {

        mapa.remove();

        mapa = null;

    }

}


/* =========================================================
   MAPA — LOCALIZAR ENDEREÇO
========================================================= */

async function mostrarMapa(
    dados,
    cep
) {

    const container =
        document.getElementById(
            "mapaContainer"
        );

    const mapaElemento =
        document.getElementById(
            "mapa"
        );


    if (!container || !mapaElemento) {

        console.warn(
            "Container do mapa não encontrado."
        );

        return;

    }


    if (
        typeof L === "undefined"
    ) {

        console.warn(
            "Leaflet não está carregado."
        );

        container.style.display =
            "none";

        return;

    }


    container.style.display =
        "block";


    /* =========================================
       REMOVE MAPA ANTERIOR
    ========================================= */

    if (mapa) {

        mapa.remove();

        mapa = null;

    }


    /* =========================================
       CRIA MAPA
    ========================================= */

    mapa =
        L.map("mapa", {
            scrollWheelZoom: true
        }).setView(
            [-14.2350, -51.9253],
            4
        );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                "&copy; OpenStreetMap contributors",
            maxZoom: 19
        }
    ).addTo(mapa);


    /* =========================================
       CONSULTA COMPLETA
    ========================================= */

    const consultas = [];


    /* Consulta pelo CEP primeiro */
    consultas.push(
        `${cep}, Brasil`
    );


    /* Consulta endereço */
    const enderecoCompleto = [

        dados.logradouro,

        dados.bairro,

        dados.localidade,

        dados.uf,

        cep,

        "Brasil"

    ].filter(Boolean).join(", ");


    if (enderecoCompleto) {

        consultas.push(
            enderecoCompleto
        );

    }


    /* Consulta cidade */
    consultas.push(
        `${dados.localidade}, ${dados.uf}, Brasil`
    );


    let localizado = false;


    /* =========================================
       TENTA TODAS AS CONSULTAS
    ========================================= */

    for (
        const consulta of consultas
    ) {

        if (localizado) {
            break;
        }


        try {

            const url =
                "https://nominatim.openstreetmap.org/search?" +
                new URLSearchParams({

                    format: "json",

                    q: consulta,

                    countrycodes: "br",

                    limit: "1",

                    addressdetails: "1"

                });


            const resposta =
                await fetch(
                    url,
                    {
                        headers: {
                            "Accept":
                                "application/json"
                        }
                    }
                );


            if (!resposta.ok) {
                continue;
            }


            const resultados =
                await resposta.json();


            if (
                !Array.isArray(resultados) ||
                !resultados.length
            ) {

                continue;

            }


            const local =
                resultados[0];


            const latitude =
                parseFloat(local.lat);

            const longitude =
                parseFloat(local.lon);


            if (
                !Number.isFinite(latitude) ||
                !Number.isFinite(longitude)
            ) {

                continue;

            }


            /* =================================
               DEFINE ZOOM
            ================================= */

            let zoom = 16;


            if (
                consulta ===
                `${dados.localidade}, ${dados.uf}, Brasil`
            ) {

                zoom = 12;

            }


            mapa.setView(
                [
                    latitude,
                    longitude
                ],
                zoom
            );


            /* =================================
               MARCADOR
            ================================= */

            const marcador =
                L.marker([
                    latitude,
                    longitude
                ]).addTo(mapa);


            marcador.bindPopup(`

                <strong>
                    ZYRO® — Local de entrega
                </strong>

                <br><br>

                ${
                    dados.logradouro ||
                    "Endereço"
                }

                <br>

                ${
                    dados.bairro ||
                    ""
                }

                <br>

                ${
                    dados.localidade ||
                    ""
                }

                -

                ${
                    dados.uf ||
                    ""
                }

                <br>

                CEP:

                ${
                    aplicarMascaraCEP(cep)
                }

            `);


            marcador.openPopup();


            localizado = true;


        } catch (erro) {

            console.warn(
                "Erro ao tentar localizar:",
                consulta,
                erro
            );

        }

    }


    /* =========================================
       SE NÃO LOCALIZOU
    ========================================= */

    if (!localizado) {

        console.warn(
            "Endereço não encontrado no mapa."
        );

        container.style.display =
            "none";

        return;

    }


    /* =========================================
       CORRIGE TAMANHO
    ========================================= */

    setTimeout(() => {

        if (mapa) {

            mapa.invalidateSize();

        }

    }, 500);

}


/* =========================================================
   RESTAURAR FRETE
========================================================= */

function restaurarFrete() {

    try {

        const freteSalvo =
            localStorage.getItem(
                CONFIG.FRETE_KEY
            );


        const enderecoSalvo =
            localStorage.getItem(
                CONFIG.ENDERECO_KEY
            );


        if (freteSalvo) {

            freteAtual =
                Number(freteSalvo) || 0;

        }


        if (enderecoSalvo) {

            enderecoAtual =
                JSON.parse(
                    enderecoSalvo
                );


            const input =
                document.getElementById(
                    "cepInput"
                );


            if (
                input &&
                enderecoAtual.cep
            ) {

                input.value =
                    aplicarMascaraCEP(
                        enderecoAtual.cep
                    );

            }

        }

    } catch (erro) {

        console.error(
            "Erro ao restaurar frete:",
            erro
        );

    }


    atualizarValoresFrete();

}


/* =========================================================
   PAGAMENTO
========================================================= */

function irParaPagamento() {

    if (carrinho.length === 0) {

        alert(
            "Seu carrinho está vazio."
        );

        return;

    }


    if (freteAtual <= 0) {

        alert(
            "Informe seu CEP e calcule o frete antes de continuar."
        );

        const cepInput =
            document.getElementById(
                "cepInput"
            );


        if (cepInput) {
            cepInput.focus();
        }

        return;

    }


    const paymentArea =
        document.querySelector(
            ".paymentArea"
        );


    if (!paymentArea) {

        alert(
            "Área de pagamento não encontrada."
        );

        return;

    }


    atualizarResumoPagamento();


    paymentArea.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });


    paymentArea.classList.add(
        "paymentHighlight"
    );


    setTimeout(() => {

        paymentArea.classList.remove(
            "paymentHighlight"
        );

    }, 2000);

}


/* =========================================================
   RESUMO PAGAMENTO
========================================================= */

function atualizarResumoPagamento() {

    const subtotal =
        calcularSubtotal();

    const total =
        calcularTotal();


    const subtotalPagamento =
        document.getElementById(
            "paymentSubtotal"
        );

    const fretePagamento =
        document.getElementById(
            "paymentFrete"
        );

    const totalPagamento =
        document.getElementById(
            "paymentTotal"
        );


    if (subtotalPagamento) {

        subtotalPagamento.textContent =
            "R$ " +
            formatarPreco(subtotal);

    }


    if (fretePagamento) {

        fretePagamento.textContent =
            "R$ " +
            formatarPreco(freteAtual);

    }


    if (totalPagamento) {

        totalPagamento.textContent =
            "R$ " +
            formatarPreco(total);

    }

}


/* =========================================================
   FORMAS DE PAGAMENTO
========================================================= */

function atualizarFormaPagamento(tipo) {

    const cartao =
        document.getElementById(
            "cartaoForm"
        );

    const pix =
        document.getElementById(
            "pixInfo"
        );

    const boleto =
        document.getElementById(
            "boletoInfo"
        );


    if (cartao) {

        cartao.style.display =
            tipo === "cartao"
                ? "block"
                : "none";

    }


    if (pix) {

        pix.style.display =
            tipo === "pix"
                ? "block"
                : "none";

    }


    if (boleto) {

        boleto.style.display =
            tipo === "boleto"
                ? "block"
                : "none";

    }

}


/* =========================================================
   EVENTO PAGAMENTO
========================================================= */

document.addEventListener(
    "change",
    function(event) {

        if (
            !event.target ||
            event.target.name !== "pagamento"
        ) {
            return;
        }


        atualizarFormaPagamento(
            event.target.value
        );

    }
);


/* =========================================================
   VALIDAR CARTÃO
========================================================= */

function validarCartao() {

    const numero =
        document.querySelector(
            '#cartaoForm input[placeholder="Número do cartão"]'
        );


    if (!numero) {

        return false;

    }


    const valor =
        numero.value.replace(
            /\D/g,
            ""
        );


    if (
        valor.length < 13 ||
        valor.length > 19
    ) {

        alert(
            "Digite um número de cartão válido."
        );

        numero.focus();

        return false;

    }


    return true;

}


/* =========================================================
   VALIDAR CHECKOUT
========================================================= */

function validarCheckout() {

    if (carrinho.length === 0) {

        alert(
            "Seu carrinho está vazio."
        );

        return false;

    }


    if (
        localStorage.getItem(
            CONFIG.LOGIN_KEY
        ) !== "true"
    ) {

        alert(
            "Faça login antes de finalizar a compra."
        );

        fecharCarrinho();

        abrirLogin();

        return false;

    }


    if (!enderecoAtual) {

        alert(
            "Informe o CEP para calcular o frete."
        );

        const cep =
            document.getElementById(
                "cepInput"
            );


        if (cep) {
            cep.focus();
        }

        return false;

    }


    if (freteAtual <= 0) {

        alert(
            "Calcule o frete antes de finalizar a compra."
        );

        return false;

    }


    const pagamento =
        document.querySelector(
            'input[name="pagamento"]:checked'
        );


    if (!pagamento) {

        alert(
            "Escolha uma forma de pagamento."
        );

        return false;

    }


    if (
        pagamento.value === "cartao"
    ) {

        if (!validarCartao()) {

            return false;

        }

    }


    return true;

}


/* =========================================================
   CRIAR RESUMO DO PEDIDO
========================================================= */

function criarResumoPedido(pagamento) {

    let resumo =
        "PEDIDO ZYRO®\n\n";


    carrinho.forEach(item => {

        resumo +=

            item.nome +

            " | Tamanho: " +

            item.tamanho +

            " | Qtd: " +

            item.quantidade +

            " | R$ " +

            formatarPreco(
                item.preco *
                item.quantidade
            ) +

            "\n";

    });


    resumo +=

        "\nSubtotal: R$ " +
        formatarPreco(
            calcularSubtotal()
        );


    resumo +=

        "\nFrete: R$ " +
        formatarPreco(
            freteAtual
        );


    resumo +=

        "\nTotal: R$ " +
        formatarPreco(
            calcularTotal()
        );


    resumo +=

        "\n\nPagamento: " +
        pagamento.toUpperCase();


    if (enderecoAtual) {

        resumo +=

            "\n\nENDEREÇO DE ENTREGA\n" +

            (
                enderecoAtual.logradouro ||
                ""
            ) +

            "\n" +

            (
                enderecoAtual.bairro ||
                ""
            ) +

            "\n" +

            (
                enderecoAtual.cidade ||
                ""
            ) +

            " - " +

            (
                enderecoAtual.estado ||
                ""
            ) +

            "\nCEP: " +

            aplicarMascaraCEP(
                enderecoAtual.cep
            );

    }


    return resumo;

}


/* =========================================================
   FINALIZAR COMPRA
========================================================= */

function finalizarCompra() {

    if (!validarCheckout()) {
        return;
    }


    const pagamento =
        document.querySelector(
            'input[name="pagamento"]:checked'
        );


    if (!pagamento) {
        return;
    }


    const resumo =
        criarResumoPedido(
            pagamento.value
        );


    console.log(
        "PEDIDO GERADO:",
        resumo
    );


    const pedidoId =
        "ZYRO-" +
        Date.now();


    const pedido = {

        id: pedidoId,

        itens: carrinho,

        subtotal:
            calcularSubtotal(),

        frete:
            freteAtual,

        total:
            calcularTotal(),

        pagamento:
            pagamento.value,

        endereco:
            enderecoAtual,

        data:
            new Date().toISOString()

    };


    localStorage.setItem(
        "ultimoPedidoZYRO",
        JSON.stringify(pedido)
    );


    alert(

        "PEDIDO REALIZADO COM SUCESSO!\n\n" +

        "Número do pedido: " +
        pedidoId +

        "\n\n" +

        "Total: R$ " +
        formatarPreco(
            pedido.total
        ) +

        "\n\n" +

        "Pagamento: " +
        pagamento.value.toUpperCase()

    );


    carrinho = [];

    salvarCarrinho();

    atualizarCarrinho();

    atualizarResumoPagamento();

    fecharCarrinho();

    fecharProduto();

}


/* =========================================================
   GERAR PIX
========================================================= */

function gerarPix() {

    if (!validarCheckout()) {
        return;
    }


    const codigo =
        "ZYROPIX-" +
        Date.now();


    const pixCodigo =
        document.getElementById(
            "pixCodigo"
        );


    if (pixCodigo) {

        pixCodigo.textContent =
            codigo;

    }


    alert(

        "PIX preparado!\n\n" +

        "Valor: R$ " +

        formatarPreco(
            calcularTotal()
        ) +

        "\n\n" +

        "Para cobrança PIX real, conecte um gateway de pagamento."

    );

}


/* =========================================================
   LOGIN ADMIN
========================================================= */

function abrirAdminLogin() {

    const modal =
        document.getElementById(
            "adminLoginModal"
        );


    if (modal) {

        modal.classList.add("active");

    }

}


function fecharAdminLogin() {

    const modal =
        document.getElementById(
            "adminLoginModal"
        );


    if (modal) {

        modal.classList.remove("active");

    }

}


/* =========================================================
   AUTENTICAR ADMIN
========================================================= */

function autenticarAdmin() {

    const usuarioElement =
        document.getElementById(
            "adminUser"
        );

    const senhaElement =
        document.getElementById(
            "adminPass"
        );


    if (
        !usuarioElement ||
        !senhaElement
    ) {
        return;
    }


    const usuario =
        usuarioElement.value.trim();

    const senha =
        senhaElement.value;


    /*
       LOGIN DEMONSTRATIVO

       Usuário: admin
       Senha: 1234

       NÃO USE EM PRODUÇÃO.
    */

    if (
        usuario === "admin" &&
        senha === "1234"
    ) {

        alert(
            "Login do moderador realizado!"
        );


        fecharAdminLogin();


        const addProduct =
            document.getElementById(
                "addProductModal"
            );


        if (addProduct) {

            addProduct.classList.add(
                "active"
            );

        }

    } else {

        alert(
            "Usuário ou senha do moderador incorretos."
        );

    }

}


/* =========================================================
   FECHAR CADASTRO PRODUTO
========================================================= */

function fecharAddProduct() {

    const modal =
        document.getElementById(
            "addProductModal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }

}


/* =========================================================
   SALVAR PRODUTO
========================================================= */

function salvarProduto() {

    const nomeElement =
        document.getElementById(
            "pNome"
        );

    const categoriaElement =
        document.getElementById(
            "pCategoria"
        );

    const precoElement =
        document.getElementById(
            "pPreco"
        );

    const imagemElement =
        document.getElementById(
            "pImg"
        );


    if (
        !nomeElement ||
        !categoriaElement ||
        !precoElement ||
        !imagemElement
    ) {

        alert(
            "Campos do produto não encontrados."
        );

        return;

    }


    const nome =
        nomeElement.value.trim();

    const categoria =
        categoriaElement.value.trim();

    const preco =
        precoElement.value.trim();

    const imagem =
        imagemElement.value.trim();


    if (
        !nome ||
        !categoria ||
        !preco ||
        !imagem
    ) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    alert(
        "Produto cadastrado com sucesso!"
    );


    fecharAddProduct();


    nomeElement.value = "";

    categoriaElement.value = "";

    precoElement.value = "";

    imagemElement.value = "";

}


/* =========================================================
   FECHAR MODAIS CLICANDO FORA
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const modais =
            document.querySelectorAll(
                ".modal, .productModal"
            );


        modais.forEach(modal => {

            if (
                event.target === modal
            ) {

                modal.classList.remove(
                    "active"
                );

                document.body.style.overflow =
                    "";

            }

        });

    }
);


/* =========================================================
   ESC FECHA MODAIS
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key !== "Escape"
        ) {
            return;
        }


        fecharProduto();

        fecharLogin();

        fecharCadastro();

        fecharCarrinho();

        fecharAdminLogin();

        fecharAddProduct();

    }
);


/* =========================================================
   MÁSCARA CEP
========================================================= */

document.addEventListener(
    "input",
    function(event) {

        if (
            !event.target ||
            event.target.id !== "cepInput"
        ) {
            return;
        }


        event.target.value =
            aplicarMascaraCEP(
                event.target.value
            );

    }
);


/* =========================================================
   ENTER NO CEP
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            !event.target ||
            event.target.id !== "cepInput"
        ) {
            return;
        }


        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            calcularFrete();

        }

    }
);


/* =========================================================
   ATUALIZAÇÃO AUTOMÁTICA PAGAMENTO
========================================================= */

document.addEventListener(
    "input",
    function(event) {

        if (
            event.target.closest(
                ".paymentArea"
            )
        ) {

            atualizarResumoPagamento();

        }

    }
);


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        /* ================================
           CARRINHO
        ================================= */

        carrinho =
            carregarCarrinho();


        /* ================================
           FRETE
        ================================= */

        restaurarFrete();


        /* ================================
           ATUALIZA CARRINHO
        ================================= */

        atualizarCarrinho();


        /* ================================
           LOGIN
        ================================= */

        atualizarLogin();


        /* ================================
           PIX PADRÃO
        ================================= */

        const pix =
            document.getElementById(
                "pixInfo"
            );

        const cartao =
            document.getElementById(
                "cartaoForm"
            );

        const boleto =
            document.getElementById(
                "boletoInfo"
            );


        const pagamentoPix =
            document.querySelector(
                'input[name="pagamento"][value="pix"]'
            );


        if (pagamentoPix) {

            pagamentoPix.checked =
                true;

        }


        if (pix) {

            pix.style.display =
                "block";

        }


        if (cartao) {

            cartao.style.display =
                "none";

        }


        if (boleto) {

            boleto.style.display =
                "none";

        }


        /* ================================
           RESUMO
        ================================= */

        atualizarResumoPagamento();

    }

);

// Exemplo básico para fazer a busca filtrar os cards do produto
function buscarProduto() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let cards = document.querySelectorAll('#productList .card');
    
    cards.forEach(card => {
        let title = card.querySelector('h3').innerText.toLowerCase();
        if (title.includes(input)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

// Funções do Modal de Login
function abrirLogin() {
    document.getElementById('loginModal').style.display = 'flex';
}

function fecharLogin() {
    document.getElementById('loginModal').style.display = 'none';
}

function realizarLogin(event) {
    event.preventDefault();
    alert('Login efetuado com sucesso!');
    fecharLogin();
}

// Adicione este listener ou substitua no seu script.js
document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Evita recarregar a página
        
        let dropSection = document.getElementById('drop');
        dropSection.scrollIntoView({ behavior: 'smooth' });
    }
});

// Adicione este listener ou substitua no seu script.js
document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Evita recarregar a página
        
        let dropSection = document.getElementById('drop');
        dropSection.scrollIntoView({ behavior: 'smooth' });
    }
});

function buscarProdutoAutocomplete() {
    let input = document.getElementById('searchInput').value.toLowerCase().trim();
    let dropdown = document.getElementById('searchDropdown');
    let cards = document.querySelectorAll('#productList .card, .products .card');

    // Limpa os resultados anteriores
    dropdown.innerHTML = '';

    // Se o campo estiver vazio, esconde o dropdown
    if (input.length === 0) {
        dropdown.classList.remove('active');
        return;
    }

    let achou = false;

    cards.forEach(card => {
        let titulo = card.querySelector('h3') ? card.querySelector('h3').innerText : '';
        let preco = card.querySelector('strong') ? card.querySelector('strong').innerText : '';
        let imagem = card.querySelector('img') ? card.querySelector('img').src : '';

        // Verifica se bate com a pesquisa
        if (titulo.toLowerCase().includes(input)) {
            achou = true;

            // Cria o item da lista
            let item = document.createElement('div');
            item.className = 'searchItem';
            item.innerHTML = `
                <img src="${imagem}" alt="${titulo}">
                <div class="searchItemInfo">
                    <strong>${titulo}</strong>
                    <span>${preco}</span>
                </div>
            `;

            // Ao clicar no item da lista, aciona o clique do card correspondente
            item.onclick = function () {
                card.click(); // Abre o modal do produto
                dropdown.classList.remove('active'); // Esconde o dropdown
                document.getElementById('searchInput').value = ''; // Limpa o campo
            };

            dropdown.appendChild(item);
        }
    });

    // Se não encontrou nada
    if (!achou) {
        dropdown.innerHTML = `<div class="noResults">NENHUM PRODUTO ENCONTRADO</div>`;
    }

    // Mostra o dropdown
    dropdown.classList.add('active');
}

// Esconde o dropdown se clicar fora da barra de pesquisa
document.addEventListener('click', function (event) {
    let searchBox = document.querySelector('.searchBox');
    let dropdown = document.getElementById('searchDropdown');
    
    if (searchBox && !searchBox.contains(event.target)) {
        dropdown.classList.remove('active');
    }
});

function buscarProdutoAutocomplete() {
    let input = document.getElementById('searchInput').value.toLowerCase().trim();
    let dropdown = document.getElementById('searchDropdown');
    
    // Pega todos os cards de produtos do site
    let cards = document.querySelectorAll('.card');

    if (!dropdown) return;

    // Limpa a lista anterior
    dropdown.innerHTML = '';

    // Se não tiver nada digitado, esconde
    if (input.length === 0) {
        dropdown.classList.remove('active');
        return;
    }

    let achou = false;

    cards.forEach(card => {
        // Busca o texto do título dentro do card
        let tituloElemento = card.querySelector('h3') || card.querySelector('h4') || card.querySelector('.title');
        let titulo = tituloElemento ? tituloElemento.innerText : card.innerText;
        
        // Busca a imagem do produto
        let imgElemento = card.querySelector('img');
        let imagem = imgElemento ? imgElemento.src : '';

        // Busca o preço (procura por R$ ou pela tag strong/span)
        let precoElemento = card.querySelector('strong') || card.querySelector('.price') || card.querySelector('span');
        let preco = precoElemento ? precoElemento.innerText : '';

        // Se o título condiz com o que foi digitado
        if (titulo.toLowerCase().includes(input)) {
            achou = true;

            let item = document.createElement('div');
            item.className = 'searchItem';
            item.innerHTML = `
                ${imagem ? `<img src="${imagem}" alt="${titulo}">` : ''}
                <div class="searchItemInfo">
                    <strong>${titulo}</strong>
                    ${preco ? `<span>${preco}</span>` : ''}
                </div>
            `;

            // Ao clicar no item do dropdown, clica no card original e fecha o menu
            item.addEventListener('click', function() {
                card.click();
                dropdown.classList.remove('active');
                document.getElementById('searchInput').value = '';
            });

            dropdown.appendChild(item);
        }
    });

    if (!achou) {
        dropdown.innerHTML = `<div class="noResults">NENHUM PRODUTO ENCONTRADO</div>`;
    }

    dropdown.classList.add('active');
}

// Esconde o menu ao clicar fora dele
document.addEventListener('click', function (e) {
    let searchBox = document.querySelector('.searchBox');
    let dropdown = document.getElementById('searchDropdown');
    if (searchBox && dropdown && !searchBox.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});

// =====================================================
// LÓGICA DA BARRA DE PESQUISA (SEARCH DROPDOWN)
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchDropdown = document.getElementById('searchDropdown');

    if (!searchInput || !searchDropdown) return;

    // Escuta o evento de digitação na barra de busca
    searchInput.addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase().trim();

        // Se o campo estiver vazio, esconde a lista
        if (termo === '') {
            searchDropdown.style.display = 'none';
            searchDropdown.innerHTML = '';
            return;
        }

        // Pega todos os cards de produtos que estão na página
        const cards = document.querySelectorAll('.card');
        let resultados = [];

        cards.forEach(card => {
            const h3 = card.querySelector('h3');
            const strong = card.querySelector('strong');
            const img = card.querySelector('.productImage img');

            if (h3) {
                const nomeProduto = h3.innerText;
                const precoProduto = strong ? strong.innerText : '';
                const imgSrc = img ? img.getAttribute('src') : '';

                // Verifica se o nome do produto contém o texto digitado
                if (nomeProduto.toLowerCase().includes(termo)) {
                    resultados.push({
                        nome: nomeProduto,
                        preco: precoProduto,
                        imagem: imgSrc,
                        elementoCard: card
                    });
                }
            }
        });

        // Renderiza os resultados no dropdown
        exibirResultadosPesquisa(resultados, searchDropdown);
    });

    // Esconde o dropdown se clicar fora da barra de busca
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
            searchDropdown.style.display = 'none';
        }
    });
});

// Renderizar itens encontrados no Dropdown
function exibirResultadosPesquisa(resultados, dropdown) {
    if (resultados.length === 0) {
        dropdown.innerHTML = '<div class="search-no-results">Nenhum produto encontrado</div>';
        dropdown.style.display = 'block';
        return;
    }

    dropdown.innerHTML = '';

    resultados.forEach(item => {
        const div = document.createElement('div');
        div.className = 'search-result-item';
        div.innerHTML = `
            <img src="${item.imagem}" alt="${item.nome}">
            <div>
                <strong>${item.nome}</strong>
                <span>${item.preco}</span>
            </div>
        `;

        // Ao clicar no resultado, rola a página até o card do produto
        div.addEventListener('click', () => {
            dropdown.style.display = 'none';
            document.getElementById('searchInput').value = '';
            item.elementoCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Efeito visual de destaque no card selecionado
            item.elementoCard.style.outline = '2px solid #ff0033';
            setTimeout(() => {
                item.elementoCard.style.outline = 'none';
            }, 2000);
        });

        dropdown.appendChild(div);
    });

    dropdown.style.display = 'block';
}

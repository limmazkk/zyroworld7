/* =====================================================
   ZYRO® - SISTEMA PRINCIPAL
===================================================== */


/* =====================================================
   VARIÁVEIS
===================================================== */

let carrinho = [];

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


/* =====================================================
   FORMATAÇÃO DE PREÇO
===================================================== */

function formatarPreco(valor) {

    return valor.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

}


/* =====================================================
   MENU MOBILE
===================================================== */

function menuMobile() {

    const menu = document.getElementById("menu");

    if (!menu) return;

    menu.classList.toggle("mobileActive");

}


/* =====================================================
   FAVORITOS
===================================================== */

function favoritar(elemento) {

    if (elemento.classList.contains("favorited")) {

        elemento.classList.remove("favorited");

        elemento.innerHTML = "♡";

    } else {

        elemento.classList.add("favorited");

        elemento.innerHTML = "♥";

    }

}


/* =====================================================
   ABRIR PRODUTO
===================================================== */

function abrirProduto(nome, preco, imagem, descricao, estoque) {

    produtoAtual = {
        nome: nome,
        preco: preco,
        imagem: imagem,
        descricao: descricao,
        estoque: estoque
    };

    quantidadeProduto = 1;

    tamanhoSelecionado = "";

    const modal = document.getElementById("productModal");

    const detailImage = document.getElementById("detailImage");

    const detailName = document.getElementById("detailName");

    const detailPrice = document.getElementById("detailPrice");

    const detailDescription =
        document.getElementById("detailDescription");

    const detailStock =
        document.getElementById("detailStock");


    if (detailImage) {

        detailImage.src = imagem;

    }


    if (detailName) {

        detailName.textContent = nome;

    }


    if (detailPrice) {

        detailPrice.textContent =
            "R$ " + formatarPreco(preco);

    }


    if (detailDescription) {

        detailDescription.textContent = descricao;

    }


    if (detailStock) {

        detailStock.textContent =
            estoque + " unidades disponíveis";

    }


    const quantidade =
        document.getElementById("productQuantity");

    const quantidade2 =
        document.getElementById("quantidadeProduto");


    if (quantidade) {

        quantidade.textContent = "1";

    }


    if (quantidade2) {

        quantidade2.textContent = "1";

    }


    /* Remove seleção anterior */

    document
        .querySelectorAll(".sizes button")
        .forEach(botao => {

            botao.classList.remove("selected");

        });


    if (modal) {

        modal.classList.add("active");

        document.body.style.overflow = "hidden";

    }


    /* Limpa frete */

    const frete =
        document.getElementById("freteResultado");

    if (frete) {

        frete.innerHTML = "";

    }


    const mapaContainer =
        document.getElementById("mapaContainer");

    if (mapaContainer) {

        mapaContainer.style.display = "none";

    }

}


/* =====================================================
   FECHAR PRODUTO
===================================================== */

function fecharProduto() {

    const modal =
        document.getElementById("productModal");

    if (modal) {

        modal.classList.remove("active");

    }

    document.body.style.overflow = "";

}


/* =====================================================
   TAMANHO
===================================================== */

function selecionarTamanho(botao) {

    document
        .querySelectorAll(".sizes button")
        .forEach(item => {

            item.classList.remove("selected");

        });


    botao.classList.add("selected");


    tamanhoSelecionado =
        botao.textContent.trim();

}


/* =====================================================
   QUANTIDADE DO PRODUTO
===================================================== */

function alterarQuantidadeProduto(valor) {

    let novaQuantidade =
        quantidadeProduto + valor;


    if (novaQuantidade < 1) {

        novaQuantidade = 1;

    }


    if (
        produtoAtual.estoque > 0 &&
        novaQuantidade > produtoAtual.estoque
    ) {

        novaQuantidade =
            produtoAtual.estoque;

    }


    quantidadeProduto =
        novaQuantidade;


    const campo1 =
        document.getElementById("productQuantity");

    const campo2 =
        document.getElementById("quantidadeProduto");


    if (campo1) {

        campo1.textContent =
            quantidadeProduto;

    }


    if (campo2) {

        campo2.textContent =
            quantidadeProduto;

    }

}


/* =====================================================
   ADICIONAR PRODUTO DOS CARDS
===================================================== */

function addCart(nome, preco) {

    const produtoExistente =
        carrinho.find(item => item.nome === nome);


    if (produtoExistente) {

        produtoExistente.quantidade++;

    } else {

        carrinho.push({

            nome: nome,

            preco: preco,

            imagem: "",

            tamanho: "M",

            quantidade: 1

        });

    }


    atualizarCarrinho();

    abrirCarrinho();

}


/* =====================================================
   ADICIONAR PRODUTO DA TELA DE DETALHES
===================================================== */

function adicionarProdutoDetalhes() {

    if (!produtoAtual.nome) {

        alert("Selecione um produto.");

        return;

    }


    if (!tamanhoSelecionado) {

        alert("Escolha um tamanho antes de continuar.");

        return;

    }


    if (produtoAtual.estoque <= 0) {

        alert("Produto sem estoque.");

        return;

    }


    const produtoExistente =
        carrinho.find(item =>
            item.nome === produtoAtual.nome &&
            item.tamanho === tamanhoSelecionado
        );


    if (produtoExistente) {

        produtoExistente.quantidade +=
            quantidadeProduto;

    } else {

        carrinho.push({

            nome: produtoAtual.nome,

            preco: produtoAtual.preco,

            imagem: produtoAtual.imagem,

            tamanho: tamanhoSelecionado,

            quantidade: quantidadeProduto

        });

    }


    atualizarCarrinho();


    alert("Produto adicionado ao carrinho!");


    fecharProduto();

}


/* =====================================================
   ATUALIZAR CARRINHO
===================================================== */

function atualizarCarrinho() {

    const cartItems =
        document.getElementById("cartItems");

    const cartCount =
        document.getElementById("cartCount");

    const subtotalElement =
        document.getElementById("subtotal");

    const totalElement =
        document.getElementById("total");


    let quantidadeTotal = 0;

    let subtotal = 0;


    carrinho.forEach(item => {

        quantidadeTotal +=
            item.quantidade;

        subtotal +=
            item.preco * item.quantidade;

    });


    if (cartCount) {

        cartCount.textContent =
            quantidadeTotal;

    }


    if (subtotalElement) {

        subtotalElement.textContent =
            formatarPreco(subtotal);

    }


    if (totalElement) {

        totalElement.textContent =
            formatarPreco(subtotal);

    }


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

        div.className =
            "cartProduct";


        div.innerHTML = `

            <div class="cartProductImage">

                ${
                    item.imagem
                    ?
                    `<img src="${item.imagem}" alt="${item.nome}">`
                    :
                    `<div class="noImage">ZYRO</div>`
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
                        onclick="alterarQuantidadeCarrinho(${index}, -1)">

                        −

                    </button>


                    <span>
                        ${item.quantidade}
                    </span>


                    <button
                        onclick="alterarQuantidadeCarrinho(${index}, 1)">

                        +

                    </button>

                </div>


                <button
                    class="removeCart"
                    onclick="removerProduto(${index})">

                    REMOVER

                </button>

            </div>

        `;


        cartItems.appendChild(div);

    });

}


/* =====================================================
   ALTERAR QUANTIDADE NO CARRINHO
===================================================== */

function alterarQuantidadeCarrinho(index, valor) {

    if (!carrinho[index]) return;


    carrinho[index].quantidade += valor;


    if (carrinho[index].quantidade <= 0) {

        carrinho.splice(index, 1);

    }


    atualizarCarrinho();

}


/* =====================================================
   REMOVER PRODUTO
===================================================== */

function removerProduto(index) {

    carrinho.splice(index, 1);

    atualizarCarrinho();

}


/* =====================================================
   ABRIR CARRINHO
===================================================== */

function abrirCarrinho() {

    const cartBox =
        document.getElementById("cartBox");


    if (!cartBox) return;


    cartBox.classList.add("active");

}


/* =====================================================
   FECHAR CARRINHO
===================================================== */

function fecharCarrinho() {

    const cartBox =
        document.getElementById("cartBox");


    if (!cartBox) return;


    cartBox.classList.remove("active");

}


/* =====================================================
   LOGIN
===================================================== */

function abrirLogin() {

    const modal =
        document.getElementById("loginModal");


    if (modal) {

        modal.classList.add("active");

    }

}


function fecharLogin() {

    const modal =
        document.getElementById("loginModal");


    if (modal) {

        modal.classList.remove("active");

    }

}


/* =====================================================
   CADASTRO
===================================================== */

function abrirCadastro() {

    fecharLogin();


    const modal =
        document.getElementById("cadastroModal");


    if (modal) {

        modal.classList.add("active");

    }

}


function fecharCadastro() {

    const modal =
        document.getElementById("cadastroModal");


    if (modal) {

        modal.classList.remove("active");

    }

}


/* =====================================================
   CRIAR CONTA
===================================================== */

function criarConta() {

    const nome =
        document.getElementById("cadastroNome").value.trim();

    const email =
        document.getElementById("cadastroEmail").value.trim();

    const senha =
        document.getElementById("cadastroSenha").value;


    if (!nome || !email || !senha) {

        alert("Preencha todos os campos.");

        return;

    }


    if (senha.length < 6) {

        alert("A senha precisa ter pelo menos 6 caracteres.");

        return;

    }


    const usuario = {

        nome: nome,

        email: email,

        senha: senha

    };


    localStorage.setItem(
        "usuarioZYRO",
        JSON.stringify(usuario)
    );


    alert(
        "Conta criada com sucesso! Agora você pode entrar."
    );


    fecharCadastro();

    abrirLogin();

}


/* =====================================================
   FAZER LOGIN
===================================================== */

function fazerLogin() {

    const email =
        document.getElementById("loginEmail").value.trim();

    const senha =
        document.getElementById("loginSenha").value;


    if (!email || !senha) {

        alert("Digite seu e-mail e sua senha.");

        return;

    }


    const usuarioSalvo =
        localStorage.getItem("usuarioZYRO");


    if (!usuarioSalvo) {

        alert(
            "Nenhuma conta encontrada. Crie uma conta primeiro."
        );

        return;

    }


    const usuario =
        JSON.parse(usuarioSalvo);


    if (
        email === usuario.email &&
        senha === usuario.senha
    ) {

        localStorage.setItem(
            "usuarioLogado",
            "true"
        );


        alert(
            "Login realizado com sucesso! Bem-vindo(a), "
            + usuario.nome + "!"
        );


        fecharLogin();


        atualizarLogin();

    } else {

        alert(
            "E-mail ou senha incorretos."
        );

    }

}


/* =====================================================
   ATUALIZAR BOTÃO DE LOGIN
===================================================== */

function atualizarLogin() {

    const botoes =
        document.querySelectorAll(".icons button");


    const logado =
        localStorage.getItem("usuarioLogado");


    if (!botoes.length) return;


    if (logado === "true") {

        botoes.forEach(botao => {

            if (
                botao.textContent
                    .trim()
                    .startsWith("LOGIN")
            ) {

                botao.textContent =
                    "MINHA CONTA";

                botao.onclick =
                    mostrarConta;

            }

        });

    }

}


/* =====================================================
   MINHA CONTA
===================================================== */

function mostrarConta() {

    const usuarioSalvo =
        localStorage.getItem("usuarioZYRO");


    if (!usuarioSalvo) {

        abrirLogin();

        return;

    }


    const usuario =
        JSON.parse(usuarioSalvo);


    const sair =
        confirm(
            "Olá, " +
            usuario.nome +
            "!\n\nE-mail: " +
            usuario.email +
            "\n\nDeseja sair da conta?"
        );


    if (sair) {

        localStorage.removeItem(
            "usuarioLogado"
        );


        location.reload();

    }

}


/* =====================================================
   FRETE
===================================================== */

function calcularFrete() {

    const input =
        document.getElementById("cepInput");


    const resultado =
        document.getElementById("freteResultado");


    if (!input || !resultado) return;


    let cep =
        input.value.replace(/\D/g, "");


    if (cep.length !== 8) {

        resultado.innerHTML = `

            <p class="freteErro">
                Digite um CEP válido com 8 números.
            </p>

        `;

        return;

    }


    input.value =
        cep.substring(0, 5) +
        "-" +
        cep.substring(5);


    resultado.innerHTML = `

        <p>
            Consultando endereço...
        </p>

    `;


    fetch(
        "https://viacep.com.br/ws/" +
        cep +
        "/json/"
    )

    .then(resposta => resposta.json())

    .then(dados => {

        if (dados.erro) {

            resultado.innerHTML = `

                <p class="freteErro">
                    CEP não encontrado.
                </p>

            `;

            return;

        }


        /*
         * Cálculo demonstrativo de frete.
         * Para uma loja real, o valor deve vir
         * de uma API de transportadora.
         */

        const frete =
            19.90;


        resultado.innerHTML = `

            <div class="freteSucesso">

                <strong>
                    ${dados.localidade} - ${dados.uf}
                </strong>

                <p>
                    ${dados.logradouro || "Endereço localizado"}
                </p>

                <p>
                    Frete: <strong>
                        R$ ${formatarPreco(frete)}
                    </strong>
                </p>

                <p>
                    Prazo estimado: 5 a 8 dias úteis
                </p>

            </div>


            <button
                class="paymentRedirect"
                onclick="irParaPagamento()">

                CONTINUAR PARA PAGAMENTO
                →

            </button>

        `;


        /* Mostrar mapa */

        mostrarMapa(
            dados.localidade,
            dados.uf,
            dados.logradouro
        );

    })

    .catch(erro => {

        console.error(erro);


        resultado.innerHTML = `

            <p class="freteErro">

                Não foi possível consultar o CEP.

            </p>

        `;

    });

}


/* =====================================================
   MAPA
===================================================== */

function mostrarMapa(cidade, estado, endereco) {

    const container =
        document.getElementById("mapaContainer");


    const mapaElemento =
        document.getElementById("mapa");


    if (!container || !mapaElemento) return;


    container.style.display = "block";


    /*
     * Se o mapa já existe, remove antes
     * de criar outro.
     */

    if (mapa) {

        mapa.remove();

        mapa = null;

    }


    mapa =
        L.map("mapa")
            .setView(
                [-14.2350, -51.9253],
                4
            );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                "&copy; OpenStreetMap"
        }
    ).addTo(mapa);


    /*
     * Consulta localização aproximada
     * usando Nominatim.
     */

    fetch(
        "https://nominatim.openstreetmap.org/search?format=json&q="
        +
        encodeURIComponent(
            cidade + ", " + estado + ", Brasil"
        )
    )

    .then(resposta => resposta.json())

    .then(dados => {

        if (!dados.length) return;


        const latitude =
            parseFloat(dados[0].lat);

        const longitude =
            parseFloat(dados[0].lon);


        mapa.setView(
            [latitude, longitude],
            12
        );


        L.marker([
            latitude,
            longitude
        ])
        .addTo(mapa)
        .bindPopup(
            "<b>Local de entrega</b><br>" +
            cidade +
            " - " +
            estado
        )
        .openPopup();

    })

    .catch(erro => {

        console.log(
            "Não foi possível localizar no mapa."
        );

    });


    /*
     * Corrige tamanho do Leaflet
     * quando o container estava escondido.
     */

    setTimeout(() => {

        mapa.invalidateSize();

    }, 300);

}


/* =====================================================
   IR PARA PAGAMENTO
===================================================== */

function irParaPagamento() {

    const paymentArea =
        document.querySelector(".paymentArea");


    if (!paymentArea) {

        alert(
            "Área de pagamento não encontrada."
        );

        return;

    }


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


/* =====================================================
   FORMAS DE PAGAMENTO
===================================================== */

document.addEventListener(
    "change",
    function(event) {

        if (
            event.target.name !== "pagamento"
        ) {

            return;

        }


        const tipo =
            event.target.value;


        const cartao =
            document.getElementById("cartaoForm");


        const pix =
            document.getElementById("pixInfo");


        const boleto =
            document.getElementById("boletoInfo");


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
);


/* =====================================================
   FINALIZAR COMPRA
===================================================== */

function finalizarCompra() {

    if (carrinho.length === 0) {

        alert(
            "Seu carrinho está vazio."
        );

        return;

    }


    const usuarioLogado =
        localStorage.getItem("usuarioLogado");


    if (usuarioLogado !== "true") {

        alert(
            "Faça login antes de finalizar sua compra."
        );


        fecharCarrinho();

        abrirLogin();

        return;

    }


    const pagamento =
        document.querySelector(
            'input[name="pagamento"]:checked'
        );


    if (!pagamento) {

        alert(
            "Escolha uma forma de pagamento."
        );

        return;

    }


    if (pagamento.value === "cartao") {

        const numero =
            document.querySelector(
                '#cartaoForm input[placeholder="Número do cartão"]'
            );


        if (
            !numero ||
            numero.value.replace(/\D/g, "").length < 13
        ) {

            alert(
                "Digite um número de cartão válido."
            );

            return;

        }

    }


    let mensagem =
        "PEDIDO REALIZADO COM SUCESSO!\n\n";


    carrinho.forEach(item => {

        mensagem +=
            item.nome +
            " | " +
            item.tamanho +
            " | Qtd: " +
            item.quantidade +
            "\n";

    });


    mensagem +=
        "\nForma de pagamento: " +
        pagamento.value.toUpperCase();


    alert(mensagem);


    carrinho = [];


    atualizarCarrinho();


    fecharCarrinho();


    fecharProduto();

}


/* =====================================================
   LOGIN MODERADOR
===================================================== */

function abrirAdminLogin() {

    const modal =
        document.getElementById("adminLoginModal");


    if (modal) {

        modal.classList.add("active");

    }

}


function fecharAdminLogin() {

    const modal =
        document.getElementById("adminLoginModal");


    if (modal) {

        modal.classList.remove("active");

    }

}


/* =====================================================
   AUTENTICAR MODERADOR
===================================================== */

function autenticarAdmin() {

    const usuario =
        document.getElementById("adminUser").value;

    const senha =
        document.getElementById("adminPass").value;


    /*
     * Login demonstrativo.
     *
     * Usuário:
     * admin
     *
     * Senha:
     * 1234
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

            addProduct.classList.add("active");

        }

    } else {

        alert(
            "Usuário ou senha do moderador incorretos."
        );

    }

}


/* =====================================================
   CADASTRO DE PRODUTO
===================================================== */

function fecharAddProduct() {

    const modal =
        document.getElementById(
            "addProductModal"
        );


    if (modal) {

        modal.classList.remove("active");

    }

}


function salvarProduto() {

    const nome =
        document.getElementById("pNome").value;

    const categoria =
        document.getElementById("pCategoria").value;

    const preco =
        document.getElementById("pPreco").value;

    const imagem =
        document.getElementById("pImg").value;


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


    document.getElementById("pNome").value = "";

    document.getElementById("pCategoria").value = "";

    document.getElementById("pPreco").value = "";

    document.getElementById("pImg").value = "";

}


/* =====================================================
   FECHAR MODAIS CLICANDO FORA
===================================================== */

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

                document.body.style.overflow = "";

            }

        });

    }
);


/* =====================================================
   ESC PARA FECHAR
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key !== "Escape") return;


        fecharProduto();

        fecharLogin();

        fecharCadastro();

        fecharCarrinho();

        fecharAdminLogin();

        fecharAddProduct();

    }
);


/* =====================================================
   MÁSCARA CEP
===================================================== */

document.addEventListener(
    "input",
    function(event) {

        if (
            event.target.id !== "cepInput"
        ) {

            return;

        }


        let cep =
            event.target.value.replace(
                /\D/g,
                ""
            );


        if (cep.length > 5) {

            cep =
                cep.substring(0, 5) +
                "-" +
                cep.substring(5, 8);

        }


        event.target.value =
            cep;

    }
);


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        atualizarCarrinho();

        atualizarLogin();


        /*
         * Deixa PIX selecionado inicialmente.
         */

        const pix =
            document.getElementById("pixInfo");


        const cartao =
            document.getElementById("cartaoForm");


        const boleto =
            document.getElementById("boletoInfo");


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

    }
);

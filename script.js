document.addEventListener('DOMContentLoaded', () => {

    // --- VERIFICAÇÃO DE ELEMENTOS CRÍTICOS ---
    const gradeProdutos = document.getElementById('grade-produtos');
    if (!gradeProdutos) {
        console.error("Erro Crítico: O contêiner de produtos '#grade-produtos' não foi encontrado. A aplicação não pode iniciar.");
        return; // Interrompe a execução se o elemento principal não existir.
    }

    // --- DADOS DOS PRODUTOS ---
    const produtos = [
        { id: 1, nome: "Bolo de Chocolate", descricao: "Um bolo de chocolate super fofinho com uma cobertura cremosa de brigadeiro.", preco: 75.00, caminhoImagem: "img/bolo-chocolate.webp", categoria: "bolos" },
        { id: 2, nome: "Torta de Limão", descricao: "Massa crocante com recheio de mousse de limão e cobertura de merengue suíço.", preco: 65.00, caminhoImagem: "img/torta-limao.webp", categoria: "tortas" },
        { id: 3, nome: "Brigadeiro Gourmet", descricao: "O clássico brigadeiro em sua melhor versão, feito com chocolate nobre.", preco: 4.00, caminhoImagem: "img/brigadeiro.webp", categoria: "doces" },
        { id: 4, nome: "Bolo de Cenoura", descricao: "Aquele bolo de cenoura com gostinho de casa de vó e muita cobertura de chocolate.", preco: 60.00, caminhoImagem: "img/bolo-cenoura.webp", categoria: "bolos" },
        { id: 5, nome: "Cheesecake de Morango", descricao: "Uma deliciosa e cremosa cheesecake com calda artesanal de morangos frescos.", preco: 80.00, caminhoImagem: "img/cheesecake.webp", categoria: "tortas" },
        { id: 6, nome: "Beijinho de Coco", descricao: "Doce tradicional de coco, perfeito para festas e para adoçar o dia.", preco: 3.50, caminhoImagem: "img/beijinho.webp", categoria: "doces" }
    ];

    // --- ESTADO DA APLICAÇÃO ---
    let carrinho = [];
    const numeroWhatsapp = "5521999832762";

    // --- ELEMENTOS DO DOM ---
    const botoesFiltro = document.querySelectorAll('.filtro-btn');
    const carrinhoIcone = document.getElementById('carrinho-icone');
    const carrinhoContador = document.getElementById('carrinho-contador');
    const modalCarrinho = document.getElementById('modal-carrinho');
    const closeButtonCarrinho = document.querySelector('.close-button-carrinho');
    const carrinhoItensContainer = document.getElementById('carrinho-itens');
    const carrinhoPrecoTotalEl = document.getElementById('carrinho-preco-total');
    const finalizarCompraBtn = document.getElementById('finalizar-compra-btn');

    // --- FUNÇÕES ---

    /**
     * Renderiza os produtos na grade e retorna uma Promise que resolve quando todas as imagens carregam.
     * @param {Array} listaProdutos - A lista de produtos a ser exibida.
     * @returns {Promise<void>}
     */
    const mostrarProdutos = (listaProdutos) => {
        gradeProdutos.innerHTML = '';

        if (listaProdutos.length === 0) {
            return Promise.resolve(); // Resolve imediatamente se não há produtos.
        }

        const promessasImagens = listaProdutos.map(produto => {
            return new Promise((resolve) => {
                const card = document.createElement('div');
                card.classList.add('produto-card');
                
                const img = new Image();
                img.src = produto.caminhoImagem;
                img.alt = produto.nome;
                
                // Resolve a promessa quando a imagem carrega ou dá erro.
                img.onload = resolve;
                img.onerror = resolve;

                card.innerHTML = `
                    <div class="produto-info">
                        <h3>${produto.nome}</h3>
                        <p>${produto.descricao}</p>
                        <div class="produto-rodape">
                            <span class="produto-preco">R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
                            <button class="add-carrinho-btn" data-id-produto="${produto.id}" title="Adicionar ao Carrinho"><i class="fas fa-cart-plus"></i></button>
                        </div>
                    </div>
                `;
                card.insertAdjacentElement('afterbegin', img);
                gradeProdutos.appendChild(card);
            });
        });

        return Promise.all(promessasImagens);
    };

    const atualizarCarrinho = () => {
        carrinhoItensContainer.innerHTML = '';
        let total = 0;
        let totalItens = 0;

        carrinho.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.classList.add('carrinho-item');
            itemEl.innerHTML = `
                <span class="carrinho-item-nome">${item.nome} (x${item.quantidade})</span>
                <span class="carrinho-item-preco">R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</span>
                <button class="remover-item-btn" data-id-produto="${item.id}" title="Remover Item">&times;</button>
            `;
            carrinhoItensContainer.appendChild(itemEl);
            total += item.preco * item.quantidade;
            totalItens += item.quantidade;
        });

        carrinhoPrecoTotalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        carrinhoContador.textContent = totalItens;
        
        if (totalItens > 0) {
            carrinhoContador.style.display = 'block';
            carrinhoContador.classList.add('carrinho-animar');
            setTimeout(() => {
                carrinhoContador.classList.remove('carrinho-animar');
            }, 300);
        } else {
            carrinhoContador.style.display = 'none';
        }
    };

    const adicionarAoCarrinho = (id) => {
        const produtoExistente = carrinho.find(item => item.id === id);
        if (produtoExistente) {
            produtoExistente.quantidade++;
        } else {
            const produto = produtos.find(p => p.id === id);
            if (produto) {
                carrinho.push({ ...produto, quantidade: 1 });
            }
        }
        atualizarCarrinho();
    };

    const removerDoCarrinho = (id) => {
        const itemNoCarrinho = carrinho.find(item => item.id === id);
        if (itemNoCarrinho && itemNoCarrinho.quantidade > 1) {
            itemNoCarrinho.quantidade--;
        } else {
            carrinho = carrinho.filter(item => item.id !== id);
        }
        atualizarCarrinho();
    };

    const gerarMensagemWhatsApp = () => {
        if (carrinho.length === 0) {
            alert("Seu carrinho está vazio!");
            return null;
        }
        let mensagem = "Olá, Ingrid! Gostaria de fazer um orçamento dos seguintes itens:\n\n";
        let total = 0;
        carrinho.forEach(item => {
            const subtotal = item.preco * item.quantidade;
            mensagem += `*${item.nome}* (x${item.quantidade}) - R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
            total += subtotal;
        });
        mensagem += `\n*Total do Orçamento:* R$ ${total.toFixed(2).replace('.', ',')}`;
        return `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensagem)}`;
    };

    // --- EVENT LISTENERS (ouvintes de eventos) ---

    function setupEventListeners() {
        botoesFiltro.forEach(botao => {
            botao.addEventListener('click', () => {
                if (botao.classList.contains('active')) {
                    return; // Não faz nada se o filtro já estiver ativo.
                }

                document.body.classList.add('loading');
                botoesFiltro.forEach(btn => btn.classList.remove('active'));
                botao.classList.add('active');

                const filtro = botao.dataset.filter;
                const produtosFiltrados = filtro === 'todos' ? produtos : produtos.filter(p => p.categoria === filtro);

                // Garante que o loader seja exibido antes de carregar as imagens.
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        mostrarProdutos(produtosFiltrados).then(() => {
                            document.body.classList.remove('loading');
                        });
                    }, 0);
                });
            });
        });

        gradeProdutos.addEventListener('click', (e) => {
            const botaoAdicionar = e.target.closest('.add-carrinho-btn');
            if (botaoAdicionar) {
                const idProduto = parseInt(botaoAdicionar.dataset.idProduto);
                adicionarAoCarrinho(idProduto);
            }
        });

        carrinhoItensContainer.addEventListener('click', (e) => {
            const botaoRemover = e.target.closest('.remover-item-btn');
            if (botaoRemover) {
                const idProduto = parseInt(botaoRemover.dataset.idProduto);
                removerDoCarrinho(idProduto);
            }
        });

        carrinhoIcone.addEventListener('click', () => {
            modalCarrinho.style.display = 'block';
        });

        // Animação do ícone do carrinho ao ser pressionado
        carrinhoIcone.addEventListener('mousedown', () => {
            carrinhoIcone.classList.add('pressed');
        });

        carrinhoIcone.addEventListener('mouseup', () => {
            carrinhoIcone.classList.remove('pressed');
        });

        carrinhoIcone.addEventListener('mouseleave', () => {
            // Remove a classe se o mouse sair enquanto pressionado
            carrinhoIcone.classList.remove('pressed');
        });

        closeButtonCarrinho.addEventListener('click', () => {
            modalCarrinho.style.display = 'none';
        });

        finalizarCompraBtn.addEventListener('click', () => {
            const urlWhatsapp = gerarMensagemWhatsApp();
            if (urlWhatsapp) {
                window.open(urlWhatsapp, '_blank');
                modalCarrinho.style.display = 'none';
            }
        });

        window.addEventListener('click', (e) => {
            if (e.target === modalCarrinho) {
                modalCarrinho.style.display = 'none';
            }
        });
    }

    // --- INICIALIZAÇÃO ---
    function init() {
        setupEventListeners();
        atualizarCarrinho();
        // Carga inicial dos produtos (sem loader)
        document.body.classList.add('loading');
        mostrarProdutos(produtos).then(() => {
            document.body.classList.remove('loading');
        });
    }

    init();

});
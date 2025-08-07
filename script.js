document.addEventListener('DOMContentLoaded', () => {

    // --- VERIFICAÇÃO DE ELEMENTOS CRÍTICOS ---
    const gradeProdutos = document.getElementById('grade-produtos');
    if (!gradeProdutos) {
        console.error("Erro Crítico: O contêiner de produtos '#grade-produtos' não foi encontrado. A aplicação não pode iniciar.");
        return; 
    }

    // --- DADOS DOS PRODUTOS ---
    const produtos = [
        { id: 1, nome: "Bolo de Chocolate", descricao: "Um bolo de chocolate super fofinho com uma cobertura cremosa de brigadeiro.", preco: 75.00, caminhoImagem: "img/bolo-chocolate.jpg", categoria: "bolos" },
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
    const pesquisaInput = document.getElementById('pesquisa-input');
    const botoesOrdenacao = document.querySelectorAll('.ordenacao-btn'); // Novo seletor
    const carrinhoIcone = document.getElementById('carrinho-icone');
    const carrinhoContador = document.getElementById('carrinho-contador');
    const modalCarrinho = document.getElementById('modal-carrinho');
    const closeButtonCarrinho = document.querySelector('.close-button-carrinho');
    const carrinhoItensContainer = document.getElementById('carrinho-itens');
    const carrinhoPrecoTotalEl = document.getElementById('carrinho-preco-total');
    const finalizarCompraBtn = document.getElementById('finalizar-compra-btn');
    const toastContainer = document.getElementById('toast-container');
    const carrinhoVazioMsg = document.getElementById('carrinho-vazio-mensagem');

    // --- FUNÇÕES ---

    /**
     * Mostra uma notificação (toast) na tela.
     * @param {string} mensagem - A mensagem a ser exibida.
     */
    const mostrarToast = (mensagem) => {
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.textContent = mensagem;
        toastContainer.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => toast.remove());
        }, 3000);
    };

    /**
     * Renderiza os produtos na grade.
     * @param {Array} listaProdutos - A lista de produtos a ser exibida.
     */
    const mostrarProdutos = (listaProdutos) => {
        gradeProdutos.innerHTML = '';
        if (listaProdutos.length === 0) {
            gradeProdutos.innerHTML = '<p class="nenhum-produto">Nenhum produto encontrado.</p>';
            return;
        }

        listaProdutos.forEach(produto => {
            const card = document.createElement('div');
            card.classList.add('produto-card');
            card.innerHTML = `
                <img src="${produto.caminhoImagem}" alt="${produto.nome}">
                <div class="produto-info">
                    <h3>${produto.nome}</h3>
                    <p>${produto.descricao}</p>
                    <div class="produto-rodape">
                        <span class="produto-preco">R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
                        <button class="add-carrinho-btn" data-id-produto="${produto.id}" title="Adicionar ao Carrinho"><i class="fas fa-cart-plus"></i></button>
                    </div>
                </div>
            `;
            gradeProdutos.appendChild(card);
        });
    };

    /**
     * Salva o estado do carrinho no localStorage.
     */
    const salvarCarrinho = () => {
        localStorage.setItem('carrinhoConfeitaria', JSON.stringify(carrinho));
    };

    /**
     * Carrega o carrinho do localStorage ao iniciar a página.
     */
    const carregarCarrinho = () => {
        const carrinhoSalvo = localStorage.getItem('carrinhoConfeitaria');
        if (carrinhoSalvo) {
            carrinho = JSON.parse(carrinhoSalvo);
        }
    };

    const atualizarCarrinho = () => {
        carrinhoItensContainer.innerHTML = '';
        let total = 0;
        let totalItens = 0;

        if (carrinho.length === 0) {
            carrinhoVazioMsg.style.display = 'block';
            carrinhoItensContainer.style.display = 'none';
            finalizarCompraBtn.style.display = 'none';
            document.getElementById('carrinho-total').style.display = 'none';
        } else {
            carrinhoVazioMsg.style.display = 'none';
            carrinhoItensContainer.style.display = 'block';
            finalizarCompraBtn.style.display = 'flex';
            document.getElementById('carrinho-total').style.display = 'block';

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
        }

        carrinhoPrecoTotalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        carrinhoContador.textContent = totalItens;
        
        if (totalItens > 0) {
            carrinhoContador.style.display = 'flex';
            if (!document.querySelector('.carrinho-animar')) {
                carrinhoContador.classList.add('carrinho-animar');
                setTimeout(() => {
                    carrinhoContador.classList.remove('carrinho-animar');
                }, 300);
            }
        } else {
            carrinhoContador.style.display = 'none';
        }
        salvarCarrinho();
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
        mostrarToast('Produto adicionado ao carrinho!');
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

    const filtrarEExibirProdutos = () => {
        const termoPesquisa = pesquisaInput.value.toLowerCase();
        const filtroAtivo = document.querySelector('.filtro-btn.active').dataset.filter;
        const tipoOrdenacao = document.querySelector('.ordenacao-btn.active').dataset.sort;

        let produtosFiltrados = [...produtos]; // Usar uma cópia para não alterar a ordem original

        // 1. Filtragem por categoria
        if (filtroAtivo !== 'todos') {
            produtosFiltrados = produtosFiltrados.filter(p => p.categoria === filtroAtivo);
        }

        // 2. Filtragem por pesquisa
        if (termoPesquisa) {
            produtosFiltrados = produtosFiltrados.filter(p => p.nome.toLowerCase().includes(termoPesquisa));
        }

        // 3. Ordenação
        if (tipoOrdenacao === 'preco-asc') {
            produtosFiltrados.sort((a, b) => a.preco - b.preco);
        } else if (tipoOrdenacao === 'preco-desc') {
            produtosFiltrados.sort((a, b) => b.preco - a.preco);
        }
        // Se for 'padrao', a ordem original (após filtros) é mantida

        mostrarProdutos(produtosFiltrados);
    };

    // --- EVENT LISTENERS ---

    function setupEventListeners() {
        // Listener para o toggle de ordenação em mobile
        const ordenacaoContainer = document.getElementById('ordenacao-container');
        const ordenacaoToggle = document.querySelector('.ordenacao-toggle');
        if (ordenacaoToggle) {
            ordenacaoToggle.addEventListener('click', () => {
                ordenacaoContainer.classList.toggle('open');
            });
        }

        botoesFiltro.forEach(botao => {
            botao.addEventListener('click', () => {
                if (botao.classList.contains('active')) return;
                botoesFiltro.forEach(btn => btn.classList.remove('active'));
                botao.classList.add('active');
                filtrarEExibirProdutos();
            });
        });

        pesquisaInput.addEventListener('input', filtrarEExibirProdutos);

        botoesOrdenacao.forEach(botao => {
            botao.addEventListener('click', () => {
                if (botao.classList.contains('active')) return;
                botoesOrdenacao.forEach(btn => btn.classList.remove('active'));
                botao.classList.add('active');
                filtrarEExibirProdutos();
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

        carrinhoIcone.addEventListener('mousedown', () => {
            carrinhoIcone.classList.add('pressed');
        });

        carrinhoIcone.addEventListener('mouseup', () => {
            carrinhoIcone.classList.remove('pressed');
        });

        carrinhoIcone.addEventListener('mouseleave', () => {
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
        carregarCarrinho();
        setupEventListeners();
        atualizarCarrinho();
        filtrarEExibirProdutos();
    }

    init();

});
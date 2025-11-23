/**
 * Este script é executado quando o DOM (a estrutura da página HTML) está completamente carregado.
 * Ele é responsável por buscar os dados dos filmes, exibi-los na tela e
 * gerenciar a funcionalidade de busca.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos do HTML que serão manipulados pelo script.
    const gradeArtigos = document.querySelector('.articles-grid');
    const campoBusca = document.getElementById('campo-busca');
    const botaoBuscar = document.getElementById('botao-buscar');
    // Seleciona os botões de ordenação que estão no HTML
    const botaoAnoDesc = document.getElementById('ordenar-ano-desc');
    const botaoAnoAsc = document.getElementById('ordenar-ano-asc');
    const botaoNome = document.getElementById('ordenar-nome');

    // Array para armazenar a lista completa de filmes carregada do data.json.
    // Isso evita a necessidade de buscar os dados novamente a cada pesquisa.
    let todosOsFilmes = [];
    // Armazena o estado atual da ordenação.
    let ordenacaoAtual = 'lancamento_desc'; // 'lancamento_desc', 'lancamento_asc', ou 'alfabetica'


    /**
     * Cria a estrutura HTML para um único card de filme.
     * @param {object} filme - O objeto do filme contendo nome, ano, sinopse, link e img.
     * @returns {string} Uma string contendo o HTML do elemento <article> do card.
     */
    function criarCartaoFilme(filme) {
        const tagsHtml = filme.tags && filme.tags.length > 0
            ? `<div class="tags-container">${filme.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>`
            : '';

        return `
            <article class="cartao" data-nome-filme="${filme.nome}">
                <img src="${filme.img}" alt="Pôster do filme ${filme.nome}">
                <h4>${filme.nome} (${filme.ano})</h4>
                ${tagsHtml}
                <p>${filme.sinopse}</p>
                <a href="#" class="botao-detalhes">Ver Detalhes</a>
            </article>
        `;
    }

    /**
     * Renderiza uma lista de filmes na grade da página.
     * @param {Array<object>} movies - Um array de objetos de filme a serem exibidos.
     */
    function exibirFilmes(filmes) { 
        if (!gradeArtigos) {
            console.error("Erro: O contêiner '.articles-grid' não foi encontrado no DOM.");
            return;
        }

        // Limpa a grade antes de adicionar os novos cards para evitar duplicatas.
        gradeArtigos.innerHTML = ''; 

        // Se a lista de filmes estiver vazia (nenhum resultado encontrado), exibe uma mensagem.
        if (filmes.length === 0) {
            gradeArtigos.innerHTML = '<p class="nao-encontrado">Nenhum filme encontrado com esse nome. Tente novamente.</p>';
            return;
        }

        // Cria o HTML para todos os cards de uma vez e o insere na grade.
        // Usar map().join() é mais performático do que adicionar um elemento de cada vez ao DOM.
        const cartoesHtml = filmes.map(criarCartaoFilme).join('');
        gradeArtigos.innerHTML = cartoesHtml;
    }

    /**
     * Busca os dados dos filmes do arquivo 'data.json' de forma assíncrona.
     * Após buscar, armazena os dados na variável `allMovies` e chama a função para exibi-los.
     */
    async function buscarDadosEExibir() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                // Lança um erro se a resposta da rede não for bem-sucedida (ex: erro 404).
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            todosOsFilmes = await response.json(); 
            // Exibe os filmes na ordem padrão (definida por ordenacaoAtual).
            atualizarExibicao();
        } catch (error) {
            // Em caso de erro na busca, exibe uma mensagem de erro na tela e no console.
            console.error("Erro ao buscar os dados dos filmes:", error);
            gradeArtigos.innerHTML = '<p class="nao-encontrado">Ocorreu um erro ao carregar os filmes. Por favor, tente recarregar a página.</p>';
        }
    }

    /**
     * Filtra e ordena os filmes com base nos critérios atuais (busca e ordenação) e os exibe.
     */
    function atualizarExibicao() {
        // Pega o valor do input, remove espaços em branco no início/fim e converte para minúsculas.
        const termoBusca = campoBusca.value.trim().toLowerCase();

        // 1. Filtra os filmes
        let filmesParaExibir = todosOsFilmes.filter(filme => 
            filme.nome.toLowerCase().includes(termoBusca) || 
            filme.sinopse.toLowerCase().includes(termoBusca) || 
            filme.ano.toString().includes(termoBusca) ||
            (Array.isArray(filme.tags) && filme.tags.some(tag => tag.toLowerCase().includes(termoBusca)))
        );

        // 2. Ordena os filmes filtrados
        if (ordenacaoAtual === 'lancamento_desc') {
            // Ordena por ano (mais novo para o mais antigo)
            filmesParaExibir.sort((a, b) => b.ano.localeCompare(a.ano));
        } else if (ordenacaoAtual === 'lancamento_asc') {
            // Ordena por ano (mais antigo para o mais novo)
            filmesParaExibir.sort((a, b) => a.ano.localeCompare(b.ano));
        } else if (ordenacaoAtual === 'alfabetica') {
            // Ordena por nome (A-Z)
            filmesParaExibir.sort((a, b) => a.nome.localeCompare(b.nome));
        }

        // 3. Exibe o resultado final
        exibirFilmes(filmesParaExibir);
        // 4. Atualiza o destaque do botão ativo
        atualizarBotaoAtivo();
    }

    /**
     * Encontra um filme pelo nome, salva seus dados e redireciona para a página de detalhes.
     * @param {string} nomeFilme - O nome do filme a ser exibido.
     */
    function abrirPaginaDetalhes(nomeFilme) {
        const filme = todosOsFilmes.find(f => f.nome === nomeFilme);
        if (filme) {
            // Salva o objeto do filme no sessionStorage para ser acessado pela outra página
            sessionStorage.setItem('filmeSelecionado', JSON.stringify(filme));
            // Redireciona para a página de detalhes
            window.location.href = 'detalhes.html';
        } else {
            console.error('Filme não encontrado:', nomeFilme);
        }
    }

    /**
     * Atualiza qual botão de ordenação tem a classe 'active'.
     */
    function atualizarBotaoAtivo() {
        // Seleciona todos os botões que têm o atributo data-sort
        const botoesOrdenacao = document.querySelectorAll('.controles-ordenacao button[data-sort]');
        botoesOrdenacao.forEach(button => {
            // Se o data-sort do botão for igual ao critério de ordenação atual, adiciona a classe 'active'.
            // Caso contrário, remove a classe.
            button.classList.toggle('active', button.dataset.sort === ordenacaoAtual);
        });
    }

    // --- Adiciona os "escutadores" de eventos aos elementos ---

    // 1. Evento de busca: Apenas no clique do botão.
    botaoBuscar.addEventListener('click', atualizarExibicao);

    // 2. Eventos de ordenação
    botaoAnoDesc.addEventListener('click', () => {
        ordenacaoAtual = 'lancamento_desc';
        atualizarExibicao();
    });
    botaoAnoAsc.addEventListener('click', () => {
        ordenacaoAtual = 'lancamento_asc';
        atualizarExibicao();
    });
    botaoNome.addEventListener('click', () => {
        ordenacaoAtual = 'alfabetica';
        atualizarExibicao();
    });

    // 3. Evento de clique nos cards (usando delegação de eventos)
    gradeArtigos.addEventListener('click', (evento) => {
        // Procura pelo elemento .cartao mais próximo do elemento que foi clicado
        const cartao = evento.target.closest('.cartao');
        if (cartao) {
            evento.preventDefault(); // Impede o comportamento padrão do link
            const nomeFilme = cartao.dataset.nomeFilme;
            abrirPaginaDetalhes(nomeFilme);
        }
    });

    // Chama a função para buscar e exibir os dados assim que o script é executado.
    buscarDadosEExibir();
});
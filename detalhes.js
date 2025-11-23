/**
 * Este script é executado quando a página de detalhes do filme é carregada.
 * Ele lê os dados do filme selecionado do sessionStorage e os exibe na tela.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona o contêiner onde as informações do filme serão exibidas.
    const container = document.getElementById('detalhes-filme-container');

    // Tenta obter a string JSON do filme do sessionStorage.
    const filmeJson = sessionStorage.getItem('filmeSelecionado');

    // Verifica se o contêiner existe e se os dados do filme foram encontrados.
    if (container && filmeJson) {
        try {
            // Converte a string JSON de volta para um objeto JavaScript.
            const filme = JSON.parse(filmeJson);

            // Cria o HTML para as tags, se existirem.
            const tagsHtml = filme.tags && filme.tags.length > 0
                ? `<div class="tags-container">${filme.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>`
                : '';

            // Monta o HTML final com todas as informações do filme.
            container.innerHTML = `
                <div class="detalhes-poster">
                    <img src="${filme.img}" alt="Pôster do filme ${filme.nome}">
                </div>
                <div class="detalhes-info">
                    <h2>${filme.nome} (${filme.ano})</h2>
                    ${tagsHtml}
                    <h3>Sinopse</h3>
                    <p>${filme.sinopse}</p>
                    <a href="${filme.link}" target="_blank" class="botao-imdb">Ver no IMDB</a>
                </div>
            `;
        } catch (error) {
            console.error("Erro ao processar os dados do filme:", error);
            container.innerHTML = '<p class="erro-detalhes">Não foi possível carregar os detalhes do filme.</p>';
        }
    } else {
        // Se não encontrar dados do filme, exibe uma mensagem de erro.
        container.innerHTML = '<p class="erro-detalhes">Nenhum filme selecionado. Por favor, volte à página inicial e escolha um filme.</p>';
    }
});
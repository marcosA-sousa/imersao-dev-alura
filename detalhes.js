/**
 * Este script é executado quando a página de detalhes do filme é carregada.
 * Ele lê os dados do filme selecionado a partir do `sessionStorage`,
 * constrói o HTML correspondente e o insere na página.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Seleciona o elemento contêiner principal onde os detalhes do filme serão renderizados.
    const container = document.getElementById('detalhes-filme-container');

    // 2. Tenta obter a string JSON do filme que foi armazenada no sessionStorage na página anterior.
    const filmeJson = sessionStorage.getItem('filmeSelecionado');

    // 3. Verifica se o contêiner de destino existe no DOM e se os dados do filme foram encontrados no sessionStorage.
    if (container && filmeJson) {
        try {
            // 4. Converte (parse) a string JSON de volta para um objeto JavaScript.
            // Esta operação é envolvida em um bloco try...catch, pois pode falhar se o JSON for inválido.
            const filme = JSON.parse(filmeJson);

            // 5. Gera o HTML para as tags do filme.
            // Usa um operador ternário para verificar se o array de tags existe e não está vazio.
            // Se sim, mapeia cada tag para um elemento <span> e os une em uma única string.
            // Se não, retorna uma string vazia.
            const tagsHtml = filme.tags && filme.tags.length > 0
                ? `<div class="tags-container">${filme.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>`
                : '';

            // 6. Monta o bloco de HTML final usando Template Literals (crases ``).
            // Isso permite incorporar as propriedades do objeto 'filme' diretamente no HTML de forma legível.
            // - <h1>: Usado para o título do filme, a informação mais importante da página.
            // - <h2>: Usado para subseções como "Sinopse".
            container.innerHTML = `
                <div class="detalhes-poster">
                    <img src="${filme.img}" alt="Pôster do filme ${filme.nome}">
                </div>
                <div class="detalhes-info">
                    <h1>${filme.nome} (${filme.ano})</h1>
                    ${tagsHtml}
                    <h2>Sinopse</h2>
                    <p>${filme.sinopse}</p>
                    <a href="${filme.link}" target="_blank" class="botao-imdb">Ver no IMDB</a>
                </div>
            `;
        } catch (error) {
            // 7. Se ocorrer um erro durante o parsing do JSON, ele é capturado aqui.
            console.error("Erro ao processar os dados do filme:", error);
            container.innerHTML = '<p class="erro-detalhes">Não foi possível carregar os detalhes do filme.</p>';
        }
    } else {
        // 8. Se os dados do filme não forem encontrados no sessionStorage, exibe uma mensagem de erro clara para o usuário.
        container.innerHTML = '<p class="erro-detalhes">Nenhum filme selecionado. Por favor, volte à página inicial e escolha um filme.</p>';
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const brandSelect = document.getElementById('brandSelect');
    const modelSelect = document.getElementById('modelSelect');
    const yearSelect = document.getElementById('yearSelect');
    const searchButton = document.getElementById('searchButton');
    const resultsContainer = document.getElementById('resultsContainer');

    // URLs da API
    const API_URL_BRANDS = 'https://parallelum.com.br/fipe/api/v1/carros/marcas';
    const API_URL_MODELS = (brandCode) => `https://parallelum.com.br/fipe/api/v1/carros/marcas/${brandCode}/modelos`;
    const API_URL_YEARS = (brandCode, modelCode) => `https://parallelum.com.br/fipe/api/v1/carros/marcas/${brandCode}/modelos/${modelCode}/anos`;
    const API_URL_PRICE = (brandCode, modelCode, yearCode) => `https://parallelum.com.br/fipe/api/v1/carros/marcas/${brandCode}/modelos/${modelCode}/anos/${yearCode}`;

    // Funções de busca
    async function fetchBrands() {
        try {
            const response = await fetch(API_URL_BRANDS);
            const brands = await response.json();
            populateSelect(brandSelect, brands);
        } catch (error) {
            console.error('Erro ao buscar marcas:', error);
            resultsContainer.innerHTML = '<p>Erro ao carregar as marcas. Tente novamente mais tarde.</p>';
        }
    }

    async function fetchModels(brandCode) {
        try {
            const response = await fetch(API_URL_MODELS(brandCode));
            const modelsData = await response.json();
            const models = modelsData.modelos;
            populateSelect(modelSelect, models);
            modelSelect.disabled = false;
        } catch (error) {
            console.error('Erro ao buscar modelos:', error);
        }
    }

    async function fetchYears(brandCode, modelCode) {
        try {
            const response = await fetch(API_URL_YEARS(brandCode, modelCode));
            const years = await response.json();
            populateSelect(yearSelect, years);
            yearSelect.disabled = false;
        } catch (error) {
            console.error('Erro ao buscar anos:', error);
        }
    }

    async function fetchPrice(brandCode, modelCode, yearCode) {
        try {
            resultsContainer.innerHTML = '<h3>Buscando preço...</h3>';
            const response = await fetch(API_URL_PRICE(brandCode, modelCode, yearCode));
            const priceData = await response.json();
            displayPrice(priceData);
        } catch (error) {
            console.error('Erro ao buscar preço:', error);
            resultsContainer.innerHTML = '<p>Erro ao buscar o preço. Verifique sua seleção.</p>';
        }
    }

    // Função para preencher os menus
    function populateSelect(selectElement, data) {
        selectElement.innerHTML = '';
        selectElement.disabled = false;
        selectElement.innerHTML += `<option value="">Selecione o(a) ${selectElement.id.replace('Select', '')}</option>`;
        data.forEach(item => {
            selectElement.innerHTML += `<option value="${item.codigo}">${item.nome}</option>`;
        });
    }

    // Função para exibir o resultado
    function displayPrice(data) {
        resultsContainer.innerHTML = `
            <div class="result-card">
                <h3>Preço Médio</h3>
                <p><strong>Marca:</strong> ${data.Marca}</p>
                <p><strong>Modelo:</strong> ${data.Modelo}</p>
                <p><strong>Ano:</strong> ${data.AnoModelo}</p>
                <p><strong>Combustível:</strong> ${data.Combustivel}</p>
                <p><strong>Preço:</strong> <span style="font-size: 2em; color: #00b0ff;">${data.Valor}</span></p>
                <small>Referência: ${data.MesReferencia}</small>
            </div>
        `;
    }

    // Event listeners
    brandSelect.addEventListener('change', (e) => {
        const brandCode = e.target.value;
        if (brandCode) {
            modelSelect.innerHTML = `<option value="">Carregando...</option>`;
            modelSelect.disabled = true;
            yearSelect.disabled = true;
            searchButton.disabled = true;
            resultsContainer.innerHTML = '';
            fetchModels(brandCode);
        }
    });

    modelSelect.addEventListener('change', (e) => {
        const brandCode = brandSelect.value;
        const modelCode = e.target.value;
        if (modelCode) {
            yearSelect.innerHTML = `<option value="">Carregando...</option>`;
            yearSelect.disabled = true;
            searchButton.disabled = true;
            resultsContainer.innerHTML = '';
            fetchYears(brandCode, modelCode);
        }
    });

    yearSelect.addEventListener('change', () => {
        searchButton.disabled = !yearSelect.value;
    });

    searchButton.addEventListener('click', () => {
        const brandCode = brandSelect.value;
        const modelCode = modelSelect.value;
        const yearCode = yearSelect.value;
        if (brandCode && modelCode && yearCode) {
            fetchPrice(brandCode, modelCode, yearCode);
        }
    });

    // Inicia a busca pelas marcas ao carregar a página
    fetchBrands();
});
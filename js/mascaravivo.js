async function consultarCNPJ() {
    let cnpj = document.getElementById("cnpjInput").value;
    const resultDiv = document.getElementById("result");

    // Remove caracteres de pontuação do CNPJ
    cnpj = cnpj.replace(/[^\d]/g, '');

    // Verifica se o CNPJ tem o formato correto
    if (!/^\d{14}$/.test(cnpj)) {
        resultDiv.innerHTML = "Por favor, insira um CNPJ válido com 14 dígitos.";
        return;
    }

    try {
        // Mostra mensagem de carregamento
        resultDiv.innerHTML = "Buscando informações...";

        // 💡 ALTERAÇÃO 1: Usando o proxy CORS para evitar o bloqueio do navegador
        const url = `https://api.allorigins.win/raw?url=https://receitaws.com.br/v1/cnpj/${cnpj}`;
        const response = await fetch(url);

        if (!response.ok) {
            // Se a resposta da rede não for bem-sucedida (ex: erro 429, 500)
            throw new Error("Erro na rede ou limite de requisições excedido.");
        }

        const data = await response.json();

        // 💡 ALTERAÇÃO 2: Verificando se a API retornou um erro específico
        if (data.status === "ERROR") {
            throw new Error(data.message); // Ex: "CNPJ inválido"
        }

        // 💡 ALTERAÇÃO 3: A verificação correta é pela propriedade "situacao"
        if (data && data.situacao === "ATIVA") {
            
            // 💡 ALTERAÇÃO 4: Corrigindo o mapeamento dos campos para a estrutura da API
            document.getElementById('RAZAOSOCIAL').value = data.nome || 'Não informado';
            document.getElementById('CNPJ').value = data.cnpj || cnpj;
            document.getElementById('LOGRADOURO').value = data.logradouro || 'Não informado';
            document.getElementById('NUMERO').value = data.numero || 'Não informado';
            document.getElementById('COMPLEMENTO').value = data.complemento || 'Não informado';
            document.getElementById('BAIRRO').value = data.bairro || 'Não informado';
            document.getElementById('CIDADE').value = data.municipio || 'Não informado';
            document.getElementById('UF').value = data.uf || 'Não informado';
            document.getElementById('CEP').value = data.cep ? data.cep.replace(/[^\d]/g, '') : 'Não informado';
            document.getElementById('EMAIL').value = data.email || 'Não informado';
            
            // A API retorna um array de sócios (qsa), pegamos o primeiro
            document.getElementById('REPRESENTANTELEGAL').value = (data.qsa && data.qsa.length > 0) ? data.qsa[0].nome : 'Não informado';

            resultDiv.innerHTML = "<span style='color: green;'>✔ Dados carregados com sucesso!</span>";
        } else {
            resultDiv.innerHTML = `CNPJ encontrado, mas com status: ${data.situacao}.`;
        }
    } catch (error) {
        // Exibe uma mensagem de erro mais detalhada
        resultDiv.innerHTML = `<span style='color: red;'>❌ Erro ao buscar informações: ${error.message}</span>`;
        console.error("Erro detalhado:", error);
    }
}

// Função para gerar a máscara de informações
function gerarMascara() {
    const fields = ['CNPJ', 'RAZAOSOCIAL', 'REPRESENTANTELEGAL', 'CPF', 'RG', 'EMAIL', 'TELEFONE', 'VENC', 'NUMPORTABILIDADE', 'MAILING', 'OPERADORA', 'VALOR', 'LOGRADOURO', 'NUMERO', 'COMPLEMENTO', 'PONTOREFERENCIA', 'BAIRRO', 'CIDADE', 'UF', 'CEP'];

    let maskInfo = '';
    fields.forEach(field => {
        const value = document.getElementById(field)?.value || 'Não informado';
        maskInfo += `${field}: ${value}\n`;

        if (field === 'OPERADORA') {
            // Incluindo os planos e quantidades
            const planoSelects = document.querySelectorAll('.plano-select');
            const quantidadeInputs = document.querySelectorAll('.quantidade-input');

            planoSelects.forEach((select, index) => {
                const plano = select.value || 'Não informado';
                const quantidade = quantidadeInputs[index]?.value || '0';
                maskInfo += `PLANO: ${plano} - Quantidade: ${quantidade}\n`;
            });
        }
    });

    return maskInfo;
}

// Função para copiar informações
function copiarInformacao() {
    navigator.clipboard.writeText(gerarMascara())
        .then(() => alert("Informações copiadas com sucesso!"))
        .catch(() => alert("Erro ao copiar as informações."));
}

// Função para baixar informações e limpar a página
function baixarMascara() {
    const blob = new Blob([gerarMascara()], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'mascara_cliente.txt';
    link.click();

    limparCampos();
}

// Função para limpar todos os campos
function limparCampos() {
    const fields = ['CNPJ', 'RAZAOSOCIAL', 'REPRESENTANTELEGAL', 'CPF', 'RG', 'EMAIL', 'TELEFONE', 'VENC', 'NUMPORTABILIDADE', 'MAILING', 'OPERADORA', 'VALOR', 'LOGRADOURO', 'NUMERO', 'COMPLEMENTO', 'PONTOREFERENCIA', 'BAIRRO', 'CIDADE', 'UF', 'CEP'];

    fields.forEach(field => {
        const input = document.getElementById(field);
        if (input) input.value = '';
    });

    const planoSelects = document.querySelectorAll('.plano-select');
    const quantidadeInputs = document.querySelectorAll('.quantidade-input');
    planoSelects.forEach(select => select.value = '');
    quantidadeInputs.forEach(input => input.value = '');

    const resultDiv = document.getElementById("result");
    if (resultDiv) resultDiv.innerHTML = '';
}

// Frases motivacionais
const frases = [
    "Acredite em você e todo o resto virá naturalmente.",
    "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
    "Não importa quão devagar você vá, desde que você não pare.",
    "A única maneira de fazer um ótimo trabalho é amar o que você faz.",
    "Você é capaz de coisas incríveis!",
    "A persistência é o caminho do êxito."
];

let indice = 0;

function mudarFrase() {
    const fraseElement = document.getElementById('fraseMotivacional');
    fraseElement.textContent = frases[indice];
    indice = (indice + 1) % frases.length;
}

// Muda a frase a cada 5 segundos
setInterval(mudarFrase, 5000);

// Adiciona event listeners após o carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
    mudarFrase(); // Mostra a primeira frase imediatamente

    document.getElementById('consultarCNPJButton').addEventListener('click', consultarCNPJ);
    document.getElementById('copiarInformacaoButton').addEventListener('click', copiarInformacao);
    document.getElementById('baixarMascaraButton').addEventListener('click', baixarMascara);
    document.getElementById('voltarButton').addEventListener('click', () => {
        window.location.href = '../index.html';
    });
    document.getElementById('irParaConsultaButton').addEventListener('click', () => {
        window.open('https://solucoes.receita.fazenda.gov.br/servicos/cnpjreva/cnpjreva_solicitacao.asp', '_blank');
    });
});

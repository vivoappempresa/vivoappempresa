async function consultarCNPJ() {
    let cnpj = document.getElementById("cnpjInput").value;
    const resultDiv = document.getElementById("result");

    // Remove caracteres de pontuação do CNPJ
    cnpj = cnpj.replace(/[^\d]/g, '');

    // Verifica se o CNPJ tem o formato correto (após remover a pontuação)
    const cnpjPattern = /^\d{14}$/;
    if (!cnpjPattern.test(cnpj)) {
        resultDiv.innerHTML = "Por favor, insira um CNPJ válido com 14 dígitos.";
        return;
    }

    try {
        // Mostra mensagem de carregamento
        resultDiv.innerHTML = "Buscando informações...";

        // Chama a API
        const response = await fetch(`https://receitaws.com.br/v1/cnpj/${cnpj}`);

        if (!response.ok) {
            throw new Error("Erro ao buscar o CNPJ.");
        }

        const data = await response.json();

        // Verifica se a empresa está ativa
        if (data && data.status.text === "Ativa") {
            const address = data.address;

            // Preenche os campos da máscara com os dados
            document.getElementById('RAZAOSOCIAL').value = data.company.name;
            document.getElementById('CNPJ').value = cnpj;
            document.getElementById('LOGRADOURO').value = address.street;
            document.getElementById('NUMERO').value = address.number;
            document.getElementById('COMPLEMENTO').value = address.details || 'Não informado';
            document.getElementById('BAIRRO').value = address.district;
            document.getElementById('CIDADE').value = address.city;
            document.getElementById('UF').value = address.state;
            document.getElementById('CEP').value = address.zip;
            document.getElementById('EMAIL').value = Array.isArray(data.emails) && data.emails.length > 0 ? data.emails[0].address : 'Não informado';

            // Preenche o campo de quadro de sócios
            document.getElementById('REPRESENTANTELEGAL').value = data.company.members?.[0]?.person.name || 'Não informado';

            resultDiv.innerHTML = "Dados carregados com sucesso!";
        } else {
            resultDiv.innerHTML = "CNPJ não encontrado ou status não ativo.";
        }
    } catch (error) {
        resultDiv.innerHTML = "Erro ao buscar informações. Tente novamente.";
        console.error(error);
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

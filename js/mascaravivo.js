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
        // Chama a API
        const response = await fetch(`https://open.cnpja.com/office/${cnpj}`);

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
            document.getElementById('EMAIL').value = data.emails.length > 0 ? data.emails[0].address : 'Não informado';

            // Preenche o campo de quadro de sócios
            document.getElementById('REPRESENTANTELEGAL').value = data.company.members[0]?.person.name || 'Não informado';
        } else {
            resultDiv.innerHTML = "CNPJ não encontrado ou status não ativo.";
        }
    } catch (error) {
        resultDiv.innerHTML = "Erro ao buscar informações. Tente novamente.";
        console.error(error);
    }
}


// Função para copiar as informações, incluindo o plano e a quantidade
function copiarInformacao() {
    const fields = ['CNPJ', 'RAZAOSOCIAL', 'REPRESENTANTELEGAL', 'CPF', 'RG', 'EMAIL', 'TELEFONE', 'VENC', 'NUMPORTABILIDADE', 'MAILING', 'OPERADORA', 'VALOR', 'LOGRADOURO', 'NUMERO', 'COMPLEMENTO', 'PONTOREFERENCIA', 'BAIRRO', 'CIDADE', 'UF', 'CEP'];

    let maskInfo = '';

    // Incluindo os outros campos na ordem desejada
    fields.forEach(field => {
        // Pular a inserção do PLANO depois da OPERADORA
        if (field === 'OPERADORA') {
            const value = document.getElementById(field)?.value || 'Não informado';
            maskInfo += `${field}: ${value}\n`;

            // Incluindo as informações do plano com a quantidade entre OPERADORA e VALOR
            const planoSelects = document.querySelectorAll('.plano-select');
            const quantidadeInputs = document.querySelectorAll('.quantidade-input');

            planoSelects.forEach((select, index) => {
                const plano = select.value;
                const quantidade = quantidadeInputs[index].value;
                maskInfo += `PLANO: ${plano} - Quantidade: ${quantidade}\n`;
            });
        } else {
            const value = document.getElementById(field)?.value || 'Não informado';
            maskInfo += `${field}: ${value}\n`;
        }
    });

    // Copiar o texto para a área de transferência
    navigator.clipboard.writeText(maskInfo).then(() => {
        alert("Informações copiadas com sucesso!");
    }).catch(err => {
        alert("Erro ao copiar as informações.");
    });
}

// Função para baixar a máscara com as informações, incluindo o plano e a quantidade
function baixarMascara() {
    const fields = ['CNPJ', 'RAZAOSOCIAL', 'REPRESENTANTELEGAL', 'CPF', 'RG', 'EMAIL', 'TELEFONE', 'VENC', 'NUMPORTABILIDADE', 'MAILING', 'OPERADORA', 'VALOR', 'LOGRADOURO', 'NUMERO', 'COMPLEMENTO', 'PONTOREFERENCIA', 'BAIRRO', 'CIDADE', 'UF', 'CEP'];

    let maskInfo = '';

    // Incluindo os outros campos na ordem desejada
    fields.forEach(field => {
        // Pular a inserção do PLANO depois da OPERADORA
        if (field === 'OPERADORA') {
            const value = document.getElementById(field)?.value || 'Não informado';
            maskInfo += `${field}: ${value}\n`;

            // Incluindo as informações do plano com a quantidade entre OPERADORA e VALOR
            const planoSelects = document.querySelectorAll('.plano-select');
            const quantidadeInputs = document.querySelectorAll('.quantidade-input');

            planoSelects.forEach((select, index) => {
                const plano = select.value;
                const quantidade = quantidadeInputs[index].value;
                maskInfo += `PLANO: ${plano} - Quantidade: ${quantidade}\n`;
            });
        } else {
            const value = document.getElementById(field)?.value || 'Não informado';
            maskInfo += `${field}: ${value}\n`;
        }
    });

    // Criar e baixar o arquivo
    const blob = new Blob([maskInfo], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'mascara_cliente.txt';
    link.click();
}

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
    indice = (indice + 1) % frases.length; // Muda para a próxima frase
}

// Muda a frase a cada 5 segundos
setInterval(mudarFrase, 5000);

// Adiciona event listeners após o carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
    mudarFrase(); // Chama a função uma vez para mostrar a primeira frase imediatamente

    document.getElementById('consultarCNPJButton').addEventListener('click', consultarCNPJ);
    document.getElementById('copiarInformacaoButton').addEventListener('click', copiarInformacao);
    document.getElementById('baixarMascaraButton').addEventListener('click', baixarMascara);
    document.getElementById('voltarButton').addEventListener('click', () => {
        window.location.href = '../index.html';
    });
    document.getElementById('irParaConsultaButton').addEventListener('click', () => {
        window.open('https://solucoes.receita.fazenda.gov.br/servicos/cnpjreva/cnpjreva_solicitacao.asp', '_blank');
    });
    // Adiciona a chamada inicial para mudarFrase no DOMContentLoaded
    mudarFrase();
}); 
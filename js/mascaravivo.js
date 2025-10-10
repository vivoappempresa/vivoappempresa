// Função para consultar CNPJ na API ReceitaWS
async function consultarCNPJ() {
    let cnpj = document.getElementById("cnpjInput").value;
    const resultDiv = document.getElementById("result");

    // Remove caracteres de pontuação do CNPJ (deixa só números)
    cnpj = cnpj.replace(/[^\d]/g, '');

    // Verifica se o CNPJ tem o formato correto (14 dígitos)
    const cnpjPattern = /^\d{14}$/;
    if (!cnpjPattern.test(cnpj)) {
        resultDiv.innerHTML = "<span style='color: orange;'>Por favor, insira um CNPJ válido com 14 dígitos.</span>";
        return;
    }

    try {
        // Mostra mensagem de carregamento
        resultDiv.innerHTML = "Buscando informações...";

        // URL da API com proxy para evitar erro de CORS
        const url = `https://api.allorigins.win/raw?url=https://receitaws.com.br/v1/cnpj/${cnpj}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Erro de rede ao buscar o CNPJ. A API pode estar fora do ar ou o limite de requisições foi atingido.");
        }

        const data = await response.json();

        // Verifica se a API retornou uma mensagem de erro
        if (data.status === "ERROR") {
            throw new Error(data.message); // Ex: "CNPJ inválido"
        }

        // Verifica se a empresa está ativa
        if (data && data.situacao === "ATIVA") {
            // Preenche os campos do formulário com os dados retornados
            document.getElementById('RAZAOSOCIAL').value = data.nome || 'Não informado';
            document.getElementById('CNPJ').value = data.cnpj || cnpj;
            document.getElementById('LOGRADOURO').value = data.logradouro || 'Não informado';
            document.getElementById('NUMERO').value = data.numero || 'Não informado';
            document.getElementById('COMPLEMENTO').value = data.complemento || '';
            document.getElementById('BAIRRO').value = data.bairro || 'Não informado';
            document.getElementById('CIDADE').value = data.municipio || 'Não informado';
            document.getElementById('UF').value = data.uf || '';
            document.getElementById('CEP').value = data.cep ? data.cep.replace(/[^\d]/g, '') : 'Não informado';
            document.getElementById('EMAIL').value = data.email || 'Não informado';
            document.getElementById('TELEFONE').value = data.telefone || '';

            // Pega o primeiro nome do quadro de sócios como Representante Legal
            document.getElementById('REPRESENTANTELEGAL').value = (data.qsa && data.qsa.length > 0) ? data.qsa[0].nome : 'Não informado';

            resultDiv.innerHTML = "<span style='color: green;'>✔ Dados carregados com sucesso!</span>";
        } else {
            resultDiv.innerHTML = `<span style='color: orange;'>CNPJ encontrado, mas com situação: ${data.situacao}.</span>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<span style='color: red;'>❌ Erro ao buscar informações: ${error.message}. Tente novamente.</span>`;
        console.error("Erro detalhado:", error);
    }
}

// Função para gerar a máscara de informações para cópia/download
function gerarMascara() {
    const fields = ['CNPJ', 'RAZAOSOCIAL', 'REPRESENTANTELEGAL', 'CPF', 'RG', 'EMAIL', 'TELEFONE', 'VENC', 'NUMPORTABILIDADE', 'MAILING', 'OPERADORA', 'VALOR', 'LOGRADOURO', 'NUMERO', 'COMPLEMENTO', 'PONTOREFERENCIA', 'BAIRRO', 'CIDADE', 'UF', 'CEP'];

    let maskInfo = '';
    fields.forEach(field => {
        const value = document.getElementById(field)?.value.trim() || 'Não informado';
        maskInfo += `${field}: ${value}\n`;

        if (field === 'OPERADORA') {
            const planoSelects = document.querySelectorAll('.plano-select');
            const quantidadeInputs = document.querySelectorAll('.quantidade-input');

            let hasPlan = false;
            planoSelects.forEach((select, index) => {
                const plano = select.value;
                const quantidade = quantidadeInputs[index]?.value;
                if (plano && quantidade > 0) {
                    maskInfo += `PLANO: ${plano} - Quantidade: ${quantidade}\n`;
                    hasPlan = true;
                }
            });
            if (!hasPlan) {
                maskInfo += `PLANO: Não informado\n`;
            }
        }
    });

    return maskInfo;
}

// Função para copiar informações para a área de transferência
function copiarInformacao() {
    navigator.clipboard.writeText(gerarMascara())
        .then(() => alert("Informações copiadas com sucesso!"))
        .catch(() => alert("Erro ao copiar as informações."));
}

// Função para baixar as informações em um arquivo .txt
function baixarMascara() {
    const blob = new Blob([gerarMascara()], {
        type: 'text/plain'
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    
    const razaoSocial = document.getElementById('RAZAOSOCIAL')?.value.trim() || 'cliente';
    const dataHoje = new Date().toISOString().slice(0, 10); // Formato AAAA-MM-DD
    link.download = `mascara_${razaoSocial.replace(/ /g, '_')}_${dataHoje}.txt`;

    link.click();
    URL.revokeObjectURL(link.href);

    limparCampos();
}

// Função para limpar todos os campos do formulário
function limparCampos() {
    const form = document.getElementById('mascaraForm');
    if(form) {
        form.reset(); // Método mais eficiente para limpar formulários
    }

    // Limpa campos que não estão no form (se houver) e a div de resultado
    document.getElementById('cnpjInput').value = '';
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
    if (fraseElement) {
        fraseElement.textContent = frases[indice];
        indice = (indice + 1) % frases.length;
    }
}

// Muda a frase a cada 5 segundos
setInterval(mudarFrase, 5000);

// Adiciona os "escutadores de eventos" aos botões após o carregamento completo da página
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

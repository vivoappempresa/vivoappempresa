// Função para consultar CNPJ na API ReceitaWS
async function consultarCNPJ() {
    let cnpj = document.getElementById("cnpjInput").value;
    const resultDiv = document.getElementById("result");

    // Remove caracteres de pontuação do CNPJ (deixa só números)
    cnpj = cnpj.replace(/[^\d]/g, '');

    // ===============================================================
    // VERIFICAÇÃO DO CÓDIGO SECRETO (EASTER EGG)
    // ===============================================================
    if (cnpj === '999888777') {
        // Esconde o formulário e inicia o jogo
        document.getElementById('form-container').style.display = 'none';
        document.getElementById('game-container').style.display = 'block';
        iniciarJogoDaVelha();
        return; // Para a execução da função aqui
    }
    // ===============================================================

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
            if (!hasPlan) { maskInfo += `PLANO: Não informado\n`; }
        }
    });
    return maskInfo;
}

function copiarInformacao() {
    navigator.clipboard.writeText(gerarMascara())
        .then(() => alert("Informações copiadas com sucesso!"))
        .catch(() => alert("Erro ao copiar as informações."));
}

function baixarMascara() {
    const blob = new Blob([gerarMascara()], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const razaoSocial = document.getElementById('RAZAOSOCIAL')?.value.trim() || 'cliente';
    const dataHoje = new Date().toISOString().slice(0, 10);
    link.download = `mascara_${razaoSocial.replace(/ /g, '_')}_${dataHoje}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
    limparCampos();
}

function limparCampos() {
    const form = document.getElementById('mascaraForm');
    if (form) { form.reset(); }
    document.getElementById('cnpjInput').value = '';
    const resultDiv = document.getElementById("result");
    if (resultDiv) resultDiv.innerHTML = '';
}

// Frases motivacionais
const frases = ["Acredite em você e todo o resto virá naturalmente.", "O sucesso é a soma de pequenos esforços repetidos dia após dia.", "Não importa quão devagar você vá, desde que você não pare.", "A única maneira de fazer um ótimo trabalho é amar o que você faz.", "Você é capaz de coisas incríveis!", "A persistência é o caminho do êxito."];
let indice = 0;
function mudarFrase() {
    const fraseElement = document.getElementById('fraseMotivacional');
    if (fraseElement) {
        fraseElement.textContent = frases[indice];
        indice = (indice + 1) % frases.length;
    }
}
setInterval(mudarFrase, 5000);

// Adiciona os "escutadores de eventos" aos botões
document.addEventListener('DOMContentLoaded', () => {
    mudarFrase();
    document.getElementById('consultarCNPJButton').addEventListener('click', consultarCNPJ);
    document.getElementById('copiarInformacaoButton').addEventListener('click', copiarInformacao);
    document.getElementById('baixarMascaraButton').addEventListener('click', baixarMascara);
    document.getElementById('voltarButton').addEventListener('click', () => { window.location.href = '../index.html'; });
    document.getElementById('irParaConsultaButton').addEventListener('click', () => { window.open('https://solucoes.receita.fazenda.gov.br/servicos/cnpjreva/cnpjreva_solicitacao.asp', '_blank'); });
});


// =================================================================
// LÓGICA DO JOGO DA VELHA (EASTER EGG)
// =================================================================

function iniciarJogoDaVelha() {
    // 1. CONFIGURAÇÃO DO FIREBASE
    // !!!!!!!!!!! IMPORTANTE !!!!!!!!!!!
    // COLE AQUI O OBJETO DE CONFIGURAÇÃO QUE VOCÊ COPIOU DO FIREBASE
    const firebaseConfig = {
        apiKey: "SEU_API_KEY",
        authDomain: "SEU_AUTH_DOMAIN",
        databaseURL: "SUA_DATABASE_URL",
        projectId: "SEU_PROJECT_ID",
        storageBucket: "SEU_STORAGE_BUCKET",
        messagingSenderId: "SEU_MESSAGING_SENDER_ID",
        appId: "SEU_APP_ID"
    };

    // Inicializa o Firebase apenas se não tiver sido inicializado antes
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const database = firebase.database();

    // 2. ELEMENTOS DO JOGO E VARIÁVEIS
    const statusText = document.getElementById('status-text');
    const boardCells = document.querySelectorAll('.cell');
    const resetButton = document.getElementById('reset-button');
    const gameIdDisplay = document.getElementById('game-id-display');
    const voltarButton = document.getElementById('voltar-form-button');

    let gameId, playerSymbol, gameRef;

    // Lógica para voltar ao formulário
    voltarButton.addEventListener('click', () => {
        document.getElementById('game-container').style.display = 'none';
        document.getElementById('form-container').style.display = 'block';
        if (gameRef) gameRef.off(); // Desconecta do listener do Firebase
    });

    // 3. LÓGICA DE SALAS E JOGADORES
    const urlParams = new URLSearchParams(window.location.search);
    const urlGameId = urlParams.get('game');

    if (urlGameId) {
        gameId = urlGameId;
        playerSymbol = 'O';
        gameRef = database.ref('games/' + gameId);
        joinGame();
    } else {
        gameId = database.ref().child('games').push().key;
        playerSymbol = 'X';
        gameRef = database.ref('games/' + gameId);
        window.history.replaceState(null, null, '?game=' + gameId);
        createNewGame();
    }
    gameIdDisplay.textContent = gameId;

    function createNewGame() {
        const newGame = { board: Array(9).fill(null), currentPlayer: 'X', status: 'Aguardando oponente...', winner: null, players: { X: true, O: false } };
        gameRef.set(newGame);
    }

    function joinGame() {
        gameRef.transaction(game => {
            if (game && !game.players.O) {
                game.players.O = true;
                game.status = "Vez do jogador 'X'";
            }
            return game;
        });
    }

    // 4. LÓGICA PRINCIPAL DO JOGO
    gameRef.on('value', (snapshot) => {
        const gameState = snapshot.val();
        if (gameState) updateUI(gameState);
    });

    function updateUI(gameState) {
        gameState.board.forEach((cell, index) => { boardCells[index].textContent = cell; });
        statusText.textContent = gameState.status;
    }

    boardCells.forEach(cell => {
        cell.addEventListener('click', handleCellClick, { once: true }); // Adiciona o listener uma vez para evitar duplicação
    });
    
    // Precisamos re-adicionar os listeners se o jogo for resetado
    function addCellListeners() {
        boardCells.forEach(cell => cell.addEventListener('click', handleCellClick));
    }
    
    function handleCellClick(event) {
        const index = event.target.getAttribute('data-index');
        makeMove(parseInt(index));
    }

    resetButton.addEventListener('click', () => {
        gameRef.transaction(game => {
            if (game) {
                game.board = Array(9).fill(null);
                game.currentPlayer = 'X';
                game.status = "Vez do jogador 'X'";
                game.winner = null;
            }
            return game;
        });
    });

    function makeMove(index) {
        gameRef.transaction(game => {
            if (game && !game.winner && game.board[index] === null && game.currentPlayer === playerSymbol && game.players.O) {
                game.board[index] = playerSymbol;
                const winner = checkWinner(game.board);
                if (winner) {
                    game.winner = winner;
                    game.status = `Jogador '${winner}' venceu!`;
                } else if (!game.board.includes(null)) {
                    game.status = "Empate!";
                } else {
                    game.currentPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
                    game.status = `Vez do jogador '${game.currentPlayer}'`;
                }
            }
            return game;
        });
    }

    function checkWinner(board) {
        const winningConditions = [ [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6] ];
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
        }
        return null;
    }
}

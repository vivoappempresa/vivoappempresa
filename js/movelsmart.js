// Constantes
const MDM_PRICE = 5;
const ADDITIONAL_PRICE = 10;
const ADDITIONAL_GB = 10;
const FRASE_INTERVAL = 5000;

// Lista de planos existentes
const plans = [
  { name: '6GB', gb: 6, price: 39.99 },
  { name: '15GB', gb: 15, price: 54.99 },
  { name: '20GB', gb: 20, price: 59.99 },
  { name: '30GB', gb: 30, price: 69.99 },
  { name: '40GB', gb: 40, price: 79.99 },
  { name: '50GB', gb: 50, price: 89.99 },
  { name: '100GB', gb: 100, price: 99.99 }
];

// Frases motivacionais
const frases = [
  "Acredite em você e todo o resto virá naturalmente.",
  "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
  "Não importa quão devagar você vá, desde que você não pare.",
  "A única maneira de fazer um ótimo trabalho é amar o que você faz.",
  "Você é capaz de coisas incríveis!",
  "A persistência é o caminho do êxito.",
  "O NÃO você já tem, vá em embusca do SIM ass:Jonas"
];

// Elementos do DOM
const elements = {
  mobileOptions: document.querySelectorAll('.mobile-plan'),
  mdmQuantity: document.getElementById('mdm-quantity'),
  additional1: document.getElementById('additional1'),
  additional2: document.getElementById('additional2'),
  totalPrice: document.getElementById('totalPrice'),
  totalGB: document.getElementById('totalGB'),
  title: document.querySelector('h1'),
  image: document.querySelector('img.changeable'),
  valor: document.getElementById('valor'),
  gb: document.getElementById('gb'),
  linhas: document.getElementById('linhas'),
  supervisorPassword: document.getElementById('supervisor-password'),
  suggestions: document.getElementById('suggestions'),
  fraseMotivacional: document.getElementById('fraseMotivacional')
};

// Função para adicionar plano de desconto ou redirecionar
function addDiscountPlan() {
  const password = elements.supervisorPassword.value;

  if (password === '17172025') {
    plans.push({ name: '1GB', gb: 1, price: 29.99 });
    alert('Plano de 1GB adicionado com sucesso!');
  } else if (password === 'bruna2025') {
    window.location.href = 'equipebruna2025.html';
  }
}

// Função para calcular o total
function calculateTotal() {
  let total = 0;
  let totalGB = 0;

  // Soma os valores dos planos selecionados e os GBs
  elements.mobileOptions.forEach(option => {
    const quantity = parseInt(option.querySelector('input[type="number"]').value) || 0;
    const price = parseFloat(option.querySelector('input[type="checkbox"]').value);
    const gb = parseInt(option.querySelector('input[type="checkbox"]').dataset.gb);
    total += price * quantity;
    totalGB += gb * quantity;
  });

  // Adiciona o custo do MDM
  const mdmQuantity = parseInt(elements.mdmQuantity.value) || 0;
  total += MDM_PRICE * mdmQuantity;

  // Adiciona os custos dos adicionais
  if (elements.additional1.checked) {
    total += ADDITIONAL_PRICE;
    totalGB += ADDITIONAL_GB;
  }
  if (elements.additional2.checked) {
    total += ADDITIONAL_PRICE;
    totalGB += ADDITIONAL_GB;
  }

  // Atualiza a interface
  updateInterface(mdmQuantity);
  updateTotals(total, totalGB);
}

// Função para atualizar a interface
function updateInterface(mdmQuantity) {
  if (mdmQuantity > 0) {
    elements.title.textContent = `Móvel Combo + ${mdmQuantity} MDM`;
    elements.image.src = "../img/movelsmartmdm.png";
  } else {
    elements.title.textContent = "Móvel Planos Smart Empresas";
    elements.image.src = "../img/movelsmart.png";
  }
}

// Função para atualizar os totais
function updateTotals(total, totalGB) {
  elements.totalPrice.textContent = `Preço Total: R$ ${total.toFixed(2)}`;
  elements.totalGB.textContent = `Total de GB: ${totalGB}GB`;
}

// Função para analisar o melhor plano
function analyzeBestPlan() {
  addDiscountPlan();

  const valor = parseFloat(elements.valor.value) || 0;
  const gbTotal = parseInt(elements.gb.value) || 0;
  const linhas = parseInt(elements.linhas.value) || 1;
  
  elements.suggestions.innerHTML = '';

  if (valor <= 0 || gbTotal <= 0 || linhas < 1) {
    elements.suggestions.innerHTML = '<p>Preencha todos os campos corretamente.</p>';
    return;
  }

  const validCombs = generateValidCombinations(valor, gbTotal, linhas);
  displaySuggestions(validCombs);
}

// Função para gerar combinações válidas
function generateValidCombinations(valor, gbTotal, linhas) {
  const allCombinations = getCombinations(linhas);
  
  return allCombinations
    .map(comb => {
      let totalCost = comb.reduce((acc, p) => acc + p.price, 0);
      let totalGb = comb.reduce((acc, p) => acc + p.gb, 0);
      totalCost += MDM_PRICE * linhas;
      return { combination: comb, totalCost, totalGb };
    })
    .filter(item => item.totalCost <= valor && item.totalGb >= gbTotal)
    .slice(0, 3);
}

// Função para exibir sugestões
function displaySuggestions(validCombs) {
  if (validCombs.length === 0) {
    elements.suggestions.innerHTML = '<p>Não foi possível encontrar uma combinação que atenda os requisitos.</p>';
    return;
  }

  let html = '<h3>Sugestões:</h3>';
  validCombs.forEach(item => {
    html += `<div class='suggestion-box'><strong>Plano sugerido:</strong><br>`;
    html += summarizeCombination(item.combination);
    html += `<br>Total: R$ ${(item.totalCost).toFixed(2)} | GB Total: ${item.totalGb}GB</div>`;
  });

  elements.suggestions.innerHTML = html;
}

// Função recursiva para gerar combinações
function getCombinations(n, start = 0, current = [], all = []) {
  if (current.length === n) {
    all.push([...current]);
    return;
  }
  for (let i = start; i < plans.length; i++) {
    current.push(plans[i]);
    getCombinations(n, i, current, all);
    current.pop();
  }
  return all;
}

// Função para resumir combinações
function summarizeCombination(comb) {
  const summary = {};
  comb.forEach(plan => {
    if (!summary[plan.name]) {
      summary[plan.name] = { count: 0, price: plan.price, gb: plan.gb };
    }
    summary[plan.name].count++;
  });

  const parts = Object.entries(summary).map(([key, item]) => 
    `${item.count} linha(s) de ${key} (R$ ${item.price.toFixed(2)} c/ ${item.gb}GB)`
  );

  parts.push(`MDM (+R$ ${MDM_PRICE} por linha)`);
  return parts.join(' + ');
}

// Função para mudar frase motivacional
let indice = 0;
function mudarFrase() {
  elements.fraseMotivacional.textContent = frases[indice];
  indice = (indice + 1) % frases.length;
}

// Event Listeners
document.addEventListener('change', calculateTotal);
setInterval(mudarFrase, FRASE_INTERVAL);
mudarFrase(); // Mostra a primeira frase imediatamente 
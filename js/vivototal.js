// Constantes para valores fixos
const MDM_PRICE = 6.90;
const DISCOUNTED_500MEGA_PRICE = 89.99;
const REGULAR_500MEGA_PRICE = 89.99;

// Elementos do DOM
const elements = {
    broadband: document.querySelector('input[name="broadband"]:checked'),
    mobile: document.querySelector('input[name="mobile"]:checked'),
    unlimited: document.getElementById('unlimited'),
    mdm: document.getElementById('mdm'),
    totalPrice: document.getElementById('totalPrice'),
    title: document.querySelector('h1'),
    image: document.querySelector('img')
};

// Função para calcular o preço da banda larga com descontos
function calculateBroadbandPrice(broadband) {
    if (!broadband) return 0;

    if (broadband.value === "99.99" && (elements.mobile || elements.unlimited.checked)) {
        return elements.unlimited.checked ? REGULAR_500MEGA_PRICE : DISCOUNTED_500MEGA_PRICE;
    }
    return parseFloat(broadband.value);
}

// Função para atualizar a interface baseada nas seleções
function updateInterface() {
    const broadband = document.querySelector('input[name="broadband"]:checked');
    const mobile = document.querySelector('input[name="mobile"]:checked');

    if (broadband && mobile && elements.unlimited.checked) {
        elements.title.textContent = "Oferta Vivo Total";
        elements.image.src = "../img/vivototal.png";
    } else if (broadband && mobile) {
        elements.title.textContent = "Oferta Vivo Total 2P MÓVEL";
        elements.image.src = "../img/vivototal2p.png";
    }
}

// Função principal para calcular o total
function calculateTotal() {
    let total = 0;

    // Atualiza os elementos do DOM
    elements.broadband = document.querySelector('input[name="broadband"]:checked');
    elements.mobile = document.querySelector('input[name="mobile"]:checked');

    // Calcula o preço da banda larga
    total += calculateBroadbandPrice(elements.broadband);

    // Adiciona o preço do plano móvel
    if (elements.mobile) {
        total += parseFloat(elements.mobile.value);
    }

    // Adiciona o preço do plano ilimitado
    if (elements.unlimited.checked) {
        total += parseFloat(elements.unlimited.value);
    }

    // Adiciona o preço do MDM
    if (elements.mdm.checked) {
        total += MDM_PRICE;
    }

    // Atualiza a interface
    updateInterface();

    // Atualiza o preço total
    elements.totalPrice.textContent = `Preço Total: R$ ${total.toFixed(2)}`;
}

// Adiciona o listener de eventos
document.addEventListener('change', calculateTotal);

// Calcula o total inicial
calculateTotal(); 

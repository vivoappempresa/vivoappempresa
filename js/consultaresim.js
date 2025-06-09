// Constantes
const FRASE_INTERVAL = 5000;

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

// Lista de dispositivos compatíveis com eSIM
const devices = [
    // iPhone
    "iPhone XR", "iPhone XS", "iPhone XS Max", "iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max",
    "iPhone SE (2020)", "iPhone 12 mini", "iPhone 12", "iPhone 12 Pro", "iPhone 12 Pro Max",
    "iPhone 13 mini", "iPhone 13", "iPhone 13 Pro", "iPhone 13 Pro Max",
    "iPhone SE (2022)", "iPhone 14", "iPhone 14 Plus", "iPhone 14 Pro", "iPhone 14 Pro Max",
    "iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max",
    
    // Samsung
    "Samsung Galaxy S20", "Samsung Galaxy S20+", "Samsung Galaxy S20 Ultra",
    "Samsung Galaxy Note 20", "Samsung Galaxy Note 20 Ultra",
    "Samsung Galaxy S21", "Samsung Galaxy S21+", "Samsung Galaxy S21 Ultra",
    "Samsung Galaxy S22", "Samsung Galaxy S22+", "Samsung Galaxy S22 Ultra",
    "Samsung Galaxy S23", "Samsung Galaxy S23+", "Samsung Galaxy S23 Ultra",
    "Samsung Galaxy Fold", "Samsung Galaxy Z Fold2", "Samsung Galaxy Z Fold3", "Samsung Galaxy Z Fold4", "Samsung Galaxy Z Fold5",
    "Samsung Galaxy Z Flip", "Samsung Galaxy Z Flip 5G", "Samsung Galaxy Z Flip3", "Samsung Galaxy Z Flip4", "Samsung Galaxy Z Flip5",
    
    // Google Pixel
    "Google Pixel 3", "Google Pixel 3 XL", "Google Pixel 3a", "Google Pixel 3a XL",
    "Google Pixel 4", "Google Pixel 4 XL", "Google Pixel 4a", "Google Pixel 4a 5G",
    "Google Pixel 5", "Google Pixel 6", "Google Pixel 6 Pro", "Google Pixel 6a",
    "Google Pixel 7", "Google Pixel 7 Pro", "Google Pixel 7a",
    "Google Pixel 8", "Google Pixel 8 Pro",
    
    // Outros fabricantes
    "Huawei P40", "Huawei P40 Pro", "Huawei Mate 40 Pro",
    "Motorola Razr (2019)", "Motorola Razr 5G",
    "Oppo Find X3 Pro", "Oppo Reno 5A", "Oppo Reno 6A",
    "Sony Xperia 10 III Lite",
    "Xiaomi 12T Pro",
    "Microsoft Surface Duo", "Microsoft Surface Duo 2",
    "Acer Swift 7",
    "HP Spectre Folio",
    "Lenovo Yoga C630", "Lenovo Flex 5G"
];

// Elementos do DOM
const elements = {
    deviceList: document.getElementById('deviceList'),
    searchInput: document.getElementById('searchInput'),
    fraseMotivacional: document.getElementById('fraseMotivacional')
};

// Função para criar elemento de lista
function createListItem(text, className) {
    const listItem = document.createElement('li');
    listItem.textContent = text;
    listItem.classList.add(className);
    return listItem;
}

// Função para exibir dispositivos
function displayDevices(filter = '') {
    elements.deviceList.innerHTML = '';
    const lowerCaseFilter = filter.toLowerCase();

    const filteredDevices = devices.filter(device =>
        device.toLowerCase().includes(lowerCaseFilter)
    );

    if (filteredDevices.length === 0) {
        elements.deviceList.appendChild(
            createListItem("Nenhum aparelho encontrado com este termo.", "no-results")
        );
        return;
    }

    filteredDevices.forEach(device => {
        elements.deviceList.appendChild(
            createListItem(device, "device-item")
        );
    });
}

// Função para pesquisar dispositivo
function searchDevice() {
    displayDevices(elements.searchInput.value);
}

// Função para mudar frase motivacional
let indice = 0;
function mudarFrase() {
    elements.fraseMotivacional.textContent = frases[indice];
    indice = (indice + 1) % frases.length;
}

// Event Listeners
elements.searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchDevice();
    }
});

// Inicialização
displayDevices();
setInterval(mudarFrase, FRASE_INTERVAL);
mudarFrase(); // Mostra a primeira frase imediatamente 
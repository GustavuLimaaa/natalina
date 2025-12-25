document.addEventListener('DOMContentLoaded', () => {

    // --- Configuration ---
    const phrases = [
        // Funny
        "{NOME}, confessa: você só veio pelo presente 😂",
        "Você merece panetone… sem uva passa, {NOME}.",
        "{NOME}, hoje tá liberado repetir a ceia três vezes.",
        "Se Papai Noel te ver, ele pede autógrafo, {NOME}.",
        "{NOME}, Feliz Natal! E desculpa qualquer piada ruim 😅",
        "Você oficialmente entrou na lista dos bonzinhos… por pouco, {NOME}.",
        "{NOME}, se sumir comida, foi o espírito natalino (ou você).",
        "Hoje é Natal. Dieta? Nunca nem vi, {NOME}.",
        "{NOME}, relaxa: Natal conta como feriado emocional.",
        "Se o trenó atrasar, foi culpa do Wi-Fi das renas, {NOME}.",

        // Romantic / Sweet
        "{NOME}, você já é um presente e nem precisa de laço.",
        "Que seu Natal seja leve — igual seu sorriso, {NOME}.",
        "{NOME}, hoje eu só te desejo paz, luz e aquele carinho bom.",
        "Você ilumina qualquer lugar, {NOME}. Nem precisa de pisca-pisca.",
        "{NOME}, que seu coração fique quentinho hoje.",
        "Seu Natal merece ser lindo — igual você, {NOME}. ",
        "{NOME}, que a magia do Natal abrace você bem forte.",
        "Se existir presente perfeito, ele chega até você, {NOME}.",
        "{NOME}, que a vida te surpreenda bonito hoje.",
        "Com você, qualquer dia vira Natal, {NOME}."
    ];

    const LOADING_DELAY_MS = 3500; // 3.5 seconds delay

    // --- DOM Elements ---
    const inputScreen = document.getElementById('inputScreen');
    const resultScreen = document.getElementById('resultScreen');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const nameInput = document.getElementById('nameInput');
    const celebrateBtn = document.getElementById('celebrateBtn');
    const finalMessage = document.getElementById('finalMessage');
    const snowContainer = document.getElementById('snowContainer');

    // --- Logic ---

    function getRandomPhrase(name) {
        const randomIndex = Math.floor(Math.random() * phrases.length);
        const rawPhrase = phrases[randomIndex];
        // Wrap name in a highlight span
        return rawPhrase.replace(/{NOME}/g, `<span class="name-highlight">${name}</span>`);
    }

    function startCelebration() {
        const name = nameInput.value.trim();

        if (!name) {
            alert("Por favor, digite seu nome primeiro! 🎅");
            return;
        }

        // 1. Hide Input Screen
        inputScreen.classList.remove('active');
        inputScreen.classList.add('hidden');

        // 2. Show Loading
        loadingOverlay.classList.remove('hidden');

        // 3. Wait and Show Result
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');

            // Set Message (using innerHTML to render the span)
            finalMessage.innerHTML = getRandomPhrase(name);

            // Show Result Screen
            resultScreen.classList.remove('hidden');
            // Small timeout to allow display:block to apply before opacity transition
            setTimeout(() => {
                resultScreen.classList.add('active');
            }, 50);

        }, LOADING_DELAY_MS);
    }

    function resetApp() {
        resultScreen.classList.remove('active');
        setTimeout(() => {
            resultScreen.classList.add('hidden');
            nameInput.value = '';
            inputScreen.classList.remove('hidden');
            setTimeout(() => {
                inputScreen.classList.add('active');
            }, 50);
        }, 1000); // Wait for fade out
    }

    // --- Background Animation (Snowflakes) ---
    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.textContent = ['❄', '❅', '❆', '✨'][Math.floor(Math.random() * 4)];

        snowflake.style.left = Math.random() * 100 + 'vw';
        snowflake.style.animationDuration = Math.random() * 3 + 2 + 's'; // 2-5s
        snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';
        snowflake.style.opacity = Math.random();

        snowContainer.appendChild(snowflake);

        setTimeout(() => {
            snowflake.remove();
        }, 5000);
    }

    setInterval(createSnowflake, 200);

    // --- Event Listeners ---
    celebrateBtn.addEventListener('click', startCelebration);

    // Allow Enter key to submit
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            startCelebration();
        }
    });
});

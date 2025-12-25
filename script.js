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
    const shareBtn = document.getElementById('shareBtn');

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

                // Show share button only if sharing is supported or as a fallback
                // We'll show it always for now, logic inside handles the action
                shareBtn.style.display = 'inline-flex';
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

    // --- Sharing Logic ---
    shareBtn.addEventListener('click', async () => {
        try {
            // Feedback to user
            const originalBtnContent = shareBtn.innerHTML;
            shareBtn.innerHTML = '<span class="spinner" style="font-size: 1rem;">⌛</span>';

            // Hide UI elements we don't want in the print
            shareBtn.style.display = 'none';
            document.querySelector('.refresh-hint').style.display = 'none';

            // Capture the entire body with specific clone edits
            const canvas = await html2canvas(document.body, {
                backgroundColor: '#1a2e1a', // Force the dark green background
                scale: 2, // High resolution
                useCORS: true,
                windowWidth: document.body.scrollWidth,
                windowHeight: document.body.scrollHeight,
                x: 0,
                y: 0,
                width: document.body.scrollWidth,
                height: document.body.scrollHeight,
                onclone: (clonedDoc) => {
                    const body = clonedDoc.body;

                    // 1. Force Background (Double check)
                    body.style.background = '#1a2e1a';

                    // 2. Hide 3D Tree & Environment to clear the view
                    const tree = body.querySelector('.christmas-tree');
                    if (tree) tree.style.display = 'none';
                    const snow = body.querySelector('.snow-container');
                    if (snow) snow.style.display = 'none';
                    const lights = body.querySelector('.lights-overlay');
                    if (lights) lights.style.display = 'none';

                    // 3. Show & Style Icon
                    // We'll insert a high-contrast icon directly or show the existing one
                    const icon = body.querySelector('.print-icon');
                    if (icon) {
                        icon.style.display = 'block';
                        icon.style.color = '#ffffff'; // White icon
                        icon.style.fontSize = '80px';
                        icon.style.marginBottom = '20px';
                        icon.innerHTML = '⭐'; // Use a Star for high contrast against green
                    }

                    // 4. Force Text Colors to White
                    const texts = body.querySelectorAll('.animated-text');
                    texts.forEach(t => {
                        t.style.color = '#ffffff';
                        t.style.textShadow = '0 2px 5px #000000';
                        t.style.fontFamily = 'Quicksand, sans-serif';
                        t.style.opacity = '1';
                    });

                    // 5. Force Name Highlight to Gold
                    const highlights = body.querySelectorAll('.name-highlight');
                    highlights.forEach(h => {
                        h.style.color = '#fcc201';
                        h.style.textShadow = '0 0 15px rgba(252, 194, 1, 0.8)';
                        h.style.fontWeight = 'bold';
                    });

                    // 6. Ensure buttons are hidden in clone (redundant but safe)
                    const btn = body.querySelector('#shareBtn');
                    if (btn) btn.style.display = 'none';
                    const hint = body.querySelector('.refresh-hint');
                    if (hint) hint.style.display = 'none';
                }
            });

            // Restore UI elements (on the real document)
            shareBtn.style.display = 'inline-flex';
            document.querySelector('.refresh-hint').style.display = 'block';
            shareBtn.innerHTML = originalBtnContent;

            // Convert to blob
            canvas.toBlob(async (blob) => {
                const file = new File([blob], "mensagem_natal.png", { type: "image/png" });

                // Check for native share support
                if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            files: [file],
                            title: 'Mensagem de Natal',
                            text: 'Olha minha mensagem de Natal! 🎄✨'
                        });
                    } catch (err) {
                        console.log('Share cancelled', err);
                    }
                } else {
                    // Fallback: Download
                    const link = document.createElement('a');
                    link.download = 'mensagem_natal.png';
                    link.href = canvas.toDataURL();
                    link.click();
                    alert("Imagem salva! Verifique seus downloads. 📸");
                }
            }, 'image/png');

        } catch (error) {
            console.error('Error:', error);
            // Restore UI in case of error
            shareBtn.style.display = 'inline-flex';
            document.querySelector('.refresh-hint').style.display = 'block';
            shareBtn.innerHTML = '<span class="icon">📸</span> Compartilhar no Story';
            alert('Erro ao gerar imagem. Tente tirar print manual.');
        }
    });

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

document.addEventListener('DOMContentLoaded', () => {
    // Shared Elements
    const bg = document.querySelector('.background');
    let isAnimating = false;
    let currentMode = 'lr'; // 'lr' or 'number'

    // Mode Sections
    const modeLR = document.getElementById('mode-lr');
    const modeNumber = document.getElementById('mode-number');

    // LR Elements
    const btnLR = document.getElementById('start-btn-lr');
    const cardLeft = document.getElementById('card-left');
    const cardRight = document.getElementById('card-right');
    const cards = [cardLeft, cardRight];
    const toNumberBtn = document.getElementById('to-number-btn');

    // Number Elements
    const btnNum = document.getElementById('start-btn-num');
    const giantNumber = document.getElementById('giant-number');
    const toLRBtn = document.getElementById('to-lr-btn');

    // --- Logging Helper ---
    function log(msg) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('zh-TW', { hour12: false }) + '.' + String(now.getMilliseconds()).padStart(3, '0');
        console.log(`[${timeString}] ${msg}`);
    }

    // --- Mode Switching ---
    function switchMode(mode) {
        if (isAnimating) {
            log('Cannot switch mode while animating');
            return;
        }

        if (mode === 'number') {
            modeLR.classList.add('hidden');
            modeLR.classList.remove('active');
            modeNumber.classList.remove('hidden');
            modeNumber.classList.add('active');
            currentMode = 'number';
            log('Switched to Number Mode');
        } else {
            modeNumber.classList.add('hidden');
            modeNumber.classList.remove('active');
            modeLR.classList.remove('hidden');
            modeLR.classList.add('active');
            currentMode = 'lr';
            log('Switched to Left/Right Mode');
        }
    }

    // Navigation Listeners
    toNumberBtn.addEventListener('click', () => switchMode('number'));
    toLRBtn.addEventListener('click', () => switchMode('lr'));

    // --- Input Listeners ---
    btnLR.addEventListener('click', () => {
        log('LR Button Clicked');
        startLRSelection();
    });

    btnNum.addEventListener('click', () => {
        log('Number Button Clicked');
        startNumberSelection();
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault(); // Prevent scrolling
            log('Spacebar Pressed');
            if (currentMode === 'lr') startLRSelection();
            else startNumberSelection();
        } else if (e.code === 'ArrowRight') {
            if (currentMode === 'lr') switchMode('number');
        } else if (e.code === 'ArrowLeft') {
            if (currentMode === 'number') switchMode('lr');
        }
    });

    // --- Logic: Left vs Right ---
    function startLRSelection() {
        if (isAnimating) return;

        log('Starting LR Selection...');
        isAnimating = true;
        btnLR.disabled = true;
        bg.classList.remove('dimmed');

        // Reset states
        cards.forEach(c => {
            c.classList.remove('active');
            c.classList.remove('highlight');
            c.classList.remove('loser');
        });

        const duration = Math.random() * 5000 + 10000;
        log(`Planned Duration: ${(duration / 1000).toFixed(2)}s`);

        const startTime = Date.now();

        // Start immediately
        let activeIndex = Math.floor(Math.random() * 2);

        cards.forEach((c, i) => {
            if (i === activeIndex) c.classList.add('highlight');
            else c.classList.remove('highlight');
        });

        let lastSwitchTime = startTime;
        let currentDelay = 500;
        const maxDelay = 1500;

        function step() {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1.0);
            const ease = progress * progress * progress;
            const targetDelay = 500 + (maxDelay - 500) * ease;

            if (now - lastSwitchTime >= currentDelay) {
                // Switch
                activeIndex = (activeIndex + 1) % 2;
                cards.forEach((c, i) => {
                    if (i === activeIndex) c.classList.add('highlight');
                    else c.classList.remove('highlight');
                });
                lastSwitchTime = now;
                currentDelay = targetDelay;
            }

            if (progress < 1.0) {
                requestAnimationFrame(step);
            } else {
                finish();
            }
        }

        function finish() {
            const winner = cards[activeIndex];
            const loser = cards[(activeIndex + 1) % 2]; // The other card
            const winnerName = activeIndex === 0 ? 'LEFT' : 'RIGHT';
            log(`FINISHED. Winner: ${winnerName}`);

            cards.forEach(c => c.classList.remove('highlight'));
            winner.classList.add('active');
            loser.classList.add('loser'); // Blur the loser
            bg.classList.add('dimmed');

            isAnimating = false;
            btnLR.disabled = false;
        }

        requestAnimationFrame(step);
    }

    // --- Logic: Number Selector ---
    function startNumberSelection() {
        if (isAnimating) return;

        log('Starting Number Selection...');
        isAnimating = true;
        btnNum.disabled = true;
        bg.classList.remove('dimmed');

        // Reset state
        giantNumber.classList.remove('active');
        giantNumber.classList.add('highlight'); // Use highlight for running state

        const duration = Math.random() * 5000 + 10000;
        log(`Planned Duration: ${(duration / 1000).toFixed(2)}s`);

        const startTime = Date.now();
        let currentNum = Math.floor(Math.random() * 10);
        giantNumber.textContent = currentNum;

        let lastSwitchTime = startTime;
        let currentDelay = 50; // Start very fast (50ms)
        const maxDelay = 600; // End slower (600ms)

        function step() {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1.0);
            const ease = progress * progress * progress;
            const targetDelay = 50 + (maxDelay - 50) * ease; // Fast curve for numbers

            if (now - lastSwitchTime >= currentDelay) {
                // Pick new random number (avoiding same number twice looks better)
                let nextNum = Math.floor(Math.random() * 10);
                while (nextNum === currentNum) {
                    nextNum = Math.floor(Math.random() * 10);
                }
                currentNum = nextNum;
                giantNumber.textContent = currentNum;

                lastSwitchTime = now;
                currentDelay = targetDelay;
            }

            if (progress < 1.0) {
                requestAnimationFrame(step);
            } else {
                finish();
            }
        }

        function finish() {
            log(`FINISHED. Winner: ${currentNum}`);
            giantNumber.classList.remove('highlight');
            giantNumber.classList.add('active');
            bg.classList.add('dimmed');

            isAnimating = false;
            btnNum.disabled = false;
        }

        requestAnimationFrame(step);
    }
});

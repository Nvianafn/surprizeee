// Memastikan semua kode dijalankan setelah HTML selesai dimuat
document.addEventListener("DOMContentLoaded", function() {
    const splashScreen = document.getElementById('splash-screen');
    const tombolMulai = document.querySelector('.tombol-mulai-interaktif');
    const mainContent = document.querySelector('main');
    const footer = document.querySelector('footer');

    // Sembunyikan konten utama pada awalnya
    if (mainContent) mainContent.style.opacity = '0';
    if (footer) footer.style.opacity = '0';

    // Event listener utama untuk tombol mulai
    if (tombolMulai) {
        tombolMulai.addEventListener('click', function() {
            if (splashScreen.classList.contains('menghilang')) return; // Mencegah klik berulang
            splashScreen.classList.add('menghilang');
            
            // 1. Animasi tombol aktif
            tombolMulai.classList.add('on');
            
            // 2. Tampilkan loading text
            const loadingText = document.querySelector('.loading-text');
            if (loadingText) loadingText.style.opacity = '1';
            
            // 3. Setelah animasi tombol selesai, jalankan transisi keluar
            setTimeout(() => {
                splashScreen.style.opacity = '0';
                splashScreen.style.visibility = 'hidden';

                // 4. Munculkan konten utama
                if (mainContent) mainContent.style.opacity = '1';
                if (footer) footer.style.opacity = '1';
                
                // 5. SETELAH KONTEN UTAMA MUNCUL, BARU KITA AKTIFKAN SEMUA INTERAKSI & ANIMASI
                initHalamanUtama();
                
            }, 1200); // Jeda 1.2 detik
        });
    }

     function initHalamanUtama() {
        initMemoryGame(); // Aktifkan logika game
        //initGsapAnimations(); // Aktifkan animasi scroll
    }

            // =======================================================
            //          MEMORY GAME FUNCTIONALITY
            // =======================================================
            function initMemoryGame() {
        const gameBoard = document.getElementById('game-board');
        const startBtn = document.getElementById('start-game-btn');
        const winScreen = document.getElementById('win-screen');
        const closeBtn = document.getElementById('close-win-screen-btn');
        const hadiahBtn = document.getElementById('hadiah-btn');
        
        if (!gameBoard || !startBtn) {
            console.log('Game elements not found');
            return;
        }

        let gameState = {
            flippedCards: [],
            matchedPairs: 0,
            isLocked: false,
            totalPairs: 8
        };

        // Event listener untuk tombol start
        startBtn.addEventListener('click', () => {
            console.log('Start game clicked');
            
            // Fade out start button
            startBtn.style.opacity = '0';
            startBtn.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                startBtn.style.display = 'none';
                
                // Setup and show game board
                gameBoard.style.display = 'grid';
                gameBoard.style.opacity = '0';
                gameBoard.style.transform = 'scale(0.8)';
                
                createGameCards();
                
                // Animate game board in
                setTimeout(() => {
                    gameBoard.style.opacity = '1';
                    gameBoard.style.transform = 'scale(1)';
                }, 100);
                
            }, 300);
        });

        function createGameCards() {
            console.log('Creating game cards...');
            // Clear previous game
            gameBoard.innerHTML = '';
            gameState = {
                flippedCards: [],
                matchedPairs: 0,
                isLocked: false,
                totalPairs: 8
            };

            // Pilih 8 stiker untuk game (pastikan ada pasangannya)
            const stickerNames = ['Stiker1', 'Stiker2', 'Stiker3', 'Stiker4', 'Stiker5', 'Stiker6', 'Stiker7', 'Stiker8'];
            let gameGrid = [...stickerNames, ...stickerNames]; // Gandakan untuk jadi pasangan

            // Acak posisi kartu dengan algoritma Fisher-Yates
            for (let i = gameGrid.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [gameGrid[i], gameGrid[j]] = [gameGrid[j], gameGrid[i]];
            }

            console.log('Game grid:', gameGrid);

            // Buat kartu-kartu di HTML
            gameGrid.forEach((name, index) => {
                const card = document.createElement('div');
                card.classList.add('card');
                card.dataset.name = name;
                card.dataset.index = index;

                card.innerHTML = `
                    <div class="card-inner">
                        <div class="card-face card-front">
                            <div class="card-pattern">?</div>
                        </div>
                        <div class="card-face card-back">
                            <img src="assets/stikers/${name}.png" alt="Stiker">
                        </div>
                    </div>
                `;
                
                gameBoard.appendChild(card);
                
                // Add click event listener langsung ke setiap card
                card.addEventListener('click', (e) => handleCardClick(e, card));
            });

            console.log('Cards created:', gameBoard.children.length);
        }

        function handleCardClick(e, clickedCard) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Card clicked:', clickedCard.dataset.name);
            
            // Prevent clicking if game is locked, card already flipped, or matched
            if (gameState.isLocked || 
                clickedCard.classList.contains('flipped') || 
                clickedCard.classList.contains('matched') ||
                gameState.flippedCards.length >= 2) {
                console.log('Click prevented - game locked or card already flipped');
                return;
            }

            // Flip the card
            clickedCard.classList.add('flipped');
            gameState.flippedCards.push(clickedCard);
            
            console.log('Flipped cards count:', gameState.flippedCards.length);
            console.log('Card should show:', clickedCard.dataset.name);

            // Check if two cards are flipped
            if (gameState.flippedCards.length === 2) {
                gameState.isLocked = true;
                setTimeout(() => checkForMatch(), 600); // Small delay to see both cards
            }
        }

        function checkForMatch() {
            const [cardOne, cardTwo] = gameState.flippedCards;
            
            console.log('Checking match:', cardOne.dataset.name, 'vs', cardTwo.dataset.name);
            
            if (cardOne.dataset.name === cardTwo.dataset.name) {
                // Match found!
                console.log('Match found!');
                cardOne.classList.add('matched');
                cardTwo.classList.add('matched');
                gameState.matchedPairs++;
                
                // Reset flipped cards
                gameState.flippedCards = [];
                gameState.isLocked = false;
                
                console.log('Matched pairs:', gameState.matchedPairs, '/', gameState.totalPairs);
                
                // Check if game is won
                if (gameState.matchedPairs === gameState.totalPairs) {
            console.log('Game won!');
            // Tampilkan pesan kemenangan dengan animasi
            setTimeout(() => {
                const winMessage = document.getElementById('win-message');
                if (winMessage) {
                    winMessage.style.display = 'block';
                    gsap.to(winMessage, { opacity: 1, scale: 1.1, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
                }
            }, 800);
        }
            } else {
                // No match - flip cards back after delay
                console.log('No match - flipping back');
                setTimeout(() => {
                    cardOne.classList.remove('flipped');
                    cardTwo.classList.remove('flipped');
                    gameState.flippedCards = [];
                    gameState.isLocked = false;
                }, 1200);
            }
        }

    }


    // =======================================================
    // FUNGSI UNTUK MEMBUAT ELEMEN LATAR BELAKANG
    // =======================================================

    // Membuat partikel-partikel kecil yang melayang
    function buatPartikel() {
        const container = document.querySelector('.particles');
        if (!container) return;
        const jumlahPartikel = 25;
        
        for (let i = 0; i < jumlahPartikel; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
            container.appendChild(particle);
        }
    }

    // Membuat garis-garis konstelasi yang berkelip
    function buatKonstellasi() {
        const container = document.querySelector('.constellation');
        if (!container) return;
        const jumlahGaris = 15;
        
        for (let i = 0; i < jumlahGaris; i++) {
            const line = document.createElement('div');
            line.className = 'constellation-line';
            line.style.left = Math.random() * 90 + '%';
            line.style.top = Math.random() * 90 + '%';
            line.style.width = Math.random() * 120 + 70 + 'px';
            line.style.transform = `rotate(${Math.random() * 360}deg)`;
            line.style.animationDelay = Math.random() * 4 + 's';
            container.appendChild(line);
        }
    }

    // Panggil fungsi-fungsi di atas
    buatPartikel();
    buatKonstellasi();

    // Inisialisasi SortableJS
    const galeri = document.getElementById('galeri-sortable');
    if (galeri) { // Pastikan elemennya ada
        new Sortable(galeri, {
            animation: 350, // Durasi animasi saat item bergeser (dalam ms)
            ghostClass: 'sortable-ghost', // Class untuk placeholder
            chosenClass: 'sortable-chosen', // Class saat item diangkat
            dragClass: 'sortable-drag',
        });
    }

    const stikerGrid = document.getElementById('stiker-sortable');
    if (stikerGrid) {
        new Sortable(stikerGrid, {
            animation: 350,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
        });
    }

    // =======================================================
    // ANIMASI GSAP
    // =======================================================

    gsap.registerPlugin(ScrollTrigger);

    // Animasi entrance untuk bagian Beranda
    const timelineBeranda = gsap.timeline({
        delay: 0.5,
        scrollTrigger: {
            trigger: "#beranda",
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });

    timelineBeranda
        .to("#beranda .foto-utama", { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "expo.out" })
        .to("#beranda h1", { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" }, "-=1.0")
        .to("#beranda .subjudul", { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" }, "-=0.8");

    // Animasi untuk judul-judul section
    gsap.utils.toArray('h2').forEach(h2 => {
        gsap.to(h2, {
            scrollTrigger: {
                trigger: h2,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "expo.out"
        });
    });

    // Animasi untuk galeri
    gsap.to(".item-galeri", {
        scrollTrigger: {
            trigger: ".grid-galeri",
            start: "top 80%"
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: "expo.out"
    });

    // Animasi untuk Spotify
    const timelineSpotify = gsap.timeline({
        scrollTrigger: {
            trigger: "#spotify",
            start: "top 80%"
        }
    });

    timelineSpotify
        .to("#spotify p", { opacity: 1, y: 0, duration: 1, ease: "expo.out" })
        .to("#spotify iframe", { opacity: 1, y: 0, duration: 1, ease: "expo.out" }, "-=0.6");

    // Animasi untuk Catatan
    const timelineCatatan = gsap.timeline({
        scrollTrigger: {
            trigger: ".konten-catatan",
            start: "top 80%"
        }
    });

    timelineCatatan
        .to(".konten-catatan h4:first-of-type", { opacity: 1, y: 0, duration: 1, ease: "expo.out" })
        .to(".konten-catatan .teks-puisi", { opacity: 1, y: 0, duration: 1, ease: "expo.out" }, "-=0.5")
        .to(".konten-catatan h4:last-of-type", { opacity: 1, y: 0, duration: 1, ease: "expo.out" }, "-=0.5")
        .to(".konten-catatan audio", { opacity: 1, y: 0, duration: 1, ease: "expo.out" }, "-=0.5")
        .to(".konten-catatan hr", { opacity: 1, duration: 1.5, ease: "expo.out" }, "-=0.5")
        .to(".konten-catatan .teks-penutup", { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" }, "-=1.0");

    // Animasi Parallax untuk background saat scroll
    gsap.to(".latar-angkasa", {
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: true
        },
        y: -300, // Background akan bergerak ke atas lebih lambat
        ease: "none"
    });

    // Animasi Parallax mouse move
    document.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth) - 0.5;
        const mouseY = (e.clientY / window.innerHeight) - 0.5;
        
        gsap.to(".latar-angkasa", {
            x: -mouseX * 50,
            y: -mouseY * 50,
            duration: 2,
            ease: "power2.out"
        });
    });

    
});
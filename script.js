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
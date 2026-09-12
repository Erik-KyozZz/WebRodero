// --- Data: Tracks & Products ---

const TRACKS = [
    {
        id: 0,
        title: "A Todas",
        artist: "RODERO",
        cover: "media/img/cancionesimg/A TODAS [KNmR0zeJX_o].jpg",
        url: "media/canciones/A TODAS [KNmR0zeJX_o].mp3",
        isCollab: false
    },
    {
        id: 1,
        title: "Algo Diferente",
        artist: "RODERO",
        cover: "media/img/cancionesimg/ALGO DIFERENTE [2v6pEiE7nug].jpg",
        url: "media/canciones/ALGO DIFERENTE [2v6pEiE7nug].mp3",
        isCollab: false
    },
    {
        id: 2,
        title: "Bandida",
        artist: "RODERO",
        cover: "media/img/cancionesimg/Bandida [o46mjtV5epg].jpg",
        url: "media/canciones/Bandida [o46mjtV5epg].mp3",
        isCollab: false
    },
    {
        id: 3,
        title: "Cae La Luna",
        artist: "RODERO",
        cover: "media/img/cancionesimg/CAE LA LUNA [EP6UBdoNbhE].jpg",
        url: "media/canciones/CAE LA LUNA [EP6UBdoNbhE].mp3",
        isCollab: false
    },
    {
        id: 4,
        title: "Caile",
        artist: "RODERO",
        cover: "media/img/cancionesimg/Caile [SdvoH5qSe4c].jpg",
        url: "media/canciones/Caile [SdvoH5qSe4c].mp3",
        isCollab: false
    },
    {
        id: 5,
        title: "Cómo te va",
        artist: "RODERO",
        cover: "media/img/cancionesimg/Cómo te va [46DTL44j3dg].jpg",
        url: "media/canciones/Cómo te va [46DTL44j3dg].mp3",
        isCollab: false
    },
    {
        id: 6,
        title: "Dime Bebé",
        artist: "RODERO",
        cover: "media/img/cancionesimg/Dime Bebé [6RE0u9Gw0wY].jpg",
        url: "media/canciones/Dime Bebé [6RE0u9Gw0wY].mp3",
        isCollab: false
    },
    {
        id: 7,
        title: "Dos Desconocidos",
        artist: "RODERO",
        cover: "media/img/cancionesimg/Dos Desconocidos [QIuDSFjYnFw].jpg",
        url: "media/canciones/Dos Desconocidos [QIuDSFjYnFw].mp3",
        isCollab: false
    },
    {
        id: 8,
        title: "Estar Juntitos Los Dos",
        artist: "RODERO",
        cover: "media/img/cancionesimg/Estar Juntitos Los Dos [dcVwUMIyusE].jpg",
        url: "media/canciones/Estar Juntitos Los Dos [dcVwUMIyusE].mp3",
        isCollab: false
    },
    {
        id: 9,
        title: "Isla Desierta",
        artist: "RODERO",
        cover: "media/img/cancionesimg/Isla Desierta [In-jK5Eo3A4].jpg",
        url: "media/canciones/Isla Desierta [In-jK5Eo3A4].mp3",
        isCollab: false
    },
    {
        id: 10,
        title: "Japón",
        artist: "RODERO",
        cover: "media/img/cancionesimg/Japón [DPzJVrM5yqY].jpg",
        url: "media/canciones/Japón [DPzJVrM5yqY].mp3",
        isCollab: false
    },
    {
        id: 11,
        title: "Llegó El Verano",
        artist: "RODERO",
        cover: "media/img/cancionesimg/Llegó El Verano [zMBNpNpyz3s].jpg",
        url: "media/canciones/Llegó El Verano [zMBNpNpyz3s].mp3",
        isCollab: false
    },
    {
        id: 12,
        title: "Mallorca",
        artist: "RODERO",
        cover: "media/img/cancionesimg/Mallorca [m39HHN4rmMc].jpg",
        url: "media/canciones/Mallorca [m39HHN4rmMc].mp3",
        isCollab: false
    },
    {
        id: 13,
        title: "Morenita",
        artist: "RODERO",
        cover: "media/img/cancionesimg/Morenita [qZwN1tXAKbw].jpg",
        url: "media/canciones/Morenita [qZwN1tXAKbw].mp3",
        isCollab: false
    },
    {
        id: 14,
        title: "Para Mi",
        artist: "RODERO",
        cover: "media/img/cancionesimg/Para Mi [6oKVtVQn-9c].jpg",
        url: "media/canciones/Para Mi [6oKVtVQn-9c].mp3",
        isCollab: false
    },
    {
        id: 15,
        title: "Quiero más",
        artist: "RODERO",
        cover: "media/img/cancionesimg/Quiero más [0U84yHaLO4E].jpg",
        url: "media/canciones/Quiero más [0U84yHaLO4E].mp3",
        isCollab: false
    },
    {
        id: 16,
        title: "Otra Vez",
        artist: "RODERO & GUIJAS",
        cover: "media/img/cancionesimg/Otra vez.jpg",
        url: "media/canciones/Otra vez.mp3",
        isCollab: true
    },
    {
        id: 17,
        title: "Último Verano",
        artist: "RODERO & GUIJAS",
        cover: "media/img/cancionesimg/Último Verano.jpg",
        url: "media/canciones/Último Verano.mp3",
        isCollab: true
    },
    {
        id: 18,
        title: "Aunque Yo Ya Sé",
        artist: "RODERO & GUIJAS",
        cover: "media/img/cancionesimg/AunqueYoYaSé.jpg",
        url: "media/canciones/AunqueYoYaSé.mp3",
        isCollab: true
    },
    {
        id: 19,
        title: "Algo Diferente - Remix",
        artist: "RODERO - LUANI - LUCIA DE LA PUERTA",
        cover: "media/img/cancionesimg/AlgoDiferente LUCIA DE LA PUERTA - LUANI - RODERO.jpg",
        url: "media/canciones/AlgoDiferente LUCIA DE LA PUERTA - LUANI - RODERO.mp3",
        isCollab: true
    }
];

const PRODUCTS = [
    {
        id: "preset-trap",
        title: "PRESET VOCAL",
        type: "preset",
        desc: "Preset vocal completo para voces de trap limpias y definidas. Incluye afinación, EQ dinámica y compresión. Compatible con FL Studio.",
        price: 74.99,
        image: "media/img/preset_vocal.png",
        checkoutUrl: "https://rodero.lemonsqueezy.com/checkout/buy/preset-trap?embed=1"
    },
    {
        id: "preset-reggaeton",
        title: "ADLIBS",
        type: "preset",
        desc: "Logra el brillo y el autotune característico de las mejores voces de reggaetón del momento. Configuración rápida y profesional.",
        price: 24.99,
        image: "media/img/preset_adlibs.png",
        checkoutUrl: "https://rodero.lemonsqueezy.com/checkout/buy/preset-reggaeton?embed=1"
    },
    {
        id: "preset-merengue",
        title: "Merengue Vocal Brightener",
        type: "preset",
        desc: "Preset optimizado para resaltar y dar presencia a voces sobre percusiones latinas pesadas. Sonido brillante y cálido.",
        price: 19.99,
        image: "media/img/preset_merengue.png",
        checkoutUrl: "https://rodero.lemonsqueezy.com/checkout/buy/preset-merengue?embed=1"
    },
    {
        id: "beat-mambo",
        title: "Mambo Trap Type Beat - 'FUEGO'",
        type: "beat",
        desc: "Beat completo con licencia comercial. Mezcla explosiva de dembow de merengue con bajos de 808 del trap. Stems incluidos.",
        price: 39.99,
        image: "media/img/beat_fuego.png",
        checkoutUrl: "https://rodero.lemonsqueezy.com/checkout/buy/beat-fuego?embed=1"
    },
    {
        id: "beat-urbano",
        title: "Reggaeton Romántico - 'LUNA'",
        type: "beat",
        desc: "Beat melódico y comercial, ideal para un hit de reggaetón suave. Incluye licencias comerciales para plataformas de streaming.",
        price: 34.99,
        image: "media/img/beat_luna.png",
        checkoutUrl: "https://rodero.lemonsqueezy.com/checkout/buy/beat-luna?embed=1"
    },
    {
        id: "pack-drumkit",
        title: "RODERO Trap Drums Vol 1",
        type: "beat",
        desc: "El kit definitivo con más de 150 sonidos de percusión creados y procesados personalmente por RODERO. Kicks, 808s, Snares.",
        price: 14.99,
        image: "media/img/pack_drumkit.png",
        checkoutUrl: "https://rodero.lemonsqueezy.com/checkout/buy/pack-drumkit?embed=1"
    }
];

// --- State Variables ---
let currentTrackIndex = 0;
let isPlaying = false;
let audio = new Audio();
let cart = JSON.parse(localStorage.getItem('rodero_cart')) || [];

// --- DOM Elements ---
const menuToggleBtn = document.getElementById('menuToggleBtn');
const navLinksEl = document.querySelector('.nav-links');

const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const progressBar = document.getElementById('progressBar');
const progressBarContainer = document.getElementById('progressBarContainer');
const volumeSlider = document.getElementById('volumeSlider');
const volumeIcon = document.getElementById('volumeIcon');
const playerContainer = document.querySelector('.player-container');

const currentTrackCover = document.getElementById('currentTrackCover');
const currentTrackTitle = document.getElementById('currentTrackTitle');
const currentTrackArtist = document.getElementById('currentTrackArtist');
const singlesTrackList = document.getElementById('singlesTrackList');
const collabsTrackList = document.getElementById('collabsTrackList');

const storeGridEl = document.getElementById('storeGrid');

const cartToggleBtn = document.getElementById('cartToggleBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartTotalValue = document.getElementById('cartTotalValue');
const cartCountEl = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');

const checkoutModal = document.getElementById('checkoutModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const checkoutForm = document.getElementById('checkoutForm');
const modalDetails = document.getElementById('modalDetails');
const successDetails = document.getElementById('successDetails');
const successCloseBtn = document.getElementById('successCloseBtn');

const navbar = document.getElementById('navbar');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    loadTrack(currentTrackIndex);
    renderTracklist();
    renderProducts();
    updateCartUI();

    // Event Listeners
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', playPrevious);
    nextBtn.addEventListener('click', playNext);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', setDuration);
    audio.addEventListener('ended', playNext);
    progressBarContainer.addEventListener('click', setProgress);
    volumeSlider.addEventListener('input', changeVolume);

    // Mobile Menu Toggle
    menuToggleBtn.addEventListener('click', () => {
        navLinksEl.classList.toggle('open');
        const icon = menuToggleBtn.querySelector('i');
        if (navLinksEl.classList.contains('open')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars';
        }
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link-item').forEach(link => {
        link.addEventListener('click', () => {
            navLinksEl.classList.remove('open');
            const icon = menuToggleBtn.querySelector('i');
            icon.className = 'fa-solid fa-bars';
        });
    });

    // Cart Sidebar Interactions
    cartToggleBtn.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);
    checkoutBtn.addEventListener('click', openCheckoutModal);

    // Modal Interactions
    closeModalBtn.addEventListener('click', closeCheckoutModal);
    successCloseBtn.addEventListener('click', closeCheckoutModal);
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);

    // Navigation and Scrolling Effects
    window.addEventListener('scroll', handleNavbarScroll);
    setupSmoothScrolling();

    // Quick play for featured songs
    const registerQuickPlay = (btnId, title) => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', () => {
                const trackIndex = TRACKS.findIndex(t => t.title.toLowerCase() === title.toLowerCase());
                if (trackIndex !== -1) {
                    currentTrackIndex = trackIndex;
                    isPlaying = true;
                    playerContainer.classList.add('playing');
                    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                    loadTrack(currentTrackIndex);

                    // Scroll to music section smoothly
                    const musicSection = document.getElementById('music');
                    if (musicSection) {
                        const offset = 80;
                        const targetPosition = musicSection.getBoundingClientRect().top + window.scrollY - offset;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        }
    };

    registerQuickPlay('quickPlayAlgoDiferente', 'Algo Diferente');
    registerQuickPlay('quickPlayComoTeVa', 'Cómo te va');
    registerQuickPlay('quickPlayDimeBebe', 'Dime Bebé');

    // Quick add buttons in the Featured section
    document.querySelectorAll('.quick-add-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const presetId = btn.getAttribute('data-preset-id');
            if (presetId) {
                addToCart(presetId);
            }
        });
    });

    initLemonSqueezy();
});

// --- Music Player Logic ---

function loadTrack(index) {
    const track = TRACKS[index];
    audio.src = track.url;
    currentTrackTitle.textContent = track.title;
    currentTrackArtist.textContent = track.artist;
    currentTrackCover.src = track.cover;

    // Highlight track in tracklist
    const items = document.querySelectorAll('.track-item');
    items.forEach(item => {
        item.classList.remove('active');
        if (parseInt(item.dataset.index) === index) {
            item.classList.add('active');
        }
    });

    if (isPlaying) {
        audio.play().catch(e => console.log("Audio play failed or interrupted."));
    }
}

function renderTracklist() {
    singlesTrackList.innerHTML = '';
    collabsTrackList.innerHTML = '';

    // Render Singles
    TRACKS.forEach((track, index) => {
        if (!track.isCollab) {
            appendTrackItem(track, index, singlesTrackList);
        }
    });

    // Render Collabs
    TRACKS.forEach((track, index) => {
        if (track.isCollab) {
            appendTrackItem(track, index, collabsTrackList);
        }
    });
}

function appendTrackItem(track, index, container) {
    const trackItem = document.createElement('div');
    trackItem.className = `track-item ${index === currentTrackIndex ? 'active' : ''}`;
    trackItem.dataset.index = index;
    trackItem.innerHTML = `
        <div class="track-item-main">
            <span class="track-item-index">${index + 1}</span>
            <div class="track-item-details">
                <p class="track-item-title">${track.title}</p>
            </div>
        </div>
        <div class="track-item-meta">
            <span class="track-item-play-icon"><i class="fa-solid fa-play"></i></span>
        </div>
    `;
    trackItem.addEventListener('click', () => {
        currentTrackIndex = index;
        isPlaying = true;
        playerContainer.classList.add('playing');
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        loadTrack(index);
    });
    container.appendChild(trackItem);
}

function togglePlay() {
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        playerContainer.classList.remove('playing');
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    } else {
        audio.play().catch(e => console.log("Audio play failed."));
        isPlaying = true;
        playerContainer.classList.add('playing');
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    }
}

function playPrevious() {
    currentTrackIndex = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    loadTrack(currentTrackIndex);
}

function playNext() {
    currentTrackIndex = (currentTrackIndex + 1) % TRACKS.length;
    loadTrack(currentTrackIndex);
}

function updateProgress() {
    const { currentTime, duration } = audio;
    if (isNaN(duration)) return;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
    currentTimeEl.textContent = formatTime(currentTime);
}

function setDuration() {
    durationEl.textContent = formatTime(audio.duration);
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    if (isNaN(duration)) return;
    audio.currentTime = (clickX / width) * duration;
}

function changeVolume(e) {
    const vol = e.target.value;
    audio.volume = vol;
    if (vol == 0) {
        volumeIcon.className = "fa-solid fa-volume-xmark";
    } else if (vol < 0.5) {
        volumeIcon.className = "fa-solid fa-volume-low";
    } else {
        volumeIcon.className = "fa-solid fa-volume-high";
    }
}

function formatTime(time) {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// --- Store Logic ---

function renderProducts() {
    storeGridEl.innerHTML = '';

    PRODUCTS.forEach(product => {
        const card = document.createElement('article');
        card.className = "product-card glass";
        card.innerHTML = `
            <div class="product-media">
                <img src="${product.image}" alt="${product.title}" class="product-img">
                <span class="product-tag">${product.type === 'preset' ? 'Preset Vocal' : 'Beat / Loop'}</span>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-desc">${product.desc}</p>
                <div class="product-footer">
                    <span class="product-price">${product.price.toFixed(2)}<span>€</span></span>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="buy-now-btn" data-id="${product.id}" aria-label="Comprar ahora" title="Comprar ahora">
                            <i class="fa-solid fa-credit-card"></i>
                        </button>
                        <button class="add-to-cart-btn" data-id="${product.id}" aria-label="Añadir al carrito" title="Añadir al carrito">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Buy now event
        card.querySelector('.buy-now-btn').addEventListener('click', () => {
            if (product.checkoutUrl) {
                openLemonSqueezyCheckout(product.checkoutUrl);
            }
        });

        // Add to cart event
        card.querySelector('.add-to-cart-btn').addEventListener('click', () => {
            addToCart(product.id);
        });

        storeGridEl.appendChild(card);
    });
}

// --- Cart Logic ---

function addToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    openCartSidebar();
}

function openCartSidebar() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('open');
}

function toggleCart() {
    cartSidebar.classList.toggle('open');
    cartOverlay.classList.toggle('open');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('rodero_cart', JSON.stringify(cart));
}

function updateCartUI() {
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-msg">
                <i class="fa-solid fa-bag-shopping"></i>
                <p>Tu carrito está vacío</p>
            </div>
        `;
        checkoutBtn.disabled = true;
        cartCountEl.textContent = 0;
        cartTotalValue.textContent = "0.00€";
        return;
    }

    checkoutBtn.disabled = false;
    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;

        const product = PRODUCTS.find(p => p.id === item.id);
        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        cartItemEl.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-img">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.title}</h4>
                <p class="cart-item-price">${item.price.toFixed(2)}€ x ${item.quantity}</p>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <button class="pay-cart-item" data-id="${item.id}" aria-label="Comprar este producto" title="Comprar este producto">
                    <i class="fa-solid fa-credit-card"></i>
                </button>
                <button class="remove-cart-item" data-id="${item.id}" aria-label="Eliminar producto">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;

        cartItemEl.querySelector('.pay-cart-item').addEventListener('click', () => {
            if (product && product.checkoutUrl) {
                openLemonSqueezyCheckout(product.checkoutUrl);
            }
        });

        cartItemEl.querySelector('.remove-cart-item').addEventListener('click', () => {
            removeFromCart(item.id);
        });

        cartItemsContainer.appendChild(cartItemEl);
    });

    cartCountEl.textContent = count;
    cartTotalValue.textContent = `${total.toFixed(2)}€`;
}

// --- Checkout Modal Logic ---

function openCheckoutModal() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');

    // If there is only 1 item in the cart, open the Lemon Squeezy checkout immediately!
    if (cart.length === 1) {
        const product = PRODUCTS.find(p => p.id === cart[0].id);
        if (product && product.checkoutUrl) {
            openLemonSqueezyCheckout(product.checkoutUrl);
            return;
        }
    }

    checkoutModal.classList.add('open');
    modalDetails.classList.remove('hidden');
    successDetails.classList.add('hidden');

    // Build checkout details dynamically for Lemon Squeezy
    const modalDetailsEl = document.getElementById('modalDetails');

    let itemsHtml = '';
    cart.forEach(item => {
        itemsHtml += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid var(--border-color); margin-bottom: 1rem; background: rgba(255,255,255,0.01); border-radius: 6px;">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <img src="${item.image}" alt="${item.title}" style="width: 45px; height: 45px; border-radius: 4px; object-fit: cover;">
                    <div>
                        <h4 style="font-size: 0.95rem; font-weight: 600; margin: 0; text-align: left;">${item.title}</h4>
                        <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: bold;">${item.price.toFixed(2)}€</span>
                    </div>
                </div>
                <button class="btn btn-primary" onclick="openIndividualCheckoutFromModal('${item.id}')" style="padding: 0.5rem 1rem; font-size: 0.75rem;">
                    <i class="fa-solid fa-credit-card"></i> Pagar
                </button>
            </div>
        `;
    });

    modalDetailsEl.innerHTML = `
        <h3>Finalizar Compra</h3>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem; font-size: 0.9rem; text-align: left;">
            Completa la compra de cada uno de tus productos de forma segura a través de **Lemon Squeezy**:
        </p>
        <div class="checkout-items-list" style="max-height: 250px; overflow-y: auto; margin-bottom: 1.5rem;">
            ${itemsHtml}
        </div>
        <div style="text-align: center; color: var(--text-muted); font-size: 0.8rem; display: flex; align-items: center; gap: 0.5rem; justify-content: center; border-top: 1px solid var(--border-color); padding-top: 1rem;">
            <i class="fa-solid fa-lock" style="color: #4cd137;"></i> Pago 100% Seguro Procesado por Lemon Squeezy
        </div>
    `;
}

function closeCheckoutModal() {
    checkoutModal.classList.remove('open');
}

function handleCheckoutSubmit(e) {
    e.preventDefault();
}

// --- Lemon Squeezy Helpers & SDK Integration ---

function initLemonSqueezy() {
    // Setup Lemon Squeezy event handler
    if (window.LemonSqueezy) {
        window.LemonSqueezy.Setup({
            eventHandler: (event) => {
                console.log('Lemon Squeezy event:', event);
                if (event.event === 'Checkout.Success') {
                    handleSuccessfulCheckoutEvent(event);
                }
            }
        });
    }

    // Bind Quick Buy buttons in the Featured section
    document.querySelectorAll('.quick-buy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const presetId = btn.getAttribute('data-preset-id');
            const product = PRODUCTS.find(p => p.id === presetId);
            if (product && product.checkoutUrl) {
                openLemonSqueezyCheckout(product.checkoutUrl);
            }
        });
    });
}

function openLemonSqueezyCheckout(url) {
    if (window.LemonSqueezy) {
        window.LemonSqueezy.Url.Open(url);
    } else {
        window.open(url, '_blank');
    }
}

window.openIndividualCheckoutFromModal = function (productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (product && product.checkoutUrl) {
        openLemonSqueezyCheckout(product.checkoutUrl);
    }
};

function handleSuccessfulCheckoutEvent(event) {
    // Clear cart on successful payment
    cart = [];
    saveCart();
    updateCartUI();

    // Open success modal details
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');
    checkoutModal.classList.add('open');

    // Find modal elements and display success view
    const modalDetailsEl = document.getElementById('modalDetails');
    const successDetailsEl = document.getElementById('successDetails');
    if (modalDetailsEl) modalDetailsEl.classList.add('hidden');
    if (successDetailsEl) successDetailsEl.classList.remove('hidden');
}

// --- Scroll & UX Effects ---

function handleNavbarScroll() {
    const scrollY = window.scrollY;

    // Fade out banner based on scroll
    const bannerImg = document.querySelector('.banner-img');
    if (bannerImg) {
        const newOpacity = Math.max(0, 1 - (scrollY / 350));
        bannerImg.style.opacity = newOpacity;
    }

    if (scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Update active nav link based on scroll position
    const sections = document.querySelectorAll('section, .banner-container');
    const navLinks = document.querySelectorAll('.nav-link-item');

    let currentId = 'home';
    sections.forEach(sec => {
        const top = sec.offsetTop - 120;
        const height = sec.offsetHeight;
        if (window.scrollY >= top && window.scrollY < top + height) {
            currentId = sec.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').substring(1);
        if (href === currentId || (currentId === 'home' && href === 'store')) {
            link.classList.add('active');
        }
    });
}

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;

            const offset = 80; // height of fixed navbar
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

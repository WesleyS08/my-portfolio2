// === VALIDAÇÃO + ENVIO ===
document.getElementById('contact-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const form = this;
    const submitBtn = document.getElementById('submit-btn');
    const feedback = document.getElementById('form-feedback');

    // Reset
    document.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
    document.querySelectorAll('.error-msg').forEach(m => m.textContent = '');
    feedback.className = 'form-feedback';
    feedback.textContent = '';

    let valid = true;

    // Validação Nome
    const name = form.name.value.trim();
    if (name.length < 2) {
        showError(form.name, 'Nome deve ter pelo menos 2 caracteres');
        valid = false;
    }

    // Validação E-mail
    const email = form.email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError(form.email, 'E-mail inválido');
        valid = false;
    }

    // Validação Mensagem
    const message = form.message.value.trim();
    if (message.length < 10) {
        showError(form.message, 'Mensagem deve ter pelo menos 10 caracteres');
        valid = false;
    }

    if (!valid) return;

    // Enviar
    submitBtn.classList.add('sending');
    submitBtn.disabled = true;

    try {
        const formData = new FormData(form);
        const response = await fetch('/', {
            method: 'POST',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(formData).toString()
        });

        if (response.ok) {
            feedback.className = 'form-feedback success';
            feedback.textContent = 'Mensagem enviada com sucesso! Entrarei em contato em breve.';
            form.reset();
        } else {
            throw new Error('Erro no servidor');
        }
    } catch (error) {
        feedback.className = 'form-feedback error';
        feedback.textContent = 'Erro ao enviar. Tente novamente ou me contate por e-mail.';
    } finally {
        submitBtn.classList.remove('sending');
        submitBtn.disabled = false;
    }
});

function showError(input, message) {
    const group = input.parentElement;
    group.classList.add('error');
    group.querySelector('.error-msg').textContent = message;
}

// === MAPA INTERATIVO (Leaflet) ===
function initMap() {
    const map = L.map('map').setView([-14.2350, -51.9253], 4); // Centro do Brasil

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    const marker = L.marker([-23.5505, -46.6333]).addTo(map) // São Paulo (ajuste pro seu estado)
        .bindPopup('<b>Wesley S.</b><br>Desenvolvedor Full-Stack<br>Disponível para projetos')
        .openPopup();

    // Estilo cyberpunk no mapa
    setTimeout(() => {
        document.querySelector('.leaflet-popup-content-wrapper').style.background = '#11112b';
        document.querySelector('.leaflet-popup-content-wrapper').style.color = '#e0e0ff';
        document.querySelector('.leaflet-popup-content').style.textAlign = 'center';
        document.querySelector('.leaflet-popup-tip').style.background = '#11112b';
    }, 500);
}

// Carregar Leaflet
const leafletCSS = document.createElement('link');
leafletCSS.rel = 'stylesheet';
leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
document.head.appendChild(leafletCSS);

const leafletJS = document.createElement('script');
leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
leafletJS.onload = initMap;
document.head.appendChild(leafletJS);
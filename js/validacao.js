// === COPIAR E-MAIL COM COMANDO ===
document.querySelectorAll('.copy-email').forEach(btn => {
    btn.addEventListener('click', () => {
        const email = btn.dataset.email;
        navigator.clipboard.writeText(email);

        const output = document.getElementById('terminal-output');
        output.textContent = `$ copy email\n→ ${email} copiado para área de transferência!`;
        output.className = 'terminal-output show';

        setTimeout(() => {
            output.classList.remove('show');
        }, 4000);
    });
});

// === COMANDOS COM EFEITO DE DIGITAÇÃO (opcional) ===
document.querySelectorAll('.command-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        if (this.tagName === 'A') return; // deixa links abrirem normalmente

        e.preventDefault();
        const cmd = this.dataset.cmd;
        const output = document.getElementById('terminal-output');

        let text = '';
        if (cmd === 'copy') text = `$ copy email\n→ E-mail copiado!`;

        output.textContent = text;
        output.className = 'terminal-output show';

        setTimeout(() => {
            output.classList.remove('show');
        }, 3000);
    });
});
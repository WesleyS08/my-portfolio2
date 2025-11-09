document.addEventListener("DOMContentLoaded", () => {
    const phrases = [
        "Desenvolvedor Full Stack",
        "React & Node.js",
        "Python & Django",
        "UI/UX Enthusiast",
        "Cyberpunk Dev"
    ];

    let i = 0, j = 0, currentPhrase = [], isDeleting = false, isEnd = false;

    function type() {
        document.getElementById("typed").innerHTML = currentPhrase.join('');

        if (i < phrases.length) {
            if (!isDeleting && j <= phrases[i].length) {
                currentPhrase.push(phrases[i][j++]);
            }
            if (isDeleting && j <= phrases[i].length) {
                currentPhrase.pop(phrases[i][j--]);
            }
            if (j === phrases[i].length) { isEnd = true; isDeleting = true; }
            if (isDeleting && j === 0) { currentPhrase = []; isDeleting = false; i = (i + 1) % phrases.length; }
        }

        const time = isEnd ? 2000 : isDeleting ? (Math.random() * 80 + 50) : (Math.random() * 150 + 100);
        setTimeout(type, time);
    }

    setTimeout(type, 500);
});
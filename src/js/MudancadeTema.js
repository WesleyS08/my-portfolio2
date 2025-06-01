document.addEventListener("DOMContentLoaded", () => {
    const userPrefersDark = window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem("theme");
    const body = document.body;

    if (savedTheme === "dark" || (!savedTheme && userPrefersDark)) {
        body.classList.add("dark-mode");
        document.getElementById("checkbox").checked = true;
    } else {
        document.getElementById("checkbox").checked = false;
    }

    const toggleCheckbox = document.getElementById("checkbox");
    if (toggleCheckbox) {
        toggleCheckbox.addEventListener("change", () => {
            body.classList.toggle("dark-mode");
            const currentTheme = body.classList.contains("dark-mode") ? "dark" : "light";
            localStorage.setItem("theme", currentTheme);
        });
    }
});

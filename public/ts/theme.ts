function initTheme(): void {
    setTheme(localStorage.getItem('math-definitions-theme') === 'dark' ? 'dark' : 'light');
    document.getElementById('button-theme').addEventListener('click', toggleTheme);
    setTimeout(function () {
        const sheet = window.document.styleSheets[0];
        sheet.insertRule('body, input { transition: background-color 0.5s, color 0.5s; }', sheet.cssRules.length);
    }, 100);
}

function setTheme(theme: 'dark' | 'light'): void {
    if (theme === 'dark') {
        document.body.classList.add('dark');
        localStorage.setItem('math-definitions-theme', 'dark');
    }
    else {
        document.body.classList.remove('dark');
        localStorage.setItem('math-definitions-theme', 'light');
    }
}

function toggleTheme(): void {
    setTheme(document.body.classList.contains('dark') ? 'light' : 'dark');
}

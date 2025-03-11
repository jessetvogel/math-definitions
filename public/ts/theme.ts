function getCookie(name: string): string {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2)
        return parts.pop().split(';').shift();
}

function initTheme(): void {
    // const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const cookieTheme = getCookie('theme');
    if (cookieTheme !== undefined)
        setTheme(cookieTheme === 'dark');
    else
        setTheme(false); // prefersDark
    document.getElementById('button-theme').addEventListener('click', function () {
        document.cookie = `theme=${setTheme(null) ? 'dark' : 'light'}`;
    });
    setTimeout(function () { // little hack to prevent initial transition, but it works
        const sheet = window.document.styleSheets[0];
        sheet.insertRule('body, input { transition: background-color 0.5s, color 0.5s; }', sheet.cssRules.length);
    }, 100);
}

function setTheme(dark: boolean): boolean {
    if (dark === true) {
        document.body.classList.add('dark');
        return true;
    }
    if (dark === false) {
        document.body.classList.remove('dark');
        return false;
    }
    return setTheme(!document.body.classList.contains('dark'));
}

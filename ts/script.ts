declare const topics: { [id: string]: string };
declare const examples: string[];
declare const renderMathInElement: (elem: HTMLElement, options: any) => void;

window.onload = function () {
    initAutoComplete();
    checkUrlFragment();
    initTheme();
};

window.addEventListener('popstate', checkUrlFragment);

function loadTopic(id: string): void {
    const content = document.getElementById('content');

    // Load definition
    content.innerHTML = '<div id="definition"><div class="loading"></div></div>';
    fetch('data/definitions/' + id.replace(':', '-') + '.html').then(response => {
        switch (response.status) {
            case 200: return response.text();
            case 404: throw 'Definition not found 🥺';
            default: throw 'Could not load definition 🥺';
        }
    }).then(response => {
        const definition = document.getElementById('definition');
        definition.innerHTML = response;
        typeset(definition);
        setDocumentTitle(capitalize(topics[id]));
    }).catch(error => {
        content.innerHTML = `<div class="error">${error}</div>`;
        setDocumentTitle(null);
    });

    // Load examples
    if (!examples.includes(id))
        return;

    content.innerHTML += '<div id="examples" class="hidden"></div>';
    fetch('data/examples/' + id.replace(':', '-') + '.html').then(response => {
        switch (response.status) {
            case 200: return response.text();
            case 404: throw 'Examples not found 🥺';
            default: throw 'Could not load examples 🥺';
        }
    }).then(response => {
        const examples_ = document.getElementById('examples');
        const toggle = document.createElement('div');
        toggle.classList.add('toggle-examples-button');
        toggle.addEventListener('click', function () { examples_.classList.toggle('hidden'); });
        examples_.append(toggle);
        examples_.insertAdjacentHTML('beforeend', response);
        typeset(examples_);
    }).catch(error => {
        console.log(error);
    });
}

function gotoTopic(id: string): void {
    loadTopic(id);
    const topic = capitalize(topics[id]);
    autoComplete.input.value = topic;
    autoComplete.options.innerHTML = '';
    setSearchCategory(categories[id.substring(0, id.indexOf(':'))]);
    window.history.pushState(id, 'Math: ' + id, '#' + id);
}

function checkUrlFragment(): void {
    const id = window.location.hash.substring(1);
    if (id !== '') {
        document.getElementById('content').innerHTML = '';
        loadTopic(id);
        autoComplete.input.value = capitalize(topics[id]);
        setSearchCategory(categories[id.substring(0, id.indexOf(':'))]);
        return;
    }

    const search = getURLParameter('q');
    if (search != null) {
        const input = document.getElementById('input-search') as HTMLInputElement;
        input.value = search;
        input.focus();
        updateAutoComplete();
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}


function typeset(elem: HTMLElement): void {
    // Typeset math
    renderMathInElement(elem, KaTeXOptions);

    // Make sure the svg images have correct margin
    function setImageMargin(img: HTMLImageElement) {
        const margin = 0.5 * img.height * 0.33 + 16;
        img.style.marginTop = img.style.marginBottom = `${margin}px`;
    }
    for (const img of Array.from(elem.querySelectorAll('img.display-math-svg')) as HTMLImageElement[]) {
        if (img.complete)
            setImageMargin(img);
        else
            img.addEventListener('load', function () { setImageMargin(this); });
    }
}

function setDocumentTitle(str: string): void {
    document.title = (str == null) ? 'Math Definitions' : str + ' - Math Definitions';
}

function getURLParameter(name: string): string {
    for (const item of location.search.substring(1).split('&')) {
        const [key, value] = item.split('=');
        if (key == name)
            return decodeURIComponent(value.replace(/\+/g, ' '));
    }
    return null;
}

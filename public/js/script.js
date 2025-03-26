const autoComplete = {
    input: null,
    options: null,
    numOptions: 0,
    selected: -1,
    topicTokens: {}
};
function computeTokens(str) {
    const pattern = /[\w()]+/g;
    const tokens = [];
    let match;
    str = normalizeString(str).toLowerCase();
    while ((match = pattern.exec(str)) != null)
        tokens.push({ index: match.index, str: match[0] });
    return tokens;
}
function findSubtoken(value, token) {
    let index = token.str.replaceAll(/[()]/g, '').indexOf(value = value.replaceAll(/[()]/g, ''));
    if (index < 0)
        return null;
    for (let i = 0; i < index; ++i) {
        if (token.str[i] == '(' || token.str[i] == ')')
            ++index;
    }
    for (let i = index; i < index + value.length; ++i) {
        if (token.str[i] == '(' || token.str[i] == ')')
            value = value.slice(0, i - index) + token.str[i] + value.slice(i - index);
    }
    return {
        index: token.index + index,
        str: token.str.substring(index, index + value.length)
    };
}
function findMatch(input, value) {
    const tokens = [];
    for (const A of input) {
        let found = false;
        for (const B of value) {
            const token = findSubtoken(A.str, B);
            if (token == null)
                continue;
            if (tokens.some(other => other.index < token.index + token.str.length && other.index + other.str.length > token.index))
                continue;
            tokens.push(token);
            found = true;
            break;
        }
        if (!found)
            return null;
    }
    tokens.sort((A, B) => A.index - B.index);
    return tokens;
}
function boldenTokens(str, tokens) {
    if (tokens == null)
        return str;
    let out = [];
    let offset = 0;
    for (const token of tokens) {
        out.push(str.substring(offset, token.index));
        out.push(str.substring(token.index, token.index + token.str.length).replaceAll(/[A-Za-zÀ-ÖØ-öø-ÿ]+/g, w => `<b>${w}</b>`));
        offset = token.index + token.str.length;
    }
    out.push(str.substring(offset));
    return out.join('');
}
function initAutoComplete() {
    autoComplete.input = document.getElementById('input-search');
    autoComplete.options = document.getElementById('auto-complete-options');
    autoComplete.input.addEventListener('input', updateAutoComplete);
    autoComplete.input.addEventListener('keydown', function (event) {
        if (event.key == 'ArrowDown') {
            if (autoComplete.selected < autoComplete.numOptions - 1)
                autoCompleteSelect(autoComplete.selected + 1);
        }
        if (event.key == 'ArrowUp') {
            if (autoComplete.selected > -1)
                autoCompleteSelect(autoComplete.selected - 1);
        }
        if (event.key == 'Enter') {
            let option = autoComplete.options.querySelector('div.select');
            let id = null;
            if (option == null)
                option = autoComplete.options.querySelector('div');
            if (option != null)
                id = option.querySelector('.identifier')?.innerText;
            if (id != null)
                gotoTopic(id);
        }
        if (event.key == 'Escape')
            autoComplete.input.blur();
    });
    autoComplete.input.addEventListener('focusout', () => autoComplete.options.innerHTML = '');
    window.addEventListener('keydown', function (event) {
        if (event.altKey && event.code == 'KeyF') {
            const input = document.getElementById('input-search');
            input.focus();
            input.select();
            updateAutoComplete();
            event.preventDefault();
        }
    });
    for (const id in topics)
        autoComplete.topicTokens[id] = computeTokens(topics[id]);
}
function updateAutoComplete() {
    let value = autoComplete.input.value;
    setSearchCategory(null);
    autoComplete.options.innerHTML = '';
    autoComplete.selected = -1;
    autoComplete.numOptions = 0;
    if (value == '')
        return;
    autoComplete.options.innerHTML = '<label class="loading" style="display: block;"></label>';
    const prefix = value.match(/^\w+:/)?.[0] || null;
    if (prefix != null)
        value = value.substring(prefix.length).trim();
    const tokens = computeTokens(value);
    const results = [];
    for (const id in topics) {
        if (prefix != null && !id.startsWith(prefix))
            continue;
        const matchedTokens = findMatch(tokens, autoComplete.topicTokens[id]);
        if ((matchedTokens == null || matchedTokens.length == 0) && (value || prefix == null))
            continue;
        const category = categories[id.substring(0, id.indexOf(':'))];
        const topic = topics[id];
        const index = (matchedTokens != null && matchedTokens.length > 0) ? matchedTokens[0].index : -1;
        const elem = document.createElement('div');
        elem.innerHTML = `<span class="topic">${boldenTokens(capitalize(topics[id]), matchedTokens)}</span><span class="category">${category}</span><span class="identifier">${id}</span>`;
        elem.addEventListener('mousedown', () => gotoTopic(id));
        results.push({ index, topic, elem });
    }
    autoComplete.options.innerHTML = '';
    if (results.length == 0) {
        const option = document.createElement('div');
        option.innerHTML = '<span style="color: var(--clr-autoComplete-topic-default); opacity: 0.5;">no results</span>';
        autoComplete.options.appendChild(option);
        return;
    }
    results.sort(function (a, b) {
        if (a.index != b.index)
            return a.index - b.index;
        return a.topic.localeCompare(b.topic, 'en', { sensitivity: 'base' });
    });
    autoComplete.numOptions = results.length;
    for (const result of results)
        autoComplete.options.appendChild(result.elem);
}
;
function autoCompleteSelect(i) {
    const options = Array.from(autoComplete.options.querySelectorAll('div'));
    options[autoComplete.selected]?.classList.remove('select');
    autoComplete.selected = i;
    if (i >= 0 && i < options.length) {
        options[i].classList.add('select');
        options[i].scrollIntoView({
            behavior: 'auto',
            block: 'nearest',
            inline: 'nearest'
        });
    }
}
function setSearchCategory(str) {
    const div = document.getElementById('result-category');
    if (str == undefined || str == null || str == '')
        div.style.display = 'none';
    else {
        div.innerHTML = str;
        div.style.display = 'block';
    }
}
function normalizeString(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}
function capitalize(str) {
    const i = normalizeString(str).search(/[a-z]/i);
    if (i < 0)
        return str;
    return str.substring(0, i) + str[i].toUpperCase() + str.substring(i + 1);
}
const categories = {
    "AA": "Algebra",
    "AG": "Algebraic Geometry",
    "AT": "Algebraic Topology",
    "CA": "Complex Analysis",
    "CO": "Combinatorics",
    "CP": "Computer Algebra",
    "CT": "Category Theory",
    "DG": "Differential Geometry",
    "DT": "Deformation Theory",
    "FA": "Functional Analysis",
    "GM": "General",
    "GT": "Group Theory",
    "HA": "Homological Algebra",
    "HT": "Homotopy Theory",
    "LA": "Linear Algebra",
    "LO": "Logic",
    "MT": "Measure Theory",
    "NT": "Number Theory",
    "PT": "Probability Theory",
    "RT": "Representation Theory",
    "ST": "Set Theory",
    "TO": "Topology",
    "UN": "Uncategorized"
};
const KaTeXOptions = {
    macros: {
        "\\id": "\\text{id}",
        "\\Hom": "\\text{Hom}",
        "\\ZZ": "\\mathbb{Z}",
        "\\QQ": "\\mathbb{Q}",
        "\\CC": "\\mathbb{C}",
        "\\RR": "\\mathbb{R}",
        "\\NN": "\\mathbb{N}",
        "\\PP": "\\mathbb{P}",
        "\\AA": "\\mathbb{A}",
        "\\FF": "\\mathbb{F}",
        "\\GG": "\\mathbb{G}",
        "\\EE": "\\mathbb{E}",
        "\\textup": "\\text{#1}",
        "\\im": "\\operatorname{im}",
        "\\colim": "\\mathop{\\operatorname{colim}}\\limits",
        "\\coker": "\\operatorname{coker}",
        "\\tr": "\\operatorname{tr}",
        "\\bdot": "\\bullet",
        "\\Spec": "\\operatorname{Spec}",
        "\\Proj": "\\operatorname{Proj}",
        "\\norm": "{\\left\\|#1\\right\\|}",
        "\\sslash": "\\mathbin{/\\mkern-6mu/}",
        "\\mod": "\\text{ mod }",
        "\\mapsfrom": "\\leftarrow\\mathrel{\\mkern-3.2mu\\raisebox{.7mu}{$\\shortmid$}}",
        "\\isom": "\\cong",
        "\\iHom": "\\underline{\\Hom}"
    }
};
window.onload = function () {
    initAutoComplete();
    checkUrlFragment();
    initTheme();
};
window.addEventListener('popstate', checkUrlFragment);
function loadTopic(id) {
    const content = document.getElementById('content');
    content.innerHTML = '<div id="definition"><div class="loading"></div></div>';
    fetch('data/topics/' + id.replace(':', '-') + '.html').then(response => {
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
function gotoTopic(id) {
    loadTopic(id);
    const topic = capitalize(topics[id]);
    autoComplete.input.value = topic;
    autoComplete.options.innerHTML = '';
    setSearchCategory(categories[id.substring(0, id.indexOf(':'))]);
    window.history.pushState(id, 'Math: ' + id, '#' + id);
}
function checkUrlFragment() {
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
        const input = document.getElementById('input-search');
        input.value = search;
        input.focus();
        updateAutoComplete();
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}
function typeset(elem) {
    if ('renderMathInElement' in window)
        renderMathInElement(elem, KaTeXOptions);
    function setImageMargin(img) {
        const margin = 0.5 * img.height * 0.33 + 16;
        img.style.marginTop = img.style.marginBottom = `${margin}px`;
    }
    for (const img of Array.from(elem.querySelectorAll('img.display-math-svg'))) {
        if (img.complete)
            setImageMargin(img);
        else
            img.addEventListener('load', function () { setImageMargin(this); });
    }
}
function setDocumentTitle(str) {
    document.title = (str == null) ? 'Math Definitions' : str + ' - Math Definitions';
}
function getURLParameter(name) {
    for (const item of location.search.substring(1).split('&')) {
        const [key, value] = item.split('=');
        if (key == name)
            return decodeURIComponent(value.replace(/\+/g, ' '));
    }
    return null;
}
function initTheme() {
    setTheme(localStorage.getItem('math-definitions-theme') === 'dark' ? 'dark' : 'light');
    document.getElementById('button-theme').addEventListener('click', toggleTheme);
    setTimeout(function () {
        const sheet = window.document.styleSheets[0];
        sheet.insertRule('body, input { transition: background-color 0.5s, color 0.5s; }', sheet.cssRules.length);
    }, 100);
}
function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark');
        localStorage.setItem('math-definitions-theme', 'dark');
    }
    else {
        document.body.classList.remove('dark');
        localStorage.setItem('math-definitions-theme', 'light');
    }
}
function toggleTheme() {
    setTheme(document.body.classList.contains('dark') ? 'light' : 'dark');
}

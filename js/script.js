function init() {
    initAutoComplete();
    checkUrlFragment();
    initTheme();
}

window.onload = init;

function loadTopic(id) {
    const content = document.getElementById('content');

    // Load definition
    content.innerHTML = '<div id="definition"><div class="loading"></div></div>';

    const xhttpDef = new XMLHttpRequest();
    xhttpDef.open('GET', 'data/definitions/' + id.replace(':', '-') + '.html', true);
    xhttpDef.onload = function () {
        const definition = document.getElementById('definition');
        if (xhttpDef.status == 200) {
            definition.innerHTML = this.responseText;
            typeset(definition);
        }
        else if (xhttpDef.status == 404)
            definition.innerHTML = '<div class="error">Definition not found 🥺</div>';
    };
    xhttpDef.onerror = function () {
        content.innerHTML = '<div class="error">Could not load definition 🥺</div>';
    };
    xhttpDef.send();

    // Load examples
    if (!examples.includes(id))
        return;

    content.innerHTML += '<div id="examples" class="hidden"></div>';
    const xhttpEx = new XMLHttpRequest();
    xhttpEx.open('GET', 'data/examples/' + id.replace(':', '-') + '.html', true);
    xhttpEx.onload = function () {
        const examples_ = document.getElementById('examples');
        const toggle = document.createElement('div');
        toggle.classList.add('toggle-examples-button');
        toggle.addEventListener('click', function () { examples_.classList.toggle('hidden'); });
        examples_.append(toggle);
        examples_.insertAdjacentHTML('beforeend', this.responseText);
        typeset(examples_);
    };
    xhttpEx.onerror = function () {
        console.log('error..');
    };
    xhttpEx.send();
}

function gotoTopic(id) {
    loadTopic(id);
    const topic = capitalize(topics[id]);
    autoCompleteInput.value = topic;
    autoCompleteList.innerHTML = '';
    setSearchCategory(categories[id.substring(0, id.indexOf(':'))]);
    window.history.pushState(id, 'Math: ' + id, '#' + id);
}

function checkUrlFragment() {
    const id = window.location.hash.substring(1);
    if (id != '') {
        document.getElementById('content').innerHTML = '';
        loadTopic(id);
        const topic = capitalize(topics[id]);
        autoCompleteInput.value = topic;
        setSearchCategory(categories[id.substring(0, id.indexOf(':'))]);
        return;
    }

    const search = getParameter('q');
    if (search != null) {
        const input = document.getElementById('input-search');
        input.value = search;
        input.focus();
        updateAutoComplete();
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

window.addEventListener('popstate', checkUrlFragment);

var autoCompleteInput = null;
var autoCompleteList = null;
var autoCompleteItem = -1;
var autoCompleteNumItems = 0;
var autoCompleteTopicParts = {};

// Autocomplete function
function initAutoComplete() {
    autoCompleteInput = document.getElementById('input-search');
    autoCompleteList = document.getElementById('auto-complete-list');
    autoCompleteInput.addEventListener('input', updateAutoComplete);
    autoCompleteInput.addEventListener('keydown', function (e) {
        if (e.key == 'ArrowDown') {
            if (autoCompleteItem < autoCompleteNumItems - 1)
                autoCompleteSetFocus(autoCompleteItem + 1);
        }

        if (e.key == 'ArrowUp') {
            if (autoCompleteItem > -1)
                autoCompleteSetFocus(autoCompleteItem - 1);
        }

        if (e.key == 'Enter') {
            let item = autoCompleteList.querySelector('div.focus');
            let id = null;
            if (item == null)
                item = autoCompleteList.querySelector('div');
            if (item != null)
                id = item.querySelector('.identifier').innerText;
            if (id != null)
                gotoTopic(id);
        }

        if (e.key == 'Escape')
            autoCompleteInput.blur();
    });

    autoCompleteInput.addEventListener('focusout', function (e) {
        // if(autoCompleteList.querySelectorAll('div:hover').length > 0) return; // otherwise click events don't trigger.. // doesn't work on mobile!
        autoCompleteList.innerHTML = '';
    });

    // Override search function
    window.addEventListener('keydown', function (event) {
        // const ctrlKey = navigator.platform.indexOf('Mac') > -1 ? event.metaKey : event.ctrlKey;
        if (event.altKey && event.code == 'KeyF') {
            const input = document.getElementById('input-search');
            input.focus();
            input.select();
            updateAutoComplete(event);
            event.preventDefault();
        }
    });

    // Precompute topic parts for searching
    const re = /\w+/g;
    for (let id in topics) {
        const topic = normalizeString(topics[id]).toLowerCase();
        const topicParts = [];
        while ((match = re.exec(topic)) != null)
            topicParts.push([match.index, match[0]]);
        autoCompleteTopicParts[id] = topicParts;
    }
}

function updateAutoComplete(e) {
    const val = autoCompleteInput.value;
    // console.log(val);

    // Hide #result-category
    setSearchCategory();

    // Create suggestions
    autoCompleteList.innerHTML = '';
    autoCompleteItem = -1;
    autoCompleteNumItems = 0;

    if (val == '')
        return;

    const items = [];
    for (const id in topics) {
        const match = searchMatch(id, val);
        if (match == null)
            continue;
        const topic = topics[id];
        const item = document.createElement('div');
        item.innerHTML = match[1];
        item.addEventListener('mousedown', function (e) { gotoTopic(id); });
        items.push([match[0], topic, item]);
    }

    if (items.length == 0) {
        const item = document.createElement('div');
        item.innerHTML = '<span style="color: var(--clr-autocomplete-topic-default); opacity: 0.5;">no results</span>';
        autoCompleteList.appendChild(item);
        return;
    }

    items.sort(function (a, b) { // Sort primarily on the index, then alphabetically
        if (a[0] != b[0])
            return a[0] - b[0];
        return a[1].localeCompare(b[1], 'en', { sensitivity: 'base' });
    });

    autoCompleteNumItems = items.length; //Math.min(items.length, 10); // Show only the top 10 results
    for (let i = 0; i < autoCompleteNumItems; ++i) {
        autoCompleteList.appendChild(items[i][2]);
    }
};

function autoCompleteSetFocus(i) {
    autoCompleteItem = i;
    let items = autoCompleteList.querySelectorAll('div');
    for (const item of items)
        item.classList.remove('focus');
    if (autoCompleteItem >= 0 && autoCompleteItem < items.length) {
        items[autoCompleteItem].classList.add('focus');
        items[autoCompleteItem].scrollIntoView({
            behavior: 'auto',
            block: 'nearest',
            inline: 'nearest'
        });
    }
}

function searchMatch(id, input) {
    // Search based on 'parts': split both topic and input on words, and match each word of the input to a word on the topic
    // Note that the parts of the topics have already been precomputed
    const topicParts = autoCompleteTopicParts[id];
    const inputParts = normalizeString(input).toLowerCase().match(/\w+/g);
    const m = topicParts.length;
    const n = inputParts.length;

    const ranges = []; // ranges of the topic which are a match
    for (let i = 0; i < n; ++i) {
        let found = false;
        for (let j = 0; j < m; ++j) {
            const index = topicParts[j][1].indexOf(inputParts[i]);
            if (index < 0) continue; // input part not found
            const range = [topicParts[j][0] + index, topicParts[j][0] + index + inputParts[i].length];
            if (ranges.some(other => other[0] < range[1] && other[1] > range[0])) continue; // overlap with some other range
            ranges.push(range);
            found = true;
            break;
        }
        if (!found) return null;
    }
    ranges.sort((a, b) => a[0] - b[0]);

    function makeBold(str, ranges) {
        let offset = 0;
        for (let r of ranges) {
            const start = r[0] + offset;
            const end = r[1] + offset;
            str = str.substring(0, start) + '<b>' + str.substring(start, end) + '</b>' + str.substring(end);
            offset += 7; // '<b></b>' counts 7 characters
        }
        return str;
    }

    const category = categories[id.substring(0, id.indexOf(':'))];
    const topicHTML = makeBold(capitalize(topics[id]), ranges);
    const html = '<span class="topic">' + topicHTML + '</span><span class="category">' + category + '</span><span class="identifier">' + id + '</span>';
    let order = 0; // determine the order in which results must be listed, based on a number
    for (let i = 0; i < ranges.length; ++i)
        order += ranges[i][0] * (1 << (i * 6));
    return [order, html];
}

function setSearchCategory(str) {
    const div = document.getElementById('result-category');
    if (str == undefined || str == '') {
        div.style.display = 'none';
    }
    else {
        div.innerHTML = str;
        div.style.display = 'block';
    }
}

function normalizeString(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

function capitalize(str) {
    const i = normalizeString(str).search(/[a-z]/i); // Index of first letter in string
    if (i < 0)
        return str;

    return str.substring(0, i) + str[i].toUpperCase() + str.substring(i + 1);
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function initTheme() {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const cookieTheme = getCookie('theme');
    if (cookieTheme !== undefined)
        setTheme(cookieTheme === 'dark');
    else
        setTheme(false); // prefersDark
    document.getElementById('button-theme').addEventListener('click', function () {
        document.cookie = `theme=${setTheme() ? 'dark' : 'light'}`;
    });
    setTimeout(function () { // little hack to prevent initial transition, but it works
        const sheet = window.document.styleSheets[0];
        sheet.insertRule('body, input { transition: background-color 0.5s, color 0.5s; }', sheet.cssRules.length);
    }, 100);
}

function setTheme(dark) {
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

function typeset(elem) {
    // Typeset math
    renderMathInElement(elem, KaTeXOptions);

    // Make sure the svg images have correct margin
    function setImageMargin(img) {
        const margin = 0.5 * img.height * 0.33 + 16;
        img.style.marginTop = img.style.marginBottom = `${margin}px`;
    }
    for (const img of elem.querySelectorAll('img.display-math-svg')) {
        if (img.complete) setImageMargin(img); else img.addEventListener('load', function () { setImageMargin(this); });
    }
}

function getParameter(name) {
    for (const item of location.search.substring(1).split('&')) {
        const [key, value] = item.split('=');
        if (key == name)
            return decodeURIComponent(value);
    }
    return null;
}

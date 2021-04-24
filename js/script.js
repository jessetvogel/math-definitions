function init() {
    initAutoComplete();
    checkUrlFragment();
}

function loadTopic(id) {
    const content = document.getElementById('content');

    // Load definition
    content.innerHTML = '<div id="definition"><div class="loading"></div></div>';

    const xhttpDef = new XMLHttpRequest();
    xhttpDef.open('GET', 'data/definitions/' + id.replace(':', '-') + '.html', true);
    xhttpDef.onload = function () {
        const definition = document.getElementById('definition');
        if(xhttpDef.status == 200) {
            definition.innerHTML = this.responseText;
            if(MathJax && MathJax.typeset)
                MathJax.typeset([ definition ]);
        }
        else if(xhttpDef.status == 404)
            definition.innerHTML = '<div class="error">Definition not found 🥺</div>';
    }
    xhttpDef.onerror = function () {
        content.innerHTML = '<div class="error">Could not load definition 🥺</div>';
    }
    xhttpDef.send();

    // Load examples
    if(!examples.includes(id))
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
        if(MathJax && MathJax.typeset)
            MathJax.typeset([ examples_ ]);
    }
    xhttpEx.onerror = function () {
        console.log('error..');
    }
    xhttpEx.send();
}

function gotoTopic(id) {
    loadTopic(id);
    const topic = capitalize(topics[id]);
    autoCompleteInput.value = topic;
    autoCompleteList.innerHTML = '';
    setSearchCategory(categories[id.substr(0, id.indexOf(':'))])
    window.history.pushState(id, 'Math: ' + id, '#' + id);
}

function checkUrlFragment() {
    const id = window.location.hash.substr(1);
    if(id == '') {
        document.getElementById('content').innerHTML = '';
        return;
    }
    loadTopic(id);
    const topic = capitalize(topics[id]);
    autoCompleteInput.value = topic;
    setSearchCategory(categories[id.substr(0, id.indexOf(':'))])
}

window.addEventListener('popstate', checkUrlFragment);

var autoCompleteInput = null;
var autoCompleteList = null;
var autoCompleteItem = -1;
var autoCompleteNumItems = 0;

// Autocomplete function
function initAutoComplete() {
    autoCompleteInput = document.getElementById('input-search');
    autoCompleteList = document.getElementById('auto-complete-list');
    const updateAutoComplete = function (e) {
        const val = autoCompleteInput.value;
        // console.log(val);
        
        // Hide #result-category
        setSearchCategory();

        // Create suggestions
        autoCompleteList.innerHTML = '';
        autoCompleteItem = -1;
        autoCompleteNumItems = 0;

        if(val == '')
            return;

        const items = [];
        for(const id in topics) {
            const index = searchMatchIndex(topics[id], val);
            if(index < 0)
                continue;
            const topic = topics[id];
            const item = document.createElement('div');
            item.innerHTML = suggestionHTML(id, val);
            item.addEventListener('click', function (e) { gotoTopic(id); });
            items.push([ index, topic, item ]);
        }

        if(items.length == 0) {
            const item = document.createElement('div');
            item.innerHTML = '<span style="color: rgba(0, 0, 0, 0.5);">no results</span>';
            autoCompleteList.appendChild(item);
            return;
        }

        items.sort(function (a, b) {
            if(a[0] != b[0])
                return a[0] - b[0];
            return a[1].localeCompare(b[1], 'en', { sensitivity: 'base' });
        });

        autoCompleteNumItems = Math.min(items.length, 10);
        for(let i = 0; i < autoCompleteNumItems; ++i) {
            autoCompleteList.appendChild(items[i][2]);
        }
    };
    autoCompleteInput.addEventListener('input', updateAutoComplete);
    autoCompleteInput.addEventListener('keydown', function(e) {
        if(e.key == 'ArrowDown') {
            if(autoCompleteItem < autoCompleteNumItems - 1)
                autoCompleteSetFocus(autoCompleteItem + 1);
        }

        if(e.key == 'ArrowUp') {
            if(autoCompleteItem > -1)
                autoCompleteSetFocus(autoCompleteItem - 1);
        }

        if(e.key == 'Enter') {
            let item = autoCompleteList.querySelector('div.focus');
            let id = null;
            if(item == null)
                item = autoCompleteList.querySelector('div');
            if(item != null)
                id = item.querySelector('.identifier').innerText;
            if(id != null)
                gotoTopic(id);
        }

        if(e.key == 'Escape')
            autoCompleteInput.blur();
    });

    autoCompleteInput.addEventListener('focusout', function(e) {
        autoCompleteList.innerHTML = '';
    });

    // Override search function
    window.addEventListener('keydown',function (event) {
        const ctrlKey = navigator.platform.indexOf('Mac') > -1 ? event.metaKey : event.ctrlKey;
        if (ctrlKey && event.shiftKey && event.key == 'f') {
            const input = document.getElementById('input-search');
            input.focus();
            input.select();
            updateAutoComplete(event);
            event.preventDefault();
        }
    });
}

function autoCompleteSetFocus(i) {
    autoCompleteItem = i;
    let items = autoCompleteList.querySelectorAll('div');
    for(const item of items)
        item.classList.remove('focus');
    if(autoCompleteItem >= 0 && autoCompleteItem < items.length)
        items[autoCompleteItem].classList.add('focus');
}

function searchMatchIndex(topic, input) {
    topic = normalizeString(topic).toUpperCase();
    input = normalizeString(input).toUpperCase();
    return topic.indexOf(input);
}

function suggestionHTML(id, input) {
    let topic = capitalize(topics[id]);
    const category = categories[id.substr(0, id.indexOf(':'))];

    const i = searchMatchIndex(topic, input);
    const topicHTML = topic.substr(0, i) + '<b>' + topic.substr(i, input.length) + '</b>' + topic.substr(i + input.length);

    const html = '<span class="topic">' + topicHTML + '</span><span class="category">' + category + '</span><span class="identifier">' + id + '</span>';
    return html;
}

function setSearchCategory(str) {
    const div = document.getElementById('result-category');
    if(str == undefined || str == '') {
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
    if(i < 0)
        return str;

    return str.substr(0, i) + str[i].toUpperCase() + str.substr(i + 1);
}

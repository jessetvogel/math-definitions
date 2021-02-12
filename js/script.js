function init() {
    initAutoComplete();
    checkUrlFragment();
}

function loadTopic(id) {
    window.topicId = id;

    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        const content = document.getElementById('content');

        if(xhttp.status == 200) {
            content.innerHTML = this.responseText;
            MathJax.typeset([ content ]);
        }
        
        else if(xhttp.status == 404)
            content.innerHTML = 'Definition not found 🥺';
    }

    xhttp.onerror = function () {
        const content = document.getElementById('content');
        content.innerHTML = 'Could not load definition 🥺';
    }

    xhttp.open('GET', 'data/definitions/' + id.replace(':', '-') + '.html', true);
    xhttp.send();
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
    autoCompleteInput.addEventListener('input', function (e) {
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

        let items = [];
        for(const id in topics) {
            const index = searchMatchIndex(topics[id], val);
            if(index < 0)
                continue;

            let item = document.createElement('div');
            item.innerHTML = suggestionHTML(id, val);
            item.addEventListener('click', function (e) { gotoTopic(id); });
            items.push([ index, item ]);
        }

        if(items.length == 0) {
            let item = document.createElement('div');
            item.innerHTML = '<span style="color: rgba(0, 0, 0, 0.5);">no results</span>';
            autoCompleteList.appendChild(item);
            return;
        }

        items.sort(function (a, b) { return a[0] - b[0]; });
        autoCompleteNumItems = Math.min(items.length, 10);
        for(let i = 0; i < autoCompleteNumItems; ++i) {
            autoCompleteList.appendChild(items[i][1]);
        }
    });

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
    topic = topic.toUpperCase();
    input = input.toUpperCase();
    return topic.indexOf(input);
}

function suggestionHTML(id, input) {
    let topic = capitalize(topics[id]);
    const category = categories[id.substr(0, id.indexOf(':'))];

    const i = topic.toUpperCase().indexOf(input.toUpperCase());
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

function capitalize(str) {
    const i = str.search(/[a-z]/i); // Index of first letter in string
    if(i < 0)
        return str;

    return str.substr(0, i) + str[i].toUpperCase() + str.substr(i + 1);
}

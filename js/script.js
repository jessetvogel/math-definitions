function init() {
    initAutoComplete();
    checkUrlFragment();
}

function loadTopic(id) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById('content').innerHTML = this.responseText;
            MathJax.typeset()
        }

        if (this.readyState == 4 && this.status == 404) {
            document.getElementById('content').innerHTML = '404 Not Found';
        }

        // Catch some error codes here! E.g. 404
    };
    xhttp.open('GET', 'data/' + id.replace(':', '-') + '.html', true);
    xhttp.send();
}

function gotoTopic(id) {
    loadTopic(id);
    let topic = topics[id];
    topic = topic[0].toUpperCase() + topic.substr(1);
    autoCompleteInput.value = topic;
    autoCompleteList.innerHTML = '';
    window.history.pushState(id, 'Math: ' + id, '#' + id);
}

function checkUrlFragment() {
    const id = window.location.hash.substr(1);
    if(id == '') {
        document.getElementById('content').innerHTML = '';
        return;
    }
    loadTopic(id);
    let topic = topics[id];
    topic = topic[0].toUpperCase() + topic.substr(1);
    autoCompleteInput.value = topic;
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
        console.log(val);
        
        // Create suggestions
        autoCompleteList.innerHTML = '';
        autoCompleteItem = -1;
        autoCompleteNumItems = 0;

        if(val == '')
            return;

        for(const id in topics) {
            if(!searchMatches(topics[id], val))
                continue;

            let item = document.createElement('div');
            item.innerHTML = suggestionHTML(id, val);
            item.addEventListener('click', function (e) { gotoTopic(id); });
            autoCompleteList.appendChild(item);
            autoCompleteNumItems ++;
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

function searchMatches(topic, input) {
    topic = topic.toUpperCase();
    input = input.toUpperCase();
    return topic.indexOf(input) >= 0;
}

function suggestionHTML(id, input) {
    let topic = topics[id];
    topic = topic[0].toUpperCase() + topic.substr(1);
    const category = categories[id.substr(0, id.indexOf(':'))];

    const i = topic.toUpperCase().indexOf(input.toUpperCase());
    const topicHTML = topic.substr(0, i) + '<b>' + topic.substr(i, input.length) + '</b>' + topic.substr(i + input.length);

    const html = '<span class="topic">' + topicHTML + '</span><span class="category">' + category + '</span><span class="identifier">' + id + '</span>';
    return html;
}


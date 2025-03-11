type Token = {
    index: number,
    str: string
};

const autoComplete = {
    input: null as HTMLInputElement,
    options: null as HTMLElement,
    numOptions: 0,
    selected: -1,
    topicTokens: {} as { [id: string]: Token[] }
}

function computeTokens(str: string): Token[] {
    const pattern = /[\w()]+/g;
    const tokens = [];
    let match: RegExpExecArray;
    str = normalizeString(str).toLowerCase();
    while ((match = pattern.exec(str)) != null)
        tokens.push({ index: match.index, str: match[0] });
    return tokens;
}

function findSubtoken(value: string, token: Token): Token {
    // Use `indexOf` on simplified strings 
    let index = token.str.replaceAll(/[()]/g, '').indexOf(value = value.replaceAll(/[()]/g, ''));
    if (index < 0)
        return null;
    // Increment the index for every '(' or ')' appearing before 
    for (let i = 0; i < index; ++i) {
        if (token.str[i] == '(' || token.str[i] == ')')
            ++index;
    }
    // Increment the length for every '(' or ')' appearing in the substring
    for (let i = index; i < index + value.length; ++i) {
        if (token.str[i] == '(' || token.str[i] == ')')
            value = value.slice(0, i - index) + token.str[i] + value.slice(i - index);
    }
    // Construct Token
    return {
        index: token.index + index,
        str: token.str.substring(index, index + value.length)
    };
}

function findMatch(input: Token[], value: Token[]): Token[] {
    const tokens = [];
    for (const A of input) {
        let found = false;
        for (const B of value) {
            const token = findSubtoken(A.str, B);
            if (token == null)
                continue;
            if (tokens.some(other => other.index < token.index + token.str.length && other.index + other.str.length > token.index)) // check for overlap with other tokens
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

function boldenTokens(str: string, tokens: Token[]): string {
    if (tokens == null)
        return str;
    let out = [];
    let offset = 0;
    for (const token of tokens) {
        out.push(str.substring(offset, token.index));
        out.push(str.substring(token.index, token.index + token.str.length).replaceAll(/[A-Za-zÀ-ÖØ-öø-ÿ]+/g, w => `<b>${w}</b>`)); // bolden all words in the range
        offset = token.index + token.str.length;
    }
    out.push(str.substring(offset));
    return out.join('');
}

function initAutoComplete() {
    autoComplete.input = document.getElementById('input-search') as HTMLInputElement;
    autoComplete.options = document.getElementById('auto-complete-options');
    autoComplete.input.addEventListener('input', updateAutoComplete);
    autoComplete.input.addEventListener('keydown', function (event: KeyboardEvent) {
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
                id = (option.querySelector('.identifier') as HTMLElement)?.innerText;
            if (id != null)
                gotoTopic(id);
        }
        if (event.key == 'Escape')
            autoComplete.input.blur();
    });

    autoComplete.input.addEventListener('focusout', () => autoComplete.options.innerHTML = '');

    // Override search function
    window.addEventListener('keydown', function (event: KeyboardEvent) {
        if (event.altKey && event.code == 'KeyF') {
            const input = document.getElementById('input-search') as HTMLInputElement;
            input.focus();
            input.select();
            updateAutoComplete();
            event.preventDefault();
        }
    });

    // Precompute topic parts for searching
    for (const id in topics)
        autoComplete.topicTokens[id] = computeTokens(topics[id]);
}

function updateAutoComplete(): void {
    let value = autoComplete.input.value;

    // Hide #result-category
    setSearchCategory(null);

    // Create suggestions
    autoComplete.options.innerHTML = '';
    autoComplete.selected = -1;
    autoComplete.numOptions = 0;

    if (value == '')
        return;

    autoComplete.options.innerHTML = '<label class="loading" style="display: block;"></label>';

    // Check for a prefix
    const prefix = value.match(/^\w+:/)?.[0] || null;
    if (prefix != null)
        value = value.substring(prefix.length).trim();

    // Go through topic ids, looking for matches
    const tokens = computeTokens(value);
    const results: { index: number, topic: string, elem: HTMLElement }[] = [];
    for (const id in topics) {
        if (prefix != null && !id.startsWith(prefix))
            continue;

        const matchedTokens = findMatch(tokens, autoComplete.topicTokens[id]);
        if ((matchedTokens == null || matchedTokens.length == 0) && (value || prefix == null))
            continue;

        // Construct autoComplete entry
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

    // Sort the results primarily on the index, then alphabetically
    results.sort(function (a, b) {
        if (a.index != b.index)
            return a.index - b.index;
        return a.topic.localeCompare(b.topic, 'en', { sensitivity: 'base' });
    });

    // Fill #auto-complete-options with the results
    autoComplete.numOptions = results.length; // Math.min(results.length, 10); // Show only the top 10 results
    for (const result of results)
        autoComplete.options.appendChild(result.elem);
};

function autoCompleteSelect(i: number): void {
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

function setSearchCategory(str: string): void {
    const div = document.getElementById('result-category');
    if (str == undefined || str == null || str == '')
        div.style.display = 'none';
    else {
        div.innerHTML = str;
        div.style.display = 'block';
    }
}

function normalizeString(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

function capitalize(str: string): string {
    const i = normalizeString(str).search(/[a-z]/i); // Index of first letter in string
    if (i < 0)
        return str;
    return str.substring(0, i) + str[i].toUpperCase() + str.substring(i + 1);
}

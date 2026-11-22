function updateAudioMessageNumbers() {
    const label = document.documentElement.lang === "en" ? "Message" : "Poselstwo";
    document.querySelectorAll("[data-number]").forEach(element => {
        element.textContent = `${label} ${element.dataset.number}`;
    });
}
document.addEventListener("languagechange", updateAudioMessageNumbers);
updateAudioMessageNumbers();

function setupAudioLanguages() {
    const names = { pl: "Polski", en: "English", ru: "Русский" };
    document.querySelectorAll(".audio-conference").forEach(conference => {
        const content = conference.querySelector(".audio-conference-content");
        const headings = [...content.querySelectorAll(":scope > .audio-group-title")];
        const groups = [];

        if (headings.length === 3) {
            const languages = ["en", "pl", "ru"];
            headings.forEach((heading, index) => {
                const grid = heading.nextElementSibling;
                const group = document.createElement("div");
                group.className = "audio-language-group";
                heading.before(group);
                group.append(heading, grid);
                groups.push({ language: languages[index], element: group });
            });
        } else if (conference.querySelector('source[src*="Special%20fellowship"]')) {
            const grid = content.querySelector(".audio-grid");
            const cards = [...grid.querySelectorAll(".audio-card")];
            cards.forEach(card => {
                const source = decodeURIComponent(card.querySelector("source").getAttribute("src"));
                const language = /ENG-POL/i.test(source) ? "pl" : /ENG-RUS/i.test(source) ? "ru" : "en";
                groups.push({ language, element: card });
            });
        }
        if (!groups.length) return;

        const selector = document.createElement("div");
        selector.className = "audio-language-selector";
        selector.setAttribute("role", "group");
        selector.setAttribute("aria-label", document.documentElement.lang === "en" ? "Recording language" : "Język nagrania");
        const languages = [...new Set(groups.map(group => group.language))];
        const buttons = new Map();
        function selectLanguage(language) {
            groups.forEach(group => {
                const hidden = group.language !== language;
                if (hidden && !group.element.hidden) {
                    group.element.querySelectorAll("audio").forEach(audio => audio.pause());
                }
                group.element.hidden = hidden;
            });
            buttons.forEach((button, key) => button.setAttribute("aria-pressed", String(key === language)));
        }
        languages.forEach(language => {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = names[language];
            button.addEventListener("click", () => selectLanguage(language));
            selector.append(button);
            buttons.set(language, button);
        });
        content.prepend(selector);
        selectLanguage(languages.includes(document.documentElement.lang) ? document.documentElement.lang : "pl");
        document.addEventListener("languagechange", () => {
            selector.setAttribute("aria-label", document.documentElement.lang === "en" ? "Recording language" : "Język nagrania");
        });
    });
}
setupAudioLanguages();

function setupAudioSources() {
    document.querySelectorAll("audio source[src]").forEach(source => {
        const audio = source.parentElement;
        const status = document.createElement("p");
        status.className = "audio-status";
        status.setAttribute("role", "status");
        audio.after(status);
        let state = "";
        function updateStatus() {
            const en = document.documentElement.lang === "en";
            const messages = {
                error: en ? "Unable to play this recording. The file may be unavailable or the link may not support direct playback." : "Nie można odtworzyć nagrania. Plik może być niedostępny lub link nie obsługuje bezpośredniego odtwarzania."
            };
            status.textContent = messages[state] || "";
            status.hidden = !state;
        }
        const setState = value => { state = value; updateStatus(); };
        document.addEventListener("languagechange", updateStatus);
        audio.addEventListener("error", () => setState("error"));
        source.addEventListener("error", () => setState("error"));
        audio.addEventListener("playing", () => setState(""));
    });
}
setupAudioSources();

let eventData = [];

const canonicalWeekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const eventWeekdays = {
    en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    pl: ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"]
};

async function loadEvents() {
    try {
        const response = await fetch("events.json");
        if (!response.ok) throw new Error("Could not load events.json");
        eventData = await response.json();

        const conference = eventData.find(event => event.id === 'students-conference');
        conference.registrationUrl = 'https://forms.gle/gh8eA5edVX7pZtB28';
        conference.showSignup = true;
        renderEvents();
    } catch (error) {
        console.error("Events load error:", error);
    }
}

function createSpecialEventBadge(lang) {
    const badge = document.createElement("span");
    badge.className = "event-special-badge";
    badge.textContent = lang === "en" ? "Special event" : "Specjalne";
    return badge;
}

function renderEvents() {
    if (eventData.length === 0) return;

    const lang = document.documentElement.lang === "en" ? "en" : "pl";
    const weekdays = eventWeekdays[lang];
    const dayIndex = (day) => canonicalWeekdays.indexOf((day || "").toLowerCase());
    const today = new Date().getDay();
    const nextEventIndex = eventData.reduce((best, event, index) => {
        const indexDay = dayIndex(event.day);
        const bestDay = dayIndex(eventData[best].day);
        const delta = indexDay < 0 ? 8 : (indexDay - today + 7) % 7;
        const bestDelta = bestDay < 0 ? 8 : (bestDay - today + 7) % 7;
        return delta < bestDelta ? index : best;
    }, 0);

    const timeline = document.getElementById("modernTimeline");
    const rail = document.querySelector(".events-rail");
    const homeCarousel = document.getElementById("eventsCarousel");
    timeline?.replaceChildren();
    rail?.replaceChildren();
    homeCarousel?.replaceChildren();

    eventData.forEach((event, index) => {
        const day = dayIndex(event.day);
        const dayName = day >= 0 ? weekdays[day] : event.day;
        const displayDay = lang === "en" ? dayName.slice(0, 3).toUpperCase() : dayName.slice(0, 3).toLocaleUpperCase("pl");
        const displayDate = event.date?.[lang] || event.date?.en || "";
        const title = event.title?.[lang] || event.title?.en || event.id;
        const location = event.location?.[lang] || event.location?.en || "";
        const description = event.description?.[lang] || event.description?.en || "";
        const active = index === nextEventIndex;
        const featured = event.id === "students-conference";

        if (timeline) {
            const timelineItem = document.createElement("div");
            timelineItem.className = `timeline-event${active ? " active" : ""}`;
            if (active) timelineItem.id = "todayEvent";
            const dot = document.createElement("div");
            dot.className = "timeline-dot";
            const content = document.createElement("div");
            content.className = "timeline-content";
            const dayLabel = document.createElement("span");
            dayLabel.className = "timeline-day";
            dayLabel.textContent = `${displayDay}${displayDate ? ` · ${displayDate}` : ""}`;
            const heading = document.createElement("h4");
            heading.textContent = title;
            const details = document.createElement("p");
            details.textContent = `${event.time ? `${event.time} · ` : ""}${location}`;
            content.append(dayLabel, heading, details);
            timelineItem.append(dot, content);
            timeline.append(timelineItem);
        }

        if (rail) {
            const card = document.createElement("div");
            card.className = `rail-item${featured ? " event-featured" : ""}`;
            if (event.showSignup !== false) card.addEventListener("click", () => { window.location.href = event.registrationUrl || "formularz.html"; });
            const top = document.createElement("div");
            top.className = "rail-top";
            const cardDay = document.createElement("span");
            cardDay.className = "rail-day";
            cardDay.textContent = `${lang === "en" ? dayName.toUpperCase() : dayName.toLocaleUpperCase("pl")}${displayDate ? ` · ${displayDate}` : ""}`;
            const time = document.createElement("span");
            time.className = "rail-time";
            time.textContent = event.time;
            const meta = document.createElement("div");
            meta.className = "rail-meta";
            if (event.time) meta.append(time);
            if (event.special) meta.append(createSpecialEventBadge(lang));
            top.append(cardDay, meta);
            const cardTitle = document.createElement("h3");
            cardTitle.textContent = title;
            const locationLine = document.createElement("p");
            if (event.mapUrl) {
                const mapLink = document.createElement("a");
                mapLink.href = event.mapUrl;
                mapLink.target = "_blank";
                mapLink.rel = "noopener noreferrer";
                mapLink.addEventListener("click", (click) => click.stopPropagation());
                mapLink.textContent = location;
                locationLine.append(mapLink);
            } else {
                locationLine.textContent = location;
            }
            card.append(top, cardTitle, locationLine);
            if (featured && event.showSignup !== false) {
                const center = document.createElement("div");
                center.className = "center";
                const signup = document.createElement("button");
                signup.type = "button";
                signup.className = "cta-btn";
                signup.textContent = translations["form-button"] || (lang === "en" ? "Sign up" : "Zapisz si\u0119");
                signup.addEventListener("click", (click) => {
                    click.stopPropagation();
                    window.location.href = event.registrationUrl || "formularz.html";
                });
                center.append(signup);
                card.append(center);
            }
            featured ? rail.prepend(card) : rail.append(card);
        }

        if (homeCarousel) {
            const card = document.createElement("div");
            card.className = `meeting-card event-slide${featured ? " event-featured" : ""}`;
            const cardTitle = document.createElement("div");
            cardTitle.className = "meeting-title";
            cardTitle.textContent = title;
            card.append(cardTitle);
            if (description) {
                const descriptionText = document.createElement("p");
                descriptionText.textContent = description;
                card.append(descriptionText);
            }
            const info = document.createElement("div");
            info.className = "event-info";
            const locationText = document.createElement("span");
            locationText.textContent = `📍 ${location}`;
            const timeText = document.createElement("span");
            timeText.textContent = `⏰ ${dayName}${displayDate ? ` · ${displayDate}` : ""}${event.time ? ` · ${event.time}` : ""}`;
            const dateRow = document.createElement("div");
            dateRow.className = "event-date-row";
            dateRow.append(timeText);
            if (event.special) {
                timeText.textContent = `⏰ ${dayName}${displayDate ? ` · ${displayDate}` : ""}`;
                const meta = document.createElement("div");
                meta.className = "event-meta";
                if (event.time) {
                    const time = document.createElement("span");
                    time.textContent = event.time;
                    meta.append(time);
                }
                dateRow.append(meta);
            }
            info.append(locationText, dateRow);
            card.append(info);
            if (event.showSignup !== false) {
                const center = document.createElement("div");
                center.className = "center";
                const signup = document.createElement("button");
                signup.className = "cta-btn";
                signup.textContent = translations["form-button"] || (lang === "en" ? "Sign up" : "Zapisz się");
                signup.addEventListener("click", () => { window.location.href = event.registrationUrl || "formularz.html"; });
                center.append(signup);
                card.append(center);
            }
            featured ? homeCarousel.prepend(card) : homeCarousel.append(card);
        }
    });

    if (timeline) {
        requestAnimationFrame(() => {
            document.getElementById("todayEvent")?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const scroller = document.querySelector(".modern-timeline-scroll");
    document.getElementById("timelineNext")?.addEventListener("click", () => scroller?.scrollBy({ left: 300, behavior: "smooth" }));
    document.getElementById("timelinePrev")?.addEventListener("click", () => scroller?.scrollBy({ left: -300, behavior: "smooth" }));
    loadEvents();
});

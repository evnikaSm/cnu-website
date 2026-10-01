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
        renderEvents();
    } catch (error) {
        console.error("Events load error:", error);
    }
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
            details.textContent = `${event.time} · ${location}`;
            content.append(dayLabel, heading, details);
            timelineItem.append(dot, content);
            timeline.append(timelineItem);
        }

        if (rail) {
            const card = document.createElement("div");
            card.className = "rail-item";
            card.addEventListener("click", () => goToForm());
            const top = document.createElement("div");
            top.className = "rail-top";
            const cardDay = document.createElement("span");
            cardDay.className = "rail-day";
            cardDay.textContent = `${lang === "en" ? dayName.toUpperCase() : dayName.toLocaleUpperCase("pl")}${displayDate ? ` · ${displayDate}` : ""}`;
            const time = document.createElement("span");
            time.className = "rail-time";
            time.textContent = event.time;
            top.append(cardDay, time);
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
            rail.append(card);
        }

        if (homeCarousel) {
            const card = document.createElement("div");
            card.className = "meeting-card event-slide";
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
            timeText.textContent = `⏰ ${dayName}${displayDate ? ` · ${displayDate}` : ""} · ${event.time}`;
            info.append(locationText, timeText);
            card.append(info);
            if (event.showSignup !== false) {
            const center = document.createElement("div");
            center.className = "center";
            const signup = document.createElement("button");
            signup.className = "cta-btn";
            signup.textContent = translations["form-button"] || (lang === "en" ? "Sign up" : "Zapisz się");
            signup.addEventListener("click", () => { window.location.href = "formularz.html"; });
            center.append(signup);
            card.append(center);
            }
            homeCarousel.append(card);
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

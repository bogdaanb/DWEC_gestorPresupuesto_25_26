"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let ciudad;
let hora;
let fecha;
let timezoneActual = "Europe/Madrid";
const actualizarHora = () => {
    hora.innerHTML = new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: timezoneActual,
    });
};
const actualizarFecha = () => {
    fecha.innerHTML = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: timezoneActual,
    });
};
window.addEventListener("DOMContentLoaded", () => {
    ciudad = document.getElementById("ciudadAMostrar");
    hora = document.getElementById("horaHoy");
    fecha = document.getElementById("fechaHoy");
    actualizarFecha();
    actualizarHora();
    setInterval(actualizarHora, 1000);
});
const input = document.getElementById("cityInput");
const suggestions = document.getElementById("suggestions");
let ciudadSeleccionada = false;
input.addEventListener("input", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const query = input.value.trim();
    ciudadSeleccionada = false;
    if (query.length < 3) {
        suggestions.innerHTML = "";
        return;
    }
    const res = yield fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=es&format=json`);
    const data = yield res.json();
    const cities = (_a = data.results) !== null && _a !== void 0 ? _a : [];
    suggestions.innerHTML = "";
    cities.forEach((city) => {
        const li = document.createElement("li");
        li.textContent = `${city.name}, ${city.country}`;
        li.onclick = () => {
            input.value = li.textContent;
            ciudad.innerHTML = input.value;
            suggestions.innerHTML = "";
            ciudadSeleccionada = true;
            timezoneActual = city.timezone;
            actualizarFecha();
            actualizarHora();
            const textoWidth = medirTexto(input.value);
            const paddingExtra = 10;
            input.style.width = `${Math.max(220, textoWidth + paddingExtra)}px`;
            actualizarClima(city.latitude, city.longitude, city.timezone);
        };
        suggestions.appendChild(li);
    });
}));
const medirTexto = (texto) => {
    const span = document.createElement("span");
    span.style.visibility = "hidden";
    span.style.whiteSpace = "nowrap";
    span.style.font = getComputedStyle(input).font;
    span.textContent = texto;
    document.body.appendChild(span);
    const width = span.offsetWidth;
    document.body.removeChild(span);
    return width;
};
const weatherMap = {
    0: { text: "Clear", img: "/img/sun.svg" },
    1: { text: "Mostly Clear", img: "/img/sunny.svg" },
    2: { text: "Partly Cloudy", img: "/img/cloudy.svg" },
    3: { text: "Cloudy", img: "/img/cloud.svg" },
    45: { text: "Fog", img: "/img/fog.svg" },
    61: { text: "Slight Rain", img: "/img/rainy.svg" },
    63: { text: "Rain", img: "/img/rain.svg" },
    65: { text: "Heavy Rain", img: "/img/heavyrain.svg" },
    71: { text: "Light Snow", img: "/img/snowy.svg" },
    73: { text: "Snow", img: "/img/snow.svg" },
    75: { text: "Heavy Snow", img: "/img/heavysnow.svg" },
    95: { text: "Thunderstorm", img: "/img/thunder.svg" }
};
const weatherIcon = document.querySelector(".svgTiempo");
const weatherText = document.getElementById("weatherStatusTitle");
const mainTemp = document.getElementById("todayMainTemp");
const getWeatherIcon = (code, temp, esDeNoche) => {
    var _a;
    const info = (_a = weatherMap[code]) !== null && _a !== void 0 ? _a : { text: "Unknown", img: "/img/sun.svg" };
    if (esDeNoche && [0, 1, 2].includes(code))
        return `/img/${code}-night.svg`;
    if (temp < 0 && [0, 1, 2].includes(code))
        return "/img/snow.svg";
    return info.img;
};
const renderHourlyForecast = (temps, codes, times, horaActual) => {
    const forecastContainer = document.querySelector(".hourlyForecast");
    forecastContainer.innerHTML = "";
    const hoursToShow = 10;
    const startIdx = Math.max(0, horaActual);
    const endIdx = Math.min(startIdx + hoursToShow, temps.length);
    const actualHoursToShow = endIdx - startIdx;
    if (actualHoursToShow < 2)
        return;
    const tempSlice = temps.slice(startIdx, endIdx);
    const maxTemp = Math.max(...tempSlice);
    const minTemp = Math.min(...tempSlice);
    const tempRange = maxTemp - minTemp || 1;
    // Crear SVG
    const svgHeight = 150;
    const padding = 20;
    const graphHeight = svgHeight - padding * 2;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 100 ${svgHeight}`);
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", svgHeight + "px");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.style.display = "block";
    svg.style.marginBottom = "20px";
    // Construir puntos
    const points = [];
    for (let i = 0; i < actualHoursToShow; i++) {
        const x = (i / Math.max(1, actualHoursToShow - 1)) * 100;
        const y = padding + graphHeight - ((temps[startIdx + i] - minTemp) / tempRange) * graphHeight;
        points.push({ x, y });
    }
    // Crear path con curva suave
    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(0, i - 1)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(points.length - 1, i + 2)];
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    // Dibujar la línea curva
    const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    line.setAttribute("d", pathD);
    line.setAttribute("stroke", "#ffffff");
    line.setAttribute("stroke-width", "1.5");
    line.setAttribute("fill", "none");
    line.setAttribute("stroke-linecap", "round");
    line.setAttribute("stroke-linejoin", "round");
    line.setAttribute("vector-effect", "non-scaling-stroke");
    svg.appendChild(line);
    forecastContainer.appendChild(svg);
    // Contenedor de las horas
    const hourCardsContainer = document.createElement("div");
    hourCardsContainer.style.display = "flex";
    hourCardsContainer.style.gap = "15px";
    hourCardsContainer.style.paddingBottom = "10px";
    hourCardsContainer.style.justifyContent = "space-between";
    hourCardsContainer.style.width = "100%";
    hourCardsContainer.style.margin = "10px 0";
    hourCardsContainer.style.padding = "0 20px";
    hourCardsContainer.style.boxSizing = "border-box";
    for (let i = 0; i < actualHoursToShow; i++) {
        const idx = startIdx + i;
        const card = document.createElement("div");
        card.style.display = "flex";
        card.style.flexDirection = "column";
        card.style.alignItems = "center";
        card.style.flex = "1";
        card.style.minWidth = "70px";
        card.style.padding = "10px";
        card.style.borderRadius = "12px";
        card.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
        card.style.border = "1px solid rgba(255, 255, 255, 0.1)";
        if (idx === horaActual) {
            card.style.border = "2px solid #ffffff";
            card.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
        }
        const timeEl = document.createElement("p");
        timeEl.style.fontSize = "0.85em";
        timeEl.style.margin = "0 0 8px 0";
        timeEl.style.color = "#ccc";
        timeEl.textContent = times[idx];
        const tempEl = document.createElement("p");
        tempEl.style.fontSize = "1.2em";
        tempEl.style.fontWeight = "bold";
        tempEl.style.margin = "0 0 8px 0";
        tempEl.textContent = `${Math.round(temps[idx])}°`;
        const iconImg = document.createElement("img");
        const hour = parseInt(times[idx].split(":")[0]);
        iconImg.src = getWeatherIcon(codes[idx], temps[idx], hour < 6 || hour > 18);
        iconImg.style.width = "40px";
        iconImg.style.height = "40px";
        card.appendChild(timeEl);
        card.appendChild(tempEl);
        card.appendChild(iconImg);
        hourCardsContainer.appendChild(card);
    }
    forecastContainer.appendChild(hourCardsContainer);
};
const actualizarClima = (lat, lon, timezone) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
        const resCurrent = yield fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=sunrise,sunset&timezone=${timezone}`);
        const dataCurrent = yield resCurrent.json();
        console.log(dataCurrent);
        const temp = dataCurrent.current_weather.temperature;
        const code = dataCurrent.current_weather.weathercode;
        const nowStr = new Date().toLocaleTimeString("en-GB", { hour12: false, hour: "2-digit", minute: "2-digit", timeZone: timezone });
        const now = parseInt(nowStr.split(":")[0]) * 60 + parseInt(nowStr.split(":")[1]);
        const sunriseStr = new Date(dataCurrent.daily.sunrise[0]).toLocaleTimeString("en-GB", { hour12: false, timeZone: timezone });
        const sunsetStr = new Date(dataCurrent.daily.sunset[0]).toLocaleTimeString("en-GB", { hour12: false, timeZone: timezone });
        const sunrise = parseInt(sunriseStr.split(":")[0]) * 60 + parseInt(sunriseStr.split(":")[1]);
        const sunset = parseInt(sunsetStr.split(":")[0]) * 60 + parseInt(sunsetStr.split(":")[1]);
        const esDeNoche = now < sunrise || now > sunset;
        weatherIcon.src = getWeatherIcon(code, temp, esDeNoche);
        weatherText.textContent = (_b = (_a = weatherMap[code]) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : "Unknown";
        mainTemp.textContent = `${temp > 0 ? "+" : ""}${temp}ºC`;
        // Fetch hourly data
        const resHourly = yield fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weather_code&daily=apparent_temperature_max,relative_humidity_2m_max,windspeed_10m_max,uv_index_max,precipitation_sum&timezone=${timezone}`);
        if (!resHourly.ok) {
            console.error("Hourly weather API error:", resHourly.status);
            return;
        }
        const dataHourly = yield resHourly.json();
        const horaActual = new Date().getHours();
        const sensacion = (_c = dataHourly.daily.apparent_temperature_max[0]) !== null && _c !== void 0 ? _c : temp;
        const humedad = (_d = dataHourly.daily.relative_humidity_2m_max[0]) !== null && _d !== void 0 ? _d : 0;
        const viento = (_e = dataHourly.daily.windspeed_10m_max[0]) !== null && _e !== void 0 ? _e : 0;
        const uv = (_f = dataHourly.daily.uv_index_max[0]) !== null && _f !== void 0 ? _f : 0;
        const precipitacion = (_g = dataHourly.daily.precipitation_sum[0]) !== null && _g !== void 0 ? _g : 0;
        document.getElementById("todaySideTemp").textContent = `${sensacion > 0 ? "+" : ""}${sensacion.toFixed(1)}ºC`;
        document.getElementById("humidity").textContent = `${humedad}%`;
        document.getElementById("wind").textContent = `${viento.toFixed(1)} km/h`;
        document.getElementById("uvindex").textContent = `${uv}`;
        document.getElementById("visibility").textContent = `${precipitacion.toFixed(1)} mm`;
        // Preparar datos para el gráfico
        const temps = dataHourly.hourly.temperature_2m;
        const codes = dataHourly.hourly.weather_code;
        const times = dataHourly.hourly.time.map((t) => {
            const d = new Date(t);
            return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: timezone });
        });
        renderHourlyForecast(temps, codes, times, horaActual);
    }
    catch (error) {
        console.error("Error updating weather:", error);
    }
});
//# sourceMappingURL=main.js.map
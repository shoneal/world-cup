import {
  players,
  teams,
} from "https://shoneal.github.io/world-cup/scripts/data.js";

const showImage = (img) => {
  const onLoadOrError = () => {
    img.style.opacity = "1";
    img.removeEventListener("load", onLoadOrError);
    img.removeEventListener("error", onLoadOrError);
  };

  if (img.complete) {
    onLoadOrError();
  } else {
    img.addEventListener("load", onLoadOrError, { once: true });
    img.addEventListener("error", onLoadOrError, { once: true });
  }
}; // Функция для настройки загрузки изображения
const bodyElements = {
  url: document.querySelector('meta[name="url"]'),
  title: document.querySelector(".banner-section-title"),
  svg: document.querySelector(".banner-section-image img"),
  container: document.querySelector(".container"),
  template: document.getElementById("card-template"),
}; // Элементы тела страницы
const renderPlayers = (container, players, teams, url, template) => {
  Object.keys(players).forEach((position) => {
    const positionDiv = document.createElement("div");

    const title = document.createElement("h2");
    title.className = "cards-title";
    title.textContent = position;
    positionDiv.appendChild(title);

    const ul = document.createElement("ul");
    ul.className = "cards-list";

    const fragment = document.createDocumentFragment();

    const sortedPlayers = Object.values(players[position]).sort((a, b) => {
      const pointsDiff = b[3] - a[3];
      if (pointsDiff !== 0) return pointsDiff;

      const nameA = typeof a[1] === "string" ? a[1].toUpperCase() : "";
      const nameB = typeof b[1] === "string" ? b[1].toUpperCase() : "";
      return nameA.localeCompare(nameB);
    });

    sortedPlayers.forEach((data) => {
      const clone = template.content.cloneNode(true);
      const card = clone.querySelector(".card");
      const flag = clone.querySelector(".card-header img");
      const team = clone.querySelector(".card-team-name");
      const points = clone.querySelector(".card-points");
      const name = clone.querySelector(".card-name");
      const statValue = clone.querySelector(".card-stat-value");
      const statName = clone.querySelector(".card-stat-name");
      const player = clone.querySelector(".card-player-image img");

      flag.src = `${url.content}images/flags/${teams[data[2]]}.png`;
      team.textContent = data[2];
      points.textContent = `${data[3]} pts`;

      const firstName = data[0] ? `${data[0]} ` : "";
      const lastName = data[1].toUpperCase();
      name.textContent = firstName + lastName;

      statValue.textContent = data[4];
      statName.textContent = data[4] === 1 ? "game" : "games";

      player.style.opacity = "0";
      player.src = `${url.content}images/squad/${lastName.replace(
        /\s+/g,
        "-",
      )}.avif`;
      player.alt = name.textContent;
      showImage(player);

      fragment.appendChild(card);
    });

    ul.appendChild(fragment);
    positionDiv.appendChild(ul);
    container.appendChild(positionDiv);
  });
}; // Вывод элементов в структуру HTML
const totalPts = (data) =>
  Object.values(data)
    .flatMap((pos) => Object.values(pos))
    .reduce((sum, stats) => sum + stats[3], 0); // Общее кол-во чочков
const updateSvg = (svg, url) => {
  svg.src =
    url.content +
    (window.innerWidth >= 768
      ? "images/title-banner-desktop.svg"
      : "images/title-banner-mobile.svg");
}; // Обновление svg в баннере

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-theme");
  }

  updateSvg(bodyElements.svg, bodyElements.url);

  bodyElements.title.textContent = `${totalPts(players)} Total pts`;

  renderPlayers(
    bodyElements.container,
    players,
    teams,
    bodyElements.url,
    bodyElements.template,
  );
}); // Изначальная инициализация
let isResizing = false;
window.addEventListener("resize", () => {
  if (!isResizing) {
    window.requestAnimationFrame(() => {
      updateSvg(bodyElements.svg, bodyElements.url);
      isResizing = false;
    });
    isResizing = true;
  }
}); // Обработчик resize

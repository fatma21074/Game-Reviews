const rowBody = document.getElementById("rowBody");
const btns = document.querySelectorAll("[data-category]");
const loading=document.getElementById("loading");
const params = new URLSearchParams(window.location.search);
const gameId = params.get("id");
const details = document.getElementById("details")
const detailsimg=document.getElementById("detailsimg")



async function getgames(query = 'mmorpg') {
  loading.classList.remove('d-none');

  let baseUrl = 'https://www.freetogame.com/api/games';
  let url = query ? `${baseUrl}?category=${query}` : baseUrl;
  let proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

  let data = await fetch(proxyUrl);
  let response = await data.json();
  let games = JSON.parse(response.contents);

  display(games);
  updateHeader(games);   

  loading.classList.add('d-none');
}

function updateHeader(games) {
  const carousel = document.getElementById("headerCarousel");

  const featuredGames = games.slice(0, 3);

  let slides = '';

  featuredGames.forEach((game, index) => {
    slides += `
      <div class="carousel-item ${index === 0 ? 'active' : ''}">
        <img
          src="${game.thumbnail.replace('thumbnail', 'background')}"
          class="d-block mx-auto rounded"
          alt="${game.title}"
        >
        <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded">
          <h5>${game.title}</h5>
          <p>${game.short_description}</p>
        </div>
      </div>
    `;
  });

  carousel.innerHTML = slides;
}


function display(arr) {
  let box = '';

  arr.forEach(game => {
    box += `
      <div class="col-md-3 mb-4 py-3">
        <div class="card h-100 shadow game-card">
          <img src="${game.thumbnail}" class="card-img-top" alt="${game.title}" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="getGameDetails(${game.id})">
          <div class="card-body">
            <p class="card-text fw-bold text-center">
              ${game.title}
            </p>
          </div>
        </div>
      </div>
    `;
  });

  rowBody.innerHTML = box;
  rowBody.style.cssText = "margin-top:100px;";
}


async function getGameDetails(id) {
  const baseUrl = `https://www.freetogame.com/api/game?id=${id}`;
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(baseUrl)}`;

  const res = await fetch(proxyUrl);
  const data = await res.json();
  const game = JSON.parse(data.contents);

  displayDetails(game);
}

function displayDetails(game) {
  document.getElementById("modalBodyContent").innerHTML = `
    <div class="col-md-4">
      <img src="${game.thumbnail}" class="img-fluid rounded shadow mb-3">
    </div>

    <div class="col-md-8">
      <h3>${game.title}</h3>

      <p class="my-2">
        <span class="badge bg-info me-2">${game.genre}</span>
        <span class="badge bg-primary me-2">${game.platform}</span>
        <span class="badge bg-success">${game.status}</span>
      </p>
      <p>${game.description}</p>

      <a href="${game.game_url}" target="_blank" class="btn btn-warning">
        Show Game
      </a>
    </div>
  `;
}


btns.forEach(btn => {
  btn.addEventListener("click", e => {
    e.preventDefault();
    const category = btn.dataset.category;
    if (category) {
      getgames(category);
    }
  });
});

getgames();


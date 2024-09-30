let books = [];
let filteredBooks = [];
let filtro = document.getElementById('filtro');
let pesquisa = document.getElementById("pesquisa");

function searchBooks(element = pesquisa) {
  const searchTerm = element.value;
  if (searchTerm.trim() === "") {
    alert("Por favor, insira um termo de pesquisa.");
    return;
  }
  fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&maxResults=10`)
    .then((response) => response.json())
    .then((data) => {
      books = data.items.map(item => ({
        title: item.volumeInfo.title,
        author_name: item.volumeInfo.authors,
        first_publish_year: item.volumeInfo.publishedDate ? item.volumeInfo.publishedDate.split('-')[0] : "Desconhecido",
        isbn: item.volumeInfo.industryIdentifiers ? item.volumeInfo.industryIdentifiers[0].identifier : "Desconhecido",
        key: item.id
      }));
      filteredBooks = books;
      displayBooks();
    })
    .catch((error) => console.error("Erro ao buscar livros:", error));
}

function displayBooks() {
  const list = document.getElementById("lista-livros");
  list.innerHTML = "";

  filteredBooks.forEach((book) => {
    const li = document.createElement("li");
    li.textContent = `${book.title} - ${
      book.author_name ? book.author_name[0] : "Autor desconhecido"
    }`;
    li.addEventListener("click", () => displayBookDetails(book));
    li.appendChild(createFavoriteButton(book));
    list.appendChild(li);
  });
}

function displayBookDetails(book) {
  const details = document.getElementById("detalhes-livro");
  details.innerHTML = `
    <h3>${book.title}</h3>
    <p><strong>Autor:</strong> ${
      book.author_name ? book.author_name[0] : "Autor desconhecido"
    }</p>
    <p><strong>Ano de Publicação:</strong> ${book.first_publish_year}</p>
    <p><strong>ISBN:</strong> ${book.isbn}</p>
  `;
}

function createFavoriteButton(book) {
  const btn = document.createElement("button");
  btn.textContent = "Favoritar";
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    addTofavoritos(book);
  });
  return btn;
}

function addTofavoritos(book) {
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  if (!favoritos.find((fav) => fav.key === book.key)) {
    favoritos.push(book);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    displayfavoritos();
  } else {
    alert("Este livro já está nos favoritos!");
  }
}

function displayfavoritos() {
  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  const favoritoslista = document.getElementById("lista-favoritos");
  favoritoslista.innerHTML = "";

  favoritos.forEach((book, index) => {
    const li = document.createElement("li");
    li.textContent = `${book.title} - ${
      book.author_name ? book.author_name[0] : "Autor desconhecido"
    }`;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remover";
    removeBtn.classList.add("remove-btn");
    removeBtn.addEventListener("click", () => removeFromfavoritos(index));
    li.appendChild(removeBtn);

    favoritoslista.appendChild(li);
  });
}

function removeFromfavoritos(index) {
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  favoritos.splice(index, 1);
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  displayfavoritos();
}

window.onload = function () {
  displayfavoritos();
};

fetch(`https://www.googleapis.com/books/v1/volumes?q=matematica&maxResults=10`)
  .then((response) => response.json())
  .then((data) => {
    books = data.items.map(item => ({
      title: item.volumeInfo.title,
      author_name: item.volumeInfo.authors,
      first_publish_year: item.volumeInfo.publishedDate ? item.volumeInfo.publishedDate.split('-')[0] : "Desconhecido",
      isbn: item.volumeInfo.industryIdentifiers ? item.volumeInfo.industryIdentifiers[0].identifier : "Desconhecido",
      key: item.id
    }));
    console.log(books);
    filteredBooks = books;
    displayBooks();
  })
  .catch((error) => console.error("Erro ao buscar livros:", error));


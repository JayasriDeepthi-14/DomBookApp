const BOOKS_KEY = 'dombookapp_books_v1';

const sampleImage = 'https://m.media-amazon.com/images/I/71ZB18P3inL._SY522_.jpg';

let books = loadBooks();
let sortAsc = true;

const bookForm = document.getElementById('bookForm');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const categoryInput = document.getElementById('category');
const booksGrid = document.getElementById('booksGrid');
const sortBtn = document.getElementById('sortBtn');
const filterSelect = document.getElementById('filter');
const clearAllBtn = document.getElementById('clearAll');

bookForm && bookForm.addEventListener('submit', onAddBook);
sortBtn && sortBtn.addEventListener('click', onSortToggle);
filterSelect && filterSelect.addEventListener('change', renderBooks);
clearAllBtn && clearAllBtn.addEventListener('click', onClearAll);

renderBooks();

function onAddBook(e){
  e.preventDefault();
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const category = categoryInput.value;
  if(!title || !author) return;

  const book = { id: Date.now().toString(), title, author, category, imageUrl: sampleImage };
  books.push(book);
  saveBooks();
  bookForm.reset();
  renderBooks();
}

function onSortToggle(){
  sortAsc = !sortAsc;
  sortBtn.textContent = sortAsc ? 'Sort A → Z' : 'Sort Z → A';
  renderBooks();
}

function onDeleteBook(id){
  books = books.filter(b => b.id !== id);
  saveBooks();
  renderBooks();
}

function onClearAll(){
  if(!confirm('Clear all books?')) return;
  books = [];
  saveBooks();
  renderBooks();
}

function renderBooks(){
  if(!booksGrid) return;
  booksGrid.innerHTML = '';

  let visible = [...books];

  const filter = filterSelect ? filterSelect.value : 'All';
  if(filter && filter !== 'All'){
    visible = visible.filter(b => b.category === filter);
  }

  visible.sort((a,b) => {
    if(!a.title || !b.title) return 0;
    return sortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
  });

  if(visible.length === 0){
    const nodiv = document.createElement('div');
    nodiv.className = 'card small-muted';
    nodiv.textContent = 'No books to show.';
    booksGrid.appendChild(nodiv);
    return;
  }

  visible.forEach(book => {
    const card = document.createElement('div');
    card.className = 'book-card';

    const img = document.createElement('img');
    img.src = book.imageUrl || sampleImage;
    img.alt = book.title;

    const meta = document.createElement('div');
    meta.className = 'book-meta';
    meta.innerHTML = `<strong>${escapeHtml(book.title)}</strong><div class="small-muted">${escapeHtml(book.author)}</div><div class="small-muted">${escapeHtml(book.category)}</div>`;

    const row = document.createElement('div');
    row.className = 'row';

    const del = document.createElement('button');
    del.className = 'delete-btn';
    del.textContent = 'Delete';
    del.addEventListener('click', () => onDeleteBook(book.id));

    row.appendChild(document.createElement('div'));
    row.appendChild(del);

    card.appendChild(img);
    card.appendChild(meta);
    card.appendChild(row);

    booksGrid.appendChild(card);
  });
}

function saveBooks(){
  try{ localStorage.setItem(BOOKS_KEY, JSON.stringify(books)); }catch(e){ console.warn('save failed', e) }
}

function loadBooks(){
  try{
    const raw = localStorage.getItem(BOOKS_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){ return [] }
}

function escapeHtml(s){
  if(!s) return '';
  return String(s).replace(/[&<>"'`=\/]/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','/':'\/','`':'&#96;','=':'&#61;'}[c];
  });
}
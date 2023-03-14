const bookshelfs = [];
const RENDER_EVENT = 'render-bookshelf';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBookshelf();
    });
    if (isStorageExist()) {
      loadDataFromStorage();
    }
  });

function addBookshelf() {
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
   
    const generatedID = generateId();
    const bookshelfObject = generateBookshelfObject(generatedID, title, author, year, false);
    bookshelfs.push(bookshelfObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
  }
   
function generateBookshelfObject(id, judul, penulis, tahun, isCompleted) {
    return {
      id,
      judul,
      penulis,
      tahun,
      isCompleted
    }
}



function makeBookshelf(bookshelfObject) {
  const textTitle = document.createElement('h2');
  textTitle.innerText = bookshelfObject.judul;
 
  const textAuthor = document.createElement('p');
  textAuthor.innerText = bookshelfObject.penulis;

  const textYear = document.createElement('p');
  textYear.innerText = bookshelfObject.tahun;
 
  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, textAuthor, textYear);
 
  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(textContainer);
  container.setAttribute('id', `bookshelf-${bookshelfObject.id}`);

  if (bookshelfObject.isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
 
    undoButton.addEventListener('click', function () {
      undoBookshelfCompleted(bookshelfObject.id);
    });
 
    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
 
    trashButton.addEventListener('click', function () {
      removeBookshelfCompleted(bookshelfObject.id);
    });
 
    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    
    checkButton.addEventListener('click', function () {
      addTaskToCompleted(bookshelfObject.id);
    });

    const trashButton2 = document.createElement('button');
    trashButton2.classList.add('trash-button');
 
    trashButton2.addEventListener('click', function () {
      removeBookshelfUncompleted(bookshelfObject.id);
    });
    
    container.append(checkButton, trashButton2);
  }
 
  return container;
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookshelfList = document.getElementById('incompleteBookshelfList');
  uncompletedBookshelfList.innerHTML = '';

  const completedBookshelfList = document.getElementById('completeBookshelfList');
  completedBookshelfList.innerHTML = '';
 
  for (const bookshelfItem of bookshelfs) {
    const bookshelfElement = makeBookshelf(bookshelfItem);
    if (!bookshelfItem.isCompleted) {
      uncompletedBookshelfList.append(bookshelfElement);
    }else {
      completedBookshelfList.append(bookshelfElement);
    }
  }
});

function addTaskToCompleted (bookshelfId) {
  const bookshelfTarget = findBookshelf(bookshelfId);
 
  if (bookshelfTarget == null) return;
 
  bookshelfTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookshelf(bookshelfId) {
  for (const bookshelfItem of bookshelfs) {
    if (bookshelfItem.id === bookshelfId) {
      return bookshelfItem;
    }
  }
  return null;
}

function removeBookshelfCompleted(bookshelfId) {
  const bookshelfTarget = findBookshelfIndex(bookshelfId);
 
  if (bookshelfTarget === -1) return;
 
  bookshelfs.splice(bookshelfTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  show();
  
}

function removeBookshelfUncompleted(bookshelfId) {
  const bookshelfTarget = findBookshelfIndex(bookshelfId);
 
  if (bookshelfTarget === -1) return;
 
  bookshelfs.splice(bookshelfTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  show();
  
}
 
 
function undoBookshelfCompleted(bookshelfId) {
  const bookshelfTarget = findBookshelf(bookshelfId);
 
  if (bookshelfTarget == null) return;
 
  bookshelfTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookshelfIndex(bookshelfId) {
  for (const index in bookshelfs) {
    if (bookshelfs[index].id === bookshelfId) {
      return index;
    }
  }
 
  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(bookshelfs);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT = 'saved-bookshelf';
const STORAGE_KEY = 'BOOKSHELF_APPS';
 
function isStorageExist()  {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const bookshelf of data) {
      bookshelfs.push(bookshelf);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function showremoveComplete() {
  const s = document.querySelector(".Snackbar");
  s.classList.add("show");
  setTimeout(()=> {
    s.classList.remove("show")
  }, 2000);
}






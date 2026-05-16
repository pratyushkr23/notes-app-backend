let token = "";

const API_URL = window.location.origin;

const authPage = document.getElementById("authPage");
const dashboardPage = document.getElementById("dashboardPage");

const authMessage = document.getElementById("authMessage");
const noteMessage = document.getElementById("noteMessage");

// Register
async function register() {
  authMessage.innerText = "";

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch(`${API_URL}/register`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  authMessage.innerText = data.message;

  authMessage.style.color = response.ok ? "green" : "red";
}

// Login
async function login() {
  authMessage.innerText = "";

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch(`${API_URL}/login`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (data.access_token) {
    token = data.access_token;

    authPage.classList.add("hidden");

    dashboardPage.classList.remove("hidden");

    getNotes();
  } else {
    authMessage.innerText = data.message;

    authMessage.style.color = "red";
  }
}

// Logout
function logout() {
  token = "";

  dashboardPage.classList.add("hidden");

  authPage.classList.remove("hidden");
}

// Create Note
async function createNote() {
  noteMessage.innerText = "";

  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  const response = await fetch(`${API_URL}/notes`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      title,
      content,
    }),
  });

  const data = await response.json();

  if (response.ok) {
    noteMessage.innerText = "Note created successfully";

    noteMessage.style.color = "green";

    document.getElementById("title").value = "";
    document.getElementById("content").value = "";

    getNotes();
  } else {
    noteMessage.innerText = data.message;

    noteMessage.style.color = "red";
  }
}

// Get Notes
async function getNotes() {
  const response = await fetch(`${API_URL}/notes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const notes = await response.json();

  const notesDiv = document.getElementById("notes");

  notesDiv.innerHTML = "";

  notes.forEach((note) => {
    notesDiv.innerHTML += `
  <div class="note-card">

    <input
      type="text"
      id="title-${note._id}"
      value="${note.title}"
    />

    <textarea
      id="content-${note._id}"
    >${note.content}</textarea>

    <button onclick="updateNote('${note._id}')">
      Update
    </button>

    <button onclick="deleteNote('${note._id}')">
      Delete
    </button>

    <div class="share-box">

      <input
        type="email"
        id="share-${note._id}"
        placeholder="Share with email"
      />

      <button onclick="shareNote('${note._id}')">
        Share
      </button>

      <p id="message-${note._id}"></p>

    </div>

  </div>
`;
  });
}

//search notes
async function searchNotes() {
  const keyword = document.getElementById("searchInput").value;

  const response = await fetch(
    `${API_URL}/search?q=${keyword}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const notes = await response.json();

  const notesDiv = document.getElementById("notes");

  notesDiv.innerHTML = "";

  if (notes.length === 0) {
    notesDiv.innerHTML = `
      <p>No matching notes found</p>
    `;

    return;
  }

  notes.forEach((note) => {
    notesDiv.innerHTML += `
      <div class="note-card">

        <h3>${note.title}</h3>

        <p>${note.content}</p>

      </div>
    `;
  });
}

//update note
async function updateNote(id) {
  const title = document.getElementById(`title-${id}`).value;

  const content = document.getElementById(`content-${id}`).value;

  const response = await fetch(`${API_URL}/notes/${id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      title,
      content,
    }),
  });

  const data = await response.json();

  const messageBox = document.getElementById(`message-${id}`);

  if (response.ok) {
    messageBox.innerText = "Note updated successfully";

    messageBox.style.color = "green";
  } else {
    messageBox.innerText = data.message;

    messageBox.style.color = "red";
  }
}

// Delete Note
async function deleteNote(id) {
  await fetch(`${API_URL}/notes/${id}`, {
    method: "DELETE",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  getNotes();
}

// Share Note
async function shareNote(id) {
  const email = document.getElementById(`share-${id}`).value;

  const messageBox = document.getElementById(`message-${id}`);

  const response = await fetch(`${API_URL}/notes/${id}/share`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      share_with_email: email,
    }),
  });

  const data = await response.json();

  messageBox.innerText = data.message;

  messageBox.style.color = response.ok ? "green" : "red";
}

//about 
async function showAbout() {
  const response = await fetch(`${API_URL}/about`);

  const data = await response.json();

  const features = Object.entries(data["my features"])
    .map(([key, value]) => {
      return `<li><strong>${key}:</strong> ${value}</li>`;
    })
    .join("");

  document.getElementById("aboutMessage").innerHTML = `
    <div class="about-box">

      <h3>About Developer</h3>

      <p><strong>Name:</strong> ${data.name}</p>

      <p><strong>Email:</strong> ${data.email}</p>

      <h4>Features Added</h4>

      <ul>
        ${features}
      </ul>

    </div>
  `;
}
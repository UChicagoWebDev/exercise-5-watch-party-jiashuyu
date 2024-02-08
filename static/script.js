/* For index.html */
// TODO: If a user clicks to create a chat, create an auth key for them and save it. Redirect the user to /chat/<chat_id>
async function createChat() {
  const request = {
    method: "POST",
    headers: { "Authorization": WATCH_PARTY_API_KEY }
  };

  try {
    const response = await fetch("/rooms/new", request);
    const data = await response.json();
    if (data.room_id) {
      window.location.href = `/rooms/${data.room_id}`;
    } else {
      console.error("Failed to create room");
    }
  } catch (error) {
    console.error("Error: ", error)
  }
}

/* For chat.html */
// TODO: POST to the API when the user posts a new message.
async function postMessage() {
  const message = document.querySelector(".comment_box textarea").value;
  const roomId = document
      .querySelector(".invite a")
      .getAttribute("href")
      .split("/")[2];

  let url = "/api/rooms/" + roomId + "/messages";
  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": WATCH_PARTY_API_KEY
    },
    body: JSON.stringify({ body: message, user_id: WATCH_PARTY_USER_ID })
  }

  try {
    const response = await fetch(url, request);
    if (response.ok) {
      document.querySelector(".comment_box textarea").value = "";
      await getMessages();
    } else {
      console.error("Failed to post message");
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}

// TODO: Fetch the list of existing chat messages.
async function getMessages() {
  const roomId = document
      .querySelector(".invite a")
      .getAttribute("href")
      .split("/")[2];
  let url = "/api/rooms/" + roomId + "/messages";
  const request = {
    method: "GET",
    headers: { "Authorization": WATCH_PARTY_API_KEY }
  }

  try {
    const response = await fetch(url, request);
    const data = await response.json();
    const container = document.querySelector(".messages");
    container.innerHTML = "";
    data.forEach(message => {
      const messageElement = document.createElement("message");
      const authorElement = document.createElement("author");
      const contentElement = document.createElement("content");
      authorElement.textContent = message.name;
      contentElement.textContent = message.body;
      messageElement.appendChild(authorElement);
      messageElement.appendChild(contentElement);
      container.appendChild(messageElement);
    });
  } catch (error) {
    console.error("Error fetching messages: ", error);
  }
}

// TODO: Automatically poll for new messages on a regular interval.
function startMessagePolling() {
  setInterval(getMessages, 100);
}

async function updateUsername() {
  const newUsername = document.querySelector('input[name="username"]').value;
  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": WATCH_PARTY_API_KEY
    },
    body: JSON.stringify({ name: newUsername })
  }

  try {
    const response = await fetch("/api/user/name", request);
    if (response.ok) {
      alert("Username has been updated!");
    } else {
      alert("Failed to update username!");
    }
  } catch (error) {
    console.error("Error: ", error);
  }

  return false;
}

async function updatePassword() {
  const newPassword = document.querySelector('input[name="password"]').value;
  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": WATCH_PARTY_API_KEY
    },
    body: JSON.stringify({ password: newPassword })
  }

  try {
    const response = await fetch("/api/user/password", request);
    if (response.ok) {
      alert("Password has been updated!");
    } else {
      alert("Failed to update password!");
    }
  } catch (error) {
    console.error("Error: ", error);
  }

  return false;
}

async function updateRoomName() {
  const roomId = document
      .querySelector(".invite a")
      .getAttribute("href")
      .split("/")[2];
  const newRoomName = document.querySelector(".roomData .edit input").value;

  let url = "/api/rooms/" + roomId;
  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": WATCH_PARTY_API_KEY
    },
    body: JSON.stringify({ name: newRoomName})
  }

  try {
    const response = await fetch(url, request);
    if (response.ok) {
      document.querySelector(".roomData .roomName").textContent = newRoomName;
      document.querySelector(".roomData .display").classList.remove("hide");
      document.querySelector(".roomData .edit").classList.add("hide");
    } else {
      console.error("Failed to update room name!");
    }
  } catch (error) {
    console.error("Error: ", error);
  }

  return false;
}

function changeClassAttributes() {
  document.querySelector(".roomData .edit").classList.remove("hide");
  document.querySelector(".roomData .display").classList.add("hide");
  return false;
}
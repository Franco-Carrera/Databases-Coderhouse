const socket = io();

const emailInput = document.getElementById("email");
let email = "";
emailInput.addEventListener("keyup", (e) => {
  if (e.target.value) email = e.target.value;
});
const messageInput = document.getElementById("message");
let message = "";
messageInput.addEventListener("keyup", (e) => {
  if (e.target.value) message = e.target.value;
});

const sendChatButton = document.getElementById("sendChatButton");

sendChatButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (!email && !message) window.alert("Field email or message is empty!");
  socket.emit("chats", { email: email, message: message });
});

socket.on("chats", (data) => {
  const divChat = document.getElementById("chats");
  const chat = data
    .map((chat) => {
      return `<p>
            <span style='color: blue; font-weight: 600;'>${chat.email}</span> [<span style='color: brown;'>${chat.created_at}</span>]: <span style='color: green;font-style: italic;'>${chat.message}</span>
          </p>`;
    })
    .join("");
  divChat.innerHTML = chat;
});

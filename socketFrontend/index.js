const socketUrl = "http://localhost:3001";

let socket;

const connectBtn = document.getElementById("connectBtn");
const authBtn = document.getElementById("authBtn");
const offerBtn = document.getElementById("offerBtn");

const tokenInput = document.getElementById("tokenInput");
const messageInput = document.getElementById("message");
const titleInput = document.getElementById("title");
const discountInput = document.getElementById("discount");

const statuss = document.getElementById("status");
const statussAuth = document.getElementById("statusAuth");
const statusOffer = document.getElementById("statusOffer");

const renderr = document.getElementById("renderr");

socket = io(socketUrl);
// connectBtn.addEventListener("click", () => {

//   socket.on("connect", () => {
//     statuss.innerHTML = "cnnected";
//   });

//   socket.on("disconnect", () => {
//     statuss.innerHTML = "Disconnected";
//   });
// });

let isAuthorized = false;
authBtn.addEventListener("click", () => {
  const token = tokenInput.value.trim();
  // console.log(token);
  socket.emit("authentication", token);
});

socket.on("connect", () => {
  statuss.innerHTML = "Connected";
});

socket.on("disconnect", () => {
  statuss.innerHTML = "Disconnected";
  isAuthorized = false;
  offerBtn.disabled = true;
  statussAuth.innerHTML = "Not Authenticated";
});
socket.on("authSuccess", (data) => {
  isAuthorized = true;
  offerBtn.disabled = false;
  statussAuth.innerHTML = "Authenticated";
});
socket.on("authError", (data) => {
  isAuthorized = false;
  offerBtn.disabled = true;
  statussAuth.innerHTML = "Not Authenticated";
});
socket.on("offerError", (data) => {
  statusOffer.innerHTML = data.message;
});
socket.on("offerSucces", (data) => {
  statusOffer.innerHTML = "Offer sent successfully";
});

socket.on("userOffer", (data) => {
  const item = document.createElement("div");
  item.innerText = `Received offer: ${data.title} - ${data.message} - ${data.discount}`;

  renderr.appendChild(item);
  // statusOffer.innerHTML =

  // renderr.appendChild = `Received offer: ${data.title} - ${data.message} - ${data.discount}`;
});
offerBtn.addEventListener("click", () => {
  if (!isAuthorized) {
    alert("You are not authorized");
    return;
  }

  if (
    messageInput.value === "" ||
    titleInput.value === "" ||
    discountInput.value === ""
  ) {
    alert("Ysome fields are missing");
    return;
  }
  console.log(messageInput.value);
  console.log(titleInput.value);
  console.log(discountInput.value);

  socket.emit("adminOffer", {
    message: messageInput.value,
    title: titleInput.value,
    discount: discountInput.value,
  });
});

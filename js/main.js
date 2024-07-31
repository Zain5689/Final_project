let Url = "https://tarmeezacademy.com/api/v1/";

function loginCheck() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  let params = {
    username: username,
    password: password,
  };
  toggleLoader(false);

  axios
    .post(`${Url}login`, params)
    .then((Response) => {
      localStorage.setItem("token", Response.data.token);
      localStorage.setItem("user", JSON.stringify(Response.data.user));

      const modal = document.getElementById("exampleModal");
      const modalinstance = bootstrap.Modal.getInstance(modal);
      modalinstance.hide();
      ShowAlert("Logged in Success!", "success");
      setupUI();
    })
    .catch((error) => {
      ShowAlert(error.response.data.message, "danger");
    })
    .finally(() => {
      toggleLoader(false);
    });
}

function RegisterCheck() {
  const name = document.getElementById("name").value;
  const username = document.getElementById("usernames").value;
  const password = document.getElementById("passwords").value;
  const image = document.getElementById("register-image").files[0];

  let formData = new FormData();
  formData.append("name", name);
  formData.append("username", username);
  formData.append("password", password);
  formData.append("image", image);

  const headers = {
    "Content-Type": "multipart/form-data",
  };

  axios
    .post(`${Url}register`, formData, {
      headers: headers,
    })
    .then((response) => {
      console.log(response.data.token);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      const modal = document.getElementById("Registermodal");
      const modalInstance = new bootstrap.Modal(modal);
      modalInstance.hide();

      ShowAlert("Register Success!", "success");
      setupUI();
    })
    .catch((error) => {
      console.error("An error occurred during registration:");
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error status code:", error.response.status);
      console.error("Error data:", error.response.data);
      ShowAlert(error.response.data.message, "danger");
    });
}

function ShowAlert(msg, type) {
  const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };
  appendAlert(msg, type);
}

function LogetOut() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  // console.log(localStorage.getItem("token"), localStorage.getItem("user"));
  ShowAlert("Logged out Success!", "success");
  setupUI();
}

function setupUI() {
  const token = localStorage.getItem("token");
  const logindiv = document.getElementById("login");
  const logoutdiv = document.getElementById("logout");
  const create = document.getElementById("create");
  console.log(create);

  if (token == null) {
    logindiv.style.setProperty("display", "flex", "important");
    logoutdiv.style.setProperty("display", "none", "important");
    create.style.setProperty("display", "none", "important");
  } else {
    logindiv.style.setProperty("display", "none", "important");
    logoutdiv.style.setProperty("display", "flex", "important");
    create.style.setProperty("display", "block", "important");

    let currentuser = getCurrentuser();
    document.getElementById("nav-username").innerHTML = currentuser.username;
    document.getElementById("nav-user-image").src = currentuser.profile_image;
  }
}

function getCurrentuser() {
  let user = null;
  let currentuser = localStorage.getItem("user");
  if (currentuser !== null) {
    user = JSON.parse(currentuser);
  }
  return user;
}

function toggleLoader(show = true) {
  if (show) {
    document.getElementById("loader").style.visibility = "visible";
  } else {
    document.getElementById("loader").style.visibility = "hidden";
  }
}

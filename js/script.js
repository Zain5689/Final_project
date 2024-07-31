let currentPage = 1;
let lastPage = 1;

//===== INFINITE SCROLL =======//
window.addEventListener("scroll", function () {
  const endOfPage =
    window.innerHeight + window.pageYOffset >= document.body.scrollHeight;

  // console.log(window.pageYOffset);
  if (endOfPage && currentPage < lastPage) {
    currentPage = currentPage + 1;
    console.log(endOfPage);
    Getposts(currentPage);
  }
});
//=====// INFINITE SCROLL //=======//
Getposts();
function Getposts(page = 1) {
  toggleLoader(true);
  let postss = document.getElementById("posts");
  axios.get(`${Url}posts?limit=2&page=${page}`).then((result) => {
    toggleLoader(false);
    let posts = result.data.data;
    lastPage = result.data.meta.last_page;
    console.log(lastPage);
    for (let post of posts) {
      // console.log(post);
      let posttitle = "";
      if (posttitle !== "") {
        posttitle = post.title;
      }
      // console.log(post.id);

      let user = getCurrentuser();
      let editBtnContent = ``;
      let isMypost = user != null && post.author.id == user.id;
      if (isMypost) {
        editBtnContent = `
           <button class="btn btn-danger mx-2" style="float:right" onclick="deletePostBtnClicked('${encodeURIComponent(
             JSON.stringify(post)
           )}')"">Delete</button>
           
           <button class="btn btn-secondary" style="float:right" onclick="editPostBtnClicked('${encodeURIComponent(
             JSON.stringify(post)
           )}')"">edit</button>
        `;
      }

      let author = post.author;
      let content = `
          <div class="card mb-3" style="cursor: pointer;" >
              <div class="card-header">
              <span onclick="change(${post.id})">
                <img
                  src=${author.profile_image}
                  style="width: 40px; height: 40px"
                  class="rounded-circle border border-2"
                />
                <b>${author.username}</b>
              </span>
                ${editBtnContent}
              </div>
              <div class="card-body"    onclick="GetpostDetails(${post.id})">
                <img src=${post.image}  class="w-100" />
                <span style="color: gray" class="pt-2">${post.created_at}</span>
                <h5 class="card-title">${posttitle}</h5>
                <p class="card-text">
                ${post.body}
                </p>
                <hr />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-pen"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"
                  />
                </svg>
                <span class="ms-3">${post.comments_count} comments</span>
                <span id ="post${post.id}"></span>
              </div>
            </div>

        `;
      postss.innerHTML += content;

      let postTag = `post${post.id}`;
      document.getElementById(postTag).innerHTML = "";
      for (let tag of post.tags) {
        let tagescontent = `
        <button class="btn btn-sm rounded-5" style="background-color: gray;color:white">${tag.name}</button>
        `;
        document.getElementById(postTag).innerHTML += tagescontent;
      }
    }
  });
}

function GetpostDetails(PostId) {
  window.location = `postDetails.html?PostId=${PostId}`;
}

function createPost() {
  const title = document.getElementById("title").value;
  const body = document.getElementById("body").value;
  const image = document.getElementById("image").files[0];
  const token = localStorage.getItem("token");

  let postId = document.getElementById("post-id-input").value;
  let isCreate = postId == null || postId == "";

  let formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  formData.append("image", image);

  const headers = {
    "Content-Type": "multipart/form-data",
    authorization: `Bearer ${token}`,
  };
  let url = ``;
  if (isCreate) {
    url = `${Url}posts`;
  } else {
    formData.append("_method", "put");
    url = `${Url}posts/${postId}`;
    console.log(url);
  }

  axios
    .post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: `Bearer ${token}`,
      },
    })
    .then((Response) => {
      console.log(Response);
      Getposts();
      const modal = document.getElementById("Createpostmodal");
      const modalinstance = bootstrap.Modal.getInstance(modal);
      modalinstance.hide();
      ShowAlert("Logged in Success!", "success");
    })
    .catch((error) => {
      console.log(error.response.data.message);
      ShowAlert(error.response.data.message, "danger");
    });
}

function editPostBtnClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  console.log(post);

  document.getElementById("post-modal-submit-btn").innerHTML = "Update";
  document.getElementById("post-id-input").value = post.id;
  document.getElementById("modal-title").innerHTML = "Edit Post";
  document.getElementById("title").value = post.title;
  document.getElementById("body").value = post.body;

  let postModal = new bootstrap.Modal(
    document.getElementById("Createpostmodal"),
    {}
  );
  postModal.toggle();
}

function addBtnClicked() {
  document.getElementById("post-modal-submit-btn").innerHTML = "Create";
  document.getElementById("post-id-input").value = "";
  document.getElementById("modal-title").innerHTML = "Create A New Post";
  document.getElementById("title").value = "";
  document.getElementById("body").value = "";
  let postModal = new bootstrap.Modal(
    document.getElementById("Createpostmodal"),
    {}
  );
  postModal.toggle();
}

function deletePostBtnClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  document.getElementById("delete-id-input").value = post.id;
  let postModal = new bootstrap.Modal(
    document.getElementById("Delete-post-modal"),
    {}
  );
  postModal.toggle();
}

function confirmDelete() {
  let postId = document.getElementById("delete-id-input").value;
  let token = localStorage.getItem("token");

  axios
    .delete(`${Url}posts/${postId}`, {
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: `Bearer ${token}`,
      },
    })
    .then((Response) => {
      Getposts();
      const modal = document.getElementById("Delete-post-modal");
      const modalinstance = bootstrap.Modal.getInstance(modal);
      modalinstance.hide();
      ShowAlert("Delete modal Success!", "success");
    })
    .catch((error) => {
      console.log(error.response.data.message);
      ShowAlert(error.response.data.message, "danger");
    });
}

function change(id) {
  window.location = `Porfile.html?userId=${id}`;
}

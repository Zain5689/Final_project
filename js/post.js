// let Url = "https://tarmeezacademy.com/api/v1/";

const params = new URLSearchParams(window.location.search);
let id = params.get("PostId");

Getpost();
function Getpost() {
  toggleLoader(true);
  axios.get(`${Url}posts/${id}`).then((result) => {
    toggleLoader(false);
    let post = result.data.data;
    // console.log(post);
    let posttitle = "";
    if (posttitle !== "") {
      posttitle = post.title;
    }

    let author = post.author;
    document.getElementById("post-username").innerHTML = author.username;

    let content = `
    <div class="card mb-3" style="cursor: pointer;" >
        <div class="card-header">
          <img
            src=${author.profile_image}
            style="width: 40px; height: 40px"
            class="rounded-circle border border-2"
          />
          <b>${author.username}</b>
        </div>
        <div class="card-body">
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
          <div class="comments mt-3 p-5" style="background-color: #fafafa"></div>
          <div class="input-group mb-2">
            <input id="input" type="text" class="form-control w-80" placeholder="Write Your Commen..." />
            <button type="button" class="btn btn-outline-info" onclick="getComments()">
              Send
            </button>
          </div>
        </div>
      </div>
  
  `;

    document.getElementById("postdetails").innerHTML += content;

    let comments = post.comments;
    for (let comment of comments) {
      let commentcontent = `
       <div class="comment">
              <img
                src="${comment.author.profile_image}"
                style="width: 40px; height: 40px"
                class="rounded-circle"
              />
              <span class="mx-2"> @${comment.author.username}</span>
              <p>
                ${comment.body}
              </p>
            </div>
      
      `;

      document.querySelector(".comments").innerHTML += commentcontent;
    }
  });
}

function getComments() {
  let value = document.getElementById("input").value;
  let params = {
    body: value,
  };
  let token = localStorage.getItem("token");
  let user = localStorage.getItem("user");

  console.log(user);

  axios
    .post(`https://tarmeezacademy.com/api/v1/posts/${id}/comments`, params, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then((repo) => {
      console.log(repo.data);
      ShowAlert("comment Success!", "success");
      Getpost();
    })
    .catch((error) => {
      console.log(error.response.data.message);
      let msg = error.response.data.message;
      ShowAlert(msg, "danger");
    });
}

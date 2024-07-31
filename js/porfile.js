setupUI();

getUserId();
function getUserId() {
  const params = new URLSearchParams(window.location.search);
  let id = params.get("userId");
  console.log(id);
  return 1;
}
getUser();
function getUser() {
  let id = getUserId();
  axios
    .get(`${Url}users/${id}`)
    .then((response) => {
      const user = response.data.data;
      document.getElementById("user-image").src = user.profile_image;
      document.getElementById("user-name").innerHTML = user.name;
      document.getElementById("user-email").innerHTML = user.email;
      document.getElementById("user-username").innerHTML = user.username;
      document.getElementById("post-count").innerHTML = user.posts_count;
      document.getElementById("comment-count").innerHTML = user.comments_count;
    })
    .catch((error) => {
      console.log(error.response.data.message);
      ShowAlert(error.response.data.message, "danger");
    });
}
Getposts();
function Getposts() {
  const id = getUserId();

  axios.get(`${Url}users/${id}/posts`).then((response) => {
    const posts = response.data.data;
    console.log(posts);

    document.getElementById("post-user").innerHTML = "";

    for (let post of posts) {
      const author = post.author;
      let postTitle = "";

      // show or hide (edit) button
      let user = getCurrentuser();
      let isMyPost = user != null && post.author.id == user.id;
      let editBtnContent = ``;

      if (isMyPost) {
        editBtnContent = `
                          <button class='btn btn-danger' style='margin-left: 5px; float: right' onclick="deletePostBtnClicked('${encodeURIComponent(
                            JSON.stringify(post)
                          )}')">delete</button>
      
                          <button class='btn btn-secondary' style='float: right' onclick="editPostBtnClicked('${encodeURIComponent(
                            JSON.stringify(post)
                          )}')">edit</button>
                      `;
      }

      if (post.title != null) {
        postTitle = post.title;
      }
      let content = `
                      <div class="card shadow mb-5">
                          <div class="card-header">
                              <img class="rounded-circle border border-2" src="${author.profile_image}" alt="" style="width: 40px; height: 40px">
                              <b>${author.username}</b>
      
                              ${editBtnContent}
                              
                          </div>
                          <div class="card-body" onclick="postClicked(${post.id})" style="cursor: pointer">
                              <img class="w-100" src="${post.image}" alt="">
      
                              <h6 style="color: rgb(193, 193, 193);" class="mt-1">
                                  ${post.created_at}
                              </h6>
      
                              <h5>
                                  ${postTitle}
                              </h5>
      
                              <p>
                                  ${post.body}
                              </p>
      
                              <hr>
      
                              <div>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                      <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                                  </svg>
      
                                  <span>
                                      (${post.comments_count}) Comments
      
                                      <span id="post-tags-${post.id}">
                                      
                                      </span>
                                  </span>
                                  
                              </div>
                          </div>
                      </div>
                  `;

      document.getElementById("post-user").innerHTML += content;
    }
  });
}

function Addreview() {
  let postModal = new bootstrap.Modal(
    document.getElementById("review-modal"),
    {}
  );
  postModal.toggle();
}

function Givereview() {
  const body = document.getElementById("review-body").value;
  const name = document.getElementById("review-name").value;
  const courseName = document.getElementById("review-course-name").value;

  let params = {
    body: body,
    name: name,
    course_name: courseName,
  };

  axios
    .post(`https://tarmeezacademy.com/api/v1/courseReviews`, params)
    .then((Response) => {
      const modal = document.getElementById("review-modal");
      console.log(Response);
      const modalinstance = bootstrap.Modal.getInstance(modal);
      modalinstance.hide();
      ShowAlert("Review Sent Successfully", "success");
      setupUI();
    })
    .catch((error) => {
      ShowAlert(error.response.data.message, "danger");
    });
}

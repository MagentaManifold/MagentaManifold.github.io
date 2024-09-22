import {
  getImage,
  addImage,
  deleteImage,
  addComment,
  deleteComment,
  getFirstImageId,
  getPrevImageId,
  getNextImageId,
  getComments,
} from "./api.mjs";

let currentImageId = getFirstImageId();
let prevImageId = getPrevImageId(currentImageId);
let nextImageId = getNextImageId(currentImageId);

let commentPageNo = 0;

const prevImageBtn = document.getElementById("previous-image");
const nextImageBtn = document.getElementById("next-image");
const prevCommentsBtn = document.getElementById("previous-comments");
const nextCommentsBtn = document.getElementById("next-comments");

function update() {
  if (currentImageId === null) {
    currentImageId = getFirstImageId();
  }
  prevImageId = getPrevImageId(currentImageId);
  nextImageId = getNextImageId(currentImageId);

  //check if at least one image exists, show/hide components accordingly.
  if (currentImageId === null) {
    for (const elmt of document.getElementsByClassName("requires-image")) {
      elmt.style.display = "none";
    }
    document.getElementById("no-image").style.display = "block";
    document.querySelector("#add-image .toggle-show input").checked = true;
    return;
  }

  for (const elmt of document.getElementsByClassName("requires-image")) {
    elmt.style.display = "block";
  }
  document.getElementById("no-image").style.display = "none";

  //enable/disable image navigation buttons
  if (prevImageId === null) {
    prevImageBtn.disabled = true;
    prevImageBtn.title = "No newer images";
  } else {
    prevImageBtn.disabled = false;
    prevImageBtn.title = "Previous image";
  }

  if (nextImageId === null) {
    nextImageBtn.disabled = true;
    nextImageBtn.title = "No older images";
  } else {
    nextImageBtn.disabled = false;
    nextImageBtn.title = "Next image";
  }

  //set state of comment related components
  const comments = getComments(currentImageId);
  const commentCount = comments.length;

  if (commentCount == 0) {
    document.getElementById("no-comment").style.display = "block";
  } else {
    document.getElementById("no-comment").style.display = "none";
  }

  if (commentPageNo === 0) {
    prevCommentsBtn.disabled = true;
    prevCommentsBtn.title = "No newer comments";
  } else {
    prevCommentsBtn.disabled = false;
    prevCommentsBtn.title = "Newer comments";
  }

  if ((commentPageNo + 1) * 10 >= commentCount) {
    nextCommentsBtn.disabled = true;
    nextCommentsBtn.title = "No older comments";
  } else {
    nextCommentsBtn.disabled = false;
    nextCommentsBtn.title = "Older comments";
  }

  //display image
  const image = getImage(currentImageId);

  document.getElementById("image").src = image.url;
  document.getElementById("image").alt = image.title + " by " + image.author;
  document.getElementById("title").innerText = image.title;
  document.getElementById("author").innerText = image.author;
  document.getElementById("upload-date").innerText =
    image.date.toLocaleString();

  //display comments
  document.getElementById("comment-list").innerHTML = "";
  for (const comment of comments.slice(
    commentPageNo * 10,
    (commentPageNo + 1) * 10,
  )) {
    const elmt = document.createElement("div");
    elmt.className = "comment neumorphism-out";
    elmt.innerHTML = `
      <div class="avatar"></div>
        <div class="comment-container">
          <div class="author-and-date">
            <div class="username">${comment.author}</div>
            <div class="comment-date">${comment.date.toLocaleString()}</div>
          </div>
          <div class="comment-content">${comment.content}</div>
        </div>
        <button
          type="button"
          title="Delete this comment"
          class="btn-round btn-delete"
        ></button>
    `;
    elmt.querySelector(".btn-delete").addEventListener("click", () => {
      deleteComment(comment.commentId);
      update();
    });
    document.getElementById("comment-list").appendChild(elmt);
  }
}

//form submission
const addImageForm = document.querySelector("#add-image-form");
addImageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = addImageForm.querySelector("#image-title-input").value;
  const author = addImageForm.querySelector("#image-author-input").value;
  const url = addImageForm.querySelector("#image-url-input").value;
  currentImageId = addImage(title, author, url);
  addImageForm.reset();

  update();
});

const addCommentForm = document.querySelector("#add-comment-form");
addCommentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const author = addCommentForm.querySelector("#comment-author-input").value;
  const content = addCommentForm.querySelector("#comment-content-input").value;
  addComment(currentImageId, author, content);
  commentPageNo = 0;
  addCommentForm.reset();

  update();
});

//Previous/next buttons
prevImageBtn.addEventListener("click", () => {
  currentImageId = prevImageId;
  update();
});

nextImageBtn.addEventListener("click", () => {
  currentImageId = nextImageId;
  update();
});

prevCommentsBtn.addEventListener("click", () => {
  commentPageNo--;
  update();
});

nextCommentsBtn.addEventListener("click", () => {
  commentPageNo++;
  update();
});

//delete image
document.getElementById("delete-image").addEventListener("click", () => {
  deleteImage(currentImageId);
  if (nextImageId != null) {
    currentImageId = nextImageId;
  } else {
    currentImageId = prevImageId;
  }
  update();
});

update();

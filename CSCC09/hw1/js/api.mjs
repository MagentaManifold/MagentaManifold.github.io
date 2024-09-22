/*  ******* Data types *******
    image objects must have at least the following attributes:
        - (Number) imageId 
        - (String) title
        - (String) author
        - (String) url
        - (Date) date

    comment objects must have the following attributes
        - (Number) commentId
        - (Number) imageId
        - (String) author
        - (String) content
        - (Date) date

****************************** */

/**
 * @typedef {Object} Image
 * @property {number} imageId
 * @property {string} title
 * @property {string} author
 * @property {string} url
 * @property {Date} date
 */

/**
 * @typedef {Object} Comment
 * @property {number} commentId
 * @property {number} imageId
 * @property {string} author
 * @property {string} content
 * @property {Date} date
 */

/**
 * @typedef {Object} Gallery
 * @property {number} nextImageId
 * @property {number} nextCommentId
 * @property {Array<Image>} images
 * @property {Array<Comment>} comments
 */

/**
 * Saves the gallery data to localStorage.
 * @param {Gallery} gallery
 */
function saveData(gallery) {
  localStorage.setItem("gallery", JSON.stringify(gallery));
}

/**
 * Retrieves the gallery data from localStorage.
 * @returns {Gallery}
 */
function getData() {
  return JSON.parse(localStorage.getItem("gallery"), (key, value) => {
    if (key === "date") {
      return new Date(value);
    }
    return value;
  });
}

function reverseDateCmp(a, b) {
  return b.date - a.date;
}

if (!localStorage.getItem("gallery")) {
  saveData({ nextImageId: 0, nextCommentId: 0, images: [], comments: [] });
}

/**
 * get image by id
 * @param {number} imageId
 */
export function getImage(imageId) {
  const images = getData().images;
  const img = images.find((img) => img.imageId === imageId);
  if (img === undefined) {
    return null;
  }
  return img;
}

export function getFirstImageId() {
  const images = getData().images;
  if (images.length === 0) {
    return null;
  }
  return images[0].imageId;
}

export function getPrevImageId(imageId) {
  const images = getData().images;
  const index = images.findIndex((img) => {
    return img.imageId === imageId;
  });
  if (index === -1) {
    return null;
  }
  if (index === 0) {
    return null;
  }
  return images[index - 1].imageId;
}

export function getNextImageId(imageId) {
  const images = getData().images;
  const index = images.findIndex((img) => {
    return img.imageId === imageId;
  });
  if (index === -1) {
    return null;
  }
  if (index === images.length - 1) {
    return null;
  }
  return images[index + 1].imageId;
}

/**
 * Add an image to the gallery
 * @param {string} title
 * @param {string} author
 * @param {string} url
 * @returns {number}
 */
export function addImage(title, author, url) {
  const gallery = getData();
  let imageId = gallery.nextImageId;
  gallery.images.push({
    imageId,
    title,
    author,
    url,
    date: Date.now(),
  });
  gallery.nextImageId++;
  gallery.images.sort(reverseDateCmp);
  saveData(gallery);
  return imageId;
}

/**
 * Delete an image from the gallery given its imageId
 * @param {number} imageId
 */
export function deleteImage(imageId) {
  const gallery = getData();
  gallery.images = gallery.images.filter((img) => {
    return img.imageId !== imageId;
  });
  gallery.images.sort(reverseDateCmp);
  gallery.comments = gallery.comments.filter((comment) => {
    return comment.imageId !== imageId;
  });
  gallery.comments.sort(reverseDateCmp);
  saveData(gallery);
}

export function getComments(imageId) {
  const comments = getData().comments;
  return comments
    .filter((comment) => {
      return comment.imageId === imageId;
    })
    .sort(reverseDateCmp);
}
/**
 * Add a comment to an image
 * @param {number} imageId
 * @param {string} author
 * @param {string} content
 */
export function addComment(imageId, author, content) {
  const gallery = getData();
  let commentId = gallery.nextCommentId;
  gallery.comments.push({
    commentId,
    imageId,
    author,
    content,
    date: Date.now(),
  });
  gallery.nextCommentId++;
  gallery.comments.sort(reverseDateCmp);
  saveData(gallery);
}

/** Delete a comment to an image
 * @param {number} commentId
 */
export function deleteComment(commentId) {
  const gallery = getData();
  gallery.comments = gallery.comments.filter((comment) => {
    return comment.commentId !== commentId;
  });
  gallery.comments.sort(reverseDateCmp);
  saveData(gallery);
}

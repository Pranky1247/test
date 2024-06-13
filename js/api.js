// For each comment inside comment_list, we have
//              commentID
//              imageID
//              author
//              content
//              date
// 
// For each image inside image_list, we have 
//              id
//              title
//              author
//              url
//              date
export function empty_gallery(){
    // This function will return true if and only if the gallery if empty. 
    return get_images().then(image_list => image_list.length === 0);
}
export function add_image(title, author, file) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('imageFile', file);

    return fetch("http://127.0.0.1:3000/api/images", {
      method: "POST",
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }).then(newIndex => {
        return newIndex;
    }).catch(error => {
        console.error("Error in add_image:", error);
        return -1;
    });
  }
export function get_images() {
    // Send a HTTP GET request to our server at port 3000. 
    return fetch('http://127.0.0.1:3000/api/images').then(response => {
        // If the HTTP GET request failed, we shall print an error message. 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }).then(data => {
        return data;
      }).catch(error => {
        console.error("Error: get_images().\n", error);
        return [];
      });
}
export function delete_image(index) {
    return get_images()
        .then(image_list => {
            if (index < 0 || index >= image_list.length) {
                throw new Error('Invalid image index');
            }
            const imageID = image_list[index].id;
            return fetch(`http://127.0.0.1:3000/api/images/${imageID}`, {
                method: 'DELETE'
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return 0; // Success
        })
        .catch(error => {
            console.error("Error: delete_image().\n", error);
            return -1; // Failure
        });
}


export function add_comment(author, comment_content, image_index) {
    // This function will add a comment for the image that sits at the given index.
    // On success, return 0;
    // On failure, return -1.

    // Fetch image list from the server
    return get_images()
        .then(image_list => {
            if (image_index < 0 || image_index >= image_list.length) {
                throw new Error('Invalid image index');
            }

            const imageID = image_list[image_index].id;
            const today = new Date();
            const comment = {
                imageID,
                author,
                content: comment_content,
                date: today.toISOString().split('T')[0]
            };

            return fetch('http://127.0.0.1:3000/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(comment)
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => 0)
        .catch(error => {
            console.error("Error: add_comment().\n", error);
            return -1;
        });
}


export function delete_comment(comment_ID) {
    return fetch(`http://127.0.0.1:3000/api/comments/${comment_ID}`, {
      method: "DELETE"
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return 0; // Success
    })
    .catch(error => {
      console.error("Error in delete_comment:", error);
      return -1; // Failure
    });
  }





































export function get_comments_for_image(image_index) {
    // This function will return a comment list such that all comments inside are associated with the given image index.
    // The given image_index should be an integer.
    return get_images()
        .then(image_list => {
            if (image_index < 0 || image_index >= image_list.length) {
                throw new Error('Invalid image index');
            }
            const imageID = image_list[image_index].id;
            return fetch(`http://127.0.0.1:3000/api/comments/${imageID}`);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => data)
        .catch(error => {
            console.error("Error: get_comments_for_image().\n", error);
            return [];
        });
}


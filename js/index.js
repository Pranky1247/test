import * as api from "./api.js";
// All comments refer to codes below them. 

// Note:
//      At the very beginning.
//      All window's opacity IS 0.
//      ADD IMAGE WINDOW's position IS absolute.

function empty_gallery_UI_flow(){
    // This function shall only be called after the user submitted the FIRST image. 

    // We will first set add_image_form_container's opacity = 0.
    // Then after the transition, the TEF will handle everything for us. 
    add_image_form_container.style.opacity = "0";
}

function non_empty_gallery_UI_flow(){
    gallery_picture.style.opacity = "0"; 
    gallery_picture.offsetHeight;
    moving_bar_0.style.animation = "rotate-0 1s linear infinite";
    moving_bar_1.style.animation = "rotate-1 1s linear infinite";
    add_image_form_container.style.position = "relative";
    alert_string.textContent = "Let's add more images!";
    api.get_images().then(images => {
        update_image_info_section(images, images.length - 1);
        // Change the header string's color to white. 
        alert_string.style.color = "white";
        gallery_picture.style.opacity = "1"; 
    });
}

function change_bar_flow(i){
    // i stands for indicator.
    // If i == 0, we slow down the moving bars and change their color to white.
    // If i == 1, we speed up the moving bars and change their color to red. 
    if(i == 0){
        moving_bar_0.style.backgroundImage = "conic-gradient(transparent 180deg, transparent 90deg, transparent 0deg, white)";
        moving_bar_1.style.backgroundImage = "conic-gradient(white, transparent 180deg, transparent 90deg, transparent 0deg)";
        moving_bar_0.style.animation = "rotate-0 10s linear infinite";
        moving_bar_1.style.animation = "rotate-1 10s linear infinite";
    }else if(i == 1){
        moving_bar_0.style.backgroundImage = "conic-gradient(transparent 180deg, transparent 90deg, transparent 0deg, red)";
        moving_bar_1.style.backgroundImage = "conic-gradient(red, transparent 180deg, transparent 90deg, transparent 0deg)";
        moving_bar_0.style.animation = "rotate-0 1s linear infinite";
        moving_bar_1.style.animation = "rotate-1 1s linear infinite";
    }

}
function update_comment_into_containerUI(i_th){
    // This function will add comment entities that are associated with the current image into the comment container.
    // Note: You should first call api.add_comment() to store the comment first. THEN call this function to update it. 
    // Note: i_th means the i th 10 comments. If i is not given, we load the first 10 comments on default. 
    // Note: If i_th is given, then we load the i th 10 comments into the comments container. 
    let comments_total = -1;
    api.get_comments_for_image(current_index).then(comment_list =>{
        if(comment_list.length === 0){
            while(comment_container.firstChild){
                comment_container.removeChild(comment_container.firstChild);
            }
            return; 
        }
        if(!i_th){
            comments_total = comment_list.length;
        }else{
            comments_total = comment_list.length - ((i_th - 1) * 10);
        }
        // We first clean the comment container. 
        while(comment_container.firstChild){
            comment_container.removeChild(comment_container.firstChild);
        }
        // Start.
        let s = comments_total - 1;
        if(s > (comment_list.length - 1)){
            s = comment_list.length - 1; 
        }
        // End.
        let e = comments_total - 10;
        if(e < 0){
            e = 0;
        }
        for(let i = s; i >= e ; i--){
            let comment = comment_list[i];
            make_comment(comment.author, comment.date, comment.content, comment.id);
            comment_container.scrollTop = 0;
        }
    });
}
function update_image_info_section(images, index){
    // This function will udpate the image info section AND the current image based on the given index. 
    // This function and the function delete_image_button_function() are the ONLY two functions that can change the global variable 'current_index'. 
    // IF images === -1 === index === -1
    //      In this case, it means the user just deleted the LAST image in the gallery.
    if(images === -1 && index === -1){
        image_info_title.textContent = "Title: None";
        image_info_author.textContent = "Author: None";
        image_info_total_number.textContent = "Total: None";
        current_image.src = "";
        return; 
    }
    image_info_title.textContent = "Title: " + images[index].title;
    image_info_author.textContent = "Author: " + images[index].author;
    image_info_total_number.textContent = "Total: " + images.length;
    current_image.src = `data:image/png;base64,${images[index].fileData}`;
    current_index = index;
}
// -------------------------------------------------------------------------------------------------------------------------
// <<< Button Click Event Functions>>>
function add_image_form_submit_button_funtion(event){
    // Prevent the buffon from refreshing the page after being clicked. 
    // This also prevent other default actions, like alerting empty requried input fields. 
    event.preventDefault();
    let title = add_image_form_title_input_field.value;
    let author = add_image_form_author_input_field.value;
    // Attribute 'url' is now an actual file now.
    let url = add_image_form_url_input_field.files[0];
    // We use alert() function to alert since the dafault laerting feature is disabled by us. 
    if(title == "" || author == "" || !add_image_form_url_input_field.files[0]){
        alert("Please fill in all required fields.");
        return;
    }
    // Store the information using API's service. 
    change_bar_flow(1);
    api.add_image(title, author, url).then(index => {
        if(start === 1){
            empty_gallery_UI_flow();
        }else{
            api.get_images().then(images => {
                add_image_form_title_input_field.value = "";
                add_image_form_author_input_field.value = "";
                add_image_form_url_input_field.value = "";
                image_info_title.textContent = "Title: " + images[images.length - 1].title;
                image_info_author.textContent = "Author: " + images[images.length - 1].author;
                image_info_total_number.textContent = "Total: " + images.length;
                current_image.src = `data:image/png;base64,${images[images.length - 1].fileData}`;
                current_index = images.length - 1;
                update_comment_into_containerUI(); 
                change_bar_flow(0);
            });
        }
    }).catch(error => {
        console.log("Error is: " + error);
    });
}

function add_image_button_function(){
    if(add_image_form_container.style.opacity === "1"){
        add_image_form_container.style.opacity = "0"; 
    }else{
        add_image_form_container.style.opacity = "1"; 
    }
}

function previous_image_button_function(){
    change_bar_flow(1);
    api.get_images().then(images =>{
        if(current_index - 1 >= 0){
            update_image_info_section(images, current_index - 1);
            update_comment_into_containerUI();
        }else{
            update_image_info_section(images, images.length - 1);
            update_comment_into_containerUI();
        }
        change_bar_flow(0);
    });
}

function delete_image_button_function(){
    change_bar_flow(1);
    api.delete_image(current_index).then(data => {
        api.get_images().then(images => {
            if(images.length === 0){
                update_image_info_section(-1, -1);
                gallery_container.style.opacity = "0"; 
            }else{
                if(current_index === images.length){
                    current_index -= 1;
                }
                update_image_info_section(images, current_index);
                update_comment_into_containerUI();
            }
            change_bar_flow(0);
        });        
    });
}

function next_image_button_function(){
    change_bar_flow(1);
    api.get_images().then(images => {
        if(current_index + 1 < images.length){
            update_image_info_section(images, current_index + 1);
            update_comment_into_containerUI();
            
        }else{
            update_image_info_section(images, 0);
            update_comment_into_containerUI();
        }
        change_bar_flow(0);
    });
}

function add_comment_button_function(e){
    e.preventDefault();
    if(!comment_container.firstChild || (comment_container.firstChild && comment_container.firstChild.id != "add-comment-form")){
        let form = make_comment_form();
        comment_container.insertBefore(form, comment_container.firstChild);
        comment_container.scrollTop = 0;
    }else if(comment_container.firstChild && comment_container.firstChild.id === "add-comment-form"){
        comment_container.removeChild(comment_container.firstChild);
        comment_container.scrollTop = 0;
    }
}

function add_comment_form_cancel_button_function(){
    if(comment_container.firstChild.id === "add-comment-form"){
        comment_container.removeChild(comment_container.firstChild);
    }
}

function add_comment_form_submit_button_function(){
    // Please note that, as long as this button CAN be clicked, the add-comment-form will always exist. 
    let author = document.getElementById("add-comment-form-author-input-field").value;
    let content = document.getElementById("add-comment-form-content-input-field").value;
    if(!author || !content){
        alert("Please fill in required fields.");
        return;
    }
    change_bar_flow(1);
    api.add_comment(author, content, current_index).then(data => {
        comment_container.removeChild(comment_container.firstChild);
        update_comment_into_containerUI();
        change_bar_flow(0);
    });
}

function delete_comment_button_function(event){
    change_bar_flow(1);
    let ID = event.target.parentElement.dataset.commentId;
    api.delete_comment(parseInt(ID.trim())).then(data => {
        update_comment_into_containerUI();
        change_bar_flow(0);
    });
}

function previous_ten_comments_button_function(){
    change_bar_flow(1);
    if(i_th_10 != 1){
        update_comment_into_containerUI(i_th_10 - 1);
        i_th_10 -= 1;
        change_bar_flow(0);
    }
}

function next_ten_comments_button_function(){
    change_bar_flow(1);
    // let comment_list = api.get_comments_for_image(current_index);
    api.get_comments_for_image(current_index).then(comment_list =>{
        if((((i_th_10 + 1) * 10) - comment_list.length) < 10){
            update_comment_into_containerUI(i_th_10 + 1);
            i_th_10 += 1;
        }
        change_bar_flow(0);
    });
}
// <<< Button Click Event Functions>>>
// -------------------------------------------------------------------------------------------------------------------------

function make_comment_form(){
    // This function will create a form that allow users to add a comment. 
    let comment_form = document.createElement("form");
    let author_label = document.createElement("label");
    let author_input = document.createElement("input");
    let content_label = document.createElement("label");
    let content_input = document.createElement("textarea");
    let button_container = document.createElement("div");
    let submit_button = document.createElement("button");
    let cancel_button = document.createElement("button");
    comment_form.id = "add-comment-form"; 
    author_label.id = "add-comment-form-author-label";
    author_label.classList.add("add-comment-form-label");
    author_input.id = "add-comment-form-author-input-field";
    author_input.classList.add("add-comment-form-input-field");
    author_input.type = "text";
    content_label.id = "add-comment-form-content-label"; 
    content_label.classList.add("add-comment-form-label");
    content_input.id = "add-comment-form-content-input-field"; 
    content_input.classList.add("add-comment-form-input-field");
    button_container.id = "add-comment-form-button-container";
    submit_button.id = "add-comment-form-submit-button"; 
    submit_button.type = "button";
    cancel_button.id = "add-comment-form-cancel-button"; 
    cancel_button.type = "button"; 
    author_label.textContent = "Author";
    content_label.textContent = "Content";
    submit_button.textContent = "Submit";
    cancel_button.textContent = "Cancel";
    comment_form.appendChild(author_label);
    comment_form.appendChild(author_input);
    comment_form.appendChild(content_label);
    comment_form.appendChild(content_input);
    comment_form.appendChild(button_container);
    button_container.appendChild(submit_button);
    button_container.appendChild(cancel_button);
    submit_button.addEventListener("click", add_comment_form_submit_button_function);
    cancel_button.addEventListener("click", add_comment_form_cancel_button_function);
    return comment_form;
}

function add_image_form_container_TEF(){
    // TEF means Transition End Function. 

    // After the user added the very FIRST image and the add image form fully disappeared. 
    if(start === 1 && add_image_form_container.style.opacity === "0"){

        // We increase the moving bar running speed. 
        moving_bar_0.style.animation = "rotate-0 1s linear infinite";
        moving_bar_1.style.animation = "rotate-1 1s linear infinite";
        moving_bar_0.style.backgroundImage = "conic-gradient(transparent 180deg, transparent 90deg, transparent 0deg, red)";
        moving_bar_1.style.backgroundImage = "conic-gradient(red, transparent 180deg, transparent 90deg, transparent 0deg)";
        // We first clean the form. 
        add_image_form_title_input_field.value = "";
        add_image_form_author_input_field.value = "";
        add_image_form_url_input_field.value = "";
        // Change the header string. 
        alert_string.textContent = "Let's add more images!";
        // Change the header string's color to white. 
        alert_string.style.color = "white";
        add_image_form_container.style.position = "relative";
        // We update the image information section. (We always show the most-recent image).
        // The current_index will be 0 since we just added our very FIRST image. 
        // let images = api.get_images();
        api.get_images().then(images =>{
            current_index = 0; 
            update_image_info_section(images, 0);
            // We show the image window first. 
            gallery_picture.style.opacity = "1";
        });
    
    // After the user added the very FIRST image and after the image windows shows up. 
    }else if(start === 1 && gallery_picture.style.opacity === "1" && add_image_form_container.style.opacity === "1"){
        // We show the comments windows. 
        update_comment_into_containerUI();
        comments_container.style.opacity = "1";
    }
}

function gallery_image_TEF(){
    // TEF means Transition End Function. 

    if(gallery_picture.style.opacity === "1" && start === 1){
        // After the image window shows up, we show the image info window. 
        image_info_container.style.opacity = "1";
    }
}

function comments_container_TEF(){
    // TEF means Transition End function. 
    // This is the end of the starting UI flow. 
    if(start === 1 && comments_container.style.opacity === "1"){
        // Shows up the add image button. 
        add_image_button.style.opacity = "1";
    }
}

function image_info_container_TEF(){
    // TEF means Transition End Function. 

    if(start === 1 &&  image_info_container.style.opacity === "1"){
        add_image_form_container.style.opacity = "1";
    }
}

function add_image_button_TEF(){
    // TEF means Transition End Function. 

    if(start === 1 && add_image_button.style.opacity === "1"){
        previous_image_button.style.opacity = "1";
    }
}

function previous_image_button_TEF(){
    // TEF means Transition End Function. 

    if(start === 1 && previous_image_button.style.opacity === "1"){
        delete_image_button.style.opacity = "1";
    }
}

function delete_image_button_TEF(){
    // TEF means Transition End Function. 

    if(start === 1 && delete_image_button.style.opacity === "1"){
        next_image_button.style.opacity = "1";
    }
}

function next_image_button_TEF(){
    // TEF means Transition End Function. 

    if(start === 1 && next_image_button.style.opacity === "1"){
        add_comment_button.style.opacity = "1";
    }
}

function add_comment_button_TEF(){
    if(start === 1 && add_comment_button.style.opacity === "1"){
        previous_ten_comments_button.style.opacity = "1";
    }
}

function gallery_container_TEF(event){
    // TEF means Transition End Function. 
    // After the user delete the last image in the gallery, after the gallery container fully disappeared. 
    if(start === 0 && gallery_container.style.opacity === "0" && event.target === gallery_container){
        add_image_form_container.style.position = "absolute";
        moving_bar_0.style.backgroundImage = "conic-gradient(transparent 180deg, transparent 90deg, transparent 0deg, red)";
        moving_bar_1.style.backgroundImage = "conic-gradient(red, transparent 180deg, transparent 90deg, transparent 0deg)";
        moving_bar_0.style.animation = "rotate-0 1s linear infinite";
        moving_bar_1.style.animation = "rotate-1 1s linear infinite";
        alert_string.textContent = "Let's add your first image!";
        alert_string.style.color = "red";



        comments_container.style.display = "none";
        current_image.style.display = "none";
        add_image_button.style.display = "none";
        previous_image_button.style.display = "none";
        next_image_button.style.display = "none";
        delete_image_button.style.display = "none";
        image_info_container.style.display = "none";
        add_comment_button.style.display = "none";
        previous_ten_comments_button.style.display = "none";
        next_ten_comments_button.style.display = "none"



        comments_container.style.opacity = "0";
        current_image.style.opacity = "0";
        add_image_button.style.opacity = "0";
        previous_image_button.style.opacity = "0";
        next_image_button.style.opacity = "0";
        delete_image_button.style.opacity = "0";
        image_info_container.style.opacity = "0";
        add_comment_button.style.opacity = "0";
        previous_ten_comments_button.style.opacity = "0";
        next_ten_comments_button.style.opacity = "0"

        start = 1;
        gallery_container.style.opacity = "1";
    }else if(start === 1 && gallery_container.style.opacity === "1" && event.target === gallery_container){
        comments_container.style.display = "block";
        current_image.style.display = "block";
        add_image_button.style.display = "block";
        previous_image_button.style.display = "block";
        next_image_button.style.display = "block";
        delete_image_button.style.display = "block";
        add_comment_button.style.display = "block";
        previous_ten_comments_button.style.display = "block";
        next_ten_comments_button.style.display = "block"
        image_info_container.style.display = "flex";
        moving_bar_0.style.animation = "rotate-0 10s linear infinite";
        moving_bar_1.style.animation = "rotate-1 10s linear infinite";
    }
}

function make_comment(author, date, content, comment_id){
    // This function will make and return a comment entity(HTML element). 
    let comment_entity = document.createElement("div");
    let comment_info = document.createElement("div");
    let comment_bdoy = document.createElement("div");
    comment_entity.appendChild(comment_info);
    comment_entity.appendChild(comment_bdoy);
    comment_entity.id = "comment-entity"; 
    comment_info.id = "comment-info";
    comment_bdoy.id = "comment-body";
    comment_info.textContent = author + " on " + date;
    comment_bdoy.textContent = content;
    comment_entity.dataset.commentId = comment_id;
    comment_entity.style.cursor = "pointer";
    comment_container.appendChild(comment_entity);
    let comment_delete_button = document.createElement("button");
    comment_delete_button.classList.add("comment-delete-button");
    comment_delete_button.textContent = "Delete"; 
    comment_delete_button.addEventListener("click", delete_comment_button_function);
    comment_entity.addEventListener("click", function(){
        let entity_style = window.getComputedStyle(comment_entity);
        if(entity_style.borderColor === "rgb(255, 255, 255)"){
            comment_entity.style.border = "solid 2px red";
        }else{
            comment_entity.style.border = "solid 2px white";            
        }
        // Here, after the user click on this comment entity, we want to get rid of those red borders for other comment entities. 
        for(let i = 0; i < comment_container.childElementCount; i++){
            let child = comment_container.children[i];
            if(child.id === "comment-entity" && (child.dataset.commentId !== comment_entity.dataset.commentId)){
                if(child.style.border != "solid 2px white"){
                    child.style.border = "solid 2px white";
                    for(let k = 0; k < child.children.length; k++){
                        let item = child.children[k];
                        if(item.classList.contains("comment-delete-button")){
                            child.removeChild(item);
                        }
                    }
                }
            }
        }
        if(entity_style.borderColor === "rgb(255, 255, 255)"){
            comment_entity.removeChild(comment_delete_button);
        }else{
            comment_entity.appendChild(comment_delete_button);
        }
    });
    return comment_entity;
}

function previous_ten_comments_button_TEF(){
    if(start === 1 && previous_ten_comments_button.style.opacity === "1"){
        next_ten_comments_button.style.opacity = "1"; 
    }
}

function next_ten_comments_button_TEF(){
    if(start === 1 && next_ten_comments_button.style.opacity === "1"){
        moving_bar_0.style.backgroundImage = "conic-gradient(transparent 180deg, transparent 90deg, transparent 0deg, white)";
        moving_bar_1.style.backgroundImage = "conic-gradient(white, transparent 180deg, transparent 90deg, transparent 0deg)";
        moving_bar_0.style.animation = "rotate-0 10s linear infinite";
        moving_bar_1.style.animation = "rotate-1 10s linear infinite";
        start = 0;
    }
}

function initialize(i){
    // i means indicator, we use it to indicate whether or not we should upload some prepared images. 
    // i = 0
    //      We don't load any images, the gallery will be empty. 
    // i = 1
    //      We load two images, the gallery will not be empty.
    if(i === 1){
        api.add_image("Lady", "Lin_0", "./media/i0.jpeg");
        api.add_image("Sun", "Lin_1", "./media/i1.jpeg");
    }
    add_image_form_submit_button.addEventListener("click", add_image_form_submit_button_funtion);
    add_image_button.addEventListener("click", add_image_button_function);
    add_image_button.addEventListener("transitionend", add_image_button_TEF);
    add_image_form_container.addEventListener("transitionend", add_image_form_container_TEF);
    gallery_picture.addEventListener("transitionend", gallery_image_TEF);
    comments_container.addEventListener("transitionend", comments_container_TEF);
    image_info_container.addEventListener("transitionend",  image_info_container_TEF);
    previous_image_button.addEventListener("transitionend", previous_image_button_TEF);
    previous_image_button.addEventListener("click", previous_image_button_function);
    next_image_button.addEventListener("transitionend", next_image_button_TEF);
    next_image_button.addEventListener("click", next_image_button_function);
    delete_image_button.addEventListener("transitionend", delete_image_button_TEF);
    delete_image_button.addEventListener("click", delete_image_button_function);
    gallery_container.addEventListener("transitionend", gallery_container_TEF);
    add_comment_button.addEventListener("transitionend", add_comment_button_TEF);
    add_comment_button.addEventListener("click", add_comment_button_function);
    previous_ten_comments_button.addEventListener("transitionend", previous_ten_comments_button_TEF);
    previous_ten_comments_button.addEventListener("click", previous_ten_comments_button_function);
    next_ten_comments_button.addEventListener("transitionend", next_ten_comments_button_TEF);
    next_ten_comments_button.addEventListener("click", next_ten_comments_button_function);

}

function main(){
    // First we initialize elements like adding an event listener for buttons. 
    initialize(0); 
    // If the gallery is not empty, we start the non_empty_gallery_UI_flow.
    // If the gallery IS EMPTY, we will start the empty_gallery_UI_flow when the 'submit' button is clicked.
    api.empty_gallery().then(data=>{
        // If empty
        if(data){
            add_image_form_container.style.opacity = "1";
        }else{
            non_empty_gallery_UI_flow();
        }
    });
}

// ===============================================================================================================================================================
// First we get a collection of referrences of our UI components for future use. 

// This vatiable controls what will happen after the add image window disappear.
// Please refer to function add_image_form_submit_button_TEF for more information. 
let start = 1;
let current_index = 0;
// This has to stay -1 if not used. 
let to_be_deleted_comment_id = -1;
// We load the first 10 comments on default. 
let i_th_10 = 1; 
// This contains both the form section AND the message section. 
let add_image_form_container = document.getElementById("add-image-form-container");
let add_image_form_submit_button = document.getElementById("add-image-form-submit-button");
let add_image_form_title_input_field = document.getElementById("add-image-form-title-input-field");
let add_image_form_author_input_field = document.getElementById("add-image-form-author-input-field");
let add_image_form_url_input_field = document.getElementById("add-image-form-url-input-field");
let gallery_picture = document.getElementById("gallery-picture");
let comments_container = document.getElementById("comments-container");
let moving_bar_0 = document.getElementById("moving-bar-0");
let moving_bar_1 = document.getElementById("moving-bar-1");
let add_image_button = document.getElementById("add-image-button");
let alert_string = document.getElementById("alert-string");
let image_info_container = document.getElementById("image-info-container");
let previous_image_button = document.getElementById("previous-image-button");
let next_image_button = document.getElementById("next-image-button");
let delete_image_button = document.getElementById("delete-image-button");
let image_info_title = document.getElementById("image-info-title");
let image_info_author = document.getElementById("image-info-author");
let image_info_total_number = document.getElementById("image-info-total-number");
let current_image = document.getElementById("gallery-picture");
let gallery_container = document.getElementById("gallery-container");
let comment_container = document.getElementById("comments-container");
let add_comment_button = document.getElementById("add-comment-button");
let previous_ten_comments_button = document.getElementById("previous-ten-comments-button");
let next_ten_comments_button = document.getElementById("next-ten-comments-button");
// Call the main function. 
document.addEventListener("DOMContentLoaded", () => {
    main();
});

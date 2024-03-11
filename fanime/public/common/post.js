$(document).ready(function(){
    $("#submit-post").click(function(){
        var postData = {
            title: $("#post-title").val(),
            date: "5hrs ago",//will get the date and make a function for this
            genre: $("#post-genre").val(),
            description: $("#post-description").val(),
            image:"https://cdn.pixabay.com/photo/2023/12/07/11/11/girl-8435340_1280.png"
        };
        
        console.log("hi");
        $.post('create_post', postData,
        function(data, status){
          if(status === 'success'){
            let post_content = `<div class="post">
                <div class="post-header">
                    <div class="post-title">
                        <h2>${data.title}</h2>
                    </div>
                    <h4>${data.genre}</h4>
                    <div class="post-profile">
                        <img src={{post-profile}}>
                    </div>
                    <h4>${data.username}</h4>
                    <h6>${data.date}</h6>
                </div>
                <div class="post-body">${data.description}</div>
                <div class="post-img">
                    <img src=${data.image}>
                </div>
                <div class="post-action">
                    <i class="fa fa-thumbs-up like" data-post-id="${data._id}">${data.like}</i>
                    <i class="fa fa-thumbs-down dislike" id="${data._id}">${data.dislike}</i>
                    <button class="toggle-comment-section">Comments</button>
                </div>
                <div class="comment-section" id="comment-section">
                </div>
            </div>`;
            $('#post-area').append(post_content);
          }//if
        });//fn+post
    });//btn
});//doc
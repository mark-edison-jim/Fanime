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
                    <div class="post-profile">
                        <img src={{post-profile}}>
                    </div>
                    <h4>${data.username}</h4>
                    <h6>${data.date}</h6>
                </div>
                <div class="post-body">${data.description}</div>
                <div class="post-img">
                    <img src=${data.file}>
                </div>
                <div class="post-action">
                    <i class="fa fa-thumbs-up">0</i>
                    <i class="fa fa-thumbs-down">0</i>
                    <button class="toggle-comment-section">Comments</button>
                </div>
                <div class="comment">
                    <form class="comment-form">
                        <textarea placeholder="Write your comment here..."></textarea>
                        <button type="submit"><h4>Comment</h4></button>
                    </form>
                </div>
                <div class="comment-section" id="comment-section">
                </div>
            </div>`;
            $('#post-area').append(post_content);
          }//if
        });//fn+post
    });//btn
});//doc
$(document).ready(function(){
    $("#submit-comment").click(function(){
        var postId = $(".post-head").data('post-id');

        var commentData = {
            comment: $("#comment-data").val(),
            id: postId
        };
        $.post('create_comment', commentData,
        function(data, status){
          if(status === 'success'){
            let comment = `
            <div class="comment-text">
                <div class="comment-user">
                    <p>${data.user}</p>
                </div>
                <p>${data.comment}</p>
            </div>`;
            $('.comment-container').append(comment);
          }//if
        });//fn+post
    });//btn
});//doc
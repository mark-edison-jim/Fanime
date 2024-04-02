function deletecomment(button){
    let text = "Are you sure you want to delete this comment?";
    if (confirm(text) == true) {
        alert("You pressed OK!");

        var commentId = $(button).data("commentid");
        var postId = $(button).closest(".user-post").find(".user-post-title").data("postid");
        console.log(commentId);
        console.log(postId);
        window.location.href = '/delete_comment?post_id=' + postId + '&comment_id=' + commentId;
    } else {
        alert("You canceled!");
    }
}

$(document).ready(function(){
    function checkInputs(){
        return !($("#comment-data").val() === '');
    }
    $("#submit-comment").click(function(){
        if(checkInputs()){
            var postId = $(".noclick-post").data('post-id');
            var commentData = {
                comment: $("#comment-data").val(),
                id: postId
            };
            console.log(commentData);
            $.post('create_comment', commentData,
            function(data, status){
            if(status === 'success'){
                let comment = `
                <div class="comment-text">
                    <div class="comment-user">
                        <p>${data.user}</p>
                    </div>
                    <div class="comment-body">${data.comment}</div>
                </div>`;
                $('.comment-container').append(comment);
                let textarea = document.getElementById('comment-data');
                textarea.value = '';
            }//if
            });//fn+post
        }else{
            window.alert("Please fill out a text area before commenting!");
        }
    });//btn

    $(".edit-comment").click(function() {
        let commentId = $(this).data("commentid");
        let postId = $(this).closest(".user-post").find(".user-post-title").data("postid");
        console.log(commentId);
        window.location.href = '/editcomment?post_id=' + postId + '&comment_id=' + commentId;
    });
});//doc
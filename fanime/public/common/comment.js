$(document).ready(function(){
    function checkInputs(){
        return !($("#comment-data").val() === '');
    }
    $("#submit-comment").click(function(){
        if(checkInputs()){
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
        }else{
            window.alert("Please fill out a text area before commenting!");
        }
    });//btn
});//doc
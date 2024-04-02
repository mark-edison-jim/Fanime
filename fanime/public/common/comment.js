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
});//doc
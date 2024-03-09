$(document).ready(function(){
    $("#submit-comment").click(function(){
        var commentData = {
            text: $("#comment-text").val()
        };
        
        $.post('create_comment', commentData,
        function(data, status){
          if(status === 'success'){
            let comment = `
            <div class="comment-text">
                <div class="comment-user">
                    <p>{commentUser}</p>
                </div>
                <p>${data.comment}</p>
            </div>`;
            $('#comment-section').append(comment);
          }//if
        });//fn+post
    });//btn
});//doc
function deletecomment(button){
    let text = "Are you sure you want to delete this comment?";
    if (confirm(text) == true) {
        alert("Successfully deleted the comment!");

        const commentId = $(button).data("commentid");
        const postId = $(button).closest(".user-post").find(".user-post-title").data("postid");
        console.log(commentId);
        console.log(postId);
        window.location.href = '/delete_comment?post_id=' + postId + '&comment_id=' + commentId;
    }
}

function deletereply(button){
    let text = "Are you sure you want to delete this reply?";
    if (confirm(text) == true) {
        alert("Successfully deleted the reply!");

        const replyId = $(button).data("replyid");
        const commentId = $(button).closest(".user-post").find(".user-post-title").data("commentid");
        const postId = $(button).closest(".user-post").find(".user-post-title").data("postid");
        console.log(replyId);
        console.log("com", commentId);
        console.log(postId);
        window.location.href = '/delete_reply?post_id=' + postId + '&comment_id=' + commentId + '&reply_id=' + replyId;
    }
}

$(document).ready(function(){
    function checkCommentInputs(){
        return !($("#comment-data").val() === '');
    }
    // $("#submit-comment").click(function(){
    //     if(checkCommentInputs()){
    //         var postId = $(".noclick-post").data('post-id');
    //         var commentData = {
    //             comment: $("#comment-data").val(),
    //             id: postId
    //         };
    //         console.log(commentData);
    //         $.post('create_comment', commentData,
    //         function(data, status){
    //         if(status === 'success'){
    //             let comment = `<input type="hidden" id="comment-id-in-post" value="${commentID}">
    //                     <div class="comment-text show-replies"> <!-- Added 'clickable' class -->
    //                         <div class="comment-inner">
    //                             <div class="comment-user">
    //                                 <p>${data.user}</p>
    //                             </div>
    //                             <div class="comment-body">${data.comment}</div>
    //                         </div>  
    //                         <div class="reply-container" style="display: none;">
    //                             <div class="reply-form" >
    //                                     <textarea class="reply-data" placeholder="Write your reply here..." maxlength="250"></textarea>
    //                                     <button class="submit-reply">Reply</button>
    //                             </div>
    //                             {{#if replies.length}}
    //                             <div class="replies">
    //                                 {{#each replies}}
    //                                 <div class="reply">
    //                                     <div class="reply-user">
    //                                         <p>{{user}}</p>
    //                                     </div>
    //                                     <div class="reply-body">{{text}}</div>
    //                                 </div>
    //                                 {{/each}}   
    //                             </div>
    //                             {{/if}}
    //                         </div>
    //                     </div>`;
    //             $('.comment-container').append(comment);
    //             let textarea = document.getElementById('comment-data');
    //             textarea.value = '';
    //         }//if
    //         });//fn+post
    //     }else{
    //         window.alert("Please fill out a text area before commenting!");
    //     }
    // });//btn

    // function checkReplyInput(rep){
    //     return !($(".reply-data").val() === '');
    // }
    // $(".submit-reply").click(function(){
    //     if(checkReplyInput($(this))){
    //         const postId = $(".noclick-post").data('post-id');
    //         const comemntId = $("#comment-id-in-post").val();
    //         console.log("comId", comemntId)
    //         const replyData = {
    //             reply: $(".reply-data").val(),
    //             postId: postId,
    //             commentId: comemntId
    //         };
    //         console.log(replyData);
    //         $.post('create_reply', replyData,
    //         function(data, status){
    //         if(status === 'success'){
    //             console.log("wot");
    //             const reply = `<div class="reply">
    //                 <div class="reply-user">
    //                     <p>${data.user}</p>
    //                 </div>
    //                 <div class="reply-body">${data.reply}</div>
    //             </div>`;
    //             console.log("reply");
    //             console.log(reply);
    //             $('.replies').append(reply);
    //             let textarea = document.getElementById('reply-data');
    //             textarea.value = '';
    //         }//if
    //         });//fn+post
    //     }else{
    //         window.alert("Please fill out a text area before replying!");
    //     }
    // });//btn

    $(".edit-comment").click(function() {
        let commentId = $(this).data("commentid");
        let postId = $(this).closest(".user-post").find(".user-post-title").data("postid");
        console.log(commentId);
        window.location.href = '/editcomment?post_id=' + postId + '&comment_id=' + commentId;
    });

    $(".edit-reply").click(function() {
        let replyId = $(this).data("replyid");
        let commentId = $(this).closest(".user-post").find(".user-post-title").data("commentid");
        let postId = $(this).closest(".user-post").find(".user-post-title").data("postid");
        console.log(commentId);
        window.location.href = '/editreply?post_id=' + postId + '&comment_id=' + commentId + '&reply_id=' + replyId;
    });
});//doc
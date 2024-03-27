$(document).ready(function(){
    function checkInputs(){
        const title = $("#post-title").val();
        const desc = $("#post-description").val();
        const tag = $("#post-genre").val();
        return !(title === "" || desc === "" || tag === null);
    }

    $("#unregButton").click(function(){
        window.alert("Please Login First to access certain features! :)");

    });

    // $("#submit-post").click(function(){
    //     if(checkInputs()){
    //         var postData = {
    //             title: $("#post-title").val(),
    //             date: "5hrs ago",//will get the date and make a function for this
    //             genre: $("#post-genre").val(),
    //             description: $("#post-description").val(),
    //             image:"https://cdn.pixabay.com/photo/2023/12/07/11/11/girl-8435340_1280.png"
    //         };
            
    //         console.log("hi");
    //         $.post('create_post', postData,
    //         function(data, status){
    //           if(status === 'success'){//change post header to something else so it wont loop
    //             let post_content = `<div class="post">
    //                 <div class="post-header">
    //                     <div class="post-title">
    //                         <h2>${data.title}</h2>
    //                     </div>
    //                     <h4>${data.genre}</h4>
    //                     <div class="post-profile">
    //                         <img src={{post-profile}}>
    //                     </div>
    //                     <h4>${data.username}</h4>
    //                     <h6>${data.date}</h6>
    //                 </div>
    //                 <div class="post-body">${data.description}</div>
    //                 <div class="post-img">
    //                     <img src=${data.image}>
    //                 </div>
    //                 <div class="post-action">
    //                     <i class="fa fa-thumbs-up like" data-post-id="${data._id}">${data.like}</i>
    //                     <i class="fa fa-thumbs-down dislike" id="${data._id}">${data.dislike}</i>
    //                     <button class="toggle-comment-section">Comments</button>
    //                 </div>
    //                 <div class="comment-section" id="comment-section">
    //                 </div>
    //             </div>`;
    //             $('#post-area').append(post_content);
    //           }//if
    //         });//fn+post

    //     }else{
    //         window.alert('All fields must be entered before posting ༼ʘ̚ل͜ʘ̚༽');
    //     }
    //     resetPostInputs();
    // });//btn

    $(".post").click(function() {
        var postId = $(this).data("postid");
        window.location.href = '/post?post_id=' + postId;
    });

    $(".user-post-title").click(function() {
        var postId = $(this).data("postid");
        console.log(postId);
        window.location.href = '/post?post_id=' + postId;
    });
        
    $(".topic").click(function() {
        if($(this).val()==="true"){
            var topic = $(this).find("strong").text();
            window.location.href = '/genrefilter?topic=' + topic;
        }else{
            window.alert("Please Login First to access certain features! :)");
        }
    });

    $(".filter-button").click(function() {
        if($(this).val()==="true"){
            var filter = $(this).find("h3").text();
            window.location.href = '/postfilter?filter=' + filter;
        }else{
            window.alert("Please Login First to access certain features! :)");
        }
    });

});//doc
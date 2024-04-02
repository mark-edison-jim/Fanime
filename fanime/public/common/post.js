function deletepost(button){
        let text = "Are you sure you want to delete the post?";
        if (confirm(text) == true) {
            alert("You pressed OK!");

            var postId = $(button).data("postid");
            console.log(postId);
            window.location.href = '/delete_post?post_id=' + postId;
        } else {
            alert("You canceled!");
        }
}

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

    $(".post").click(function(event) {
        if (!$(event.target).closest('.post-action').length) {
            let postId = $(this).data("post-id");
            window.location.href = '/post?post_id=' + postId;
        }
    });

    $(".user-post-title").click(function() {
        var postId = $(this).data("postid");
        console.log(postId);
        window.location.href = '/post?post_id=' + postId;
    });

    $(".edit-post").click(function(event) {
        event.preventDefault();
        let postId = $(this).data("postid");
        console.log(postId);
        window.location.href = '/editpost?post_id=' + postId;
    });

    $(".submit-editpost").click(function() {
        let postId = $(this).data("postid");
        console.log(postId);
        window.location.href = '/submit_edit_post?post_id=' + postId;
    });
        
    $(".topic").click(function() {
        console.log("val", $(this).data("value"));
        if($(this).data("value")===true){
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

});
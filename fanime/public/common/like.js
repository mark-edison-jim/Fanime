$(document).ready(function(){
    $(".like").click(function(){
      let likeData = {
        isLike: true,
        postId: $(this).data('post-id')
      }
      $.post('like', likeData,
      function(data, status){
        if(status === 'success'){
          let likes = parseInt($("#likes").text());
          likes++;
          $("#likes").text(likes);
          console.log('Post liked!');
        }//if
      });//fn+post
    });//btn

    $("#dislike").click(function(){
      // Increment the value of dislikes
      let dislikes = parseInt($("#dislikes").text());
      dislikes++;
      $("#dislikes").text(dislikes);

      $.post('dislike', likeData, 
      function(data, status){
          if(status === 'success'){
            let dislikes = parseInt($("#dislikes").text());
            dislikes++;
            $("#dislikes").text(dislikes);
            console.log('Post disliked!');
          }
      });
  });
});//doc
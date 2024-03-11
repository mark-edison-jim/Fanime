$(document).ready(function(){
    $(".like").click(function(){
      let likeData = {
        postId: $(this).data('post-id')
      }
      let $clickedElement = $(this);
      $.post('like', likeData,
      function(data, status){
        if(status === 'success'){
          $clickedElement.text(data.likes);
        }//if
      });//fn+post
    });//btn

    $(".dislike").click(function(){
      // Increment the value of dislikes
      let likeData = {
        postId: $(this).data('post-id')
      }
      let $clickedElement = $(this);
      $.post('dislike', likeData, 
      function(data, status){
          if(status === 'success'){
            $clickedElement.text(data.dislikes);
          }
      });
    });
});//doc
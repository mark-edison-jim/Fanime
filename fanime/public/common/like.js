$(document).ready(function(){
    $(".like").click(function(){
      let likeData = {
        postId: $(this).data('post-id')
    };
    let $clickedElement = $(this);
    let $dislikeElement = $clickedElement.siblings('.dislike'); // Find the sibling dislike button
    
    $.post('like', likeData,
        function(data, status) {
            if (status === 'success') {
                $clickedElement.text(data.likes);
                $dislikeElement.text(data.dislikes);
            }
        });
    });//btn

    $(".dislike").click(function(){
      let dislikeData = {
        postId: $(this).data('post-id')
      };
      let $clickedElement = $(this);
      let $likeElement = $clickedElement.siblings('.like'); // Find the sibling like button
    
      $.post('dislike', dislikeData, function(data, status) {
          if (status === 'success') {
              $clickedElement.text(data.dislikes);
              $likeElement.text(data.likes); // Update like count as well
          }
      });
    });
});//doc
$(document).ready(function(){
    $("#like").click(function(){
        

        $.post('like', postData,
        function(data, status){
          if(status === 'success'){
            let likes = parseInt($("#likes").text());
            likes++;
            $("#likes").text(likes);
          }//if
        });//fn+post
    });//btn
});//doc
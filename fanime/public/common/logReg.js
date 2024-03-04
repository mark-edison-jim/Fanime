$(document).ready(function(){
    let curForm = 'register';
    let login = $(".loginDiv");
    let reg = $(".registerDiv");
    
    $("#logAcc").click(function(){
        login.show(); 
        reg.hide();
    });

    $("#regAcc").click(function(){
        login.hide(); 
        reg.show();
    });

}); 

$(document).ready(function() {
  $(".toggle-comment-section").click(function() {
      $(this).closest('.post').find(".comment").toggle();
      $(this).closest('.post').find(".comment-section").toggle();
  });
  if($('.notification div').text() != ''){
    $("#exit-noti").click(function(){
      $(".notification").toggle();
    })
  }else{
    $('.notification').hide();
  }
  
});

let modal = document.querySelector(".main");
let btn = document.getElementById("signup");
let login = document.querySelector(".loginDiv");
let reg = document.querySelector(".registerDiv");
let dropdown = document.getElementById("drop");
let webprof = document.getElementById("webprof");
let toggleD = false;

btn.onclick = function() {
  webprof.style.removeProperty("position");
  toggleD =  false;
  modal.style.visibility = "visible";
  modal.style.background = "rgba(0,0,0,0.4)";
  login.style.opacity = "100%";
  reg.style.opacity = "100%";
  dropdown.classList.remove("open-d");
}
                
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.visibility = "hidden";
    modal.style.background = "rgba(0,0,0,0)";
    login.style.opacity = "0";
    reg.style.opacity = "0";
    }
}

function toggleDropdown(){
  if(!toggleD){
    webprof.style.position = "relative";
    toggleD = true;
  }
  else{
    webprof.style.removeProperty("position");
    toggleD = false;
  }
  dropdown.classList.toggle("open-d");
}

// $(document).ready(function() {
//   $("#reg-button").click(function(){
//     $.post('register',
//           {user: $(".registerDiv #user").val(), email: $(".registerDiv #email").val(), pass: $(".registerDiv #pass").val(), confirmpass: $(".registerDiv #confirmpass").val()},
//           function(data, status){
//             if(status === "success"){
//               if(data.err != "True")
//                 alert(data.err);
//               else
//                 console.log(data.err)
//             }
//           });
//   });
// });

function validateRegForm(){
  let username = document.forms["regForm"]["user"].value;
  let pass = document.forms["regForm"]["pass"].value;
  let confirmpass = document.forms["regForm"]["confirmpass"].value;
  if (username == "") {
    alert("Name must be filled out!");
    return false;
  }
  if(pass !== confirmpass){
    alert("Passwords must be the same!");
    return false;
  }
  if(pass.length<8){
    alert("Password must be atleast 8 characters long!");
    return false;
  } 
  return true;
}
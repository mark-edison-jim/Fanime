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
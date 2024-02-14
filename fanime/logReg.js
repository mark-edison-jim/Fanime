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

let modal = document.querySelector(".main");
let btn = document.getElementById("signup");
let login = document.querySelector(".loginDiv");
let reg = document.querySelector(".registerDiv");

btn.onclick = function() {
  modal.style.visibility = "visible";
  modal.style.background = "rgba(0,0,0,0.4)";
  login.style.opacity = "100%";
  reg.style.opacity = "100%";
}
                
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.visibility = "hidden";
    modal.style.background = "rgba(0,0,0,0)";
    login.style.opacity = "0";
    reg.style.opacity = "0";
    }
}
document.body.style.transform = 'scale(1)';

let logpass = 'password';
let regpass = 'password';
let conpass = 'password';

document.getElementById('logPassEye').addEventListener('click', ()=>{
  logpass = logpass == 'password' ? 'text' : 'password';
  document.getElementById('logpass').type = logpass;
});

document.getElementById('regPassEye').addEventListener('click', ()=>{
  regpass = regpass == 'password' ? 'text' : 'password';
  document.getElementById('regpass').type = regpass;
});

document.getElementById('regConPassEye').addEventListener('click', ()=>{
  conpass = conpass == 'password' ? 'text' : 'password';
  document.getElementById('confirmpass').type = conpass;
});

$(document).ready(function(){
  $(".toggle-comment-section").click(function() {
      $(this).closest('.post').find(".comment").toggle();
      $(this).closest('.post').find(".comment-section").toggle();
  });
  
  $('.notification').hide();
  if($('.notification #notiMsgDiv').text() != ''){
    $('.notification').show();
    $("#exit-noti").click(function(){
      $(".notification").toggle();
    })
  }

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

//UserDropdown
let modal = document.querySelector(".main");
let btn = document.getElementById("signup");
let login = document.querySelector(".loginDiv");
let reg = document.querySelector(".registerDiv");
let dropdown = document.getElementById("drop");
let webprof = document.getElementById("webprof");
let toggleD = false;

const eyesDiv = document.getElementById('eyes');
const anchor = document.getElementById('anchor');

eyesDiv.addEventListener('mouseenter', ()=>{
  eyesDiv.style.transform = 'translateY(30%)';
  anchor.style.transform = 'translateY(30%)';
});

eyesDiv.addEventListener('mouseleave', ()=>{
  eyesDiv.style.transform = 'translateY(0)';
  anchor.style.transform = 'translateY(0)';
});

document.addEventListener('mousemove', (e)=>{
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  const rect = anchor.getBoundingClientRect();
  const anchorX = rect.left + rect.width / 2;
  const anchorY = rect.top + rect.height / 2;
  
  const angleDeg = getAngle(mouseX,mouseY,anchorX,anchorY);

  const eyes = document.querySelectorAll('.eye');
  eyes.forEach(eye =>{
    eye.style.transform =`rotate(${90 + angleDeg}deg)`;
  }); 
});

function getAngle(mx,my,ax,ay){
  const dy = ay-my;
  const dx = ax-mx;
  const rad = Math.atan2(dy,dx);
  const deg = rad * 180 / Math.PI;
  return deg;
}

btn.onclick = function() {
  webprof.style.removeProperty("position");
  toggleD =  false;
  modal.style.visibility = "visible";
  modal.style.background = "rgba(0,0,0,0.4)";
  login.style.opacity = "100%";
  reg.style.opacity = "100%";
  dropdown.classList.remove("open-d");
  $('#speech-bubble').show();
}
                
window.onclick = function(event) {
  if (event.target == modal) {
    $('#speech-bubble').hide(200);
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

//post scroll animate
// const observer = new IntersectionObserver((entries) =>{
//   entries.forEach((entry)=>{
//     if(entry.isIntersecting){
//       entry.target.classList.add('post-show');
//     }else{
//       entry.target.classList.remove('post-show');
//     }
//   })
// });

// const postElements = document.querySelectorAll(".post");
// postElements.forEach((e)=>observer.observe(e));

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
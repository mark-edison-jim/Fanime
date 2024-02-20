// Get the button, popup, and overlay elements
var btn = document.getElementById('edit-profile-btn');
var popup = document.getElementById('edit-profile-popup');
var overlay = document.querySelector('.popup-overlay');

// When the user clicks on the button, open the popup
btn.onclick = function() {
    popup.classList.add('show-popup');
}

// When the user clicks anywhere outside of the popup, close it
window.onclick = function(event) {
    if (event.target == overlay) {
        popup.classList.remove('show-popup');
    }
}

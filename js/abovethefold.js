// Hide header on scroll down
var lastScrollTop = 0;
var delta = 5;
var header = document.querySelector('header');
var navbarHeight = header ? header.offsetHeight : 0;
var isTicking = false;

// Throttle scroll work to animation frames so layout/class updates do not run on every scroll event.
window.addEventListener('scroll', function () {
    if (isTicking) {
        return;
    }

    isTicking = true;
    window.requestAnimationFrame(function () {
        hasScrolled();
        isTicking = false;
    });
}, { passive: true });

function hasScrolled() {
    if (!header) {
        return;
    }

    var st = window.scrollY || window.pageYOffset || 0;

    // Make sure they scroll more than delta
    if (Math.abs(lastScrollTop - st) <= delta) {
        return;
    }

    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
    if (st > lastScrollTop && st > navbarHeight) {
        // Scroll Down
        header.classList.remove('nav-down');
        header.classList.add('nav-up');
    } else {
        // Scroll Up
        if (st + window.innerHeight < document.documentElement.scrollHeight) {
            header.classList.remove('nav-up');
            header.classList.add('nav-down');
        }
    }

    lastScrollTop = st;
}


// change colours on refresh

//var colors = ['#FFAFA1', '#44d9ff', '#17c37b', '#a6a5b7'];

//var changeBackground = function() {
//    document.body.style.background = colors[Math.floor(Math.random()*colors.length)];
//};

//changeBackground();



//var bgcolorlist = ['#FFAFA1', '#44d9ff', '#17c37b', '#a6a5b7'];
//var colorlist = ['#fff', '#000', '#999', '#ccc'];
//
//$(function() {
//  var backgroundColor = bgcolorlist[Math.floor(Math.random()*bgcolorlist.length)];
//  var textColor = colorlist[Math.floor(Math.random()*colorlist.length)];
//  $('.color-change').css({
//        background: backgroundColor, 
//        color: textColor 
//  });
//});
// Hide header on scroll down
var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('header').outerHeight();

$(window).scroll(function(event){
    didScroll = true;
});

setInterval(function() {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);

function hasScrolled() {
    var st = $(this).scrollTop();
    
    // Make sure they scroll more than delta
    if(Math.abs(lastScrollTop - st) <= delta)
        return;
    
    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
    if (st > lastScrollTop && st > navbarHeight){
        // Scroll Down
        $('header').removeClass('nav-down').addClass('nav-up');
    } else {
        // Scroll Up
        if(st + $(window).height() < $(document).height()) {
            $('header').removeClass('nav-up').addClass('nav-down');
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
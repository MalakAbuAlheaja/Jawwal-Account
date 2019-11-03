// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
// Collapse click
$('[data-toggle=sidebar-colapse]').click(function () {
    SidebarCollapse();
});

function SidebarCollapse() {
    $('.sidebar-wrapper').toggleClass('sidebar-expanded sidebar-collapsed');
    $('.menu-collapsed').toggleClass('d-none');
    $('.sidebar-submenu').toggleClass('d-none');
    $('.submenu-icon').toggleClass('d-none');
    $('.page-content-wrapper').toggleClass('page-content-wrapper-expanded');

    $('.dropdown-icon').toggleClass('d-none');
    if ($(".logo-img").attr("src") == "/assets/images/logo.svg" || $(".logo-img").attr("src") == "../../assets/images/logo.svg"  ) {
        $(".logo-img").attr("src", "../../assets/images/logo2.svg");


    }
    else {
        $(".logo-img").attr("src", "../../assets/images/logo.svg");
    }
    
    // Treating d-flex/d-none on separators with title
    var SeparatorTitle = $('.sidebar-separator-title');
    if (SeparatorTitle.hasClass('d-flex')) {
        SeparatorTitle.removeClass('d-flex');
    } else {
        SeparatorTitle.addClass('d-flex');
    }

    // Collapse/Expand icon
}


$("#menu-toggle, .close-icone").click(function(e) {
        e.preventDefault();
    $("#wrapper").toggleClass("toggled");
  });


$(document).ready(function () {
    var param = document.location.pathname.match(/[^\/]+$/)[0];
    $(".sidebar-wrapper .list-group").find("a[href*='" + param + "']").each(function () {
        $(this).addClass("selected");
        if ($(this).parent().attr("id") == "manageCamp") {
            $(".sidebar-wrapper .list-group").find("a[href='#manageCamp']").addClass("selected");
            $('#manageCamp').addClass("show");
            $(".sidebar-wrapper .list-group").find("a[href='#manageCamp']").attr('aria-expanded', 'true');
        }
    });



});
var navList = [];
navList.push({ "Name": "dashboard" });
navList.push({ "Name": "myprofile" });
navList.push({ "Name": "contracts" });
navList.push({ "Name": "users" });

if (window.location.href.toLowerCase().indexOf('index') > -1) {
  window.location = '/#dashboard';
}

var app = $.sammy(function () {

  this.get('/home/index/#', function () {
    getPartialPage("dashboard");
  });

  this.get('#dashboard', function () {
    getPartialPage("dashboard");
  });

  this.get('#myprofile', function () {
    getPartialPage("myprofile");
  });

  this.get('#users', function () {
    getPartialPage('UserManagement');
  });

  this.get('#contracts', function () {
    getPartialPage('Contracts');
  });

  this.get('#profile', function () {
    getPartialPage('Profile');
  });

  this.get('#email', function () {
    getPartialPage('EmailManagement');
  });

  this.get('#product', function () {
    getPartialPage('ProductManagement');
  });


  this.get('#contact', function () {
    getPartialPage('ContactManagement');
  });

}).run('#dashboard');//run it with default html fragment


function getPartialPage(param) {
  $.ajax({
    url: "home/" + param, success: function (result) {
        $("#main-content").html(result);
        $("#main-content").css("display", "block");      
        $("#contract-wizard").css("display", "none");
        $("#divExit").css("display", "none");
    }
  });
}

function activateNavigation(param) {
  $('.dd-side').each(function (e) {
    if (this.id.toLowerCase() == param.toLowerCase()) {
      $(this).addClass("active");
    } else {
      $(this).removeClass("active");
    }
  });
}



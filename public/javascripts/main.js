$( document ).ready(function() {
  var token = window.localStorage.getItem('token');
  if (token) {
    $.ajaxSetup({
      headers: {
        'x-access-token': token
      }
    });
    checklogin();
  } else {
    displayLogoutButton(false);
  }
});

function checklogin() {
  $.ajax({
		type:'POST',
		url:'/auth/check',
		success:function(resp){
      console.log(resp);
      if (resp.tokenverified) {
        if (window.location.pathname!="/") {
          window.location = "/";
        }
        displayLogoutButton(true);
      } else {
        displayLogoutButton(false);
      }
		}
	});
}


function login() {
  var un = $("input[name=username]").val();
  var pw = $("input[name=password]").val();
  $.ajax({
		type:'POST',
		url:'/auth/login',
		data:{username:un, password:pw},
		success:function(resp){
      console.log(resp);
      if (resp.token) {
        window.localStorage.setItem('token',resp.token);
        window.location = "/";
      }
		}
	});
}

function logout() {
  window.localStorage.removeItem('token');
  window.location = "/";
}

function displayLogoutButton(display) {
  if (display) {
    $("#logout").show();
    $("#login").hide();
  } else {
    $("#login").show();
    $("#logout").hide();
  }
}

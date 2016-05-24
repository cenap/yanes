$( document ).ready(function() {
  var token = window.localStorage.getItem('token');
  if (token) {
    $.ajaxSetup({
      headers: {
        'x-access-token': token
      }
    });
  }

  checklogin();
});

function checklogin() {
  $.ajax({
		type:'POST',
		url:'/auth/check',
		success:function(resp){
      console.log(resp);
      if (resp.tokenverified && window.location.pathname==="/auth/login") {
        window.location = "/";
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
      }
		}
	});
}

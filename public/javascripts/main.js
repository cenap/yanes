$( document ).ready(function() {
  var token = window.localStorage.getItem('token');
  if (token) {
    $.ajaxSetup({
      headers: {
        'x-access-token': token
      }
    });
  }
  //checklogin();
});

function checklogin() {
  $.ajax({
		type:'POST',
		url:'/auth/check',
		success:function(resp){
      console.log(resp);
      if (resp.tokenverified) {
        if (window.location.pathname==="/auth/login") {
          window.location = "/";
        }
      }
		}
	});
}

var jwt = window.localStorage.getItem('token');
var socket = io();

socket.on('connect', function () {
  console.log('connected');
  socket.emit('login', {token: jwt});
  socket.on('authenticated', function (data) {
    console.log('authenticated: ', data);
  });
  socket.on('notauthenticated', function (data) {
    console.log('not authenticated : ', data.reason);
  });
});

$( document ).ready(function() {
  if (jwt) {
    $.ajaxSetup({
      headers: {
        'x-access-token': jwt
      }
    });
  }
  //checklogin();
});

function checklogin() {
  $.ajax({
		type:'POST',
		url:'/api/auth/check',
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

function onlogin(m) {
  jwt = window.localStorage.getItem('token');
  socket.emit('login', {token: jwt});
}
function onlogout(m) {
  jwt = window.localStorage.getItem('token');
  socket.emit('logout', {token: jwt});
}

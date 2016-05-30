var userboxStyle = {
  'maxWidth': '380px'
};

var userboxInputStyle = {
  'maxWidth': '100%'
};

var LoginPopup = React.createClass({displayName: 'LoginPopup',
  getInitialState: function() {
    return {
      message : "Log In",
    };
  },
  onTitleClick: function (evt) {
    $('.loginbox').collapse('toggle');
  },
  onLoginClick :function (evt) {
    var thiscomponent = this;
    var un = $("input[name=username]").val();
    var pw = $("input[name=password]").val();
    $.ajax({
  		type:'POST',
  		url:'/auth/login',
  		data:{username:un, password:pw},
  		success:function(resp){
        console.log(resp);
        if (resp.status===0 && resp.data.token) {
          window.localStorage.setItem('token',resp.data.token);
          thiscomponent.setState({
            message  : "Logged In",
            msgstyle : 'initial'
          });
          thiscomponent.state.message = resp.message;
          //$('#LoginModal').modal('hide');
        } else {
          $("#LoginModal").shake(4,8,600);
          if (resp.status<0) {
            thiscomponent.setState({
              message  : resp.error.msg,
              success  : false,
              error    : true,
              warning  : false,
              msgstyle : 'error'
            });
          } else if (resp.status>0) {
            thiscomponent.setState({
              message: resp.warning.msg,
              success: true,
              error  : false,
              warning: true,
              msgstyle : 'success'
            });
          }
        }
  		}
  	});
  },
  render: function() {
    return (
      //React.createElement('div', {className: "userbox"}, "Merhaba")

      <div id="LoginModal" className="modal fade" tabindex="-1" role="dialog">
        <div className="modal-dialog" style={userboxStyle}>
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">Login</h4>
            </div>
            <div className="modal-body">
              <div className="container-fluid">
                <div className="loginbox">
                  <div className="row">
                    <div className="col-sm-6 text-right hidden-xs">
                      Username:
                    </div>
                    <div className="col-sm-6">
                      <input type="text" style={userboxInputStyle} name="username" placeholder="Email address"/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6 text-right hidden-xs">
                      Password:
                    </div>
                    <div className="col-sm-6">
                      <input type="password" style={userboxInputStyle} name="password" placeholder="Password"/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xs-12 text-center">
                      <label className="checkbox">
                        <input type="checkbox" value="remember-me" /> Remember me
                      </label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xs-12 text-center">
                      <p class="message {this.state.msgstyle}">{this.state.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={this.onLoginClick}>Sign In</button>
            </div>
          </div>
        </div>
      </div>

    );
  }
});

var UserBox = React.createClass({displayName: 'UserBox',
  getInitialState: function() {
    return {
      message               : "",
      loggedin              : false,
      loginbuttonvisible    : true,
      registerbuttonvisible : true,
      logoutbuttonvisible   : false
    };
  },
  onShowLogin :function (evt) {
    $('#LoginModal').modal()
  },
  render: function() {
    return (
      <div>
        <a href="#" onClick={this.onShowLogin}>Login</a>
        <LoginPopup/>
      </div>
    );
  }
});

ReactDOM.render(
  //React.createElement(UserBox,null), document.getElementById('userbox')
  <UserBox message="sdfjsdhfj"/>, document.getElementById('userbox')
);

var Button = ReactBootstrap.Button;
var Modal  = ReactBootstrap.Modal;
var Alert  = ReactBootstrap.Alert;

var shown = {'display':'initial'};
var hidden = {'display':'none'};

var Userboxbs = React.createClass({

  componentWillMount() {
    var thiscomponent = this;
    $.ajax({
      type:'POST',
      url:'/auth/check',
      success:function(resp){
        if (resp.status === 0 && resp.data.tokenverified) {
          thiscomponent.setState({
            status            : 'success',
            message           : resp.message,
            loginBox          : hidden,
            loginButton       : hidden,
            loginSubmitButton : hidden,
            logoutButton      : shown,
          })
        }
      }
    });
  },

  getInitialState() {
    return {
      username       : '',
      password       : '',
      remember       : '',
      message        : 'Log In Now!',
      status         : 'info',
      showLoginModal : false,
      showLogoutModal: false,
      loggedin       : false,
      loginBox       : shown,
      loginButton    : shown,
      logoutButton   : hidden,
      loginSubmitButton  : shown,
    };
  },


  openLoginModal() {
    this.setState({
      showLoginModal: true,
      status : 'info',
      message : 'Log In Now!',
    });
  },

  openLogoutModal() {
    this.setState({
      showLogoutModal: true,
      status : 'danger',
      message : 'Are you sure?',
    });
  },

  closeLoginModal() {
    this.setState({ showLoginModal: false });
  },

  closeLogoutModal() {
    this.setState({ showLogoutModal: false });
  },

  handleUsernameValueChange: function(event) {
    this.setState({username: event.target.value});
  },

  handlePasswordValueChange: function(event) {
    this.setState({password: event.target.value});
  },

  handleRememberValueChange: function(event) {
    this.setState({remember: event.target.checked});
  },

  onLoginClick(evt) {
    var thiscomponent = this;
    var un = this.state.username;
    var pw = this.state.password;
    var rm = this.state.remember;
    $.ajax({
      type:'POST',
      url:'/auth/login',
      data:{username:un, password:pw, remember:rm},
      success:function(resp){
        console.log(resp);
        if (resp.status===0 && resp.data.token) {
          window.localStorage.setItem('token',resp.data.token);
          thiscomponent.setState({
            status            : 'success',
            message           : resp.message,
            loginBox          : hidden,
            loginButton       : hidden,
            loginSubmitButton : hidden,
            logoutButton      : shown,
          })
          thiscomponent.closeLoginModal();
        } else {
          $("#LoginModal").shake(4,8,600);
          if (resp.status<0) {
            thiscomponent.setState({
              message  : resp.error.msg,
              status   : 'danger',
              msgstyle : 'error'
            });
          } else if (resp.status>0) {
            thiscomponent.setState({
              message  : resp.warning.msg,
              status   : 'warning',
              msgstyle : 'success'
            });
          }
        }
      }
    });
  },

  onLogoutClick(evt) {
    var thiscomponent = this;
    $.ajax({
      type:'POST',
      url:'/auth/logout',
      success:function(resp){
        console.log(resp);
        if (resp.status>=0) {
          window.localStorage.removeItem('token');
          thiscomponent.setState({
            status            : 'success',
            message           : resp.message,
            loginBox          : shown,
            loginButton       : shown,
            loginSubmitButton : shown,
            logoutButton      : hidden,
          });
          if (resp.status>0) {
            console.log(resp.warning.msg);
          }
          thiscomponent.closeLogoutModal();
        } else {
          $("#LogoutModal").shake(4,8,600);
          if (resp.status<0) {
            thiscomponent.setState({
              message  : resp.error.msg,
              status   : 'danger',
              msgstyle : 'error'
            });
          }
        }
      }
    });
  },

  render() {

    return (
      <div>

        <Button bsStyle="primary" bsSize="large" onClick={this.openLoginModal} style={this.state.loginButton}>
          Login
        </Button>

        <Button bsStyle="warning" bsSize="large" onClick={this.openLogoutModal} style={this.state.logoutButton}>
          Logout
        </Button>

        <Modal id="LoginModal" show={this.state.showLoginModal} onHide={this.closeLoginModal}>
          <Modal.Header closeButton>
            <Modal.Title>Login</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="loginbox" style={this.state.loginBox}>
              <div className="row">
                <div className="col-sm-6 text-right hidden-xs">
                  Username:
                </div>
                <div className="col-sm-6">
                  <input type="text" name="username" placeholder="Email address" onChange={this.handleUsernameValueChange} value={this.state.username}/>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6 text-right hidden-xs">
                  Password:
                </div>
                <div className="col-sm-6">
                  <input type="password" name="password" placeholder="Password" onChange={this.handlePasswordValueChange} value={this.state.password}/>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12 text-center">
                  <label className="checkbox">
                    <input type="checkbox" name="remember" value="remember-me" onChange={this.handleRememberValueChange} defaultChecked={this.state.remember}/> Remember me
                  </label>
                </div>
              </div>
            </div>
            <div className="row message">
              <Alert bsStyle={this.state.status} className="col-xs-12 text-center">
                <p class="message">{this.state.message}</p>
              </Alert>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="danger" bsSize="sm" onClick={this.closeLoginModal}>Close</Button>
            <Button bsStyle="primary" bsSize="sm" onClick={this.onLoginClick} style={this.state.loginSubmitButton}>Sign In</Button>
          </Modal.Footer>
        </Modal>


        <Modal id="LogoutModal" show={this.state.showLogoutModal} onHide={this.closeLogoutModal}>
          <Modal.Header closeButton>
            <Modal.Title>Logout</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert bsStyle={this.state.status} className="col-xs-12 text-center">
              <p class="message">{this.state.message}</p>
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="warning" bsSize="sm" onClick={this.closeLogoutModal}>No, Cancel!</Button>
            <Button bsStyle="primary" bsSize="sm" onClick={this.onLogoutClick} style={this.state.logoutSubmitButton}>Yes, Sign Out</Button>
          </Modal.Footer>
        </Modal>

      </div>
    );
  }
});

ReactDOM.render(<Userboxbs/>, document.getElementById('userbox'));

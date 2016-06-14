var Button = ReactBootstrap.Button;
var Modal  = ReactBootstrap.Modal;

const Userboxbs = React.createClass({

  getInitialState() {
    return {
      username                 : "",
      password                 : "",
      showModal                : false,
      loggedin                 : false,
      message                  : "",
      loginBox                 : {'display':'initial'},
      loginButton              : {'display':'initial'},
      logoutButton             : {'display':'none'},
    };
  },

  display(component) {
    this.setState({component: {'display':'initial'}});
  },

  hide(component) {
    this.setState({component: {'display':'none'}});
  },

  closeModal() {
    this.setState({ showModal: false });
  },

  openModal() {
    this.setState({ showModal: true });
  },

  handleUsernameValueChange: function(event) {
    this.setState({username: event.target.value});
  },

  handlePasswordValueChange: function(event) {
    this.setState({password: event.target.value});
  },

  onLoginClick(evt) {
    var thiscomponent = this;
    var un = this.state.username;
    var pw = this.state.password;
    $.ajax({
      type:'POST',
      url:'/auth/login',
      data:{username:un, password:pw},
      success:function(resp){
        console.log(resp);
        if (resp.status===0 && resp.data.token) {
          window.localStorage.setItem('token',resp.data.token);
          thiscomponent.setState({
            message  : "Logged In"
          });
          thiscomponent.state.message = resp.message;
          thiscomponent.hide('loginBox');
          thiscomponent.hide('loginButton');
          thiscomponent.display('logoutButton');
          thiscomponent.closeModal();

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

  render() {

    return (
      <div>

        <Button bsStyle="primary" bsSize="large" onClick={this.openModal} style={this.state.loginButton}>
          Login
        </Button>

        <Button bsStyle="warning" bsSize="large" onClick={this.openModal} style={this.state.logoutButton}>
          Logout
        </Button>

        <Modal id="LoginModal" show={this.state.showModal} onHide={this.closeModal}>
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
                    <input type="checkbox" value="remember-me" /> Remember me
                  </label>
                </div>
              </div>
            </div>
            <div className="row message">
              <div className="col-xs-12 text-center">
                <p class="message {this.state.msgstyle}">{this.state.message}</p>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="danger" bsSize="large" onClick={this.closeModal}>Close</Button>
            <Button bsStyle="primary" bsSize="large" onClick={this.onLoginClick}>Sign In</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
});

ReactDOM.render(<Userboxbs/>, document.getElementById('userbox'));

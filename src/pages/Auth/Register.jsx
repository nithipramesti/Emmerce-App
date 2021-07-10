import React from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import { API_URL } from "../../constant/API";
import { registerUser } from "../../redux/actions/user"; //get the registerUser function from reducer action
import { connect } from "react-redux"; //connect to action creator

class Register extends React.Component {
  state = {
    fullName: "",
    username: "",
    email: "",
    password: "",
  };

  inputHandler = (event) => {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({ [name]: value });
  };

  registerHandler = () => {
    // alert(
    //   `fullName: ${this.state.fullName} \nusername: ${this.state.username} \nemail: ${this.state.email} \npassword: ${this.state.password} \n`
    // );
    Axios.post(`${API_URL}/users`, {
      fullName: this.state.fullName,
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      role: "user",
    })
      .then(() => {
        alert("A user registered successfully");
      })
      .catch(() => {
        alert("Register failed!");
      });
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <h1>Register now!</h1>
            <p className="lead">
              Register now to start shopping in the most affordable e-commerce
              platform
            </p>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-4 offset-4">
            <div className="card">
              <div className="card-body">
                <h5 className="font-weight-bold mb-3">Register</h5>
                <input
                  name="fullName"
                  onChange={this.inputHandler}
                  placeholder="Full Name"
                  type="text"
                  className="form-control my-2"
                />
                <input
                  name="username"
                  onChange={this.inputHandler}
                  placeholder="Username"
                  type="text"
                  className="form-control my-2"
                />
                <input
                  name="email"
                  onChange={this.inputHandler}
                  placeholder="Email"
                  type="text"
                  className="form-control my-2"
                />
                <input
                  name="password"
                  onChange={this.inputHandler}
                  placeholder="Password"
                  type="password"
                  className="form-control my-2"
                />
                <div className="d-flex flex-row justify-content-between align-items-center">
                  <button
                    onClick={() => this.props.registerUser(this.state)}
                    className="btn btn-primary mt-2"
                  >
                    Register
                  </button>
                  <Link to="/login">Or login here</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = {
  registerUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);

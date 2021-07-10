import Axios from "axios";
import { API_URL } from "../../constant/API";

export const registerUser = ({ fullName, username, email, password }) => {
  return (dispatch) => {
    Axios.post(`${API_URL}/users`, {
      fullName: fullName,
      username: username,
      email: email,
      password: password,
      role: "user",
    })
      .then((result) => {
        delete result.data.password;

        dispatch({
          type: "USER_LOGIN",
          payload: result.data,
        });
        alert("A user registered successfully");
      })
      .catch((err) => {
        alert("Register failed!");
      });
  };
};

export const loginUser = ({ username, password }) => {
  return (dispatch) => {
    Axios.get(`${API_URL}/users`, {
      params: {
        username,
      },
    })
      .then((result) => {
        if (result.data.length) {
          if (password === result.data[0].password) {
            delete result.data[0].password;

            localStorage.setItem(
              "userDataEmmerce",
              JSON.stringify(result.data[0])
            );

            dispatch({
              type: "USER_LOGIN",
              payload: result.data[0],
            });
          } else {
            //error wrong password
            dispatch({
              type: "USER_ERROR",
              payload: "Wrong password!",
            });
          }
        } else {
          //handle error username not found
          dispatch({
            type: "USER_ERROR",
            payload: "Username not found!",
          });
        }
      })
      .catch((err) => {
        alert("Theres an error on the server, please try again");
      });
  };
};

export const logoutUser = () => {
  localStorage.removeItem("userDataEmmerce");

  return {
    type: "USER_LOGOUT",
  };
};

export const userKeepLogin = (userData) => {
  return (dispatch) => {
    Axios.get(`${API_URL}/users`, {
      params: {
        id: userData.id,
      },
    })
      .then((result) => {
        localStorage.setItem("userDataEmmerce", JSON.stringify(result.data[0]));

        dispatch({
          type: "USER_LOGIN",
          payload: userData[0],
        });
      })
      .catch((err) => {
        alert("Theres an error");
      });
  };
};

export const checkStorage = () => {
  return {
    type: "CHECK_STORAGE",
  };
};

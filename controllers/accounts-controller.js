import { userStore } from "../models/user-store.js";

export const accountsController = {
  index(request, response) {
    const viewData = {
      title: "Login or Signup",
    };
    response.render("index", viewData);
  },

  login(request, response) {
    const viewData = {
      title: "Login to the Service",
    };
    response.render("login-view", viewData);
  },

  logout(request, response) {
    response.cookie("station", "");
    response.redirect("/");
  },

  signup(request, response) {
    const viewData = {
      title: "Login to the Service",
    };
    response.render("signup-view", viewData);
  },

  async register(request, response) {
    const user = request.body;
    await userStore.addUser(user);
    console.log(`registering ${user.email}`);
    response.redirect("/");
  },

  async authenticate(request, response) {
    const user = await userStore.getUserByEmail(request.body.email);
    const viewData = {
      message: "",
      messageType: "notification is-info",
    };
    if (user) {
      if (user.password === request.body.password) {
        response.cookie("station", user.email);
        console.log(`logging in ${user.email}`);
        response.redirect("/dashboard");
      }
      else {
        viewData.message = "Wrong password!";
        viewData.messageType = "notification is-danger";
        response.render("login-view", viewData);
      }
    }
    else {
      viewData.message = "User not found!";
      viewData.messageType = "notification is-danger";
      response.render("login-view", viewData);
    }
  },

  async getLoggedInUser(request) {
    const userEmail = request.cookies.station;
    return await userStore.getUserByEmail(userEmail);
  },
};
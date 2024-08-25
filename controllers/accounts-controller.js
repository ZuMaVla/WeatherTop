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
    response.cookie("weathertop_user_token", "");
    response.redirect("/");
  },

  signup(request, response) {
    const viewData = {
      title: "Register for the Service",
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
        response.cookie("weathertop_user_token", user.email);
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
    const userEmail = request.cookies.weathertop_user_token;
    return await userStore.getUserByEmail(userEmail);
  },
  
  async profile(request, response) {
    if (request.cookies.weathertop_user_token && request.cookies.weathertop_user_token.trim() !== "") {
      const requestetUser = await userStore.getUserById(request.params.userId);
      if (!currentUser) {
        currentUser = await userStore.getUserByEmail(request.cookies.weathertop_user_token);
      }
      const viewData = {
        title: "My Profile",
        user: currentUser,
        userName: currentUser.firstName + " " + currentUser.lastName,
      };
      response.render("profile-view", viewData);
    }
    else {
      // The cookie is not defined or empty
      console.log("No user is logged in");
      response.redirect("/");  
    }
  },
  
  async updateProfile(request, response) {
    await userStore.updateUser(request.params.userId, request.body);
    console.log(`user ${request.params.userId} updated with the following details: ${request.body.firstName}, ${request.body.lastName}, ${request.body.email}`);
    response.redirect("/");
  },
  
};
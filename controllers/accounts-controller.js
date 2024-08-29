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
    response.cookie("weathertop_user_token", "");                           // clearing cookies     
    response.redirect("/");
  },

  signup(request, response) {
    const viewData = {
      title: "Register for the Service",
    };
    response.render("signup-view", viewData);
  },

  async register(request, response) {
    const user = await userStore.getUserByEmail(request.body.email);       // attempt to find user with specified email in our database 
    const viewData = {
      message: "",
      messageType: "notification is-info",
    };
    
    if (user) {                                                            // Stop user from signing up using already registered email
      viewData.message = "User already registered!";
      viewData.messageType = "notification is-danger";
      response.render("signup-view", viewData);
    }
    else {    
      const user = request.body;
      await userStore.addUser(user);                                       // adding new user if their email is unique
      console.log(`registering ${user.email}`);
      response.redirect("/");
    }
  },

  async authenticate(request, response) {
    const user = await userStore.getUserByEmail(request.body.email);       // retrieving user data based on provided email 
    const viewData = {
      message: "",
      messageType: "notification is-info",
    };
    if (user) {                                                            // handling situation when user does exist
      if (user.password === request.body.password) {                       // allowing access if user provided correct password 
        response.cookie("weathertop_user_token", user.email);
        console.log(`logging in ${user.email}`);
        response.redirect("/dashboard");
      }
      else {
        viewData.message = "Wrong password!";                              // handling situation if user provided wrong password
        viewData.messageType = "notification is-danger";
        response.render("login-view", viewData);
      }
    }
    else {                                                                 // handling situation when user does NOT exist 
      viewData.message = "User not found!";
      viewData.messageType = "notification is-danger";
      response.render("login-view", viewData);
    }
  },

  async getLoggedInUser(request) {                                         // method to determine currently logged in user on other pages of the website
    const userEmail = request.cookies.weathertop_user_token;               // uses cookies to get user's email
    return await userStore.getUserByEmail(userEmail);
  },
  
  async profile(request, response) {
    if (request.cookies.weathertop_user_token && request.cookies.weathertop_user_token.trim() !== "") {
      const requestedUser = await userStore.getUserById(request.params.userId);                        // User requested in the address line
      const currentUser = await userStore.getUserByEmail(request.cookies.weathertop_user_token);       // User actually currently logged in
      if (requestedUser._id === currentUser._id) {                                                     // Grand access to profile only if the same user 
        const viewData = {
          title: "My Profile",
          user: currentUser,
          userName: currentUser.firstName + " " + currentUser.lastName,
        };
        response.render("profile-view", viewData);
      }
      else {                                                                                           // If user requested not own profile
        console.log("Unauthorised access request!");
        response.redirect("/dashboard"); 
      }
    }
    else {                                                                                             // If a profile is attempted to be accessed without a user being logged in
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
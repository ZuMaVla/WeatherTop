import { accountsController } from "./accounts-controller.js";

export const aboutController = {
  async index(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    const viewData = {
      title: "About",
      user: loggedInUser,
    };
    console.log("about rendering");
    response.render("about-view", viewData);
  },
};

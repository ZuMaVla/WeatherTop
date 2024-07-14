export const mainController = {
    index(request, response) {
      const viewData = {
        title: "",
      };
      console.log("main rendering");
      response.render("main-view", viewData);
    },
  };
  
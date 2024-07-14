export const aboutController = {
  index(request, response) {
    const viewData = {
      title: "About Station 1",
    };
    console.log("about rendering");
    response.render("about-view", viewData);
  },
};

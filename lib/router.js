Meteor.startup(function() {
  Router.route("/", {
    onBeforeAction: function() {
      /* This removes yogiben:admin's injected stylesheets to prevent them conflicting with our own CSS.
       TODO: integrate this behaviour in yogiben:admin (or find another way to separate frontend and backend CSS)
       */
      $("link[rel=stylesheet][href*=admin-lte]").remove();
      this.next();
    },
    action: function() {
      if (Meteor.userId())
        Router.go("/admin");
      this.render("adminLogin");
    },
    name: "home"
  });

  Router.route(AdminDashboard.path("database"), {
    controller: "AdminController",
    onAfterAction: function() {
      Session.set("admin_title", "Database");
    },
    name: "adminDatabase"
  });
});
Meteor.startup(function() {
  Tracker.autorun(function() {
    if (Meteor.userId()) {
      Meteor.subscribe("projectsWithDetails");
      Meteor.subscribe("categories");
      Meteor.subscribe("images");
    }
  });
});
Meteor.startup(function() {
  Accounts.validateNewUser(function(user) {
    // user.emails[0].address for accounts-password
    return user.services.github.email === "info@elias-kuiter.de";
  });

  appDump.allow = function() {
    return this.user;
  };
});
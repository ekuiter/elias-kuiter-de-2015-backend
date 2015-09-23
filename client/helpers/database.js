var fetchDatabaseStats = (function() {
  var callInvoked = false;

  return function() {
    if (callInvoked)
      return;
    callInvoked = true;
    Meteor.call("databaseStats", function(err, res) {
      Session.set("databaseStats", res);
    });
  };
})();

Template.adminDatabaseWidget.onCreated(fetchDatabaseStats);

Template.adminDatabaseWidget.helpers({
  stats: function() {
    return Session.get("databaseStats");
  },
  formatBytes: function(bytes) {
    if (!bytes) return "...";
    return (bytes / 1024 / 1024).toFixed(1);
  },
  maxSize: function() {
    return 512;
  }
});

Template.adminDatabase.onCreated(fetchDatabaseStats);


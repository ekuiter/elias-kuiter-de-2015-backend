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

function showDatabaseStats() {
  var stats = Session.get("databaseStats"), results;
  if (stats)
    results = Object.keys(stats).reduce(function(prev, cur) {
      var value;
      if (cur.indexOf("Size") !== -1)
        value = formatBytes(stats[cur]) + " MB";
      else
        value = JSON.stringify(stats[cur]);
      return prev + cur + ": " + value + "\n";
    }, "");
  else
    results = "...";
  $("[rel=results]").text(results);
}

function formatBytes(bytes) {
  return (bytes / 1024 / 1024).toFixed(1);
}

Template.adminDatabaseWidget.onCreated(fetchDatabaseStats);

Template.adminDatabaseWidget.helpers({
  stats: function() {
    return Session.get("databaseStats");
  },
  formatBytes: function(bytes) {
    if (!bytes) return "...";
    return formatBytes(bytes);
  },
  maxSize: function() {
    return 512;
  }
});

Template.adminDatabase.onCreated(fetchDatabaseStats);

Template.adminDatabase.onRendered(function() {
  this.$(".btn-success").removeClass("btn-success").addClass("btn-primary");
  this.autorun(showDatabaseStats);
});

Template.adminDatabase.events({
  "click [data-action=stats]": showDatabaseStats,
  "click [data-action=compact]": function(event) {
    if (!confirm("Are you sure? This blocks the database until it's done."))
      return;
    $(event.target).text("Compacting database ...");
    Meteor.call("databaseCompact", function(err, res) {
      $(event.target).text("Compact database");
      var results = res.reduce(function(prev, cur) {
        return prev + "\n" + JSON.stringify(cur);
      }, "");
      $("[rel=results]").text("Compact finished. These are the results:\n" + results);
    });
  }
});
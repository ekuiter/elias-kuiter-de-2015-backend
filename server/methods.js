var callDbSync = (function() {
  var db = Projects.rawDatabase();

  return function(func, arg) {
    return Meteor.wrapAsync(db[func], db)(arg);
  };
})();

Meteor.methods({
  databaseStats: function() {
    if (!this.userId)
      return;
    return callDbSync("stats");
  },
  databaseCompact: function() {
    if (!this.userId)
      return;
    return callDbSync("collectionNames").map(function(collection) {
      if (collection.name.indexOf("system.") === 0) {
        return { collection: collection.name };
      } else {
        return {
          collection: collection.name,
          result: callDbSync("command", { compact: collection.name, force: true })
        };
      }
    });
  }
});
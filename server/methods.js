Meteor.methods({
  databaseStats: function() {
    if (!this.userId)
      return;
    var db = Projects.rawDatabase();
    return Meteor.wrapAsync(db.stats, db)();
  }
});
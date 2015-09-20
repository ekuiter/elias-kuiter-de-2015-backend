function loggedIn(userId) {
  return userId;
}

Images.allow({
  insert: loggedIn,
  update: loggedIn,
  download: loggedIn
});

Meteor.publish("images", function() {
  if (!this.userId)
    this.error(new Meteor.Error(401));
  return Images.find();
});
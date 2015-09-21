var smallImageHeight = 250;
var mediumImageWidth = 400;

function storeOptions(width, height, format) {
  format = format || "jpg";
  return {
    beforeWrite: function() {
      return { extension: "jpg", type: "image/jpg" };
    },
    transformWrite: function(fileObj, readStream, writeStream) {
      var image = gm(readStream, fileObj.name());
      if (width || height)
        image = image.resize(width, height);
      image.setFormat(format).stream().pipe(writeStream);
    }
  };
}

Images = new FS.Collection("images", {
  stores: [
    new FS.Store.GridFS("small", storeOptions(null, smallImageHeight)),
    new FS.Store.GridFS("medium", storeOptions(mediumImageWidth)),
    new FS.Store.GridFS("large", storeOptions())
  ],
  filter: {
    allow: { contentTypes: ["image/*"] }
  }
});

Pictures = Images.files;

function loggedIn(userId) {
  return userId;
}

Images.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn,
  download: loggedIn
});

Projects.allow({
  update: loggedIn
});

Meteor.publish("imagesWithDetails", function() {
  if (!this.userId)
    this.error(new Meteor.Error(401));
  return Images.find();
});
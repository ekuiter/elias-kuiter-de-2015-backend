Images = new FS.Collection("images", {
  stores: [
    new FS.Store.GridFS("small"),
    new FS.Store.GridFS("medium"),
    new FS.Store.GridFS("large")
  ],
  filter: {
    allow: { contentTypes: ["image/*"] }
  }
});

Pictures = Images.files;
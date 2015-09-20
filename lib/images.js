var dropboxStore = new FS.Store.Dropbox("images", {
  key: process.env.DROPBOX_KEY,
  secret: process.env.DROPBOX_SECRET,
  token: process.env.DROPBOX_TOKEN,
  transformWrite: function(fileObj, readStream, writeStream) {
    gm(readStream, fileObj.name()).resize('50', '50').stream().pipe(writeStream);
  }
});

Images = new FS.Collection("images", {
  stores: [dropboxStore],
  filter: {
    allow: { contentTypes: ["image/*"] }
  }
});
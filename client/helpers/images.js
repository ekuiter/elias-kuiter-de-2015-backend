function suggestedName(image) {
  var project = Projects.findOne({ imageIds: image._id });
  if (!project)
    return;
  var imageNumber = project.imageIds.indexOf(image._id) + 1;
  return project.slug + "-" + imageNumber;
}

Template.adminPicturesProjectColumn.helpers({
  project: function() {
    var project = Projects.findOne({ imageIds: this.value });
    return project && project.title;
  }
});

Template.adminPicturesActionRequiredColumn.helpers({
  hasSuggestedName: function() {
    return suggestedName(this.doc) + ".jpg" === this.doc.name();
  }
});

var eventMap = {
  "click [data-action=rename]": function(event) {
    function setForAllStores(doc, property, value) {
      Object.keys(Images.storesLookup).forEach(function(store) {
        doc[property](value, { store: store });
      });
    }
    var newName;
    if ($(event.target).data("prompt") !== undefined)
      newName = prompt("New filename:", suggestedName(this.doc));
    else
      newName = suggestedName(this.doc);
    if (!newName) return;
    newName = newName.replace(".jpg", "") + ".jpg";
    this.doc.name(newName);
    setForAllStores(this.doc, "name", newName);
  },

  "click [data-action=remove]": function() {
    var self = this;
    var imageId = self.doc._id;
    var project = Projects.findOne({ imageIds: imageId });
    if (project) {
      var imageIds = project.imageIds;
      var index = imageIds.indexOf(imageId);
      imageIds.splice(index, 1);
      Projects.update(project._id, { $set: { imageIds: imageIds } }, {}, function(err) {
        if (err && err.message.indexOf("You must specify at least") !== -1)
          alert("You can't remove a project's last image!");
        else if (err)
          alert(err);
        else
          self.doc.remove();
      });
    } else
      self.doc.remove();
  }
};

Template.adminPicturesActionRequiredColumn.events(eventMap);
Template.adminPicturesActionsColumn.events(eventMap);
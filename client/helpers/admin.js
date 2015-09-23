Template.AdminDashboardView.onRendered(function() {
  this.$(".dataTables_length select").val(50).change();
});

Template.adminCategoriesProjectsColumn.helpers({
  projects: function() {
    return _.map(this.value.fetch(), function(project) {
      return project.title;
    }).join(", ");
  }
});

Template.adminPicturesProjectColumn.helpers({
  project: function() {
    var project = Projects.findOne({ imageIds: this.value });
    return project && project.title;
  }
});

Template.adminPicturesActionsColumn.events({
  "click [data-action=rename]": function() {
    function setForAllStores(doc, property, value) {
      Object.keys(Images.storesLookup).forEach(function(store) {
        doc[property](value, { store: store });
      });
    }
    var imageId = this.doc._id;
    var project = Projects.findOne({ imageIds: imageId });
    if (project) {
      var imageNumber = project.imageIds.indexOf(imageId) + 1;
      var suggestedName = project.slug + "-" + imageNumber;
    }
    var newName = prompt("New filename:", suggestedName);
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
});

function fetchDatabaseStats() {
  Meteor.call("databaseStats", function(err, res) {
    Session.set("databaseStats", res);
  });
}

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
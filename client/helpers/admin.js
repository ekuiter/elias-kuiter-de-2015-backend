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
  "click .btn-delete": function() {
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
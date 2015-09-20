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
    this.doc.remove();
  }
});
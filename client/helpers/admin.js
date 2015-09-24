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
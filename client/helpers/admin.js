Template.adminCategoriesProjectsColumn.helpers({
  projects: function() {
    return _.map(this.value.fetch(), function(project) {
      return project.title;
    }).join(", ");
  }
});
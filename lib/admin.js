function CollectionWidget(collection) {
  this.template = "adminCollectionWidget";
  this.data = { collection: collection, class: "col-lg-3 col-xs-6" };
}

AdminConfig = {
  name: "Elias Kuiter",
  collections: {
    Categories: {
      icon: "tags",
      color: "red",
      tableColumns: [
        { label: "Order", name: "order" },
        { label: "Title", name: "title" },
        { label: "Projects", name: "projects()", template: "adminCategoriesProjectsColumn" }
      ],
      extraFields: ["slug"]
    },
    Projects: {
      icon: "code",
      color: "green",
      tableColumns: [
        { label: "Order", name: "order" },
        { label: "Title", name: "longOrShortTitle()" },
        { label: "Category", name: "category()", template: "adminProjectsCategoriesColumn" }
      ],
      extraFields: ["categorySlug", "title", "longTitle"],
      omitFields: ["descriptionHtml"]
    },
    Pictures: {
      icon: "picture-o",
      color: "yellow",
      tableColumns: [
        { label: "Filename", name: "name()", template: "adminPicturesFilenameColumn" },
        { label: "Project", name: "_id", template: "adminPicturesProjectColumn" },
        { template: "adminPicturesActionRequiredColumn" },
        { label: "Actions", template: "adminPicturesActionsColumn" }
      ],
      extraFields: ["copies", "original"],
      showEditColumn: false,
      showDelColumn: false,
      templates: {
        new: { name: "adminPicturesNew" }
      }
    }
  },
  dashboard: {
    homeUrl: "http://elias-kuiter.de",
    widgets: [
      new CollectionWidget("Categories"),
      new CollectionWidget("Projects"),
      new CollectionWidget("Pictures"),
      {
        template: "adminUploadWidget",
        data: {
          color: "maroon",
          label: "Files",
          icon: "upload"
        }
      },
      {
        template: "adminDatabaseWidget",
        data: {
          color: "purple",
          label: "Database",
          icon: "database"
        }
      }
    ]
  },
  // non-documented option to show a login form (or any other route) if the user is not authenticated
  nonAdminRedirectRoute: "/"
};

Meteor.startup(function() {
  AdminDashboard.addSidebarItem("Database", AdminDashboard.path("database"), { icon: "database" });
});

/* This helper is copied from https://github.com/yogiben/meteor-admin/blob/master/lib/client/js/helpers.coffee.
 I used this to remove the (irrelevant) Meteor.users collection from the dashboard and sidebar (the routes still exist).
 TODO: Maybe a future version of yogiben:admin could allow this without monkey-patching?
 */
UI.registerHelper("admin_collections", function() {
  var collections = {};
  if (typeof AdminConfig !== 'undefined' && typeof AdminConfig.collections === 'object')
    collections = AdminConfig.collections;
  // remove Meteor.users collection (see above)
  delete collections.Users;
  return _.map(collections, function(obj, key) {
    obj = _.extend(obj, { name: key });
    obj = _.defaults(obj, { label: key, icon: 'plus', color: 'blue' });
    return obj = _.extend(obj, {
      viewPath: Router.path("adminDashboard" + key + "View"),
      newPath: Router.path("adminDashboard" + key + "New")
    });
  });
});
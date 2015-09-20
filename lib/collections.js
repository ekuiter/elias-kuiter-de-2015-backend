var Schemas = {};

var projectSchema = {
  title: {
    type: String,
    label: "Title"
  },
  slug: {
    type: String,
    label: "Slug"
  },
  order: {
    type: Number,
    label: "Order",
    defaultValue: 999
  },
  categorySlug: {
    type: String,
    label: "Category",
    autoform: {
      options: function() {
        return _.map(Categories.find().fetch(), function(category) {
          return { label: category.title, value: category.slug };
        });
      }
    }
  },
  description: {
    type: String,
    label: "Description",
    autoform: {
      rows: 10
    }
  },
  descriptionHtml: {
    type: String,
    optional: true,
    autoValue: function() {
      var description = this.field("description");
      if (Meteor.isServer && description.isSet)
        return marked(description.value);
    }
  },
  images2: {
    type: [String],
    label: "Images",
    minCount: 1
  },
  "images2.$": {
    autoform: {
      afFieldInput: {
        type: "fileUpload",
        collection: "Images",
        accept: "image/*"
      }
    }
  },
  actions: {
    type: [Object],
    label: "Actions",
    optional: true
  },
  "actions.$.title": {
    type: String,
    label: "Title",
    defaultValue: "Website ansehen"
  },
  "actions.$.url": {
    type: String,
    label: "URL",
    regEx: SimpleSchema.RegEx.Url,
    defaultValue: "http://"
  },
  githubRepository: {
    type: String,
    label: "GitHub repository",
    optional: true
  },
  twoColumnLayout: {
    type: Boolean,
    label: "Two-column layout",
    defaultValue: false
  }
};

Schemas.Project = new SimpleSchema(projectSchema);

Projects.attachSchema(Schemas.Project);
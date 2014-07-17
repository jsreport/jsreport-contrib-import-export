define('import.toolbar.view',["app", "core/view.base", "core/utils", "jquery"], function(app, ViewBase, Utils, $) {
    return ViewBase.extend({
        tagName: "li",
        template: "import-toolbar",

        initialize: function() {
            _.bindAll(this, "importCommand");
        },

        onDomRefresh: function() {
            var self = this;

            this.uploader = $(this.$el).find('#import-fine-uploader').fineUploader({
                request: {
                    endpoint: function() {
                        return app.serverUrl + 'api/import-export/' + self.model.get("shortid");
                    },
                },
                multiple: false,
                forceMultipart: true,
                autoUpload: true,
                validation: {
                    allowedExtensions: ['json'],
                    sizeLimit: 2097152,
                },
            }).on("complete", function(event, id, filename, response) {
                self.model.fetch();
            });
        },

        events: {
            "click #import": "importCommand",
        },

        onValidate: function() {
            var res = [];

            if (this.model.get("shortid") == null)
                res.push({
                    message: "You can import only to existing templates. Save it first!"
                });

            return res;
        },

        importCommand: function() {
            if (!this.validate())
                return;

            this.$el.find('input[type=file]').trigger('click');
        },
    });
});
define('export.toolbar.view',["app", "core/view.base", "core/utils", "jquery"], function(app, ViewBase, Utils, $) {
    return ViewBase.extend({
        tagName: "li",
        template: "export-toolbar",
    });
});
define(["app", "marionette", "backbone", "import.toolbar.view", "export.toolbar.view"],
    function(app, Marionette, Backbone, ImportView, ExportView) {
        
        app.on("template-extensions-toolbar-render", function(context) {
            var importView = new ImportView({ model: context.template });
            importView.templateView = context.view;
            context.region.show(importView, "import");
            
            var exportView = new ExportView({ model: context.template });
            exportView.templateView = context.view;
            context.region.show(exportView, "export");
        });
    });

define(["app", "core/view.base", "core/utils", "jquery"], function(app, ViewBase, Utils, $) {
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
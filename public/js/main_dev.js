define(["app", "marionette", "backbone", "./import.toolbar.view", "./export.toolbar.view"],
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
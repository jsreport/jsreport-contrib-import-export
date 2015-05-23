var fs = require("fs");

module.exports = function (reporter, definition) {

    reporter.on("express-configure", function (app) {

        app.get("/api/import-export/:shortid", function (req, res, next) {
            reporter.documentStore.collection("templates").find({shortid: req.params.shortid}).then(function (result) {
                var template = result[0];

                delete template._id;
                delete template.shortid;

                res.send(template);
            }).catch(function (e) {
                next(e);
            })
        });

        app.post("/api/import-export/:shortid", function (req, res, next) {

            for (var f in req.files) {
                var file = req.files[f];

                fs.readFile(file.path, function (err, content) {
                    if (err) {
                        return next(err);
                    }

                    content = content.toString();

                    var update = JSON.parse(content);

                    reporter.documentStore.collection("templates").update({shortid: req.params.shortid}, {$set:  update}).then(function () {
                        res.send({success: true})
                    }).catch(function(e) {
                        next(e);
                    })
                });
            }
        });
    });
};
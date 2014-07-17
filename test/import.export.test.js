var describeReporting = require("jsreport").describeReporting,
    importExport = require("../import.export.js"),
    path = require("path"),
    should = require("should"),
    request = require("supertest");


describeReporting(path.join(__dirname, "../"), ["express", "templates", "jsreport-import-export"], function(reporter) {
    describe('import-export', function() {

        it('export', function(done) {
            reporter.templates.create(reporter.context, { content: "foo" }).then(function(template) {
                request(reporter.options.express.app)
                    .get('/api/import-export/' + template.shortid)
                    .expect(200)
                    .end(function(err, res) {
                        JSON.parse(res.text).content.should.equal("foo");
                        done();
                    });
            });
        });

        it('import - export should equal', function(done) {
            reporter.templates.create(reporter.context, { content: "foo" }).then(function(template) {
                request(reporter.options.express.app)
                    .post('/api/import-export/' + template.shortid)
                    .attach('template', path.join(__dirname, 'testTemplate.json'))
                    .expect(200)
                    .end(function(err, res) {
                        request(reporter.options.express.app)
                            .get('/api/import-export/' + template.shortid)
                            .expect(200)
                            .end(function(err, res) {
                                JSON.parse(res.text).content.should.equal("foo2");
                                done();
                            });
                    });
            });
        });
    });
});
var describeReporting = require("jsreport").describeReporting,
    path = require("path"),
    request = require("supertest"),
    should = require("should");

describeReporting(path.join(__dirname, "../"), ["express", "templates", "jsreport-import-export"], function(reporter) {
    describe('import-export', function() {

        it('export', function(done) {
            reporter.documentStore.collection("templates").insert({ content: "foo" }).then(function(template) {
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
            reporter.documentStore.collection("templates").insert({ content: "foo" }).then(function(template) {
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
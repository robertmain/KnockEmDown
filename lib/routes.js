module.exports = exports = function(app, templateData){
	app.get("/", function(req, res) {
		res.render("slides", templateData);
	});

	app.get("/remote", function(req, res){
		res.render('remote', templateData);
	});

	app.get("/notes", function(req, res){
		res.render('notes', templateData);
	});
};
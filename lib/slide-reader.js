var jsdom = require("jsdom-nogyp");
var fs = require('fs');
var handlebars = require('handlebars');
module.exports = exports = function(dirname, callback){
	var slides = [];
	var slideHtml = "";

	fs.readdirSync(dirname).sort().forEach(function(file){
		slideHtml += fs.readFileSync(dirname+"/"+file, {"encoding": "utf8"});
	});
	slideHtml = handlebars.compile(slideHtml)({});
	jsdom.env(
		slideHtml,
		function (errors, window) {
			var nodeList = window.document.querySelectorAll("section.slide");
			for(var i=0; i<nodeList.length;i++){
				slides.push(nodeList.item(i).outerHTML);
			}
			callback(slides);
		}
	);
};
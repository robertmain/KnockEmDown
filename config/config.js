var self
module.exports = exports = self = {};

/* These are relative to the app root */
self.directories = {
	"slides": "./slides",
	"slide_templates": "./slide-templates"
};

self.webserver = {
	"ip": "0.0.0.0",
	"port": process.argv[2] || "8000"
};

self.presentation = {
	/* Use this to tell KnockEmDown where to find your themes */
	"theme": "knockemdown",
	/* /User configurable stuff */

	/* You should not need to touch anything in here, you were warned... */
	"theme_directory": "./themes"
	/* You should not need to touch anything in here, you were warned... */
};
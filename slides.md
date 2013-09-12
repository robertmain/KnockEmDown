#Node.JS
###Presented By Robert Main


##To Do
1. Server.JS:
  1. Accept pin code from audience view(set by pressing a shortkey and typing the code in)

1. Presenter Remote:
	1. Ask for pin before connection
	1. Reload slides button

1. Presenter/Notes View:
	1. Get speaker notes working with markdown
	1. Show upcoming slide(s)
	1. Show connected remote(s)

1. Presentation View
	1. Build a nicer looking template

1. Overall
	1. Read theme location from config file

<aside class="notes">
	<ul>
		<li>Bullet for speaker notes</li>
		<li>Another Bullet for speaker notes</li>
		<li>Yet Another Bullet for speaker notes</li>
		<li>Bullet all the things!</li>
		<li>Poo</li>
	</ul>
</aside>



##Making An HTTP Server
```language-javascript
http.createServer(function(req, res){
	res.writeHead(200, {"Content-Type": "text/plain"});
}).listen(8000);
```
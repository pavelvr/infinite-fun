---
pagetitle: A minimalist approach to jQuery
keywords: minimalism, jquery
---

[Posts](index.md) &raquo; _...here_

## A minimalist approach to jQuery
##### 2016.06.05 {.date}

[jQuery](http://jquery.com/) could be easily the best single thing happened to JavaScript. Since jQuery there is a reignited interest in JavaScript, browsers have been making their JavaScript engines more and more better, there is even a lot of people that is saying they are "learning jQuery" instead of "learning JavaScript" (as if jQuery was a language by itself). That is how good jQuery is.

But, do we really need jQuery? Don't get me wrong, what I mean is: do we really need to start every single web project by including jQuery as one of the libraries we'll be using?

Being an amazing library, jQuery offers a really good and useful set of functions, from it's CSS selector engine to AJAX, effects, etc. My point is: do we use all these functions, or at least most of them? I don't think so, but we include jQuery no matter what.

Most of us use only the CSS selector engine to manipulate the DOM, attach functions to events, manipulate some CSS on the fly, and maybe do some AJAX calls. The size of the minified version of jQuery 1.11.3 is aproximately 95 KiB. How many of that bytes will I really be using on my project? 30%? Maybe 50%?

The jQuery Team was kind enough to create this standalone library with only their great CSS selector engine called [sizzle.js](https://sizzlejs.com/), it's size is less than 20 KiB (v2.3.1-pre), so now we can do something like:

```javascript
Sizzle('a.external').forEach(function(externalLink) {
	externalLink.target = '_blank';
});
```

You just lost all the other stuff available in jQuery though, even the most basic, like the `on()` function, used to attach callback functions to events. This is what I'm using, maybe it is too simplistic, but it's doing the job:

```javascript
// doing 'return this;' on every function so I can chain them
// Sizzle('ul#toolbar li')
// 		.on('click', function() {
//			console.log(this.innerText);
//		})
//  	.css({'size': '1.3em'});

Object.prototype.on = function (evnt, funct) {
	if (this.attachEvent) {
		this.attachEvent('on' + evnt, funct)
	} else {
		this.addEventListener(evnt, funct, false);
	}

	return this;
}

Array.prototype.on = function (evnt, funct) {
	this.forEach(function(element) {
		element.on(evnt, funct);
	});

	return this;
}

Object.prototype.css = function (cssRules) {
	for(var attr in cssRules) {
		if(typeof(cssRules[attr]) !== "function") {
			this.style[attr] = cssRules[attr];
		}
	}

	return this;
}

Array.prototype.css = function (cssRules) {
	this.forEach(function(element) {
		element.css(cssRules);
	});

	return this;
}
```

Then I use it this way:

```javascript
var loaded = function() {
	console.log("Page loaded! Doing some cool stuff!");

	Sizzle('a').on('click', function() {
		 // not quite useful, right?
		alert(this.href);
	})
	.css({
			'text-decoration': 'none',
			'border-bottom': '1px dashed blue'
	});
}

window.on('load', loaded);
```

Once again let me be clear: jQuery is a great, amazing, beautiful library. What I'm trying to say here is: we tend to use prebuilt libraries, components, etc., without thinking even for a second if we really need them. Most of the time we need only one or two features from a library/component, features that we could write by ourself, with more or less success, in a relative short amount of time, but we don't stop to think about that. Maybe you could call it the culture of the prebuilt, or the culture of the libraries.

This is a phenomenon I usually see in the Java or the .Net world. Huge-sized applications, with a lot of dependencies you can't understand what are they used for, because you don't see them in the functionality included into the final app.

For example, a lot of people use DevExpress to build their UIs, maybe the Grid component, but the grid depends on another component, and this other component on another one, and so on. Finally, the application is about 20 MiB, and you just wanted to use the Grid because of it's filtering functionality. Flash news: the are a lot of grid components in github, with filtering functionality, they are open source, and depend on nothing else than WinForms! Also, they are considerably smaller.

#### Pros and Cons of a minimalist approach:

_Pros_: Smaller, faster applications, with less dependencies and a considerably smaller memory footprint.

_Cons_: Sometimes we have to actually write some code (sorry, is this a con?).

_**Conclusion**_: If you **really** need a library, go for it! But, just take some time checking if there is an alternative, minimalist approach/solution. In my personal experience, this usually brings more benefits than not.


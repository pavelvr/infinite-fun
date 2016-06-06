/* your js code here */

// doing 'return this;' on every function so I can chain them
// Sizzle('ul#toolbar li')
// 		.on('click', function() { console.log(this.innerText); })
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

function fixExternalLinksTarget()
{
	var domain = /^https?:.+/.test(window.location.href)
		? window.location.href.split('/')[2]
		: null;

	var test = (domain !== null)
		? function(href, domain) { return href.split('/')[2] !== domain; }
		: function(href, domain) { return /^(?:ht|f)tps?:.+/.test(href) };

	Sizzle('a').forEach(function(link) {
		if (test(link.href, domain))
			link.target = '_blank';
	});
}

window.on('load', fixExternalLinksTarget);

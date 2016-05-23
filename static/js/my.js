/* your js code here */
Object.prototype.on = function (evnt, funct) {
	return (this.attachEvent)
		? this.attachEvent('on' + evnt, funct)
		: this.addEventListener(evnt, funct, false);
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

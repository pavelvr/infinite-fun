---
pagetitle: marksite.sh - Static Website Generator
keywords: markdown, bash, static website generator
---

[Projects](index.md) &raquo; _marksite.sh_

### marksite.sh

Pandoc + MarkDown based static website generator.

- **Project Homepage**: [http://www.github.com/pavelvr/marksite.sh](http://www.github.com/pavelvr/marksite.sh)
- **Language**: bash
- **License**: GPLv3+
- **Platform**: Tested in Windows XP - 10. Since it's written in bash, should run in Linux/Unix.
- **Features**:
	- Completely portable on Windows (all needed unix tools, node, lessc, a bash shell included)
	- A simple CLI API, with only a few commands, trying to keep it simple
	- MarkDown for the content
	- Pandoc as MarkDown to HTML conversion engine, using pandoc's HTML5 template, or a custom template
	- LESS support
	- In linux/unix, you should need only the main script (`marksite.sh`), and off course pandoc, and node and lessc (if you wanna use LESS for your stylesheets)
	- (Re)generation of changed/added pages/stylesheets/other only, not the whole website

_**Note**: This is the tool this website is made with._

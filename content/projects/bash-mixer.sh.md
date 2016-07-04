---
pagetitle: bash-mixer.sh
keywords: bash-mixer, bash
---

[Projects](index.md) &raquo; _...here_

### bash-mixer.sh

A simple amixer wrapper + libnotify to control volume via command line or keyboard shortcuts

- **Project Homepage**: [http://pavelvr.github.io/projects/bash-mixer.sh.html](bash-mixer.sh.md)
- **Language**: bash
- **License**: GPLv3+
- **Platform**: Linux/Unix + ALSA
- **Features**:
	- A simple CLI API, with only a few commands, trying to keep it simple
	- Step up/down main volume
	- Mute/unmute volume
	- Toggle Mic
	- Displays a libnotify notification with current volume

In Linux I use [echinus](http://plhk.ru/) or [OpenBox](http://www.openbox.org/), with a lot of custom keyboard shortcuts. Being able to control the volume is something I think should be really easy, with no need to use the mouse, the mouse scroll or even open a whole application just to mute it. The same for playing/pausing/stopping music, so, I write this kind of scripts in order to be able to link some actions to keyboard combinations.

Here is the code:

```bash
#!/bin/sh

# Bash amixer-based mixer for ALSA
#
# Version: 0.2
# Author: Pável Varela Rodríguez <neonskull@gmail.com>
#
# Use it by setting some keybinding or calling it directly from CLI
#
# Configure as needed:
#     MASTER_CONTROL
#     STEP
#
# Interface: All defined function names
#

# User's Settings
MASTER_CONTROL="Master"  # ALSA control yo want to modify the volume to
STEP=3                   # Percent amount to increase/decrease
OSD_TIMEOUT=1500         # Miliseconds


AmixerGet="amixer get ${MASTER_CONTROL}"
AmixerSet="amixer sset ${MASTER_CONTROL}"

getMasterVolume () { ${AmixerGet}|tail -n1|sed -r 's/.*\[(.*)%\].*/\1/'; }
setMasterVolume () { ACTION="$1";${AmixerSet} ${STEP}"%"${ACTION} unmute > /dev/null; }


volumeUp () {  setMasterVolume "+"; }
volumeDown () { setMasterVolume "-"; }

mute () { ${AmixerSet} mute > /dev/null; }
unmute () { ${AmixerSet} unmute > /dev/null; }


# Main Interface
up () { volumeUp; }
down () { volumeDown; }
togglemute () { [[ -n $(${AmixerGet}|grep "\[on\]") ]] && mute || unmute; }
togglemic () { [[ -n $(amixer get Mic|grep "\[on\]") ]] && amixer sset Mic mute || amixer sset Mic unmute; }
get () { getMasterVolume; }
osd ()
{
    BODY="Current Volume Level: "$(getMasterVolume)"%"
    notify-send -t ${OSD_TIMEOUT} -i "info" "Volume" "${BODY}"
}


# This do the interface magic (thanks Bash ;-))
$@
```


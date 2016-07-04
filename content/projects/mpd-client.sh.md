---
pagetitle: mpd-client.sh
keywords: mpd-client, bash, mpd, mpc, music player daemon
---

[Projects](index.md) &raquo; _...here_

### mpd-client.sh

A simple mpc (Music Player Daemon's client) wrapper + libnotify to control your music via command line or keyboard shortcuts

- **Project Homepage**: [http://pavelvr.github.io/projects/mpd-client.sh.html](mpd-client.sh.md)
- **Language**: bash
- **License**: GPLv3+
- **Platform**: Linux/Unix + ALSA
- **Features**:
	- A simple CLI API, with only a few commands, trying to keep it simple
	- Starts/kills mpd, mpd client and mpd GUI client (configurable GUI client)
	- Plays/pauses/stops music (starting mpd if needed)
	- Controls volume
	- Forward/rewind
	- Displays libnotify notification with current state and song information

In Linux I use [echinus](http://plhk.ru/) or [OpenBox](http://www.openbox.org/), with a lot of custom keyboard shortcuts. Being able to control the volume is something I think should be really easy, with no need to use the mouse, the mouse scroll or even open a whole application just to mute it. The same for playing/pausing/stopping music, so, I write this kind of scripts in order to be able to link some actions to keyboard combinations.


Here is the code:

```bash
#!/bin/sh
#
# mpd-client
# MPD Controlling Client
# Depends upon mpc 
#
# Author: Pável Varela Rodríguez <neonskull@gmail.com>
# License: GPL v2
# 
# Version: 0.1
#

MPD_GUI_CLIENT=ario

START_PAUSED=true
STATE_FILE="$HOME/.mpd/mpdstate"

CURRENT_FORMAT="%artist%;;%album%;;%title%;;"
ICON_THEME="OxygenRefit2-black-version"
ICON_SIZE="48x48"
PLAYING_ICON="/actions/player_play.png"
PAUSED_ICON="/actions/player_pause.png"

mpd_pid   () { echo "$(pidof mpd)"; }

start     ()
{
    if [ -z "$(mpd_pid)" ]
    then
        [[ "${START_PAUSED}" = true ]] && \
            sed -i "s/^state\:.*/state\:\ pause/;s/^time\:.*/time\:\ 0/" ${STATE_FILE};
        mpd 2>/dev/null;
    fi
}

quit	   () { hidegui;stop;mpd --kill; }

guipid     () { echo $(ps -eo comm,pid=|grep -E "$MPD_GUI_CLIENT\ +[0-9]+"|awk '{print $2}'); }
showgui    () { start;eval "${MPD_GUI_CLIENT} 2>/dev/null &"; }
hidegui    ()
{
    [[ -n "$1" ]] && pid="$1" || pid=$(guipid)
    [[ -n "$pid" ]] && kill -9 $pid
}

togglegui  ()
{
    pid=$(guipid)
    [[ -z "$pid" ]] && showgui || hidegui $pid
}

get_st     () { mpc status|grep -E "^\[[a-z]+\].*"; }
state      () { echo "$(get_st|cut -d'[' -f2|cut -d] -f1)"; }

playing    () { [[ "$(state)" = "playing" ]] && echo "true"; }
paused     () { [[ "$(state)" = "paused" ]]  && echo "true"; }
position   () { echo "$(get_st|awk '{print $3}'|cut -d'/' -f1)"; }
positionp  () { echo "$(get_st|cut -d'\' -f1)"; }
position_o () { echo "$(get_st|awk '{print $3" "$4}')"; }

current    () { mpc current -f ${CURRENT_FORMAT}$(position);}

next       () { mpc -q next; }
previous   () { mpc -q prev; }
play       () { mpc -q play; }
pause      () { mpc -q pause; }
playpause  () { start;mpc -q toggle; }
stop       () { mpc -q stop; }

forward    () { mpc -q seek +10; }
rewind     () { mpc -q seek -10; }

volup      () { mpc -q volume +5; }
voldown    () { mpc -q volume -5; }

osd        ()
{
    [[ -z $ICON_THEME ]] && \
        ICON_THEME=$(grep gtk-icon-theme-name $HOME/.gtkrc-2.0|cut -d"\"" -f2)
    [[ -d "$HOME/.local/share/icons/${ICON_THEME}" ]]        && \
        ICON_THEME="$HOME/.local/share/icons/${ICON_THEME}/" || \
        ICON_THEME="/usr/share/icons/${ICON_THEME}/"
    
    _icon=$(eval "echo \${$(state|tr \"a-z\" \"A-Z\")_ICON}")
    ICON=${ICON_THEME}${ICON_SIZE}$_icon

    _current=$(current)
    ARTIST=$(echo $_current|awk -F ";;" '{print $1}')
    ALBUM=$(echo $_current|awk -F ";;" '{print $2}')
    TITLE=$(echo $_current|awk -F ";;" '{print $3}')
    [[ -z "${TITLE}" ]] && TITLE="..."

    notify-send -u low -t 3000 --icon=$ICON \
        "$TITLE" "$(position_o)\nby: ${ARTIST}\nfrom: ${ALBUM}"
}

# As usual in my scripts, $@ does all the magic
$@


```


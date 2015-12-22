#!/usr/bin/env bash
# sudo apt-get install sox libsox-fmt-mp3 id3v2 gnome-icon-theme-full 


MUSIC_DIR="/home/klaus/Music"

pkill rec -U ${USER}

if [[ $# != 3 ]] 
then
	notify-send -i /usr/share/icons/gnome/48x48/actions/gtk-media-record.png -t 300 "done" "Stopped recording"
	echo "usage: $0 artist album title"
	exit -1;
fi

DEST_DIR="${MUSIC_DIR}/${1}/${2}"

mkdir -p "${DEST_DIR}"


cd "${DEST_DIR}"
COUNT=$(LANG=C; ls -l | wc -l)
DEST_FILE=$( printf "${DEST_DIR}/%.2i - ${1} - ${3}.mp3" ${COUNT} )

rec -q -c 2 "${DEST_FILE}" &

PID=$!

notify-send -i /usr/share/icons/gnome/48x48/actions/gtk-media-record.png -t 1000 "${3}" "von ${1} aus ${2}"
echo "wait $PID"
wait $PID 
echo "id3v2"
id3v2 -a "${1}" -A "${2}" -t "${3}" "${DEST_FILE}" ;

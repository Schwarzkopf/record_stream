// ==UserScript==
// @name         Amazon Music
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Klaus Schwarzkopf
// @match        https://www.amazon.de/gp/dmusic/cloudplayer/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @grant        none

// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
this.$ = this.jQuery = jQuery.noConflict(true);

var dest_url= "https://localhost:8080/amazon_music.html";

var timeout = 100
$(document).ready(function(){

    var title = "";
    var artist = "";
    var album = "";

    var title_old = "";
    var artist_old = "";
    var album_old = "";

    function receive_observer(mutations) {
        // For the sake of...observation...let's output the mutation to console to see how this all works
        mutations.forEach(function(mutation) {
            console.log(mutation.type);
            setTimeout(function (){
                //something you want delayed
                get_data();
            }, 10);
        });    
    }

    var observer = new MutationObserver(receive_observer);

    var observer2 = new MutationObserver(receive_observer);

    // Notify me of everything!
    var observerConfig = {
        attributes: true, 
        childList: true, 
        characterData: true 
    };

    // Node, config
    // In this case we'll listen to all changes to body and child nodes
    var targetNode = document.body;

    observer2.observe(targetNode, observerConfig);

    var targetNode = null;

    setTimeout(function (){
        try_observer();
    }, 100);

    function try_observer()
    {
        targetNode = document.querySelector('.playbackControlsView');

        if(targetNode != null)
        {
            observer.observe(targetNode, observerConfig);
        }else{

            setTimeout(function (){
                try_observer();
            }, 100);
        }
    }

    function get_data()
    {

        title = $('.trackTitle > span').text();
        artist = $('.trackArtist > a').text();
        album = $('.trackSourceLink > span > a').text();

        //console.log("get_data: "+artist + " - " + album + " - " + title);
        if(title != title_old || artist != artist_old || album != album_old)
        {


            console.log(artist + " - " + album + " - " + title);

            var value = '{ "artist": "' + artist + '", "album": "' + album +'", "title": "' + title + '"}';

            title_old = title;
            artist_old = artist;
            album_old = album;

            $.ajax({
                type: "GET",
                url: dest_url,
                dataType: 'jsonp',
                async: true,
                data: {
                    music_data: value 
                },
                /*
                success: function (msg) {
                    //alert('Success');
                    if (msg != 'success') {
                        //alert('Error: Konnte nicht speichern! ' + msg);
                        //console.log("error" + msg);
                    }
                }
                */
            });


        }


    }

});

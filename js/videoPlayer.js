var overlayWidth = $('.overlay').width();
var overlayHeight = $('.overlay').height();

(function (window, document, array) {

    var video = document.getElementsByTagName('video')[0],
        videoControls = document.getElementById('videoControls'),
        overlayControls = document.getElementById('overlayControls'),
        play = document.getElementById('play'),

        overlays,
        newone,
        mustshow,
        handled = [],
        timestamps = [[]],
        playProgressInterval,
        isVideoFullScreen = false,

        progressHolder = document.getElementById("progress_box"),
        playProgressBar = document.getElementById("play_progress"),

        fullScreenToggleButton = document.getElementById("fullScreen"),

        ie = (function () {
            // borrowed from Padolsey
            var undef,
                v = 3,
                div = document.createElement('div'),
                all = div.getElementsByTagName('i');

            while (
                div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
                    all[0]
                );

            return v > 4 ? v : undef;

        }());

    var videoPlayer = {

        init: function () {
            // If IE 8 or less, get outta here.
            if (ie < 9) {return;}

            // this is equal to the videoPlayer object.
            var that = this;

            // Helpful CSS trigger for JS.
            document.documentElement.className = 'js';

            // Get rid of the default controls, because we'll use our own.
            video.removeAttribute('controls');

            // When meta data is ready, show the controls
            video.addEventListener('loadeddata', this.initializeControls, false);

            // When play, pause buttons are pressed.
            this.handleButtonPresses();

            // When the full screen button is pressed...
            fullScreenToggleButton.addEventListener("click", function () {
                isVideoFullScreen ? that.fullScreenOff() : that.fullScreenOn();
            }, true);

            this.videoScrubbing();
        },


        initializeControls: function () {
            // When all meta information has loaded, show controls
            // and set the progress bar.
            videoPlayer.showHideControls();
        },


        showHideControls: function () {
            // Shows and hides the video player.
            video.addEventListener('mouseover', function () {
                videoControls.style.opacity = 1;
            }, false);

            videoControls.addEventListener('mouseover', function () {
                videoControls.style.opacity = 1;
            }, false);

            video.addEventListener('mouseout', function () {
                videoControls.style.opacity = 0;
            }, false);

            videoControls.addEventListener('mouseout', function () {
                videoControls.style.opacity = 0;
            }, false);
        },


        fullScreenOn: function () {
            isVideoFullScreen = true;

            // Set new width according to window width
            video.style.cssText = 'position: fixed; width:' + window.innerWidth + 'px; height: ' + window.innerHeight + 'px;';

            // Apply a classname to the video and controls, if the designer needs it...
            video.className = 'fullsizeVideo';
            videoControls.className = 'fs-control';
            fullScreenToggleButton.className = "fs-active control";
            overlayControls.className = 'fs-control';

            // Listen for escape key. If pressed, close fullscreen.
            document.addEventListener('keydown', this.checkKeyCode, false);
        },


        fullScreenOff: function () {
            isVideoFullScreen = false;

            video.style.position = 'static';
            video.className = '';
            video.style.cssText = '';
            fullScreenToggleButton.className = "control";
            videoControls.className = '';
            overlayControls.className = '';
        },


        handleButtonPresses: function () {
            // When the video or play button is clicked, play/pause the video.
            video.addEventListener('click', this.playPause, false);
            play.addEventListener('click', this.playPause, false);

            // When the play button is pressed,
            // switch to the "Pause" symbol.
            video.addEventListener('play', function () {
                play.title = 'Pause';
                play.innerHTML = '<span id="pauseButton">&#x2590;&#x2590;</span>';
                videoPlayer.trackPlayProgress();
            }, false);


            // When the pause button is pressed,
            // switch to the "Play" symbol.
            video.addEventListener('pause', function () {
                play.title = 'Play';
                play.innerHTML = '&#x25BA;';
                videoPlayer.stopTrackingPlayProgress();
            }, false);


            // When the video has concluded, pause it.
            video.addEventListener('ended', function () {
                this.currentTime = 0;
                this.pause();
            }, false);
        },


        playPause: function () {
            if (video.paused || video.ended) {
                if (video.ended) {
                    video.currentTime = 0;
                }
                video.play();
            }
            else {
                video.pause();
            }
        },


        // Every 50 milliseconds, update the play progress.
        trackPlayProgress: function () {
            (function progressTrack() {
                videoPlayer.updatePlayProgress();
                playProgressInterval = setTimeout(progressTrack, 50);
            })();
        },


        updatePlayProgress: function () {
            playProgressBar.style.width = ((video.currentTime / video.duration) * (progressHolder.offsetWidth)) + "px";
        },


        // Video was stopped, so stop updating progress.
        stopTrackingPlayProgress: function () {
            clearTimeout(playProgressInterval);
        },


        videoScrubbing: function () {
            progressHolder.addEventListener("mousedown", function () {
                videoPlayer.stopTrackingPlayProgress();

                videoPlayer.playPause();

                document.onmousemove = function (e) {
                    videoPlayer.setPlayProgress(e.pageX);
                }

                progressHolder.onmouseup = function (e) {
                    document.onmouseup = null;
                    document.onmousemove = null;

                    console.log("spostato a:", videoPlayer.currentTime, videoPlayer.duration);

                    video.play();
                    videoPlayer.setPlayProgress(e.pageX);
                    videoPlayer.trackPlayProgress();
                }
            }, true);
        },

        setPlayProgress: function (clickX) {
            var newPercent = Math.max(0, Math.min(1, (clickX - this.findPosX(progressHolder)) / progressHolder.offsetWidth));
            video.currentTime = newPercent * video.duration;
            playProgressBar.style.width = newPercent * (progressHolder.offsetWidth) + "px";
        },

        findPosX: function (progressHolder) {
            var curleft = progressHolder.offsetLeft;
            while (progressHolder = progressHolder.offsetParent) {
                curleft += progressHolder.offsetLeft;
            }
            return curleft;
        },

        // Determines if the escape key was pressed.
        checkKeyCode: function (e) {
            e = e || window.event;
            if ((e.keyCode || e.which) === 27) {videoPlayer.fullScreenOff();}
        }

    };

    $(document).ready(function () {

        $.post("php/get-overlays.php",
            {
                project: 1
            },
            function (data, status) {
                console.log(data);
                overlays = JSON.parse(data);
                if (overlays !== 0) {
                    console.log(overlays);
                    $.post("php/get-timestamps.php",
                        function (data, status) {
                            timestamps = JSON.parse(data);
                            if(timestamps !== 0){
                                console.log(timestamps);
                            }
                        });
                } else {
                    alert("No overlays");
                }
            });

    });

    $("video").on("ended", function(event){
       handled.length = 0;
    });

    $("video").on("timeupdate", function (event) {
        for(var i = 0; i < overlays.length; i++) {
            mustshow = false;
            for( var k = 0; k < timestamps.length; k++) {
                if($('#player').prop('currentTime') >= timestamps[k].from && $('#player').prop('currentTime') < timestamps[k].to && overlays[i].id === timestamps[k].overlays){
                    newone = timestamps[k];
                    mustshow = true;
                    break;
                }
            }
            if(!mustshow){
                $('#overlayControls').find('#'+overlays[i].id).remove();
                for(var z = 0; z < timestamps.length; z++){
                    if(Number(timestamps[z].overlays) == Number(overlays[i].id)){
                        if(findIndex(handled, timestamps[z].id) != -1) {
                            var pos = findIndex(handled, timestamps[z].id);
                            handled.splice(pos, 1);
                        }
                    }
                }
            }
            if(typeof newone !== 'undefined' && mustshow) {
                var bool = find(handled, newone.id);
                if (handled.length <= 0 || !bool) {
                    // console.log($('#overlayControls').find('#'+overlays[i]['id']).length);
                    if ($('#overlayControls').find('#' + overlays[i].id).length === 0) {
                        var toAppend = overlays[i].type.replace("%id", overlays[i].id);
                        $('#overlayControls').append(toAppend);
                        var appended = $('#'+overlays[i].id);
                        appended.css('position', 'absolute');
                        appended.css('top', newone.y+"px");
                        appended.css('left', newone.x+"px");
                        var splitted = overlays[i].props.split('|');
                        for(var f = 0; f < splitted.length; f++){
                            var pair = splitted[f].split(':');
                            if(pair[0].charAt(0) == "!"){
                                appended.css(pair[0].substr(1), pair[1]);
                            }else if(pair[0] == "innerHtml"){
                                appended.html(pair[1]);
                            }else {
                                appended.attr(pair[0], pair[1]);
                            }
                        }
                        handled.push(newone.id);
                    } else {
                        console.log("changing "+newone.id);
                        $('#' + overlays[i].id).css('top', newone.y + "px");
                        $('#' + overlays[i].id).css('left', newone.x + "px");
                        for(var m = 0; m < timestamps.length; m++){
                            if(Number(timestamps[m].overlays) == Number(overlays[i].id)){
                                if(findIndex(handled, timestamps[m].id) != -1) {
                                    var mpos = findIndex(handled, timestamps[m].id);
                                    handled.splice(mpos, 1);
                                }
                            }
                        }
                        handled.push(newone.id);
                    }
                }else{
                }
            }
        }
    });

    function find(array, id){
        for(var i = 0; i < array.length; i++) {
            if (Number(array[i]) == Number(id)) {
                return true;
            }
        }
        // console.log("false");
        return false;
    }

    function findIndex(array, id){
        for(var i = 0; i < array.length; i++){
            if(Number(array[i]) == Number(id)){
                return i;
            }
        }
        return -1;
    }

    videoPlayer.init();

})(this, document, []);

function openNav() {
    $("#mySidenav").css('width', '350px');
    $("#main").css('margin-left', '350px');
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}

$(document).ready(function(){
    
    $('.draggable').draggable({
        stack: '.draggable',
        revert: true,
        cursor: 'move',
        helper: function(event, ui){
            var element = event.target;
            if($(element).attr('icon') == 'code'){
                return '<paper-button raised class="dragging white">BUTTON</paper-button>';
            }else if($(element).attr('icon') == 'link'){
                return '<paper-button class="dragging link">LINK</paper-button>';
            }else{
                return '<span style="color:white;" class="dragging">PLACEHOLDER</span>';
            }
        }
    });
    
    $('.overlay').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });
    
    $(window).resize(function(event){
        var hVariation = Math.abs(( $('.overlay').width() / window.overlayWidth ));
        var vVariation = Math.abs(( $('.overlay').height() / window.overlayheight ));
        console.log(hVariation);
        $('.overlay').children().each(function(){
            var newLeft = ( parseFloat($(this).css('left')) / Number(window.overlayWidth) ) * Number($('.overlay').width());
            var newTop = ( parseFloat($(this).css('top')) / Number(window.overlayHeight) ) * Number($('.overlay').height());
            $(this).css('left', newLeft);
            $(this).css('top', newTop);
            $(this).animate({transform: 'scale('+hVariation+','+vVariation+')'});
        });
        window.overlayWidth = $('.overlay').width();
        window.overlayHeight = $('.overlay').height();
    });
});

function handleDrop(event, ui){
    var helper = $(ui.helper).clone().removeClass('ui-draggable-dragging');
    var pj = 0;
    var type = $('<div/>').append($(helper).clone()).html();
    var props = "";
    
    var eui = ui;
    
    var width = Math.floor($('.overlay').width() / 2);
    var height = Math.floor($('.overlay').height() / 2);
    ui.draggable.draggable( 'option', 'revert', false );
    
    $.ajax({
        url: "php/save-overlay.php",
        method: "POST",
        data: {'project': pj, 'type': type, 'props': props},
        success: function(data){
            var id = Number(data);
            var newleft = eui.position.left - $('.overlay').offset().left;
            var newtop = eui.position.top - $('.overlay').offset().top;
            $(helper).css("position", "absolute");
            $(helper).css("left", newleft);
            $(helper).css("top", newtop);
            $(helper).data("id", id);
            $(helper).draggable({
                containment: "parent",
                start: function(event, ui) {
                    $(this).draggable("option", "cursorAt", {
                        left: 0,
                        top: 0
                    }); 
                },
                stop: function(event, ui){

                    //TODO: capire come recuperare il valore di to;
                    //TODO: passare il valore del nuovo overlay al timestamp;

                    var mui = ui;

                    var to = $('#player').prop('currentTime') + 10;

                    console.log(mui.position.left);
                    console.log(mui.position.top);
                    console.log($('#player').prop('currentTime'));
                    console.log(to);
                    console.log($(helper).data("id"));

                    $.ajax({
                        url: "php/save-timestamp.php",
                        method: "POST",
                        data: {'left': mui.position.left, 'top': mui.position.top, 'timefrom': Number($('#player').prop('currentTime')), 'timeto': Number(to), 'visible': 0, 'overlay': $(helper).data("id")},
                        success: function(data){
                            console.log(data);
                        }
                    });
                }
            });
            $('.overlay').append(helper);
        }
    });
}

/*$('.overlay').bind('drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    var width = Math.floor($('#overlayControls').width() / 2);
    var height = Math.floor($('#overlayControls').height() / 2);
    
    var item = $(e.originalEvent.dataTransfer.getData('Text')).clone();
    
    var is = this;
    
    var pj = 0;
    var type = "<paper-button raised>button</paper-button>";
    var props = "";
    
    console.log("here");
    
    $.ajax({
        url: "php/save-overlay.php",
        method: "POST",
        data: {'project': pj, 'type': type, 'props': props},
        success: function(data){
            console.log(data);
            var id = Number(data);
            
            item.css("position", "absolute");
            item.css("left", width);
            item.css("top", height);
            item.css("width", "auto");
            item.css("height", "auto")
            item.attr("draggable", false);
            item.data("id", id);
            item.draggable({
                containment: "parent",
                start: function(event, ui) {
                    console.log(is.clientWidth);
                    $(this).draggable("option", "cursorAt", {
                        left: 0,
                        top: 0
                    }); 
                },
                stop: function(event, ui){

                    //TODO: capire come recuperare il valore di to;
                    //TODO: passare il valore del nuovo overlay al timestamp;

                    var mui = ui;
                    
                    var to = $('#player').prop('currentTime') + 10;
                    
                    console.log(mui.position.left);
                    console.log(mui.position.top);
                    console.log($('#player').prop('currentTime'));
                    console.log(to);
                    console.log(item.data("id"));
                    
                    $.ajax({
                        url: "php/save-timestamp.php",
                        method: "POST",
                        data: {'left': mui.position.left, 'top': mui.position.top, 'timefrom': Number($('#player').prop('currentTime')), 'timeto': Number(to), 'visible': 0, 'overlay': item.data("id")},
                        success: function(data){
                            console.log(data);
                        }
                    });
                }
            });

            $(is).append(item);

            return false;
        }
    });
}).bind('dragover', false);*/

$('#getpos').on('click', function () {
    openNav();
});

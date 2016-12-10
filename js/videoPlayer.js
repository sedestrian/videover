var overlayWidth = $('.overlay').width();
var overlayHeight = $('.overlay').height();
var outlined;
var out_id;
var percentH = 1;
var percentV = 1;

(function (window, document, array) {

    var video = document.getElementsByTagName('video')[0],
//        videoControls = document.getElementById('videoControls'),
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
//            fullScreenToggleButton.addEventListener("click", function () {
//                isVideoFullScreen ? that.fullScreenOff() : that.fullScreenOn();
//            }, true);

//            this.videoScrubbing();
        },


        /*initializeControls: function () {
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
        },*/


        fullScreenOn: function () {
            isVideoFullScreen = true;

            // Set new width according to window width
            video.style.cssText = 'position: fixed; width:' + window.innerWidth + 'px; height: ' + window.innerHeight + 'px;';

            // Apply a classname to the video and controls, if the designer needs it...
            video.className = 'fullsizeVideo';
//            videoControls.className = 'fs-control';
            fullScreenToggleButton.className = "play fs-active control";
            overlayControls.className = 'fs-control';

            // Listen for escape key. If pressed, close fullscreen.
            document.addEventListener('keydown', this.checkKeyCode, false);
        },


        fullScreenOff: function () {
            isVideoFullScreen = false;

            video.style.position = 'static';
            video.className = '';
            video.style.cssText = '';
            fullScreenToggleButton.className = "play control";
//            videoControls.className = '';
            overlayControls.className = '';
        },


        handleButtonPresses: function () {
            // When the video or play button is clicked, play/pause the video.
//            video.addEventListener('click', this.playPause, false);
            play.addEventListener('click', this.playPause, false);

            // When the play button is pressed,
            // switch to the "Pause" symbol.
            video.addEventListener('play', function () {
                play.title = 'Pause';
                $(play).attr('icon', 'av:pause');
                videoPlayer.trackPlayProgress();
            }, false);


            // When the pause button is pressed,
            // switch to the "Play" symbol.
            video.addEventListener('pause', function () {
                play.title = 'Play';
                $(play).attr('icon', 'av:play-arrow');
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
//            playProgressBar.style.width = ((video.currentTime / video.duration) * (progressHolder.offsetWidth)) + "px";
            console.log(video.duration);    
            playProgressBar.value = ((video.currentTime / video.duration) * 100);
        },


        // Video was stopped, so stop updating progress.
        stopTrackingPlayProgress: function () {
            clearTimeout(playProgressInterval);
        },


        /*videoScrubbing: function () {
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

                    videoPlayer.setPlayProgress(e.pageX);
                    videoPlayer.trackPlayProgress();
                }
            }, true);
        },*/

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
        $(document).on('element-selected', function(e){
            var id = e.detail.selected;
            $.ajax({
                url: 'php/get-time.php',
                method: 'POST',
                data: {'id':id},
                success: function(data){
                    var result = JSON.parse(data);
                    var player = document.getElementById('player');
                    var bar = document.getElementById('play_progress');
                    player.pause();
                    player.currentTime = result[0].from;
                    bar.value = ((Number(result[0].from) / video.duration) * 100);
                    if(typeof window.out_id != 'undefined'){
                        $('#'+window.out_id).removeClass('outlined');
                    }
                    $('#t' + result[0].ov_id).addClass('outlined');
                    window.out_id = 't' + result[0].ov_id;
                }
            });
        });
        $.post("php/get-overlays.php",
            {
                project: 1
            },
            function (data, status) {
                overlays = JSON.parse(data);
                if (overlays !== 0) {
                    $.post("php/get-timestamps.php",
                        function (data, status) {
                            timestamps = JSON.parse(data);
                            if(timestamps !== 0){
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
                $('#overlayControls').find('#t'+overlays[i].id).remove();
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
                    if ($('#overlayControls').find('#t' + overlays[i].id).length === 0) {
                        var toAppend = overlays[i].type.replace("%id", "t"+overlays[i].id);
                        $('#overlayControls').append(toAppend);
                        var appended = $('#t'+overlays[i].id);
                        $(appended).css('position', 'absolute');
                        $(appended).css('top', newone.y+"px");
                        $(appended).css('left', newone.x+"px");
                        if(newone.width != 0){
                            $(appended).css('width', newone.width+"px");
                        }
                        if(newone.height != 0){
                            $(appended).css('height', newone.height+"px");
                        }
                        if(newone.text !== null && newone.text !== ""){
                            $(appended).html(newone.text);
                        }
                        if("t"+overlays[i].id == window.out_id){
                            $(appended).addClass('outlined');
                        }
                        $(appended).draggable({
                            containment: "parent"
                        });
                        $(appended).resizable({
                            containment: "parent",
                            handles: "all"
                        });
                        handled.push(newone.id);
                    } else {
                        $('#t' + overlays[i].id).animate({
                            top: newone.y,
                            left: newone.x
                        }, 1000, function(){});
                        if(newone.text !== null && newone.text !== ""){
                            $('#t' + overlays[i].id).html(newone.text);
                        }
                        /*$('#' + overlays[i].id).css('top', newone.y + "px");
                        $('#' + overlays[i].id).css('left', newone.x + "px");*/
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
        var vVariation = Math.abs(( $('.overlay').height() / window.overlayHeight ));
        var nPercentH = window.percentH - Math.abs(1 - hVariation);
        var nPercentV = window.percentV - Math.abs(1 - vVariation);
        console.log(nPercentH);
        console.log(nPercentV);
        $('.overlay').children().each(function(){
            var newLeft = ( parseFloat($(this).css('left')) / Number(window.overlayWidth) ) * Number($('.overlay').width());
            var newTop = ( parseFloat($(this).css('top')) / Number(window.overlayHeight) ) * Number($('.overlay').height());
            $(this).css('left', newLeft);
            $(this).css('top', newTop);
            $(this).animate({transform: 'scale('+nPercentH+','+nPercentV+')'});
        });
        window.overlayWidth = $('.overlay').width();
        window.overlayHeight = $('.overlay').height();
        window.percentH = nPercentH;
        window.percentV = nPercentV;
    });
});

function fuck(){
    console.log("fuck");
}

function handleDrop(event, ui){
    var helper = $(ui.helper).clone().removeClass('ui-draggable-dragging');
    //TODO: Recuperare gli stili necessari e salvarli nel database o rimuovere solo quelli fastidiosi
    helper = $(helper).attr('style', '');
    helper = $(helper).attr('id', '%id');
    var pj = 1;
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
            document.querySelector('placed-elements')._retrieveData();
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
                //TODO: Modificare il metodo di salvataggio dei timestamp, passare a bottone;
                stop: function(event, ui){

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
                        data: {'left': mui.position.left, 'top': mui.position.top, 'timefrom': Number($('#player').prop('currentTime')), 'timeto': Number(to), 'visible': 1, 'overlay': $(helper).data("id")},
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

$('#getpos').on('click', function () {
    openNav();
});

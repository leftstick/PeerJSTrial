var KEY_ENTER = 13;
var NEW_COMER = "NEW_COMER";
var TALK = "TALK";
var NICK_NAME_UPDATE = "NICK_NAME_UPDATE";
var nickName;
var peerId;

var callers = [];
var connections = {};
var step1Div = $('#step1');
var step2Div = $('#step2');
var step3Div = $('#step3');
var step1Err = $('#step1-error');
var step1Info = $('#step1-info');
var chatBoard = $('#chatBoard');

//init three panels
step1Div.show();
step2Div.hide();
step3Div.hide();
step1Err.hide();
chatBoard.hide();


function dateParse(data){
    var dataObj = {type: undefined, data: undefined};
    if(data.indexOf(NEW_COMER+":") === 0){
        dataObj.type = NEW_COMER;
        dataObj.data = data.substr(10);
        return dataObj;
    }else if(data.indexOf(TALK+":") === 0){
        dataObj.type = TALK;
        dataObj.data = data.substr(5);
        return dataObj;
    }else if(data.indexOf(NICK_NAME_UPDATE+":") === 0){

        dataObj.type = NICK_NAME_UPDATE;
        dataObj.data = data.substr(17);
        return dataObj;
    }
}

function showSelfVideo () {
  // Get audio/video stream
  navigator.getUserMedia({audio: true, video: true}, function(stream){
    // Set your video displays
    $('#client-video').prop('src', URL.createObjectURL(stream));

    window.localStream = stream;
    step2();
  }, function(){ step1Err.show(); step1Info.hide();});
}

function addTextToDisplayBox(txt){
    var displayBox = $('#displayBox');
    displayBox.val(displayBox.val() + txt + "\n");
    displayBox.scrollTop(displayBox[0].scrollHeight - displayBox.height());
}


// Get things started
showSelfVideo();

$('#updateNick').tooltip({
    container: 'body',
    placement: 'bottom'
});

$('#sendMessage').tooltip({
    container: 'body',
    placement: 'bottom'
});

$('a[fullscreen]').tooltip({
    container: 'body',
    placement: 'right'
});

// PeerJS object
var peer = new Peer({ key: 'm4lam1d6op28d7vi'});
// var peer = new Peer('zuohao', {host: '192.168.0.115', port: 9000});

peer.on('open', function(){
    // $('#my-id').text(peer.id);
    console.log(peer.id);
    peerId = peer.id;
});

peer.on('connection', function(conn) {
    conn.on('data', function(data){
        var d = dateParse(data);

        if(d.type === NEW_COMER){
            var call = peer.call(d.data, window.localStream);
            onReceiveCall(call);
        }else if(d.type === TALK){
            addTextToDisplayBox(d.data);
        }else if(d.type === NICK_NAME_UPDATE){

            var index = d.data.indexOf("_");
            var updateId = d.data.substring(0, index);
            var newNickName = d.data.substring(index + 1);
            var isHost = $("#"+updateId).attr("isHost");
            var prefix = isHost === "true" ? "HOST" : (newNickName ? "Nickname" : "Id");
            var updateValue = newNickName ? newNickName : updateId;
            $("#"+updateId).html(prefix + ": <span class=\"label label-info\">"+updateValue+"</span>");
            
        }
    });
});

$('#make-call').click(function(){
    // Initiate a call!
    var call = peer.call($('#callto-id').val(), window.localStream);
    onReceiveCall(call, true);
    step3();
});

// Receiving a call
peer.on('call', function(call){
    // Answer the call automatically (instead of prompting user) for demo purposes
    call.answer(window.localStream);
    onReceiveCall(call);
});

peer.on('error', function(err){
    console.log(err.message);
    // Return to step 2 if error occurs
    step2();
});

function sendMessage(msg){
    for(var i in connections){
        connections[i].send(msg);
    }
}


$('#shutdown').click(function(){
    for(var i in callers){
        var call = callers[i];
        var close = function(c){
            return function(){c.close()};
        }(call);
        setTimeout(close, 1000);
    }
    step2();
});

$('#chatInput').on('keyup', function(e){
    var value = $.trim($(this).val());
    if(e.keyCode === KEY_ENTER){
        if(value){
            sendMessage("TALK:" + (nickName ? nickName : peerId) + " : " + value);
            addTextToDisplayBox((nickName ? nickName : "Me") + " : " + value);
            $('#chatInput').val("");
        }
    }
});

function changeNickName(newName){
    if(newName){
        nickName = newName;
        sendMessage(NICK_NAME_UPDATE + ":" + peerId + "_" + nickName);
        $('#feedback').modal();
    }
}

$('#updateNick').on('click', function(e){
    var value = $.trim($('#nickname').val());
    changeNickName(value);
    return false;
});

$('#nickname').on('keyup', function(e){

    if(e.keyCode === KEY_ENTER){
        var value = $.trim($(this).val());
        changeNickName(value);
    }
    return false;
});

$('body').on('click', 'a[fullscreen]', function(e){
    var video = $(this).parent().parent().siblings('video');
    video.removeClass('video');
    requestFullScreen.apply(video[0]);
    lastControlVideo = video;
    return false;
});

document.addEventListener(FULLSCREEN_EVENT, function () {
    if(isFullscreen() || !lastControlVideo){
        return;
    }
    if(!lastControlVideo.hasClass('video')){
        lastControlVideo.addClass('video');
    }
}, false);


// Retry if getUserMedia fails
$('#step1-retry').click(function(){
    step1Err.hide();
    step1Info.show();
    step1();
});



function step2 () {
    step1Div.hide();
    step3Div.hide();
    chatBoard.hide();
    step2Div.show();
}

function step3 () {
    step1Div.hide();
    step2Div.hide();
    step3Div.show();
    chatBoard.show();
}

function createConnection(peerId){
    var conn = connections[peerId];
    if(!conn){
        conn = connections[peerId] = peer.connect(peerId);
    }
}

function getConnection(peerId){
    return connections[peerId];
}

function onReceiveCall(call, isHost) {

    createConnection(call.peer);
   
    var id = new Date().getTime();
    var divId = id + "_d";
    var videoId = id + "_v";
    var endCallId = id + "_b";
    var options = {
                      divId: divId,
                      videoId: videoId,
                      endCallId: endCallId,
                      callerId: call.peer,
                      caller: call,
                      isHost: isHost
                  };
    // Wait for stream on the call, then set peer video display
    call.on('stream', function(stream){
        options.url = URL.createObjectURL(stream);
        addPeople(options);
        if(nickName){
            setTimeout(function(){
                getConnection(options.callerId).send(NICK_NAME_UPDATE + ":" + peerId + "_" + nickName);
            }, 5000);
        }
    });

    call.on('close', onCallClose(options));

    callers.push(call);
}

function removeCaller(caller){
    for(var i in callers){
        var c = callers[i];
        if(c === caller){
            connections[c.peer].close();
            connections[c.peer] = undefined;
            delete connections[c.peer];
            callers.splice(i, 1);
            break;
        }
    }
    if(callers.length === 0){
        step2();
    }
}

function onCallClose(options){
    return function(){
        $("#"+options.endCallId).off('click');
        $("#"+options.videoId).prop('src', "");
        $("#"+options.divId).remove();
        removeCaller(options.caller);
    };
}

function addPeople(options){
    var html = "<div id=\""+options.divId+"\" class=\"col-md-3\">" +
                    "<div class=\"thumbnail frameClient\">" +
                        "<video id=\""+options.videoId+"\" class=\"video\" src=\""+options.url+"\" autoplay></video>" +
                        "<div class=\"caption\">" +
                            "<p id=\""+options.callerId+"\" isHost=\""+options.isHost+"\">"+(options.isHost ? "HOST " : "Id")+": <span class=\"label label-info\">"+ options.callerId+"</span></p>" +
                            "<p class=\"pull-left\"><a fullscreen class=\"glyphicon glyphicon-fullscreen rightoff\" title=\"fullscreen\"></a></p>" +
                        "</div>" +
                    "</div>" +
                "</div>";
    $('#video-container').append(html);

    $("#"+options.endCallId).on('click', function(e){
        options.caller.close();
    });

    $('a[fullscreen]').tooltip({
        container: 'body',
        placement: 'right'
    });
}
// Compatibility shim
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var step1Div = $('#step1');
var step2Div = $('#step2');
var step3Div = $('#step3');

//init three panels
step1Div.show();
step2Div.hide();
step3Div.hide();

function showSelfVideo () {
  // Get audio/video stream
  navigator.getUserMedia({audio: true, video: true}, function(stream){
    // Set your video displays
    $('#my-video').prop('src', URL.createObjectURL(stream));

    window.localStream = stream;
    step2();
  }, function(){ $('#step1-error').show(); });
}

// Get things started
showSelfVideo();

// PeerJS object
var peer = new Peer({ key: 'm4lam1d6op28d7vi'});

peer.on('open', function(){
    $('#my-id').text(peer.id);
});

// Receiving a call
peer.on('call', function(call){
    // Answer the call automatically (instead of prompting user) for demo purposes
    call.answer(window.localStream);
    onReceiveCall(call);
});

peer.on('error', function(err){
    alert(err.message);
    // Return to step 2 if error occurs
    step2();
});

// Click handlers setup
$('#make-call').click(function(){
    // Initiate a call!
    var call = peer.call($('#callto-id').val(), window.localStream);
    onCall(call);
});

$('#end-call').click(function(){
    window.existingCall.close();
    step2();
});

// Retry if getUserMedia fails
$('#step1-retry').click(function(){
    $('#step1-error').hide();
    step1();
});



function step2 () {
    $('#step1, #step3').hide();
    $('#step2').show();
}

function onCall(call){
    // Wait for stream on the call, then set peer video display
    call.on('stream', function(stream){
        $('#their-video').prop('src', URL.createObjectURL(stream));
    });

    // UI stuff
    window.existingCall = call;
    $('#their-id').text(call.peer);
    call.on('close', step2);
    $('#step1, #step2').hide();
    $('#step3').show();
}

function onReceiveCall(call) {
 
    var id = new Date().getTime();
    var divId = id + "_d";
    var videoId = id + "_v";
    var endCallId = id + "_b";
    var options = {
                      divId: divId,
                      videoId: videoId,
                      url: URL.createObjectURL(stream),
                      endCallId: endCallId,
                      callerId: call.peer
                  };
    // Wait for stream on the call, then set peer video display
    call.on('stream', function(stream){
        addPeople(options);
        // $('#their-video').prop('src', URL.createObjectURL(stream));
    });

    // UI stuff
    call.on('close', onCallClose(options));
}

function onCallClose(options){
    return function(){
        $("#"+options.endCallId).off('click');
        $("#"+options.videoId).prop('src', "");
        $("#"+options.divId).remove();
    };
}

function addPeople(options){
    var html = "<div id=\""+options.divId+"\" class=\"col-md-3\">" +
                    "<div class=\"thumbnail frame\">" +
                        "<video id=\""+options.videoId+"\" class=\"thumbnail video\" src=\""+options.url+"\" autoplay></video>" +
                        "<div class=\"caption\">" +
                            "<span class=\"label label-info\">"+options.callerId+"</span>" +
                            "<p><a href=\"#\" class=\"btn btn-danger\" id=\""+options.endCallId+"\">End call</a></p>" +
                        "</div>" +
                    "</div>" +
                "</div>";
    $('#video-container').append(html);
}

<html>
<head>
  <title>Video Chart -- HOST</title>
  <% _.forEach(csss, function(css) { %><link rel="stylesheet" href="<%- css %>"><%- "\n" %><% }); %>
</head>

<body>

  <div class="container">

      <div class="row">
          <!-- Video area -->
          <div class="col-md-3">
               <div class="thumbnail frameHost">
                   <video id="host-video" class="video" muted="true" autoplay></video>
                   <div class="caption">
                       <h3><a fullscreen class="glyphicon glyphicon-fullscreen" title="fullscreen"></a></h3>
                   </div>
               </div>
          </div>
          <div class="col-md-3">
                  <h2 class="title">PeerJS Video Chat</h2>

                  <!-- Get local audio/video stream -->
                  <div id="step1">
                      <p id="step1-info">Please click `<strong>allow</strong>` on the top of the screen so we can access your webcam and microphone for calls.</p>
                      <div id="step1-error">
                          <p class="alert alert-danger">Failed to access the webcam and microphone. Make sure to run this demo on an http server and click allow when asked for permission by the browser.</p>
                          <a href="#" class="btn btn-warning" id="step1-retry">Try again</a>
                      </div>
                  </div>

                  <!-- Make calls to others -->
                  <div id="step2">
                      <h3>Host Information:</h3>
                          <p>Your id: <span id="my-id" class="label label-info"></span></p>
                          <p>Share this id with others so they can call you.</p>
                  </div>

                  <!-- Call in progress -->
                  <div id="step3">
                      <p>Currently in call with</p>
                      <p><a href="#" class="btn btn-danger" id="shutdown">Shutdown</a></p>
                      <p>
                           <div class="input-group">
                               <input id= "nickname" placeholder="nick name..." class="form-control" type="text"/>
                               <span class="input-group-addon"><a id="updateNick" href="#" title="Click here to update your nick name" class="glyphicon glyphicon-floppy-open"></a></span>
                           </div>
                      </p>
                  </div>
          </div>

          <div id="chatBoard" class="col-md-5">
              <textarea id="displayBox" class="form-control text-chat" rows="10"></textarea>
              <div class="input-group text-input">
                   <input id="chatInput" type="text" class="form-control"/>
                   <span id="sendMessage" class="input-group-addon" title="press enter to send your message"><span class="glyphicon glyphicon-arrow-right"></span></span>
              </div>
                  
          </div>
      </div>
      
      <hr class="soften"/>
      
      <div class="row" id="video-container">
        
      </div>

  </div>

      
<!-- Modal -->
<div class="modal fade" id="feedback" tabindex="-1" role="dialog" aria-labelledby="title" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="title"><span class="glyphicon glyphicon-info-sign"></span>&nbsp;&nbsp;Information</h4>
      </div>
      <div class="modal-body text-success">
         Nick name changed successfully!
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>


</body>
</html>
<% _.forEach(hostScripts, function(script) { %><script type="text/javascript" src="<%- script %>"></script><%- "\n" %><% }); %>
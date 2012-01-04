(function() {
  $(function() {
    var $body, socket, url;
    $body = $('body');
    url = location.href.replace(/^.*:\/\//, 'ws://');
    console.log(url);
    socket = io.connect(url);
    return socket.on('tweet', function(data) {
      var tweet;
      tweet = JSON.parse(data);
      return $body.prepend($('<p>').append(tweet.text).fadeIn('normal'));
    });
  });
}).call(this);

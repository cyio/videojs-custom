// [Custom key acquisition for encrypted HLS in VideoJS](https://medium.com/@onetdev/custom-key-acquisition-for-encrypted-hls-in-videojs-59e495f78e52)

var player = videojs("player");
var prefix = "key://";
var urlTpl = "https://domain.com/path/{key}";
// player.ready
player.on("loadstart", function (e) {
  player.tech().hls.xhr.beforeRequest = function(options) {
    // required for detecting only the key requests
    if (!options.uri.startsWith(keyPrefix)) { return; }
    options.headers = options.headers || {};
    optopns.headers["Custom-Header"] = "value";
    options.uri = urlTpl.replace("{key}", options.uri.substring(keyPrefix.length));
  };
});

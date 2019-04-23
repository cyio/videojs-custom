Vue.config.debug = true
Vue.config.devtools = true

new Vue({
  el: '#app',
  data: {}
})

const options = {
  sources: [
    {
      src: '//vjs.zencdn.net/v/oceans.mp4',
      type: 'video/mp4'
    }
  ]
  // autoplay: true,
  // muted: true,
}
const videojs = window.videojs
const player = videojs('player', options, function onPlayerReady() {
  videojs.log('Your player is ready!')

  this.hotkeys({
    volumeStep: 0.1,
    seekStep: 5,
    enableModifiersForNumbers: false
  })

  // In this context, `this` is the player that was created by Video.js.
  // this.play();

  // How about an event listener?
  this.on('ended', function() {
    videojs.log('Awww...over so soon?!')
  })
})

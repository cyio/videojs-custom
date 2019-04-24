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
  ],
  inactivityTimeout: 800,
  languages: 'zh-CN',
  playbackRates: [ 0.75, 1.0, 1.2, 1.5 ],
  plugins: {
    videoJsResolutionSwitcher: {
      default: '480',
      dynamicLabel: true
    }
  },
  controlBar: {
    children: [
      'playToggle',
      'currentTimeDisplay',
      'timeDivider',
      'durationDisplay',
      'progressControl',
      'volumePanel',
      'playbackRateMenuButton',
      'fullscreenToggle'
    ],
    volumePanel: {inline: false}
  },
  // autoplay: true,
  // muted: true,
}
const videojs = window.videojs
const player = videojs('player', options)
player.on('ready', function() {
  videojs.log('Your player is ready!')

  player.hotkeys({
    volumeStep: 0.1,
    seekStep: 5,
    enableModifiersForNumbers: false
  })

  // In this context, `this` is the player that was created by Video.js.
  // this.play();
})

// How about an event listener?
player.on('ended', function() {
  videojs.log('Awww...over so soon?!')
})

player.updateSrc([
  {
    src: 'https://vjs.zencdn.net/v/oceans.mp4',
    type: 'video/mp4',
    res: 480,
    label: '标清'
  },
  {
    src: 'https://vjs.zencdn.net/v/oceans.mp4',
    type: 'video/mp4',
    res: 720,
    label: '高清'
  },
  {
    src: '//content.jwplatform.com/manifests/vM7nH0Kl.m3u8',
    type: 'application/x-mpegURL',
    res: 1080,
    label: 'm3u8'
  },
])
player.on('resolutionchange', function(){
  console.info('Source changed to %s', player.src())
})

let duration = null

player.on('loadedmetadata', function() {
  duration = player.duration()
  setMarker(10, 'is-done')
  setMarker(20, null)
})

function setMarker(time, customClass) {
  const div = document.createElement('div')
  div.setAttribute('data-marker-time', time);
  div.classList.add('vjs-marker', 'point', customClass)
  div.style.left = `${(time / duration) * 100}%`
  document.querySelector('.vjs-progress-holder').appendChild(div)
}

function updateMarker(time) {
  const div = document.querySelector(`[data-marker-time="${time}"]`)
  if (div) {
    div.classList.toggle('is-done')
  }
}

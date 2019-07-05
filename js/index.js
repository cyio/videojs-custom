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
      // src: 'https://mister-ben.github.io/videojs-flvjs/bbb.flv',
      // type: 'video/x-flv'
    }
  ],
  inactivityTimeout: 800,
  languages: 'zh-CN',
  playbackRates: [ 0.75, 1.0, 1.2, 1.5 ],
  // plugins: {
    // videoJsResolutionSwitcher: {
      // default: '480',
      // dynamicLabel: true
    // }
  // },
  controlBar: {
    children: [
      'playToggle',
      'liveDisplay', //直播流时，显示LIVE
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
  flvjs: {
    mediaDataSource: {
      isLive: true,
      cors: true,
      withCredentials: false,
    },
    // config: {},
  },
  // autoplay: true,
  // muted: true,
}
const videojs = window.videojs
const player = videojs('player', options)
player.on('ready', function() {
  videojs.log('Your player is ready!')

  // document.querySelector('.video-js').classList.add('vjs-live', 'vjs-liveui')
  // document.querySelector('.vjs-live-control').classList.remove('vjs-hidden')

  player.hotkeys({
    volumeStep: 0.1,
    seekStep: 5,
    enableModifiersForNumbers: false
  })

  rewriteFullscreen(player, '.container')
  // In this context, `this` is the player that was created by Video.js.
  // this.play();
})

// How about an event listener?
player.on('ended', function() {
  videojs.log('Awww...over so soon?!')
})

// player.updateSrc([
  // {
    // src: 'https://vjs.zencdn.net/v/oceans.mp4',
    // type: 'video/mp4',
    // res: 480,
    // label: '标清'
  // },
  // {
    // src: 'https://vjs.zencdn.net/v/oceans.mp4',
    // type: 'video/mp4',
    // res: 720,
    // label: '高清'
  // },
  // {
    // src: '//content.jwplatform.com/manifests/vM7nH0Kl.m3u8',
    // type: 'application/x-mpegURL',
    // res: 1080,
    // label: 'm3u8'
  // },
// ])
player.on('resolutionchange', function(){
  console.info('Source changed to %s', player.src())
})

let duration = null

player.on('loadedmetadata', function() {
  duration = player.duration()
  // setMarker(10, 'is-done')
  // setMarker(20, null)
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

// el: 播放器和前置元素的公共容器节点
function customFullscreenToggle(el) {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    // document.documentElement.requestFullscreen()
    document.querySelector(el).requestFullscreen()
  }
  // document.querySelector('.video-js').classList.toggle('vjs-fullscreen')
}

function rewriteFullscreen(player, commonEl) {
  player.controlBar.fullscreenToggle.off('click') // 全屏按钮事件卸载
  player.tech_.off('dblclick') // 播放器界面双击事件卸载
  document.querySelector('.vjs-fullscreen-control').addEventListener('click', () => {
    customFullscreenToggle(commonEl)
  })
  document.querySelector('.video-js').addEventListener('dblclick', () => {
    customFullscreenToggle(commonEl)
  })
}

let isHidden = false
let timer
function onTimeUpdate() {
  setTimeout(() => {
    console.log('on time update')
  }, 1000)
}
player.on('timeupdate', onTimeUpdate)
player.on('durationchange', () => {
  const duration = player.duration()
  console.log({ duration })
  console.time()
})
player.on('loadstart', () => {
  console.log('loadstart')
})
player.on('loadedmetadata', () => {
  console.timeEnd()
  console.log('loadedmetadata')
})
player.on('canplay', () => console.log('canplay'))
function handleVisibilityChange() {
  isHidden = document.hidden
  console.log({ isHidden })
  if (isHidden) {
    player.off('timeupdate', onTimeUpdate)
    console.log('off event: timeupdate ')
  } else {
    player.on('timeupdate', onTimeUpdate)
    console.log('recover')
  }
}
document.addEventListener('visibilitychange', handleVisibilityChange, false);

setTimeout(() => {
  player.src('//vjs.zencdn.net/v/oceans.mp4')
  player.play()
}, 5000)

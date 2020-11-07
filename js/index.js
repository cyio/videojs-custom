// import { bufferLog } from './buffer-log.js'
// import { eventLog } from './event-log.js'
// import { instantSpeed } from './speed.js'
import { validLog } from './valid-log.js'

const isLive = false

const paramUrl = new URL(location.href).searchParams.get('url')

const options = {
  sources: [
    {
      src: paramUrl || '//player.alicdn.com/video/editor.mp4', // vjs.zencdn.net/v/oceans.mp4
      // type: 'application/x-mpegURL',
      // type: 'video/mp4' // 不预设类型，播放器会根据 url 后缀判断
    }
  ],
  html5: {
    hls: {
      overrideNative: true, // apply for safari
      cacheEncryptionKeys: true
    },
  },
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

if (isLive) {
  options = {
    sources: {
      src: 'https://mister-ben.github.io/videojs-flvjs/bbb.flv',
      // src: 'http://127.0.0.1:7001/live/test.flv',
      type: 'video/x-flv'
    },
    controlBar: {
      children: [
        'playToggle',
        'liveDisplay', // 直播流时，显示LIVE
        'volumePanel',
        'fullscreenToggle',
      ],
      volumePanel: { inline: false },
    },
    flvjs: {
      mediaDataSource: {
        isLive: true,
        cors: true,
        withCredentials: false,
      },
    },
    playbackRates: [],
  }
}
const videojs = window.videojs
window.player = videojs('player', options)
// console.log({ player })
player.on('ready', function() {
  videojs.log('Your player is ready!')
  // console.log({ player })
  const video = document.getElementById('player_html5_api')
  // bufferLog(video)
  // eventLog(video)
  validLog(video)
  // instantSpeed(video)
  // testLog(video)

  const promise = video.play();

  if (promise !== undefined) {
    // 使用 videojs 方法，有一定概率 then 和 catch 分支里的代码不执行
    // [Player.play() does not return promise · Issue #5362 · videojs/video.js · GitHub](https://github.com/videojs/video.js/issues/5362#issuecomment-411455790)
    promise.then(function() {
      // Autoplay started!
      console.log('autoplay success with audio')
    })['catch'](function() {
      // video.muted(true)
      video.muted = true
      video.play().then(function() {
        console.log('autoplay success with audio muted')
        // confirm not work 需要用户与页面交互
        // if (confirm('点击音量按钮，取消静音')) {
          // video.muted = false
        // }
      })['catch'](function() {
        console.log('autoplay fail with audio muted')
      })
      // Autoplay was prevented.
    });
  }

  if (isLive) {
    document.querySelector('.video-js').classList.add('vjs-is-live')
  }
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
player.on("loadstart", function () {
  // https://medium.com/@onetdev/custom-key-acquisition-for-encrypted-hls-in-videojs-59e495f78e52
  const { hls } = player.tech()
  if (hls) {
    hls.xhr.beforeRequest = function(options) {
      const { href, origin } = new URL(options.uri)
      options.uri = href.replace(origin, '')
      return options;
    };
  }
});
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
// player.on('timeupdate', onTimeUpdate)
// player.on('durationchange', () => {
  // const duration = player.duration()
  // console.log({ duration })
  // console.time()
// })
// player.on('loadstart', () => {
  // console.log('loadstart')
// })
// player.on('loadedmetadata', () => {
  // console.timeEnd()
  // console.log('loadedmetadata')
// })
// player.on('canplay', () => console.log('canplay'))
function handleVisibilityChange() {
  isHidden = document.hidden
  // console.log({ isHidden })
  if (isHidden) {
    // player.off('timeupdate', onTimeUpdate)
    // console.log('off event: timeupdate ')
  } else {
    // player.on('timeupdate', onTimeUpdate)
    // console.log('recover')
  }
}
document.addEventListener('visibilitychange', handleVisibilityChange, false);

document.querySelector('.upload-video-file').addEventListener('change', (e) => {
  const file = e.target.files[0]
  const blob = URL.createObjectURL(file)
  // video.src = blob
  // player.src(blob) // not work, no error notice
  player.src({ src: blob, type: file.type })
})

document.cookie = 'hi=w'

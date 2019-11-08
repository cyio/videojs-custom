function instantSpeed(video) {
  const clip = {
    start: -1,
    duration: 0,
    speed: 0,
  }
  let currentBufferIndex = 0
  let timer
  const bitrate = 1800

  function _log(speed) {
    const el = document.querySelector('.sticky')
    el.innerText = Number.parseInt(speed) + ' kb/s'
  }

  function searchInbuffered(time) {
    const { buffered } = video
    for (let i = 0; i < buffered.length; i++) {
      const start = buffered.start(i) 
      const end = buffered.end(i) 
      if (time >= start && time <= end) {
        return i
      }
    }
    return -1
  }
  function computeSpeed() {
    const { buffered, currentTime } = video
    if (buffered.length && currentBufferIndex >= 0) {
      // console.log('end', buffered.end(currentBufferIndex), +Date.now())
      const downEnd = buffered.end(currentBufferIndex) 
      clip.unixDuration = +Date.now() - clip.startUnix
      clip.duration = downEnd - clip.start
      if (clip.unixDuration > 400) {
        if (clip.duration >= 0) {
          clip.speed = clip.duration * (bitrate / 8) / (clip.unixDuration / 1000)
          if (clip.speed <= 0 || clip.speed > 800) {
            // console.log(Date.now())
            if (clip.unixDuration > 1100) {
              // debugger
            }
            // clip.speed = lastclip.speed
          } else if (clip.speed > 0) {
            // lastclip.speed = clip.speed
          }
          console.log({ clip }, { timer })
          _log(clip.speed)
          console.log(Number.parseInt(clip.speed) + ' kb/s', 'in buffer', clip)
        } else {
          // debugger
        }
      }
    }
    // timer = null
    clip.start = -1
  }
  function getSpeed() {
    const { buffered, currentTime } = video
    currentBufferIndex = searchInbuffered(currentTime)
    if (currentBufferIndex >= 0) {
      console.log('start', buffered.end(currentBufferIndex), +Date.now())
      clip.start = buffered.end(currentBufferIndex) 
      clip.startUnix = +Date.now()
      // timer = setTimeout(() => {
        computeSpeed()
      // }, 1000 * 6)
    } else {
      // 显示平均值
      _log(0)
      console.log(Number.parseInt(0) + ' kb/s', 'not in buffer')
      clip.start = -1
    } 
  }
  video.addEventListener('seeking', () => {
    if (clip.start) {
      clip.start = -1
      // clip.start = video.currentTime
    }
  })
  function setStart() {
    const { buffered, currentTime } = video
    currentBufferIndex = searchInbuffered(currentTime)
    if (currentBufferIndex >= 0) {
      // console.log('start', buffered.end(currentBufferIndex), +Date.now())
      clip.start = buffered.end(currentBufferIndex) 
      clip.startUnix = +Date.now()
      // timer = setTimeout(() => {
        // computeSpeed()
      // }, 1000 * 6)
    } else {
      // 显示平均值
      _log(0)
      console.log(Number.parseInt(0) + ' kb/s', 'not in buffer')
      clip.start = -1
    } 
  }
  // fetching
  video.addEventListener('progress', () => {
    // console.log('progress event', +Date.now())
    if (timer) {
      clearTimeout(timer)
      clip.start = -1
      return
    }
    if (clip.start > 0) {
      computeSpeed()
    } else {
      setStart()
    }
  })
  function interval() {
    setStart()
    timer = setTimeout(() => {
      computeSpeed()
      interval()
    }, 500)
    // console.log('suspend')
    // clip.speed = 0
    // console.log({ clip.speed })
  }
  video.addEventListener('loadstart', () => {
    _log(0)
    // _log(navigator.connection.downlink / 8 * 1024 * 0.7)
    // interval()
  });
}

function testLog(video) {
  // setInterval(() => {
  // }, 2000)
  let start = 0
  let duration = 0
  video.addEventListener('progress', () => {
    const time = new Date().toString()
    // duration = video.buffered.end(video.buffered.length - 1) - start
    // console.log(duration)
    // if (start) {
      // duration = video.buffered.end(video.buffered.length - 1) - start
      // console.log(duration)
    // } else {
      // start = video.buffered.end(video.buffered.length - 1)
      // console.log(start)
    // }
  })
}

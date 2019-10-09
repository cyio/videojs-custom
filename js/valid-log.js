// 有效播放时长收集
function validLog(video) {
  const validPlayTimeLog = {
    startTime: null,
    endTime: null,
  }
  const intervalSec = 5
  let validLogTimer = null
  let isIntervalPause = false

  function setStart() {
    validPlayTimeLog.startTime = video.currentTime
  }
  function setEnd() {
    validPlayTimeLog.endTime = video.currentTime
    const diff = validPlayTimeLog.endTime - validPlayTimeLog.startTime
    filter(diff) 
  }
  // 过滤跳转产生的无效值
  function filter(diff) {
    if (diff <= intervalSec + 1 && diff > intervalSec - 1) {
      console.log('submit', diff)
    } else {
      console.log('ignore', {diff})
    }
    // console.log(validPlayTimeLog.startTime, validPlayTimeLog.endTime)
  }
  function intervalLog() {
    if (isIntervalPause) return
    setStart()
    validLogTimer = setTimeout(() => {
      setEnd()
      intervalLog()
    }, intervalSec * 1000)
  }
  video.addEventListener('playing', () => {
    if (isIntervalPause) { // 卡时 playing/waiting 可能连续触发，这里限制定时器触发
      isIntervalPause = false
      intervalLog()
    }
  });
  video.addEventListener('pause', () => {
    clearTimeout(validLogTimer)
    isIntervalPause = true
    setEnd()
  });
}


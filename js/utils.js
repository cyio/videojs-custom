/*
 * 判断视频地址是否有效
 * param url
 * return true|false
 */
function isVideoUrlValid(url) {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    const eleId = 'test-local'
    video.setAttribute('id', eleId)
    video.setAttribute('src', url)
    document.body.appendChild(video)
    let isRemoved = false
    document.getElementById(eleId).addEventListener('error', (e) => {
      console.log('test-local video err', e)
      if (e.srcElement.error.code === 4) {
        if (!isRemoved) {
          document.body.removeChild(video)
          isRemoved = true
        }
        resolve(false)
      }
    }, true)
    document.getElementById(eleId).addEventListener('loadedmetadata', (e) => {
      if (!isRemoved) {
        document.body.removeChild(video)
        isRemoved = true
      }
      resolve(true)
    }, true)
    // 连接超时，可能需要 1-2 分钟才能收到 error 事件
    setTimeout(() => {
      if (!isRemoved) {
        document.body.removeChild(video)
        isRemoved = true
      }
      resolve(false)
    }, 1000 * 10)
  })
}

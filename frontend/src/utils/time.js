Date.prototype.Format = function (fmt) {
  const o = {
    'y+': this.getFullYear(),
    'M+': this.getMonth() + 1,                 // 月份
    'd+': this.getDate(),                    // 日
    'h+': this.getHours(),                   // 小时
    'm+': this.getMinutes(),                 // 分
    's+': this.getSeconds(),                 // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S+': this.getMilliseconds(),             // 毫秒
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      if (k == 'y+') {
        fmt = fmt.replace(RegExp.$1, (`${o[k]}`).substr(4 - RegExp.$1.length))
      } else if (k == 'S+') {
        let lens = RegExp.$1.length
        lens = lens == 1 ? 3 : lens
        fmt = fmt.replace(RegExp.$1, (`00${o[k]}`).substr((`${o[k]}`).length - 1, lens))
      } else {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)))
      }
    }
  }

  return fmt
}
Number.prototype.toHHMMSS = function () {
  const sec_num = parseInt(this, 10) // don't forget the second param
  const hours = Math.floor(sec_num / 3600)
  let minutes = Math.floor((sec_num - (hours * 3600)) / 60)
  let seconds = sec_num - (hours * 3600) - (minutes * 60)

  // if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) { minutes = `0${minutes}` }
  if (seconds < 10) { seconds = `0${seconds}` }
  return `${hours}:${minutes}:${seconds}`
}
/**
 * 传入的时间time 必须为时间戳
 * @param time
 * @param format
 * @returns {string}
 */
const showTime = (time, format = 'yyyy-MM-dd hh:mm:ss') => {
  try {
    const date = new Date(parseInt(time)).Format(format)
    const newDate = date.replace(/-/g, '/') // 兼容 Safari 请不要修改
    return newDate.toLocaleString()
  } catch {
    return ''
  }
}

function formatTimeZ(time) {
  return time.replace(/000$/, 'Z')
}

export {
  showTime,
  formatTimeZ,
}

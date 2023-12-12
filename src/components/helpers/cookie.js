/*
Set cookie value by name, value and days params
 */
const setCookie = (name, value, days) => {
  let expires = ''
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/'
}

/*
Get cookie value by name, return null if no value
 */
const getCookie = (name) => {
  const pair = document.cookie.match(new RegExp(name + '=([^;]+)'))
  return pair ? pair[1] : null
}

export { setCookie, getCookie }

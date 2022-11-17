/**
 * A method to send data.
 * @param url API url
 * @param key report key
 * @param value report value
 * @param type blob type
 */
export function reportEvent(url: string, key: string, value: object | string, type?: string) {
  const data = {
    key,
    value
  }
  const blobData = new Blob([JSON.stringify(data)], {
    type: type ? type : 'application/x-www-form-urlencoded'
  })
  navigator.sendBeacon(url, blobData)
}
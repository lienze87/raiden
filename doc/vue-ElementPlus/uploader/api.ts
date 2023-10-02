import networkConfig from '@/config/default/net.config'
import headers from '@/constant/headers'
import QRCode from 'qrcode'
import { ElMessage } from 'element-plus'

let baseUrl = networkConfig.host
  ? networkConfig.host.slice(-1) === '/'
    ? networkConfig.host
    : networkConfig.host + '/'
  : ''

export const downloadFile = (url: string, method: string = 'post', data: any = {}, fileName: string) => {
  if (!url) {
    return new Promise((resolve, reject) => {
      reject(new Error('URL不能为空'))
    })
  }
  let realUrl = baseUrl + url
  if (method === 'get') {
    realUrl = realUrl + '?' + new URLSearchParams(data)
  }
  let reqData = method === 'get' ? null : JSON.stringify(data)
  return fetch(realUrl, {
    method: method,
    headers: { 'Content-Type': 'application/json', ...(<Headers>(<unknown>headers)) },
    body: reqData,
  }).then((res: any) => {
    if (!res.ok) {
      res.json().then((data: any) => {
        ElMessage.error(data.message)
      })

      return
    }

    // 获得接口返回的文件名
    let attachmentName = res.headers.get('Content-Disposition')?.split('=')[1]
    if (attachmentName) attachmentName = decodeURIComponent(attachmentName)

    res.blob().then((data: any) => {
      let blobUrl: string = window.URL.createObjectURL(data)
      let a: HTMLAnchorElement = document.createElement('a')

      a.href = blobUrl
      a.download = attachmentName || fileName
      a.click()
    })
  })
}

export const downloadQRCode = (url: string, fileName: string = '签到码.png') => {
  if (!url) {
    return new Promise((resolve, reject) => {
      reject(new Error('URL不能为空'))
    })
  }

  let realUrl = baseUrl + url

  QRCode.toDataURL(realUrl)
    .then((url: string) => {
      let a: HTMLAnchorElement = document.createElement('a')

      a.href = url
      a.download = fileName
      a.click()
    })
    .catch((err) => {
      console.error(err)
    })
}

import moment from 'moment';
import jsdom from 'jsdom';

export function uploadAndReplaceImageData(
  params: Record<string, unknown>
): Record<string, unknown> {
  const data = {...params};

  for (const [key, value] of Object.entries(data)) {
    const now = moment()
    const dateString = now.format('YYYY-MM-DD')
    const timeText = now.format('HH_mm_ss')
    const randomString = Math.random().toString(36).substring(5)
    // 8자리 랜덤 문자

    if(typeof value === 'string') {
      let result = value as string;
      const doc = new jsdom.JSDOM(result)
      const images = doc.window.document.querySelectorAll('img')
      const imgSignature = 'data:image/png;base64,'

      for (let i = 0; i < images.length; i++) {
        const index = result.search(imgSignature)
        if (index !== -1) {
          console.log(images[i].getAttribute('src'))
          const dataLength = images[i].getAttribute('src').length
          const binaryImageData = result.substring(index + imgSignature.length, index + dataLength)

          // 이미지 업로드

          // 대치
          result = result.substring(0, index)
            + "https://t1.daumcdn.net/cfile/tistory/997E5C3C5BA1E68137"
            + result.substring(index + dataLength)

          data[key] = result;
        }
      }
    }
  }

  return data;
}

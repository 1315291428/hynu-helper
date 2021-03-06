const rp = require('request-promise')
const cheerio = require('cheerio')

exports.renew = async (data, url) => {
  const { Cookie, barcodeList } = data
  const headers = {
    Cookie
  }
  const options = {
    method: 'POST',
    url: `${url}/m/loan/doRenew`,
    headers,
    form: {
      furl: '/m/loan/renewList',
      barcodeList
    }
  }
  console.log(options)

  return rp(options)
    .then(body => {
      $ = cheerio.load(body, { normalizeWhitespace: true })
      const txt = $('#messageInfo').text().trim()

      return (res = {
        code: 200,
        txt
      })
    })
    .catch(err => {
      console.error(err)

      return (res = {
        code: 601
      })
    })
}

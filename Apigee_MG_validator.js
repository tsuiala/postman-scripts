ENV = '' // sandbox|dev|test|preprod-int|preprod-ext|prod-int|prod-ext
FOUNDATION = '' // cac|cae|sea|sea_preview
PROXY_ENDPOINT = '' // From Apigee web UI
CLIENT_ID = '' // From Apigee App
CLIENT_SECRET = '' // From Apigee App

// Ref: https://confluence.manulife.io/display/PE/Manulife-JH+Apigee+Developers+Guide#Manulife-JHApigeeDevelopersGuide-ApigeeEndpoints
if (ENV == 'sandbox') {
  EDGE_URL = 'https://manulife-sandbox-dev.apigee.net'
  EDGE_MTLS_URL = 'https://dev.mtls.sandbox.api.manulife.com'
  MG_URL = 'https://edgemicro-manulife-sandbox-dev.apps.use.sandbox.pcf.manulife.com'
} else if (ENV == 'dev') {
  EDGE_URL = 'https://manulife-development-dev.apigee.net'
  EDGE_MTLS_URL = 'https://dev.mtls.api.manulife.com'
  MG_URL = 'https://' + FOUNDATION + '.internal.mesh.dev.api.manulife.com'
} else if (ENV == 'test') {
  EDGE_URL = 'https://manulife-development-test.apigee.net'
  EDGE_MTLS_URL = 'https://test.mtls.api.manulife.com'
  MG_URL = 'https://' + FOUNDATION + '.internal.mesh.test.api.manulife.com'
} else if (ENV == 'preprod-int') {
  EDGE_URL = 'https://manulife-operations-preprod-int.apigee.net'
  EDGE_MTLS_URL = null
  MG_URL = 'https://' + FOUNDATION + '.internal.mesh.preprod.api.manulife.com'
} else if (ENV == 'preprod-ext') {
  EDGE_URL = 'https://manulife-operations-preprod-ext.apigee.net'
  EDGE_MTLS_URL = 'https://preprod.mtls.api.manulife.com'
  MG_URL = 'https://' + FOUNDATION + '.mesh.preprod.api.manulife.com'
} else if (ENV == 'prod-int') {
  EDGE_URL = 'https://manulife-operations-prod-int.apigee.net'
  EDGE_MTLS_URL = null
  MG_URL = 'https://' + FOUNDATION + '.internal.mesh.api.manulife.com'
} else if (ENV == 'prod-ext') {
  EDGE_URL = 'https://manulife-operations-prod-ext.apigee.net'
  EDGE_MTLS_URL = 'https://mtls.api.manulife.com'
  MG_URL = 'https://' + FOUNDATION + '.mesh.api.manulife.com'
}
TOKEN_BASEPATH = '/v1/mg/oauth2/token'
TOKEN_URL = EDGE_URL + TOKEN_BASEPATH
console.log('TOKEN_URL: ' + TOKEN_URL)
pm.environment.set('PROXY_ENDPOINT', PROXY_ENDPOINT)
pm.environment.set('MG_URL', MG_URL)

const echoPostRequest = {
  url: TOKEN_URL,
  method: 'POST',
  header: 'Content-Type:application/json',
  body: {
    mode: 'application/json',
    raw: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      // audience:'<my audience>',
      grant_type: 'client_credentials'
    })
  }
}

var getToken = true

// Regenerate OAuth token if expired
// if (!pm.environment.get('access_token') ||
//   !pm.environment.get('expires_at')) {
//   console.log('Token or expiry date are missing')
// } else if (pm.environment.get('expires_at') < (new Date()).getTime() / 1000) {
//   console.log('Token is expired')
// } else {
//   getToken = false
//   console.log('Token and expiry date are all good')
// }

if (getToken === true) {
  pm.sendRequest(echoPostRequest, function(err, res) {
    console.log(err ? err : res.json())
    if (err === null) {
      console.log('Saving the token and expiry date')
      var responseJson = res.json();
      pm.environment.set('token', responseJson.token)
      pm.environment.set('access_token', responseJson.access_token)
      pm.environment.set('issued_at', responseJson.issued_at)
      pm.environment.set('expires_in', responseJson.expires_in)
      pm.environment.set('expires_at', parseInt(responseJson.issued_at) + parseInt(responseJson.expires_in))
    }
  })
}

//For Edge MG requests, REQUEST_URL={{EDGE_URL}}/{{PROXY_ENDPOINT}}
//For MG requests, REQUEST_URL={{MG_URL}}/{{PROXY_ENDPOINT}}
ENV = ''; // sandbox|dev|test|preprod-int|preprod-ext|prod-int|prod-ext
FOUNDATION = ''; // cac|cae|eas|sea|sea_preview; No EAS for test and dev
PROXY_ENDPOINT = ''; // From Apigee web UI
CLIENT_ID = '';
CLIENT_SECRET = '';

if (ENV == 'sandbox') {
  // EDGE_URL = 'https://manulife-sandbox-dev.apigee.net';
  // EDGE_URL = 'https://edge.sandbox-dev.api.manulife.com';
  EDGE_URL = 'https://edge.sandbox-prod.api.manulife.com';
  EDGE_MTLS_URL = 'https://dev.mtls.sandbox.api.manulife.com';
  MG_URL = 'https://edgemicro-manulife-sandbox-dev.apps.use.sandbox.pcf.manulife.com';
} else if (ENV == 'dev') {
//   EDGE_URL = 'https://manulife-development-dev.apigee.net';
  EDGE_URL = 'https://edge.dev.api.manulife.com';
  EDGE_MTLS_URL = 'https://dev.mtls.api.manulife.com';
  MG_URL = 'https://internal.mesh.dev.api.manulife.com';
} else if (ENV == 'test') {
//   EDGE_URL = 'https://manulife-development-test.apigee.net';
  EDGE_URL = 'https://edge.test.api.manulife.com';
  EDGE_MTLS_URL = 'https://test.mtls.api.manulife.com';
  MG_URL = 'https://internal.mesh.test.api.manulife.com';
} else if (ENV == 'preprod-int') {
  // EDGE_URL = 'https://manulife-operations-preprod-int.apigee.net';
  EDGE_URL = 'https://edge.preprod-int.api.manulife.com';
  EDGE_MTLS_URL = null;
  MG_URL = 'https://internal.mesh.preprod.api.manulife.com';
} else if (ENV == 'preprod-ext') {
  // EDGE_URL = 'https://manulife-operations-preprod-ext.apigee.net';
  EDGE_URL = 'https://edge.preprod-ext.api.manulife.com';
  EDGE_MTLS_URL = 'https://preprod.mtls.api.manulife.com';
  MG_URL = 'https://' + FOUNDATION + '.mesh.preprod.api.manulife.com';
} else if (ENV == 'prod-int') {
//   EDGE_URL = 'https://manulife-operations-prod-int.apigee.net';
  EDGE_URL = 'https://edge.prod-int.api.manulife.com';
  EDGE_MTLS_URL = null;
  MG_URL = 'https://internal.mesh.api.manulife.com';
//   MG_URL = 'https://' + FOUNDATION + '.internal.mesh.api.manulife.com';
} else if (ENV == 'prod-ext') {
//   EDGE_URL = 'https://manulife-operations-prod-ext.apigee.net';
  EDGE_URL = 'https://edge.prod-ext.api.manulife.com';
  EDGE_MTLS_URL = 'https://mtls.api.manulife.com';
  MG_URL = 'https://' + FOUNDATION + '.mesh.api.manulife.com';
} else {
  console.error("Unknown ENV: " + ENV);
}
TOKEN_BASEPATH = '/v1/mg/oauth2/token';
TOKEN_URL = EDGE_URL + TOKEN_BASEPATH;
PROXY_ENDPOINT = PROXY_ENDPOINT.replace(/^\//, '');  // Remove exceessive '/' from the beginning if exist
pm.environment.set('PROXY_ENDPOINT', PROXY_ENDPOINT);
pm.environment.set('EDGE_URL', EDGE_URL);
pm.environment.set('MG_URL', MG_URL);

const echoPostRequest = {
  url: TOKEN_URL,
  method: 'POST',
  header: 'Content-Type:application/json',
  body: {
    mode: 'application/json',
    raw: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  }
};

var getToken = true;

if (getToken === true) {
  pm.sendRequest(echoPostRequest, function (err, res) {
    console.log(err ? err : res.json());
    if (err === null) {
      console.log('Saving the token and expiry date');
      var responseJson = res.json();
      pm.environment.set('token', responseJson.token);
      pm.environment.set('access_token', responseJson.access_token);
      pm.environment.set('issued_at', responseJson.issued_at);
      pm.environment.set('expires_in', responseJson.expires_in);
      pm.environment.set('expires_at', parseInt(responseJson.issued_at) + parseInt(responseJson.expires_in));
    }
  });
}

console.log("ENV=" + ENV);
console.log("FOUNDATION=" + FOUNDATION);
console.log("PROXY_ENDPOINT=" + PROXY_ENDPOINT);
console.log("CLIENT_ID=" + CLIENT_ID);
console.log("CLIENT_SECRET=" + CLIENT_SECRET);
console.log("EDGE_URL=" + EDGE_URL);
console.log("EDGE_MTLS_URL=" + EDGE_MTLS_URL);
console.log("MG_URL=" + MG_URL);
console.log("TOKEN_BASEPATH=" + TOKEN_BASEPATH);
console.log("⚠️TOKEN_URL=" + TOKEN_URL);
console.log("token=" + pm.environment.get('token'));
console.log("access_token=" + pm.environment.get('access_token'));
console.log("issued_at=" + pm.environment.get('issued_at'));
console.log("expires_in=" + pm.environment.get('expires_in'));
console.log("expires_at=" + pm.environment.get('expires_at'));
console.log("⚠️Hitting: " + EDGE_URL + "/" + PROXY_ENDPOINT);
console.log("====================================================");
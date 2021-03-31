### What is this?
This is a script to be used in Postman to test our micro gateway availability.

### Usage
1. Install Postman application
1. Create a `New Request` in your `Collection`
1. Change request type from `GET` to `POST`
1. Fill in `{{MG_URL}}/{{PROXY_ENDPOINT}}` as `Enter request URL`
1. Go to `Authorization` tab, select `Bearer Token` as `TYPE` and fill in `{{access_token}}` in `Token`
1. Go to `Pre-request Script` tab and paste the content of `Apigee_MG_validator.js`
1. Update the global variables in `Apigee_MG_validator.js` to fit your case
1. Go to `MANAGE ENVIRONMENTS` from the top right `Gear` icon and `Add` a new environment
1. Add the follow Variables, just keep `INITIAL VALUE` and `CURRENT VALUE` empty
    * currentAccessToken
    * accessTokenExpiry
    * access_token
    * expires_at
    * expires_in
    * issued_at
    * token
    * MG_URL
    * PROXY_ENDPOINT
1. Click `Send` to test our micro gateway and your proxy endpoint availability
1. (Optional) Check with Postman console for details and logs from `View` -> `Show Postman Console`

### Reference
1. https://liftcodeplay.com/2018/03/18/how-to-automatically-set-a-bearer-token-for-your-postman-requests/
1. https://gist.github.com/bcnzer/073f0fc0b959928b0ca2b173230c0669
1. https://confluence.manulife.io/display/PE/Manulife-JH+Apigee+Developers+Guide#Manulife-JHApigeeDevelopersGuide-ApigeeEndpoints

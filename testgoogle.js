const {GoogleAuth} = require('google-auth-library');

async function gettoken() {
    const url   = 'https://www.googleapis.com/auth/cloud-platform'
    const auth  = new GoogleAuth({scopes: url});
    const token = await auth.getAccessToken();

    return token
} 

gettoken()
.then((token)=>{console.log(token)})
.catch(console.error);


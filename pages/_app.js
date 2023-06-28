import '../styles/global.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect } from 'react';
import Head from 'next/head';

function fbCheck() {
    console.log("before FB Init");
    FB.init({
        appId: "5349091678523310", //205300542081427",
        autoLogAppEvents: true,
        xfbml: true,
        version: "v15.0"
    });
    FB.getLoginStatus(function(response) {
        if (response.status === "connected") {
            // The user is logged in and has authenticated your
            // app, and response.authResponse supplies
            // the user's ID, a valid access token, a signed
            // request, and the time the access token 
            // and signed request each expire.
            var uid = response.authResponse.userID;
            var accessToken = response.authResponse.accessToken;
            console.log("FB connected");
        } else if (response.status === "not_authorized") // The user hasn't authorized your application.  They
        // must click the Login button, or you must call FB.login
        // in response to a user gesture, to launch a login dialog.
        console.log("FB not authorized");
        else // The user isn't logged in to Facebook. You can launch a
        // login dialog with a user gesture, but the user may have
        // to log in to Facebook before authorizing your application.
        console.log("FB not");
    });
}

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    /*window.fbAsyncInit = fbCheck;*/
    console.log("fb")
  })
  
  useEffect(() => {
    // 載入 Facebook SDK
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }, []);

  useEffect(() => {
    // SDK 載入完成時會立即呼叫 fbAsyncInit，在這個函式中對 Facebook SDK 進行初始化
    /*
    window.fbAsyncInit = function () {
        // 初始化 Facebook SDK
        window.FB.init({
          appId: "5349091678523310",  //"205300542081427",
          cookie: true,
          xfbml: true,
          version: "v15.0",
        });
    
        console.log('[fbAsyncInit] after window.FB.init');
    
        // 取得使用者登入狀態
        window.FB.getLoginStatus(function (response) {
          console.log('[refreshLoginStatus]', response);
        });
    
        window.FB.AppEvents.logPageView();
    };
    */
    // 載入 Facebook SDK
    // ...
  }, []);

  return <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat&family=Ramaraja&display=swap" rel="stylesheet"></link>
      </Head>
      {/*}
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap');
      </style>
      */}
      {/*<script src="https://unpkg.com/three@0.133.0/build/three.js"></script>*/}
      {/*<script src="https://connect.facebook.net/en_US/sdk.js" crossOrigin="anonymous"></script>*/}
      <GoogleOAuthProvider clientId="250377851296-8joflm55vr91eiistc18pcp7pn4cs3jo.apps.googleusercontent.com">
          <Component {...pageProps} />
      </GoogleOAuthProvider>
  </>
  {/*<script src="https://accounts.google.com/gsi/client" async defer></script>*/}
}

export default MyApp

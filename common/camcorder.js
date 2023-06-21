export function startVideo(elmDiv) {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');

        video.id = "localVideo";
        video.setAttribute('autoplay', '');
        video.setAttribute('muted', '');
        video.setAttribute('playsinline', '');
        video.style.position = 'absolute'
        video.style.top = '0px'
        video.style.left = '0px'
        //video.style.zIndex = '-2'
        if (elmDiv) elmDiv.appendChild(video);

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
	        //this.ui.showCompatibility();
	        reject();
	        return;
        }

        navigator.mediaDevices.getUserMedia({audio: true, video: {facingMode: 'face'}})
                                .then((stream) => {
                                    video.addEventListener('loadedmetadata', 
                                    () => {
                                        video.setAttribute('width', video.videoWidth/2);
                                        video.setAttribute('height', video.videoHeight/2);
                                        resolve(video);
                                    });
	                                video.srcObject = stream;
                                }).catch((err) => {
                                    console.log("getUserMedia error", err);
                                    reject();
                                });
        });
  }

  export function startDesktop() {
    return new Promise((resolve, reject) => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
            //this.ui.showCompatibility();
            reject();
            return;
        }

        //getDisplayMedia
        //getCurrentBrowsingContextMedia
        navigator.mediaDevices.getDisplayMedia({audio: false, video: true, preferCurrentTab:true})
                                .then((stream) => {
                                    resolve(stream);
                                }).catch((err) => {
                                    console.log("getUserMedia error", err);
                                    reject();
                                });
        });
  }

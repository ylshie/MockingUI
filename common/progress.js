
var progress_count = -1;
export function progress_start(elm) {
    return;
    progress_count = 0;
    progress(elm);
}

function progress(elm) {
    return;
    if (progress_count < 0) return;

    var text    = ""
    for (let i=0; i < progress_count % 10; i++) text += ".";
    elm.innerText = text;
    //if (refCounter.current) refCounter.current.innerText = text;
    progress_count ++;

    setTimeout(() => progress(elm), 1000);
}

export function progress_end(elm) {
    return;
    //const elm = document.getElementById(id);

    progress_count = -1;
    elm.innerText = "";
    //if (refCounter.current) refCounter.current.innerText = "";
}


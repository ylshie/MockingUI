
export function isSep(ch) {
    if (ch == ',') return true;
    if (ch == '，') return true;
    if (ch == '.') return true;
    if (ch == '。') return true;
    if (ch == '!') return true;
    if (ch == '！') return true;
    if (ch == '?') return true;
    if (ch == '？') return true;
    if (ch == '、') return true;
    if (ch == ':') return true;
    if (ch == '：') return true;
    return false
}

export const oprefix = "[order";
export const osuffix = "]";
export function hasorder(text) {
    const pre = text.indexOf(oprefix) > -1;
    const suf = text.indexOf(osuffix) > -1;

    return pre && suf;
}
export function replaceorders(orig) {
    if (orig.indexOf(oprefix) == -1) return orig;
    var text = orig;

    do {
        text = replaceorder(text);
    } while (text.indexOf(oprefix) != -1)

    console.log("replace",orig," to ",text);
    return text;
}
function replaceorder(text) {
    if (text.indexOf(oprefix) == -1) return text;
    //if (text.indexOf(osuffix) == -1) return text;

    const from  = text.indexOf(oprefix);
    const skip  = text.indexOf(oprefix)+oprefix.length+1;
    const end   = text.indexOf(osuffix);
    const orig  = (end!= -1)? text.substring(from, end+1): "";
    const repl  = (end!= -1)? text.substring(skip, end): "";
    const res   = (end!= -1)? text.replace(orig,repl): text.substring(0,from);

    if (end!= -1) console.log("replace", orig, "from",orig,"to",repl,"=",res);

    return res;
}
export function getorders (orig) {
    const orders = [];
    var text = orig;

    do {
        const order = getorder(text);
        text = order.text;
        orders.push(order);
        console.log("add order", order);
    } while (text.indexOf(oprefix) != -1)

    console.log("orders=", orders);
    return orders;
}
function getorder (text) {
    if (text.indexOf(oprefix) == -1) return {text: text};
    if (text.indexOf(osuffix) == -1) {
        const from  = text.indexOf(oprefix);
        return {text: text.substring(0,from)};
    }
    const from  = text.indexOf(oprefix);
    const skip  = text.indexOf(oprefix) + oprefix.length + 1;
    const end   = text.indexOf(osuffix);
    const orig  = text.substring(from, end+1);
    const order = text.substring(skip, end);
    const res   = text.replace(orig,"");     

    return {text: res, order: order};
}
export function postForm(path, params, method) {
    method = method || 'post';

    var form = document.createElement('form');
    form.setAttribute('method', method);
    form.setAttribute('action', path);

    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            var hiddenField = document.createElement('input');
            hiddenField.setAttribute('type', 'hidden');
            hiddenField.setAttribute('name', key);
            hiddenField.setAttribute('value', params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}

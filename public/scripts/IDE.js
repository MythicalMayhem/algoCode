function setCookie(cName, cValue, time) {
    let date = new Date();
    date.setTime(date.getTime() + (time * 1000));
    date = "expires=" + date.toUTCString()
    document.cookie = cName + "=" + cValue + "; " + date + "; path=/";
}
function getCookie(cName) {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie);
    const cArr = cDecoded.split('; ');
    let res;
    cArr.forEach(val => { if (val.indexOf(name) === 0) res = val.substring(name.length); })
    return res;
}
function deleteCookie(name) { setCookie(name, '', -1) }
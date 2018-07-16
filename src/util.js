const monthNames = ["jan", "feb", "mar", "apr", "maj", "jun",
"jul", "aug", "sep", "oky", "nov", "dec"];
function encodeSource(source) {
    let tmp = "";
    if (source.indexOf("ica.se") > -1) {
        tmp = source.substr(source.indexOf("ica.se"));

    } else if (source.indexOf("tasteline.com") > -1) {
        tmp = source.substr(source.indexOf("tasteline.com"));

    } else if (source.indexOf("koket.se") > -1) {
        tmp = source.substr(source.indexOf("koket.se"));

    } else if (source.indexOf("mittkok.expressen.se") > -1) {
        tmp = source.substr(source.indexOf("mittkok.expressen.se"));

    } else {
        console.error("ingen matchning på source:" + source);
    }
    return tmp.replace(/\./g, ",").replace(/\//g, "+");
}
function decodeSource(source) {
    let tmp = source.replace(/,/g, '.').replace(/\+/g, '/');
    return tmp;

}
function millisecToDateString(ms) {
    let date = new Date(ms);
    let dd = date.getDate();
    let mm = date.getMonth();
    let yyyy = date.getFullYear();
    let dateString = dd + " " + monthNames[mm] + " " + yyyy;
    return dateString;
}
function getDayAndMonthString(date){
    let dd = date.getDate();
    let mm = date.getMonth();
    let dateString = dd + " " + monthNames[mm];
    return dateString;
}
export { encodeSource, decodeSource, millisecToDateString, getDayAndMonthString }
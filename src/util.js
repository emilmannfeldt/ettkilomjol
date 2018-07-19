const monthNames = ["jan", "feb", "mar", "apr", "maj", "jun",
    "jul", "aug", "sep", "oky", "nov", "dec"];
module.exports = {
    encodeSource(source) {
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
    },
    decodeSource(source) {
        let tmp = source.replace(/,/g, '.').replace(/\+/g, '/');
        return tmp;

    },
    millisecToDateString(ms) {
        let date = new Date(ms);
        let dd = date.getDate();
        let mm = date.getMonth();
        let yyyy = date.getFullYear();
        let dateString = dd + " " + monthNames[mm] + " " + yyyy;
        return dateString;
    },
    getDayAndMonthString(date) {
        let dd = date.getDate();
        let mm = date.getMonth();
        let dateString = dd + " " + monthNames[mm];
        return dateString;
    },
    hideSpinner() {
        document.querySelector(".spinner").style.display = 'none';
    },
    showSpinner() {
        document.querySelector(".spinner").style.display = 'block';
    },
}
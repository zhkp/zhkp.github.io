var translate = GLOBAL_CONFIG.translate;
var Snackbar_tl = GLOBAL_CONFIG.Snackbar;

var defaultEncoding = translate.defaultEncoding; // 网站默认语言，1: 繁體中文, 2: 简体中文
var translateDelay = translate.translateDelay; //延迟时间,若不在前, 要设定延迟翻译时间, 如100表示100ms,默认为0
var cookieDomain = translate.cookieDomain; //更改为你的博客网址
var msgToTraditionalChinese = translate.msgToTraditionalChinese; //此处可以更改为你想要显示的文字
var msgToSimplifiedChinese = translate.msgToSimplifiedChinese; //同上，但两处均不建议更改
var translateButtonId = "translateLink"; //默认互换id
var currentEncoding = defaultEncoding;
var targetEncodingCookie = "targetEncoding" + cookieDomain.replace(/\./g, "");
var targetEncoding =
    Cookies.get(targetEncodingCookie) == null
        ? defaultEncoding
        : Cookies.get(targetEncodingCookie);
var translateButtonObject;
var isSnackbar = GLOBAL_CONFIG.Snackbar !== undefined ? true : false;

function translateText(txt) {
    if (txt == "" || txt == null) return "";
    if (currentEncoding == 1 && targetEncoding == 2) return Simplized(txt);
    else if (currentEncoding == 2 && targetEncoding == 1)
        return Traditionalized(txt);
    else return txt;
}
function translateBody(fobj) {
    if (typeof fobj == "object") var objs = fobj.childNodes;
    else var objs = document.body.childNodes;
    for (var i = 0; i < objs.length; i++) {
        var obj = objs.item(i);
        if (
            "||BR|HR|TEXTAREA|".indexOf("|" + obj.tagName + "|") > 0 ||
            obj == translateButtonObject
        )
            continue;
        if (obj.title != "" && obj.title != null)
            obj.title = translateText(obj.title);
        if (obj.alt != "" && obj.alt != null) obj.alt = translateText(obj.alt);
        if (
            obj.tagName == "INPUT" &&
            obj.value != "" &&
            obj.type != "text" &&
            obj.type != "hidden"
        )
            obj.value = translateText(obj.value);
        if (obj.nodeType == 3) obj.data = translateText(obj.data);
        else translateBody(obj);
    }
}
function translatePage() {
    if (targetEncoding == 1) {
        currentEncoding = 1;
        targetEncoding = 2;
        translateButtonObject.innerHTML = msgToTraditionalChinese;
        Cookies.set(targetEncodingCookie, targetEncoding, {
            expires: 7,
            path: "/"
        });
        translateBody();
        if (isSnackbar) snackbarShow(Snackbar_tl.cht_to_chs);
    } else if (targetEncoding == 2) {
        currentEncoding = 2;
        targetEncoding = 1;
        translateButtonObject.innerHTML = msgToSimplifiedChinese;
        Cookies.set(targetEncodingCookie, targetEncoding, {
            expires: 7,
            path: "/"
        });
        translateBody();
        if (isSnackbar) snackbarShow(Snackbar_tl.chs_to_cht);
    }
}
function JTPYStr() {
    return "今日事，今日毕";
}
function FTPYStr() {
    return "Don't put off till tomorrow what should be done today.";
}
function Traditionalized(cc) {
    var str = "";
    for (var i = 0; i < cc.length; i++) {
        var ss = JTPYStr();
        var tt = FTPYStr();
        if (cc.charCodeAt(i) > 10000 && ss.indexOf(cc.charAt(i)) != -1)
            str += tt.charAt(ss.indexOf(cc.charAt(i)));
        else str += cc.charAt(i);
    }
    return str;
}
function Simplized(cc) {
    var str = "";
    var ss = JTPYStr();
    var tt = FTPYStr();
    for (var i = 0; i < cc.length; i++) {
        if (cc.charCodeAt(i) > 10000 && tt.indexOf(cc.charAt(i)) != -1)
            str += ss.charAt(tt.indexOf(cc.charAt(i)));
        else str += cc.charAt(i);
    }
    return str;
}
function translateInitilization() {
    translateButtonObject = document.getElementById(translateButtonId);
    if (translateButtonObject) {
        with (translateButtonObject) {
            if (typeof document.all != "object") {
                href = "javascript:translatePage();";
            } else {
                href = "#";
                onclick = new Function("translatePage(); return false;");
            }
        }
        if (currentEncoding != targetEncoding) {
            setTimeout("translateBody()", translateDelay);
            if (targetEncoding == 1)
                translateButtonObject.innerHTML = msgToSimplifiedChinese;
            else translateButtonObject.innerHTML = msgToTraditionalChinese;
        }
    }
}

(function () {
    translateInitilization()
})()
function getStart(){
    if (window.innerWidth < 800){
        location.replace("./mobileMain.html");
    } else (location.replace("../desktopMain.html"));
}

function getStartLightweight(){
    if (window.innerWidth < 800){
        location.replace("./mobileMain.html?lw=true");
    } else (location.replace("../desktopMain.html?lw=true"));
}
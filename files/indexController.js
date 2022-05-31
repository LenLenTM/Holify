function getStart(){
    if (window.innerWidth < 800){
        location.replace("./mobileMain.html");
    } else (location.replace("../desktopMain.html"));
}
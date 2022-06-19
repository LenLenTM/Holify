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

async function testRoutX() {

    /**
    let email = 'lena@muede.at';
    let cookie = 'empty';
    //let email = 'dsjkdsjk@gmail.com';
    let username = 'lena';
    let password = 'sword';
    let xoj = true;

    let url = 'http://localhost:3456/api/deleteUser/' + username + '/' + password;
    fetch(url, {
        method: 'DELETE'
    }).then(response => console.log(response));


    let url = 'http://localhost:3456/api/register/' + cookie + '/' + email + '/' + username + '/' + password + '/' + xoj;
    fetch(url, {
        method: 'POST'
    }).then(response => console.log(response)); **/
}
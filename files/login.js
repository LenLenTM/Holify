function initLogin(){
    checkCookie();

    let pane = document.createElement('div');


}

function checkCookie(){
    let value = '';
    let cookie = 'connect.sid=s%3Av6whpb6LtXy7eHU2VhfEhyi6Pw1uPr_Y.0PIFoQ4on8TlM2pzAaA8gpaloqxSPrTNakZ7j3eI9Rs'; //document.cookie.toString();
    let cookieArray = cookie.split('');
    for(let i = 0; i < cookie.length; i++){
        let num = cookieArray[i].charCodeAt(0).toString();
        value = value + num;
    }
    let url = 'http://localhost:3456/api/username/' + value;
    fetch(url, {
        methode: 'GET'
    }).then(function (response){
        response.text()
            .then(function (text){
                let name = text;

                if(name !== 'NO'){
                    document.getElementById('user').src = 'resources/UserIcon_logged.png';
                    let username = document.createElement('p');
                    username.setAttribute('id', 'username');
                    username.innerText = name.toUpperCase();
                    document.getElementById('nav').append(username);
                }
            })})
}
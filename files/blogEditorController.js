let tagArray = [];


class Blog {
    constructor(title, content, tags, user) {

        this.title = title;
        this.content = content;
        this.tags = tags;
        let date = new Date();
        this.time = date.toLocaleString("at-DE");
        this.user = user;
    }
}

function initEditorPage(){
    checkCookie();
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

function collectData() {
    for(let i = 0; i < document.getElementsByClassName('tag').length; i++) {
        tagArray.push(document.getElementsByClassName('tag').item(i).firstChild.nodeValue);
        console.log(tagArray);
    }

    return new Blog(
        document.getElementById('title').value,
        tinyMCE.activeEditor.getContent(),
        tagArray,
        document.getElementById('user').value
    );
}

function blogToJSON(string) {
    let json = JSON.stringify(string)
    console.log(json);
    return json;


}

function saveJSON (JSON) {
    localStorage.setItem('blogPost', JSON);
    fetch('http://localhost:3456/api/newPost', {
        method: 'POST',
        contentType: 'application/json',
        body: JSON
    }).then(function(res){res.text()
        .then(function (text){
            console.log(text);
        })})
}

function jsonToBlog (json) {
    return JSON.parse(json);
}


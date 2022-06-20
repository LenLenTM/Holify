let light = false;


class Blog {
    constructor(title, content, user) {

        this.title = title;
        this.content = content;
        let date = new Date();
        this.time = date.toLocaleString("at-DE");
        this.user = user;
    }
}

function initEditorPage(){
    let paraString = window.location.search;
    let parameter = new URLSearchParams(paraString);
    if (parameter.get('light')){light = true;}
    checkCookie();
}

function userLogin(){
    if(light === true){
        location.href = "login.html?light=true";
    }
    else{
        location.href = "login.html";
    }
}
function blogLibrary(){
    if(light === true){
        location.href = "blogLibrary.html?light=true";
    }
    else{
        location.href = "blogLibrary.html";
    }
}

function checkCookie(){
    let value = '';
    let cookie = document.cookie.toString();
    let cookieArray = cookie.split('');
    for(let i = 0; i < cookie.length; i++){
        let num = cookieArray[i].charCodeAt(0).toString();
        value = value + num;
    }
    let url = 'http://localhost:3456/api/username/12' //+ value;
    fetch(url, {
        methode: 'GET'
    }).then(function (response){
        response.text()
            .then(function (text){
                let name = text;

                if(name !== 'NO'){
                    document.getElementById('user2').src = 'resources/UserIcon_logged.png';
                    let username = document.createElement('p');
                    username.setAttribute('id', 'usernameNav');
                    username.innerText = name.toUpperCase();
                    document.getElementById('userIconContainer').append(username);
                }
            })})
}

function collectData() {

    let blog = new Blog(
        document.getElementById('title').value,
        //document.getElementById('blogContent').value,
        tinyMCE.activeEditor.getContent(),
        document.getElementById('usernameNav').textContent
    );
    let blogJson = blogToJSON(blog);
    saveJSON(blogJson);
}

function blogToJSON(string) {
    let json = JSON.stringify(string)
    return json;


}

async function saveJSON (blogEntry) {
    console.log(blogEntry);

    let data = new FormData();
    data.append('json', blogEntry);
    let response = fetch('http://localhost:3456/api/newPost', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: blogEntry
    }).then(function(res){res.text()
        .then(function (text){
            console.log(text);
        })})
    let answer = await response;
    console.log(answer);
}

function jsonToBlog (json) {
    return JSON.parse(json);
}
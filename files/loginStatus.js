let loginStatus = false;
let pane;

function initLogin(){
    pane = document.createElement('div');
    pane.setAttribute('id', 'pane');
    checkCookie();
}

function removePaneChildren(){
        let child = pane.firstElementChild;
        while (child) {
            pane.removeChild(child);
            child = pane.firstElementChild;
        }
}

function checkCookie(){
    let value = '';
    let cookie = '12'; //document.cookie.toString();
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
                console.log(name)
                if(name !== 'NO'){
                    document.getElementById('user').src = 'resources/UserIcon_logged.png';
                    let username = document.createElement('p');
                    username.setAttribute('id', 'usernameNav');
                    username.innerText = name.toUpperCase();
                    document.getElementById('nav').append(username);
                    loginStatus = true;
                }
                setUp();
            })})
}

function setUp(){
    if(loginStatus === true){
        let url = 'http://localhost:3456/api/userdata/' + document.getElementById('usernameNav').textContent;
        fetch(url, {
            method: 'GET'
        }).then(response => response.json())
            .then(data => {
                let email = document.createElement('div');
                email.setAttribute('id', 'email');
                email.innerText = data.email;

                let username = document.createElement('div');
                username.setAttribute('id', 'username');
                username.innerText = data.username;

                let inputLogOut = document.createElement('button');
                inputLogOut.setAttribute('id', 'inputLogOut');
                inputLogOut.innerHTML = 'LogOut';
                inputLogOut.setAttribute('onclick', 'logOut()');
                let inputEdit = document.createElement('button');
                inputEdit.setAttribute('id', 'inputEdit');
                inputEdit.innerHTML = 'Edit Profile';
                inputEdit.setAttribute('onclick', 'goEdit()');
                let inputDelete = document.createElement('button');
                inputDelete.setAttribute('id', 'inputDelete');
                inputDelete.innerHTML = 'Delete Profile';
                inputDelete.setAttribute('onclick', 'deleteUser()');

                pane.append(email, username, inputLogOut, inputEdit, inputDelete);
                document.getElementById('container').append(pane);
            })

    }
    else {
        openLoginForm();
    }
}

function logOut(){
    let value = '';
    let cookie = '12'//document.cookie.toString();
    let cookieArray = cookie.split('');
    for(let i = 0; i < cookie.length; i++){
        let num = cookieArray[i].charCodeAt(0).toString();
        value = value + num;
    }
    let url = 'http://localhost:3456/api/logOut/12' //+ value;
    fetch(url, {
        method: 'PATCH'
    }).then(function (response){
        response.text()
            .then(function (text){
                let answer = text;
                console.log(answer);
                removePaneChildren();
                loginStatus = false;
                location.reload()})});
}

function openLoginForm(){

    removePaneChildren();

    let usernameInput = document.createElement('textarea');
    usernameInput.setAttribute('placeholder', 'Username');
    usernameInput.setAttribute('id', 'usernameInput');
    let passwordInput = document.createElement('textarea');
    passwordInput.setAttribute('placeholder', 'Password');
    passwordInput.setAttribute('id', 'passwordInput');

    let loginButton = document.createElement('button');
    loginButton.innerHTML = 'Login';
    loginButton.setAttribute('onclick', 'login()');
    let registerButton = document.createElement('button');
    registerButton.innerHTML = 'Create new profile';
    registerButton.setAttribute('onclick', 'setupRegister()');

    pane.append(usernameInput, passwordInput, loginButton, registerButton);
    document.getElementById('container').append(pane);
}

function login(){
    let username = document.getElementById('usernameInput').value;
    let password = document.getElementById('passwordInput').value;

    let value = '';
    let cookie = document.cookie.toString();
    let cookieArray = cookie.split('');
    for(let i = 0; i < cookie.length; i++){
        let num = cookieArray[i].charCodeAt(0).toString();
        value = value + num;
    }

    let url = 'http://localhost:3456/api/login/' + username + '/' + password + '/12' //+ value;
    fetch(url, {
        methode: 'GET'
    }).then(function (response){
        response.text()
            .then(function (text){
                let answer = text;
                console.log(answer);
                if(text === 'You are logged in now.'){
                    loginStatus = true;
                }
                removePaneChildren();
                location.reload()})});
}

function setupRegister(){

    removePaneChildren();

    let emailInput = document.createElement('textarea');
    emailInput.setAttribute('placeholder', 'email-address');
    emailInput.setAttribute('id', 'emailInput');
    let usernameInput = document.createElement('textarea');
    usernameInput.setAttribute('placeholder', 'Username');
    usernameInput.setAttribute('id', 'usernameInput');
    let passwordInput = document.createElement('textarea');
    passwordInput.setAttribute('placeholder', 'Password');
    passwordInput.setAttribute('id', 'passwordInput');

    let registerButton = document.createElement('button');
    registerButton.innerHTML = 'Register';
    registerButton.setAttribute('onclick', 'register()');

    pane.append(emailInput, usernameInput, passwordInput, registerButton);
}

function register(){

    let value = '';
    let cookie = document.cookie.toString();
    let cookieArray = cookie.split('');
    for(let i = 0; i < cookie.length; i++){
        let num = cookieArray[i].charCodeAt(0).toString();
        value = value + num;
    }
    let email = document.getElementById('emailInput').value;
    let username = document.getElementById('usernameInput').value;
    let password = document.getElementById('passwordInput').value;
    let url = 'http://localhost:3456/api/register/12/' + email + '/' + username + '/' + password;

    fetch(url, {
        method: 'POST'
    }).then(function (response){
        response.text()
            .then(function (text){
                let answer = text;
                console.log(answer);
                if(text === 'Registration successfull.'){
                    loginStatus = true;
                    removePaneChildren();
                    location.reload()
                }
                else if(text === 'Enter a valid email address.'){
                    document.getElementById('emailInput').value = '';
                    document.getElementById('emailInput').setAttribute('placeholder', text);
                }
                else if(text === 'Username too short.'){
                    document.getElementById('usernameInput').value = '';
                    document.getElementById('usernameInput').setAttribute('placeholder', text);
                }
                else if(text === 'Password too short.'){
                    document.getElementById('passwordInput').value = '';
                    document.getElementById('passwordInput').setAttribute('placeholder', text);
                }
                    });});
}

function goEdit(){
    removePaneChildren();

    let emailInput = document.createElement('textarea');
    emailInput.setAttribute('placeholder', 'email-address');
    emailInput.setAttribute('id', 'emailInput');
    let usernameInput = document.createElement('textarea');
    usernameInput.setAttribute('placeholder', 'Username');
    usernameInput.setAttribute('id', 'usernameInput');
    let passwordInput = document.createElement('textarea');
    passwordInput.setAttribute('placeholder', 'Password');
    passwordInput.setAttribute('id', 'passwordInput');
    let editButton = document.createElement('button');
    editButton.innerHTML = 'Edit';
    editButton.setAttribute('onclick', 'editUser()');

    pane.append(emailInput, usernameInput, passwordInput, editButton);
}

function editUser(){

    let value = '';
    let cookie = document.cookie.toString();
    let cookieArray = cookie.split('');
    for(let i = 0; i < cookie.length; i++){
        let num = cookieArray[i].charCodeAt(0).toString();
        value = value + num;
    }
    let email = document.getElementById('emailInput').value;
    let username = document.getElementById('usernameInput').value;
    let password = document.getElementById('passwordInput').value;
    let url = 'http://localhost:3456/api/editUser/12/' + email + '/' + username + '/' + password;

    fetch(url, {
        method: 'PUT'
    }).then(function (response){
        response.text()
            .then(function (text){
                let answer = text;
                console.log(answer);
                if(text === 'Changed data.'){
                    loginStatus = true;
                    removePaneChildren();
                    location.reload()
                }
                else if(text === 'Enter a valid email address.'){
                    document.getElementById('emailInput').value = '';
                    document.getElementById('emailInput').setAttribute('placeholder', text);
                }
                else if(text === 'Username too short.'){
                    document.getElementById('usernameInput').value = '';
                    document.getElementById('usernameInput').setAttribute('placeholder', text);
                }
                else if(text === 'Password too short.'){
                    document.getElementById('passwordInput').value = '';
                    document.getElementById('passwordInput').setAttribute('placeholder', text);
                }
            });});
}

function deleteUser(){
    let redButton = document.getElementById('inputDelete');
    redButton.setAttribute('onclick','deleteUserForSure()');
    redButton.innerHTML = 'DELETE';
    redButton.style.color = 'red';
    redButton.style.fontWeight = 'bold';
}

function deleteUserForSure(){
    let value = '';
    let cookie = document.cookie.toString();
    let cookieArray = cookie.split('');
    for(let i = 0; i < cookie.length; i++){
        let num = cookieArray[i].charCodeAt(0).toString();
        value = value + num;
    }
    let url = 'http://localhost:3456/api/deleteUser/12'
    fetch(url, {
        method: 'DELETE'
    }).then(function (response){
        response.text()
            .then(function (text){
                let answer = text;
                if(text === 'User deleted.'){
                    loginStatus = false;
                }
                console.log(answer);
                removePaneChildren();
                location.reload()
            });});
}
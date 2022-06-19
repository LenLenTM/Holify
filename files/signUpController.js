
function validateForm() {

    let valid = true;
    let email = document.getElementById("email").checkValidity();
    let user = document.getElementById("username").value;
    let pw = document.getElementById("password").value;
    let pwRep = document.getElementById("password-repeat").value;

    if (email === false) {
        alert("No valid email");
        valid = false;
    }
    if (user.length === 0) {
        alert("Please enter an Username");
        valid = false;
    }
    if(pw.length < 8){
        alert("Password must be longer than 8 characters");
        valid = false;
    }
    if(pw !== pwRep) {
        alert("Passwords don't match");
        valid = false;
    }
    if (valid === true) {
        collectData();
    }
}




function getValueByID(String) {
    return document.getElementById('data').value;
}

class User {
    constructor(email, username, password) {
        this.email = email;
        this.username = username;
        this.password = password;
        let date = new Date();
        this.time = date.toLocaleString("at-DE");
    }
}

function collectData() {
    let newUser = new User(
        document.getElementById('email').value,
        document.getElementById("username").value,
        document.getElementById("password").value,
    )

    let userJson = userToJSON(newUser);
    console.log(userJson);
    saveJSON(userJson);
}

function userToJSON(string) {
    return JSON.stringify(string);
}

function saveJSON (JSON) {
    localStorage.setItem('userData', JSON);
}

function jsonToUser (json) {
    return JSON.parse(json);
}

let json = localStorage.getItem('blogPost');
console.log(json);
let blogPost = jsonToBlog(json);

let date = blogPost.time;

function initLibrary(){
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

function blogPostConstructor() {
        let button = document.createElement("button");
        button.setAttribute("class", blogPost.title);
        button.setAttribute("value", "YES");
        button.setAttribute("id", blogPost.title + "button")

        let titleNode = document.createTextNode(blogPost.title);
        button.append(titleNode);

        let contentDiv = document.createElement("div");
        contentDiv.setAttribute("class", "content");

        let titleDiv = document.createElement("div");
        titleDiv.setAttribute("id", "test");

        button.append(titleNode);

        let timeDiv = document.createElement("div");
        timeDiv.setAttribute("id", "time");
        let timeNode = document.createTextNode(blogPost.time);
        timeDiv.append(timeNode);

        let userDiv = document.createElement("div");
        userDiv.setAttribute("id", "user");
        let userNode = document.createTextNode(blogPost.user);
        userDiv.append(userNode);

        let tagDiv = document.createElement("div");
        tagDiv.setAttribute("id", "tags");
        let tagNode = document.createTextNode(blogPost.tags);
        tagDiv.append(tagNode);



        contentDiv.append(titleDiv,tagDiv)
        button.append(contentDiv);

        let contentBox = document.createElement("div");
        contentBox.setAttribute("class", "contentBox");
        contentBox.setAttribute("id", blogPost.title);
        contentBox.style.visibility = "hidden";
        contentBox.style.position = "absolute"

        let textDiv = document.createElement("div");
        textDiv.setAttribute("id", "content");

        textDiv.innerHTML = blogPost.content;

        button.addEventListener("click", collapse );

        contentBox.append(userDiv,timeDiv,textDiv);
        document.getElementById("headlines").append(button, contentBox);
}

function setSearchbar (str) {
        return document.getElementById('searchbar').value = str;
}
function collapse() {
        let button = document.getElementById(blogPost.title + "button")
        if(button.value === "YES") {
                document.getElementById(blogPost.title).style.visibility = "visible";
                document.getElementById(blogPost.title).style.position = "static";
                button.value = "NO";
        }else if (button.value === "NO") {
                document.getElementById(blogPost.title).style.visibility = "hidden";
                document.getElementById(blogPost.title).style.position = "absolute";
                button.value = "YES"
        }
}
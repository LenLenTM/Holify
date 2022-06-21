/**let json = localStorage.getItem('blogPost');
 let blogPost = jsonToBlog(json);
 let date = blogPost.time; **/

let light = false;
let blogPost;

window.onload = initLibrary();

function initLibrary(){
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
function openEditor(){
        if(light === true){
                location.href = "blogEditor.html?light=true";
        }
        else{
                location.href = "blogEditor.html";
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
        let url = 'http://localhost:3456/api/username/' + value;
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
                                    let editor = document.createElement('button');
                                    editor.innerHTML = 'New Post';
                                    editor.setAttribute('id', 'openEditor');
                                    editor.setAttribute('onclick', 'openEditor()');
                                    document.getElementById('main').append(editor);
                            }
                            getLibrary();
                    })})
}

function getLibrary(){
        let url = 'http://localhost:3456/api/getLibrary'
                fetch(url, {
                        method: 'GET',
                        contentType: 'application/json'
                }).then(response => response.json())
                    .then(data => {
                            for (let i = 0; i < data.length; i++) {
                                    blogPostConstructor(data[i]);
                            }
                    });
}

function blogPostConstructor(blogPost) {

        let button = document.createElement("button");
        button.setAttribute("class", blogPost.title);
        button.setAttribute("value", "YES");
        button.setAttribute("id", blogPost.title);
        button.setAttribute("onClick", "collapse(this.id)");


        let titleNode = document.createTextNode(blogPost.title);
        button.append(titleNode);

        let contentDiv = document.createElement("div");
        contentDiv.setAttribute("class", "content");

        let titleDiv = document.createElement("div");
        titleDiv.setAttribute("id", "test");

        let timeDiv = document.createElement("div");
        timeDiv.setAttribute("id", "time");
        let time = blogPost.time.slice(0, -10);
        let timeNode = document.createTextNode(time);
        timeDiv.append(timeNode);

        let userDiv = document.createElement("div");
        userDiv.setAttribute("id", "user");
        let userNode = document.createTextNode(blogPost.user);
        userDiv.append(userNode);

        /**let tagDiv = document.createElement("div");
        tagDiv.setAttribute("id", "tags");
        let tagNode = document.createTextNode(blogPost.tags);
        tagDiv.append(tagNode);**/

        //contentDiv.append(titleDiv.tagDiv);
        //button.append(contentDiv);

        let contentBox = document.createElement("div");
        contentBox.setAttribute("class", "contentBox");
        contentBox.setAttribute("id", blogPost.title + "collapse");
        contentBox.style.visibility = "hidden";
        contentBox.style.position = "absolute";

        let textDiv = document.createElement("div");
        textDiv.setAttribute("id", "content");

        textDiv.innerHTML = blogPost.content;

        contentBox.append(userDiv,timeDiv,textDiv);

        if(document.getElementById('usernameNav')){
                if(blogPost.user.toUpperCase() === document.getElementById('usernameNav').textContent){
                        let deleteButton = document.createElement("button");
                        deleteButton.setAttribute("id", blogPost.title + 'delete');
                        deleteButton.innerHTML = 'Delete Blog';
                        deleteButton.setAttribute('onClick', 'deletePost(this.id)');

                        contentBox.append(deleteButton);
                }
        }
        document.getElementById("headlines").append(button, contentBox);
}

function collapse(id) {
        let button = document.getElementById(id);
        if(button.value === "YES") {
                document.getElementById(id + "collapse").style.visibility = "visible";
                document.getElementById(id + "collapse").style.position = "relative";
                button.style.backgroundColor = '#ebebeb';
                button.value = "NO";

        }else if (button.value === "NO") {
                document.getElementById(id + "collapse").style.visibility = "hidden";
                document.getElementById(id + "collapse").style.position = "absolute";
                button.style.backgroundColor = 'white';
                button.value = "YES"
        }
}

function deletePost(id){
        let button = document.getElementById(id);
        button.removeAttribute('onclick');
        button.setAttribute('onclick', 'deleteForSure(this.id)');
        button.style.color = 'red';
        button.style.fontWeight = 'bold';
}

function deleteForSure(id){
        let title = id.slice(0, -6);
        let url = 'http://localhost:3456/api/deletePost/' + title;
        fetch(url, {
                method: 'DELETE',
                contentType: 'application/json',
        }).then(function (response){
                response.text()
                    .then(function (text){
                    })});
        location.reload();
}
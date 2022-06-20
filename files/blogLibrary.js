/**let json = localStorage.getItem('blogPost');
 let blogPost = jsonToBlog(json);
 let date = blogPost.time; **/

let blogPost;

function initLibrary(){
        getLibrary();
}

function getLibrary(){
        let url = 'http://localhost:3456/api/getLibrary'
        fetch(url, {
                method: 'GET',
                contentType: 'application/json'
        }).then(response => response.json())
            .then(data => {
                    console.log(blogPost);
                    for(let i = 0; i < data.length; i++){
                            blogPostConstructor(data[i]);
                    }
            })
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
        contentBox.setAttribute("id", blogPost.title + "collapse");
        contentBox.style.visibility = "hidden";
        contentBox.style.position = "absolute";

        let textDiv = document.createElement("div");
        textDiv.setAttribute("id", "content");

        textDiv.innerHTML = blogPost.content;

        //button.addEventListener("click",  collapse(blogPost.title));

        let editButton = document.createElement("button");
        editButton.setAttribute("id", "editButton");
        let editButtonText = document.createTextNode("Edit Blog");
        editButton.append(editButtonText);

        //editButton.addEventListener("click", editBlog)

        contentBox.append(userDiv,timeDiv,textDiv, editButton);
        document.getElementById("headlines").append(button, contentBox);
}

function setSearchbar (str) {
        return document.getElementById('searchbar').value = str;
}
function collapse(id) {


        let button = document.getElementById(id);
        if(button.value === "YES") {
                document.getElementById(id + "collapse").style.visibility = "visible";
                document.getElementById(id + "collapse").style.position = "relative";
                button.value = "NO";

        }else if (button.value === "NO") {
                document.getElementById(id + "collapse").style.visibility = "hidden";
                document.getElementById(id + "collapse").style.position = "absolute";
                button.value = "YES"
        }




}
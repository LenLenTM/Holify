let json = localStorage.getItem('blogPost');
let blogPost = jsonToBlog(json);
blogPost.content.replaceAll('""','');
let date = blogPost.time;
document.getElementById("libraryTitle").innerText = blogPost.title;
document.getElementById("libraryTime").innerText = date;
document.getElementById("libraryUser").innerText = blogPost.user;
document.getElementById("tags").innerText = blogPost.tags;
document.getElementById("libraryContent").innerHTML = blogPost.content;
console.log(blogPost)

function blogPostConstructor() {
        let button = document.createElement("button");
        button.setAttribute("class", blogPost.title);
        button.addEventListener("click", collapse );
        let titleNode = document.createTextNode(blogPost.title);
        button.append(titleNode);


        let contentDiv = document.createElement("div");
        contentDiv.setAttribute("class", "content");

        let titleDiv = document.createElement("div");
        titleDiv.setAttribute("id", blogPost.title);

        let timeDiv = document.createElement("div");
        timeDiv.setAttribute("id", date);

        let userDiv = document.createElement("div");
        userDiv.setAttribute("id", blogPost.user);

        let tagDiv = document.createElement("div");
        tagDiv.setAttribute("id", blogPost.tags);

        let textDiv = document.createElement("div");
        textDiv.setAttribute("id", blogPost.content);

        contentDiv.append(titleDiv,timeDiv,userDiv,tagDiv,textDiv)
        button.append(contentDiv);
        document.getElementById("headlines").append(button);
}

function setSearchbar (str) {
        document.getElementById('searchbar').value = str;
}
function collapse () {
        document.getElementById()
}
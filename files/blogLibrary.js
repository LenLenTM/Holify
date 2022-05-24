let json = localStorage.getItem('blogPost');
let blogPost = jsonToBlog(json);
blogPost.content.replaceAll('""','');
let date = blogPost.time;
document.getElementById("libraryTitle").innerText = blogPost.title;
document.getElementById("libraryTime").innerText = date;
document.getElementById("libraryUser").innerText = blogPost.user;
document.getElementById("libraryContent").innerHTML = blogPost.content;
console.log(blogPost)


function setSearchbar (str) {
        document.getElementById('searchbar').value = str;
}

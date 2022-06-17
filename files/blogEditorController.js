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
    let test = JSON.stringify(string)
    console.log(test)
    return test;


}

function saveJSON (JSON) {
    localStorage.setItem('blogPost', JSON);
}

function jsonToBlog (json) {
    return JSON.parse(json);
}

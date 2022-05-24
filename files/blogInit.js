

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

function blogToJSON(string) {
    return JSON.stringify(string);
}

function saveJSON (JSON) {
    localStorage.setItem('blogPost', JSON);
}

function jsonToBlog (json) {
    return JSON.parse(json);
}



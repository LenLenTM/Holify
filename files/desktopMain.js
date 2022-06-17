function initPage(){
    let link = document.getElementById("user")
    link.addEventListener("click", () => {
        fetch('/api/login');
    })
    console.log("Hello Susi");
}





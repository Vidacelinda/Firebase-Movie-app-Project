// add an event listener to the document object, waits until the HTML document has been completely loaded and parsed
document.addEventListener("DOMContentLoaded", function() {
    var xhttp = new XMLHttpRequest();
    // set a callback function to be executed when the readyState property changes
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                document.querySelector("#navbar").innerHTML = this.responseText;
            }
        }
    };
    // initiate a GET request to the "navbar.html" file using the XMLHttpRequest object
    xhttp.open("GET", "navbar.html", true);
    xhttp.send();
});
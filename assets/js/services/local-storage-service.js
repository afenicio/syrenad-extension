function save() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    chrome.storage.local.set({
        'username': username ,
        'password': password
    }, function(){});
}

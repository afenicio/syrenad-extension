const goButton = document.getElementById('go-button');
const subscribe = document.getElementById('subscribe');
const unsubscribe = document.getElementById('unsubscribe');
const unsubscribeAll = document.getElementById('unsubscribeAll');
const openAll = document.getElementById("openAll");
const jiraId = document.getElementById('jira-id');
const test = document.getElementById('test');
const regex = /^((R|S)+([0-9])+)$/g;
const subscriptions = document.getElementById("subscriptions");
const actionSubscriptions = document.getElementById("actionSubscriptions");


const reset = document.getElementById('notify-reset');
let localObj;

window.onload = function(){
    initStorage();
    updateSubscribed();
    chrome?.tabs?.query({active: true, lastFocusedWindow: true}, tabs => {
        let url = tabs[0].url;
        let jira = url.substr(url.lastIndexOf('/') + 1);
        if (jira.startsWith('REC')||jira.startsWith('SYR')){
            jira = jira.replace('REC-','R');
            jira = jira.replace('SYR-','S');
            if(jira.includes('?')){
                jira = jira.split('?')[0];
            }
            jiraId.setAttribute('value',jira);
            goButton.disabled = false;
            subscribe.disabled = false;
            unsubscribe.disabled = false;
        }
    });
}


jiraId?.addEventListener('input', function (evt) {
    if (jiraId.value?.toUpperCase().match(regex)) {
        goButton.disabled = false;
        subscribe.disabled = false;
        unsubscribe.disabled = false;
    } else {
        goButton.disabled = true;
        subscribe.disabled = true;
        unsubscribe.disabled = true;
    }
});

jiraId?.addEventListener('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        if (jiraId.value?.toUpperCase().match(regex)) {
            window.open(getJiraUrl(jiraId.value), '_blank');
        }
    }
});

subscribe?.addEventListener('click', () => {
    store(jiraId.value.toUpperCase());
})

unsubscribe?.addEventListener('click', () => {
    remove(jiraId.value.toUpperCase());
})

unsubscribeAll?.addEventListener('click', () => {
    if (confirm("Do you want to unsubscribe to all your jiras?")) {
        localObj = [];
        localStorage.setItem('subscribed', JSON.stringify([]));
        jiraId.value = null;
        updateSubscribed();
    } else {
    }
})

openAll?.addEventListener('click', () => {
    localObj.forEach(jira=>window.open(getJiraUrl(jira), '_blank'));
})

goButton?.addEventListener('click', () => {
    window.open(getJiraUrl(jiraId.value), '_blank');
})

function getJiraUrl(jiraId) {
    return "https://natsystem.atlassian.net/browse/" + getJiraFull(jiraId);
}

function getJiraFull(jiraId) {
    return jiraId?.toUpperCase().replace('R', 'REC-').replace('S', 'SYR-');
}


function initStorage() {
    if (localStorage.getItem('subscribed')) {
        localObj = Object.values(JSON.parse(localStorage.getItem('subscribed')));
    } else {
        localObj = [];
        localStorage.setItem('subscribed', JSON.stringify([]));
    }
}

function store(jiraId) {
    localObj.push(jiraId.toString().toUpperCase());
    localObj = [...new Set(localObj)];
    localStorage.setItem('subscribed', JSON.stringify(localObj));
    jiraId.value = null;
    updateSubscribed();
}

function remove(jiraId) {
    const index = localObj.indexOf(jiraId.toString().toUpperCase());
    if (index > -1) {
        localObj.splice(index, 1); // 2nd parameter means remove one item only
    }
    localStorage.setItem('subscribed', JSON.stringify(localObj));
    jiraId.value = null;
    updateSubscribed();
}

function updateSubscribed() {
    let content = 'No subscriptions';
    if (localObj.length > 0) {
        content = "";
        localObj.forEach((jiraId) => {
            content += '<a class="subscriptionItem" href="' + getJiraUrl(jiraId) + '" role="button" target="_blank"><h6><span class="badge bg-secondary">' + getJiraFull(jiraId) + '</span></h6></a>';
        })
        if(actionSubscriptions){
            actionSubscriptions.style.display = 'block';
        }
    } else {
        if(actionSubscriptions){
            actionSubscriptions.style.display = 'none';
        }
    }
    if(subscriptions){
        subscriptions.innerHTML = content;
    }

}

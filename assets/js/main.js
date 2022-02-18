const goButton = document.getElementById('go-button');
const subscribe = document.getElementById('subscribe');
const unsubscribe = document.getElementById('unsubscribe');
const jiraId = document.getElementById('jira-id');
const test = document.getElementById('test');
const regex = /^((R|S)+([0-9])+)$/g;

const reset = document.getElementById('notify-reset');
let localObj;

window.onload = function(){
    initStorage();
    updateSubscribed();
}


jiraId?.addEventListener('input', function (evt) {
    if (jiraId.value?.toUpperCase().match(regex)) {
        goButton.disabled = false;
        subscribe.disabled = false;
    } else {
        goButton.disabled = true;
        subscribe.disabled = true;
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
/*            content += '<button role="button" class="btn btn-primary position-relative">'+getJiraFull(jiraId)+'<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-light"><i\n' +
                '                    class="minusIcon fa fa-minus-circle"\n' +
                '                    aria-hidden="true"></i></span></button>';*/
            content += '<a class="subscriptionItem" href="' + getJiraUrl(jiraId) + '" role="button" target="_blank"><h6><span class="badge bg-secondary">' + getJiraFull(jiraId) + '</span></h6></a>';
        })
    }
    document.getElementById("subscriptions").innerHTML = content;
}

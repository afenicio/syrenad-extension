const goButton = document.getElementById('go-button');
const subscribe = document.getElementById('subscribe');
const unsubscribe = document.getElementById('unsubscribe');
const jiraId = document.getElementById('jira-id');
const test = document.getElementById('test');
const regex = /^((R|S)+([0-9])+)$/g;

const reset = document.getElementById('notify-reset');

let localObj = localStorage.getItem('subscribed');

updateSubscribed();


jiraId?.addEventListener('input', function (evt) {
    if (jiraId.value.toUpperCase().match(regex)) {
        goButton.disabled = false;
        subscribe.disabled = false;
    } else {
        goButton.disabled = true;
        subscribe.disabled = true;
    }
});

jiraId?.addEventListener('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        if (jiraId.value.toUpperCase().match(regex)) {
            window.open(getJiraUrl(jiraId.value), '_blank');
        }
    }
});

subscribe?.addEventListener('click', () => {
    store(jiraId.value);
})

unsubscribe?.addEventListener('click', () => {
    remove(jiraId.value);
})

goButton?.addEventListener('click', () => {
    window.open(getJiraUrl(jiraId.value), '_blank');
    ;
})

function store(jiraId) {
    let current;

    if (localStorage.getItem('subscribed') != null) {
        current = Object.values(JSON.parse(localObj));
        current.push(jiraId);
        current = [...new Set(current)];
    } else {
        current = [jiraId.value];
    }
    localStorage.setItem('subscribed', JSON.stringify(current));
    jiraId.value = null;
    updateSubscribed();
}

function remove(jiraId) {
    let current;
    if (localStorage.getItem('subscribed') != null) {
        current = Object.values(JSON.parse(localObj));
        const index = current.indexOf(jiraId);
        if (index > -1) {
            current.splice(index, 1); // 2nd parameter means remove one item only
        }
    }
    localStorage.setItem('subscribed', JSON.stringify(current));
    jiraId.value = null;
    updateSubscribed();
}

function getJiraUrl(jiraId) {
    const jiraIdFull = jiraId.toUpperCase().replace('R', 'REC-').replace('S', 'SYR-');
    return "https://natsystem.atlassian.net/browse/" + jiraIdFull;
}

function printId(jiraId){
    alert(jiraId);
}

function updateSubscribed() {
    localObj = localStorage.getItem('subscribed');
    let content;
    if (localObj != null) {
        const current = Object.values(JSON.parse(localObj));
        if (current.length > 0) {
            content = "<table>";
            current.forEach((jiraId) => {
                content += '<tr>' +
						'<td>' +
							'<a class="subscriptionItem" href="' + getJiraUrl(jiraId) + '" role="button" target="_blank">' + jiraId + '</a>' +
						'</td>' +
                        '<td>' +
                            '<a>' + jiraId + '</a>' +
                        '</td>' +
                    '</tr>';
            })
            content += "</table>";
        }else {
            content = '<p>No subscriptions</p>'
        }
        document.getElementById("subscriptions").innerHTML = content;
    }
}

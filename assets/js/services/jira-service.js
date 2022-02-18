function getFoo() {
    (async () => {
        const rawResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic YWZlbmljaW9AbmF0c3lzdGVtLmZyOjRrZ0h0TEdjbndGeU9COEM3akxRMjcxNg'
            },
            body: JSON.stringify({
                jql: "project = REC AND sprint in openSprints() AND labels in (BugHomologation)",
                maxResults: 0
            })
        });
        const content = await rawResponse.json();

        console.log(content);
    })();
}

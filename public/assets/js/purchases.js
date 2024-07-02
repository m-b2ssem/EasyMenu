function checkLoginStatus() {
    return fetch('/is_logged_in', {
        method: 'GET',
        credentials: 'include' // Include cookies in the request
    })
    .then(res => res.json())
    .then(data => data.isLoggedIn)
    .catch(err => {
        console.error(err);
        return false;
    });
}

function handleSubscription(event, subscriptionType) {
    event.preventDefault();

    let isLoggedIn = checkLoginStatus();
    if (!isLoggedIn) {
        window.location = '/login';
        return;
    }

    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include', // Include cookies in the request
        body: JSON.stringify({ subscriptionType })
    })
    .then(res => res.json())
    .then(({ url }) => {
        window.location = url;
    })
    .catch(err => console.error(err));
}

function submitForm(event, planId) {
    event.preventDefault();

    if (!planId) {
        return;
    }else if (planId == 'free') {
        window.location = '/login';
    }else if ( planId == 'basic') {
        fetch('/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Include cookies in the request
            body: JSON.stringify({ planId })
        });
    }
  }


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

document.addEventListener('DOMContentLoaded', (event) => {
    const purchaseButton12  = document.getElementById('purchase12');
    const purchaseButton25 = document.getElementById('purchase25');
    const purchaseButton50 = document.getElementById('purchase50');
    const trailerButton = document.getElementById('trailerButton');

    if (purchaseButton12) {
        purchaseButton12.addEventListener('click', (event) => handleSubscription(event, '12'));
    }
    if (purchaseButton25) {
        purchaseButton25.addEventListener('click', (event) => handleSubscription(event, '25'));
    }
    if (purchaseButton50) {
        purchaseButton50.addEventListener('click', (event) => handleSubscription(event, '50'));
    }
    if (trailerButton) {
        trailerButton.addEventListener('click', (event) => handleSubscription(event, 'trail'));
    }
});
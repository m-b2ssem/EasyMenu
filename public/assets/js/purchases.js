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

function purchase12(event) {
    event.preventDefault();
    checkLoginStatus().then(isLoggedIn => {
        if (!isLoggedIn)
        {
            window.location = '/b';
            return;
        }
        else
        {
            window.location = '/dd';
            return ;
        }
    })
    fetch('/checkout', {
        method: 'POST'
    })
    .then(res => res.json())
    .then (({ url}) => {
        window.location = url;
    })
    .catch(err => console.error(err));
}

function purchase25(event) {
    event.preventDefault();
    fetch('/', {
        method: 'POST'
    })
    .then(res => res.json())
    .then (({ url}) => {
        window.location = url;
    })
    .catch(err => console.error(err));
}

function purchase50(event) {
    event.preventDefault();
    fetch('/', {
        method: 'POST'
    })
    .then(res => res.json())
    .then (({ url}) => {
        window.location = url;
    })
    .catch(err => console.error(err));
}

function Trail(event)
{
    event.preventDefault();
    alert('Function called!');
    // Add your logic here

}

document.addEventListener('DOMContentLoaded', (event) => {
    const purchaseButton12  = document.getElementById('purchase12');
    const purchaseButton25 = document.getElementById('purchase25');
    const purchaseButton50 = document.getElementById('purchase50');
    const trailerButton = document.getElementById('trailerButton');

    if (purchaseButton12)
    {
        purchaseButton12.addEventListener('click', purchase12);
    }
    if (purchaseButton25)
    {
        purchaseButton25.addEventListener('click', purchase25);
    }
    if (purchaseButton50)
    {
        purchaseButton50.addEventListener('click', purchase50);
    }
    if (trailerButton)
    {
        trailerButton.addEventListener('click', Trail);
    }
});
function purchase25(event) {
    event.preventDefault();
    alert('Function called!');
    // Add your logic here
}

function purchase12(event) {
    event.preventDefault();
    alert('hello Function called!');
    // Add your logic here
}

function purchase50(event) {
    event.preventDefault();
    alert('Ftion called!');
    // Add your logic here
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
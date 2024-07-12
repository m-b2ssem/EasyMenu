$(document).ready(function() {
    var startDate = new Date();

    $('.from').datepicker({
        autoclose: true,
        minViewMode: 1,
        format: 'mm/yyyy'
    }).on('changeDate', function(selected){
        const invoiceElement = document.getElementById('invoice');
        startDate = new Date(selected.date.valueOf());
        startDate.setDate(startDate.getDate(new Date(selected.date.valueOf())));
        $('.to').datepicker('setStartDate', startDate);
        const error = document.getElementById('error');
        invoiceElement.style.display = "none";
        error.style.display = 'none';
        fetch('/getInvoice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                searchDate: startDate,
                userId: userId
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                if (data.invoices.length > 0) {
                    error.style.display = 'none';
                    const invoiceNumber = document.getElementById('invoiceNumber');
                    const invoiceAmount = document.getElementById('invoiceAmount');
                    const invoiceDate = document.getElementById('invoiceDate');
                    const invoiceLink = document.getElementById('invoiceLink');
                    invoiceElement.style.display = "block";
                    invoiceNumber.innerHTML = data.invoices[0].number;
                    invoiceAmount.innerHTML = data.invoices[0].amount;
                    invoiceDate.innerHTML = new Date(data.invoices[0].date * 1000).toLocaleDateString();
                    invoiceLink.href = data.invoices[0].pdf;
                } else {
                    error.innerHTML = data.message;
                    error.style.display = 'block';
                }
            }else {
                error.innerHTML = data.message;
                error.style.display = 'block';
            }
        })
        .catch(err => {
            error.innerHTML = 'An error occured, please try again later';
            error.style.display = 'block';
        });
            }); 
});
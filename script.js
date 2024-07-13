document.getElementById('inspectionForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = {
        inspectorName: document.getElementById('inspectorName').value,
        inspectionDate: document.getElementById('inspectionDate').value,
        location: document.getElementById('location').value,
        comments: document.getElementById('comments').value
    };

    fetch('http://localhost:3001/api/submitInspection', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }).then(response => {
        if (response.ok) {
            return response.blob();
        } else {
            alert('Failed to submit inspection.');
            throw new Error('Failed to submit inspection');
        }
    }).then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'inspection_report.pdf'; // or dynamically set the filename
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        alert('Inspection submitted and PDF downloaded successfully!');
        document.getElementById('inspectionForm').reset();
    }).catch(error => {
        console.error('Error:', error);
        alert('An error occurred while submitting the inspection.');
    });
});

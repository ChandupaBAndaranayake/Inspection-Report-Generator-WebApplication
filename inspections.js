window.onload = function() {
    console.log('Fetching inspections...');
    fetch('http://localhost:3000/api/getInspections')
        .then(response => response.json())
        .then(data => {
            console.log('Data fetched:', data);
            const inspectionList = document.getElementById('inspectionList');
            data.forEach(inspection => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `Inspector: ${inspection.inspectorName}, Date: ${inspection.inspectionDate}, Location: ${inspection.location}, Comments: ${inspection.comments}
                                      <button onclick="editInspection('${inspection.id}')">Edit</button>
                                      <button onclick="deleteInspection('${inspection.id}')">Delete</button>`;
                inspectionList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching inspections:', error));
};

function editInspection(id) {
    // Implement edit functionality here
    console.log('Edit inspection with ID:', id);
}

function deleteInspection(id) {
    // Implement delete functionality here
    console.log('Delete inspection with ID:', id);
    fetch(`http://localhost:3000/api/deleteInspection/${id}`, {
        method: 'DELETE'
    }).then(response => {
        if (response.ok) {
            alert('Inspection deleted successfully!');
            window.location.reload();
        } else {
            alert('Failed to delete inspection.');
        }
    }).catch(error => {
        console.error('Error:', error);
        alert('An error occurred while deleting the inspection.');
    });
}

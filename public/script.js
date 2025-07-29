function editTask(id, currentPriority) {
    const newPriority = prompt(`Current priority: ${currentPriority}\nEnter new priority (low/high/urgent):`, currentPriority);
    
    if (newPriority && ['low', 'high', 'urgent'].includes(newPriority.toLowerCase())) {
        fetch(`/edit/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ priority: newPriority.toLowerCase() })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                location.reload();
            } else {
                alert(data.message);
            }
        });
    }
}

function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        fetch(`/delete/${id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                location.reload();
            } else {
                alert(data.message);
            }
        });
    }
}
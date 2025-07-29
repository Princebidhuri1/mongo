function editTask(taskId, currentPriority) {
    console.log('Editing task:', taskId, 'Current priority:', currentPriority);
    
    const taskItem = document.querySelector(`[data-id="${taskId}"]`);
    const taskContent = taskItem.querySelector('.task-content');
    
    if (taskItem.querySelector('.edit-dropdown')) {
        console.log('Edit dropdown already open');
        return;
    }
    
    const editForm = document.createElement('div');
    editForm.className = 'edit-dropdown';
    editForm.innerHTML = `
        <select class="priority-edit-select">
            <option value="low" ${currentPriority === 'low' ? 'selected' : ''}>Low</option>
            <option value="high" ${currentPriority === 'high' ? 'selected' : ''}>High</option>
            <option value="urgent" ${currentPriority === 'urgent' ? 'selected' : ''}>Urgent</option>
        </select>
        <button class="save-btn" onclick="saveTask('${taskId}')">Save</button>
        <button class="cancel-btn" onclick="cancelEdit('${taskId}')">Cancel</button>
    `;
    
    taskContent.appendChild(editForm);
    console.log('Edit dropdown created for task:', taskId);
}

function saveTask(taskId) {
    console.log('Saving task:', taskId);
    
    const dropdown = document.querySelector(`[data-id="${taskId}"] .priority-edit-select`);
    const newPriority = dropdown.value;
    
    console.log('Sending update request for task:', taskId, 'with priority:', newPriority);
    
    fetch(`/edit/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priority: newPriority })
    })
    .then(response => {
        console.log('Update response status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('Update response data:', data);
        if (data.success) {
            alert(data.message);
            window.location.reload();
        } else {
            alert('Failed to update task: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error updating task:', error);
        alert('Something went wrong while updating the task');
    });
}

function cancelEdit(taskId) {
    console.log('Cancelling edit for task:', taskId);
    
    const editDropdown = document.querySelector(`[data-id="${taskId}"] .edit-dropdown`);
    if (editDropdown) {
        editDropdown.remove();
    }
}

function deleteTask(taskId) {
    console.log('Attempting to delete task:', taskId);
    
    if (!confirm('Are you sure you want to delete this task?')) {
        console.log('Delete cancelled by user');
        return;
    }
    
    console.log('Sending delete request for task:', taskId);
    
    fetch(`/delete/${taskId}`, {
        method: 'DELETE'
    })
    .then(response => {
        console.log('Delete response status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('Delete response data:', data);
        if (data.success) {
            alert(data.message);
            window.location.reload();
        } else {
            alert('Failed to delete task: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error deleting task:', error);
        alert('Something went wrong while deleting the task');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Todo app loaded successfully');
    
    const form = document.querySelector('.task-form');
    const input = document.querySelector('.task-input');
    
    if (form && input) {
        form.addEventListener('submit', function(e) {
            const title = input.value.trim();
            console.log('Form submitted with title:', title);
            
            if (!title) {
                e.preventDefault();
                alert('Please enter a task title!');
                console.log('Form submission blocked: empty title');
            }
        });
    }
});


function editTask(taskId, currentTitle, currentPriority) {
    console.log('Editing task:', taskId, 'Title:', currentTitle, 'Priority:', currentPriority);

    const taskItem = document.querySelector(`[data-id="${taskId}"]`);
    const taskContent = taskItem.querySelector('.task-content');

  
    document.querySelectorAll('.edit-dropdown').forEach(el => el.remove());

    if (taskItem.querySelector('.edit-dropdown')) {
        console.log('Edit dropdown already open');
        return;
    }

    const editForm = document.createElement('div');
    editForm.className = 'edit-dropdown';
    editForm.innerHTML = `
        <input type="text" class="title-edit-input" value="${currentTitle.replace(/"/g, '&quot;')}" />
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

    const container = document.querySelector(`[data-id="${taskId}"]`);
    const titleInput = container.querySelector('.title-edit-input');
    const prioritySelect = container.querySelector('.priority-edit-select');

    const newTitle = titleInput.value.trim();
    const newPriority = prioritySelect.value;

 
    const oldError = container.querySelector('.input-error');
    if (oldError) oldError.remove();

    if (!newTitle) {
        const error = document.createElement('div');
        error.className = 'input-error';
        error.textContent = 'Title is required.';
        container.querySelector('.edit-dropdown').appendChild(error);
        return;
    }

    console.log('Sending update request:', { title: newTitle, priority: newPriority });

    fetch(`/edit/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle, priority: newPriority })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.reload();
        } else {
            const error = document.createElement('div');
            error.className = 'input-error';
            error.textContent = 'Failed to update task: ' + data.message;
            container.querySelector('.edit-dropdown').appendChild(error);
        }
    })
    .catch(error => {
        console.error('Error updating task:', error);
        const errDiv = document.createElement('div');
        errDiv.className = 'input-error';
        errDiv.textContent = 'Something went wrong while updating the task.';
        container.querySelector('.edit-dropdown').appendChild(errDiv);
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
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.reload();
        } else {
            console.error('Failed to delete task: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error deleting task:', error);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('Todo app loaded successfully');

    const form = document.querySelector('.task-form');
    const input = document.querySelector('.task-input');

    if (form && input) {
        form.addEventListener('submit', function (e) {
            const title = input.value.trim();
            console.log('Form submitted with title:', title);

            const oldError = document.querySelector('.form-error');
            if (oldError) oldError.remove();

            if (!title) {
                e.preventDefault();
                const error = document.createElement('div');
                error.className = 'form-error';
                error.textContent = 'Please enter a task title.';
                input.insertAdjacentElement('afterend', error);
                console.log('Form submission blocked: empty title');
            }
        });

        input.addEventListener('input', function () {
            const error = document.querySelector('.form-error');
            if (error) error.remove();
        });
    }
});

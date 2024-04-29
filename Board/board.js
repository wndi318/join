let todo = [];
let currentDraggedElement;

async function initBoard() {
    await includeHTML();
    await loadTodos();
    await getInitials();
    await displayOptions();
}

/**
 * This funcion updates the HTML content for different sections of the application.
 * Calls functions to update feedback, in-progress, to-do, and done sections.
 */
async function updateHTML() {
    updateAwaitFeedback();
    updateInProgress();
    updateToDo();
    updateDone();
}

/**
 * This function updates the databank and the todo array.
 */
function updateDB() {
    setItem('todos', JSON.stringify(todo));
}

/**
 * This function Loads the todos from the backend.
 */
async function loadTodos() {
    try {
        todo = JSON.parse(await getItem('todos'));
        updateHTML();
    } catch (e) {
        console.error('Loading error:', e);
    }
}

/**
 * Updates the 'to-do' section in the Kanban board based on the tasks in the 'todo' array and displays a message for no tasks.
 */
function updateToDo() {
    let to_do = todo.filter(t => t['status'] == 'to-do');
    document.getElementById('todo').innerHTML = '';
    if (to_do.length === 0) {
        document.getElementById('todo').innerHTML = '<span class="no-tasks">No tasks added</span>';
    } else {
        for (let i = 0; i < to_do.length; i++) {
            let todo = to_do[i];
            document.getElementById('todo').innerHTML += generateKanbanHTML(todo);
        }
    }
}

/**
 * Updates the 'in-progress' section in the Kanban board based on the tasks in the 'todo' array and displays a message for no tasks.
 */
function updateInProgress() {
    let progress = todo.filter(t => t['status'] == 'in-progress');
    document.getElementById('in-progress').innerHTML = '';
    if (progress.length === 0) {
        document.getElementById('in-progress').innerHTML = '<span class="no-tasks">No tasks added</span>';
    } else {
        for (let i = 0; i < progress.length; i++) {
            let todo = progress[i];
            document.getElementById('in-progress').innerHTML += generateKanbanHTML(todo);
        }
    }
}

/**
 * Updates the 'await-feedback' section in the Kanban board based on the tasks in the 'todo' array and displays a message for no tasks.
 */
function updateAwaitFeedback() {
    let awaitFeedback = todo.filter(t => t['status'] == 'await-feedback');
    document.getElementById('await-feedback').innerHTML = '';
    if (awaitFeedback.length === 0) {
        document.getElementById('await-feedback').innerHTML = '<span class="no-tasks">No tasks added</span>';
    } else {
        for (let i = 0; i < awaitFeedback.length; i++) {
            let todo = awaitFeedback[i];
            document.getElementById('await-feedback').innerHTML += generateKanbanHTML(todo);
        }
    }
}

/**
 * Updates the 'done' section in the Kanban board based on the tasks in the 'todo' array and displays a message for no tasks.
 */
function updateDone() {
    let done = todo.filter(t => t['status'] == 'done');
    document.getElementById('done').innerHTML = '';
    if (done.length === 0) {
        document.getElementById('done').innerHTML = '<span class="no-tasks">No tasks added</span>';
    } else {
        for (let i = 0; i < done.length; i++) {
            let todo = done[i];
            document.getElementById('done').innerHTML += generateKanbanHTML(todo);
        }
    }
}

/**
 * Generates a background color based on the specified category.
 *
 * @param {string} category - The category for which to generate the background color.
 * @returns {string} The background color corresponding to the given category.
 */
function generateBackroundColor(category) {
    let categoryColor = { 'Technical': '#005bf8', 'Design': '#FF7A00' };
    return categoryColor[category];
}

/**
 * Retrieves the image URL corresponding to the specified priority level.
 *
 * @param {string} priority - The priority level for which to retrieve the image URL.
 * @returns {string} The image URL associated with the given priority, or a default URL if not found.
 */
function getPriorityImage(priority) {
    const priorityImages = {
        'Low': 'img/low.png',
        'Medium': 'img/medium.svg',
        'Urgent': 'img/urgent.png'
    };
    return priorityImages[priority] || 'img/medium.svg';
}

/**
 * Generates HTML markup for a Kanban card based on the provided 'todo' object.
 *
 * @param {Object} todo - The 'todo' object containing information about the task.
 * @returns {string} HTML markup for the Kanban card.
 */
function generateKanbanHTML(todo) {
    let { category, title, subtasks, description, priority, date, id } = todo;
    let subtaskCount = getSubtaskCount(todo, id);
    let completedSubtaskCount = getCompletedSubtaskCount(todo, id);
    let priorityImage = getPriorityImage(priority);
    let categoryColor = generateBackroundColor(category);
    let progressPercentage = subtaskCount === 0 ? 0 : (completedSubtaskCount / subtaskCount) * 100;
    let progressBarSection = subtaskCount > 0 ? `
        <div class="progress-section"><div class="progress-bar"><div class="progress" style="width: ${progressPercentage}%"></div></div><div id="subtasks-count">${completedSubtaskCount}/${subtaskCount} Subtasks</div></div>` : '';
    return `
        <div id=${id} draggable="true" onclick="openCard('${category}', '${title}', '${description}', '${id}', '${date}', '${priority}', '${subtasks}')" ondragstart="startDraggin(${todo['id']})" class="card"><span class="label" style="background-color: ${categoryColor};">${category}</span><span class="description"><h3>${title}</h3><br>${description}</span>${progressBarSection}<div class="members-and-priority"><div class="members">${getContactsPic(id)}</div> <div class="priority"><img src="${priorityImage}"></div></div><div class="mobileButtons"><button onclick="categoryUp(${id}, event)"><img src="img/up.png"></button><button onclick="categoryDown(${id}, event)"><img src="img/down.png"></button></div></div>`;
}

/**
 * Moves the task with the specified ID up in the category order.
 *
 * @param {number} id - The ID of the task to be moved up.
 * @param {Event} event - The event object triggering the function.
 */
function categoryUp(id, event) {
    event.stopPropagation();
    moveCategoryUp(id);
}

/**
 * Moves the task with the specified ID down in the category order.
 *
 * @param {number} id - The ID of the task to be moved up.
 * @param {Event} event - The event object triggering the function.
 */
function categoryDown(id, event) {
    event.stopPropagation();
    moveCategoryDown(id);
}

/**
 * Checks the actual category and moves the task to the next category
 * @param {number} id - The ID of the task to be moved up.
 */
function moveCategoryUp(id) {
    const index = todo.findIndex(item => item.id === id);
    const currentCategory = todo[index].category;
    const filteredTasks = todo.filter(task => task.category === currentCategory);
    const taskIndex = filteredTasks.findIndex(task => task.id === id);
    const newTaskIndex = (taskIndex - 1 + filteredTasks.length) % filteredTasks.length;
    if (taskIndex !== -1) {
        todo[index].status = updateStatusBasedOnPrevious(todo[index].status);
        [filteredTasks[taskIndex], filteredTasks[newTaskIndex]] = [filteredTasks[newTaskIndex], filteredTasks[taskIndex]];
        updateDB();
        updateHTML();
    }
}

/**
 * Checks the currnet category and moves the task to the pevious category
 * @param {number} id - The ID of the task to be moved up.
 */
function moveCategoryDown(id) {
    const index = todo.findIndex(item => item.id === id);
    const currentCategory = todo[index].category;
    const filteredTasks = todo.filter(task => task.category === currentCategory);
    const taskIndex = filteredTasks.findIndex(task => task.id === id);
    const newTaskIndex = (taskIndex + 1) % filteredTasks.length;
    if (taskIndex !== -1) {
        todo[index].status = updateStatusBasedOnCurrent(todo[index].status);
        [filteredTasks[taskIndex], filteredTasks[newTaskIndex]] = [filteredTasks[newTaskIndex], filteredTasks[taskIndex]];
        updateDB();
        updateHTML();
    }
}

/**
 * Updates the status based on the previous status.
 *
 * @param {string} status - The current status.
 * @returns {string} The updated status based on the previous status.
 */
function updateStatusBasedOnPrevious(status) {
    const statusMap = {
        'done': 'await-feedback',
        'await-feedback': 'in-progress',
        'in-progress': 'to-do'
    };
    return statusMap[status] || status;
}

/**
 * Updates the status based on the current status.
 *
 * @param {string} status - The current status.
 * @returns {string} The updated status based on the current status.
 */
function updateStatusBasedOnCurrent(status) {
    const statusMap = {
        'to-do': 'in-progress',
        'in-progress': 'await-feedback',
        'await-feedback': 'done'
    };
    return statusMap[status] || status;
}

/**
 * Shows the full task with all informations
 * 
 * @param {string} category - The category of the task.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {number} id - The ID of the task.
 * @param {string} date - The date of the task.
 * @param {string} priority - The priority of the task.
 * @param {string} subtasks - The subtasks of the task.
 */
function openCard(category, title, description, id, date, priority, subtasks) {
    document.getElementById('big-card-bg').style.display = 'flex';
    document.getElementById('big-card').classList.remove('d-none');
    document.getElementById('big-card').innerHTML = '';
    document.getElementById('big-card').innerHTML += generateBigCard(category, title, description, id, date, priority, subtasks);
    createCheckboxes(id, subtasks);
}

/**
 * Generates the card with all informations
 * 
 * @param {string} category - The category of the task.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {number} id - The ID of the task.
 * @param {string} date - The date of the task.
 * @param {string} priority - The priority of the task.
 * @param {string} subtasks - The subtasks of the task.
 * @returns {string} HTML markup for the detailed card view.
 */

function generateBigCard(category, title, description, id, date, priority, subtasks) {
    let priorityImage = getPriorityImage(priority);
    let categoryColor = generateBackroundColor(category);
    return `
        <div class="first-section"><span class="label-big" style="background-color: ${categoryColor};">${category}</span><img src="img/close.svg" id="close" onclick="closeCard()"></div><span class="headline-big" id="headline-big">${title}</span><br><div class="description-big" id="description-big"><span>${description}</span></div><div class="date-big"><span><b>Due date:</b></span><span id="date-big">${date}</span></div><div class="date-big"><span><b>Priority:</b></span><span id="priority-big">${priority}<img src="${priorityImage}"></span></div><div class="profiles-big"><span><b>Assigned To:</b></span><div class="assigned-contacts-big">${getContactsBig(id)}</div></div><div class="subtasks-big"><span><b>Subtasks</b></span><span id="checkboxes"></span></div><div class="end-section" id="end-section"><span onclick="deleteTodo(${id})"><img src="img/delete.svg">Delete</span>
            | <span onclick="editTodo({category: '${category}',title: '${title}',description: '${description}',id: '${id}',date: '${date}',priority: '${priority}',subtasks: '${subtasks}'})"><img src="img/edit.svg">Edit</span></div>
    `;
}

/**
 * Shows the contact name
 * @param {number} id - The id of the Contact which is assigned to the Task
 * @returns {string} HTML markup for the Contact Name
 */
async function getContacts(id) {
    try {
        let names = '';
        for (let i = 0; i < todo[id].contacts.length; i++) {
            names += `<span>${todo[id].contacts[i].name}</span>`;
        }
        return names;
    } catch (error) {
        console.error("Error occurred while getting contacts:", error);
    }
}

/**
 * Create the Initiales of the contact
 * @param {string} contact - The Contact Name
 * @returns {string} initials of the contact 
 */
function getContactInitials(contact) {
    const initials = contact.name.split(' ').map(part => part[0].toUpperCase()).join('');
    return initials;
}

/**
 * Creates the contact sign with initials and backgorundcolor
 * @param {number} id - The id of the contact
 * @returns {string} HTML markup for the contactsign
 */
function getContactsPic(id) {
    try {
        let pics = '';
        if (todo[id]) {
            for (let i = 0; i < todo[id].contacts.length; i++) {
                let contactInitials = getContactInitials(todo[id].contacts[i]);
                let contactColor = todo[id].contacts[i].backgroundColor;

                pics += `<div class="board-sign" style="background-color: ${contactColor}">${contactInitials}</div>`;
            }
        }
        return pics;
    } catch (error) {
        console.error("Error occurred while getting contacts:", error);
    }
}

/**
 * Creates the sign and name for the opened Task
 * @param {number} id - The id of the contact
 * @returns {string} HTML markup for the opened task
 */
function getContactsBig(id) {
    try {
        let contactsBig = '';
        if (todo[id]) {
            for (let i = 0; i < todo[id].contacts.length; i++) {
                let contact = todo[id].contacts[i];
                let contactInitials = getContactInitials(contact);
                let contactColor = todo[id].contacts[i].backgroundColor;
                contactsBig += `
                    <div class="contacts-big-both"><span class="big-names">${contact.name}</span><div class="board-sign" style="background-color: ${contactColor}">${contactInitials}</div></div>
                `;
            }
        }
        return contactsBig;
    } catch (error) {
        console.error("Error occurred while getting contacts:", error);
    }
}

/**
 * Edits the details of a task in the detailed card view.
 *
 * @param {Object} card - The object containing information about the task.
 *                        It should have properties: id, title, description, date, priority, and subtasks.
 */
function editTodo(card) {
    let idInput = card.id;
    document.getElementById('headline-big').innerHTML = `<input id="titleinput" value="${card.title}">`;
    document.getElementById('description-big').innerHTML = `<textarea id="textinput">${card.description}</textarea>`;
    document.getElementById('date-big').innerHTML = `<input id="dateinput" type="date" value="${card.date}">`;
    document.getElementById('priority-big').innerHTML = `<div class="priority-big-buttons"><button type="button" onclick="priorityUrgent()" id="urgent">Urgent<img id="urgent-img"src="img/urgent.png"></button><button type="button" onclick="priorityMedium()" id="medium">Medium<img id="medium-img"src="img/medium.png"></button><button type="button" onclick="priorityLow()" id="low">Low<img id="low-img"src="img/low.png"></button></div>`;
    document.getElementById('checkboxes').innerHTML = '';
    for (let i = 0; i < todo[idInput].subtasks.length; i++) {
        let subtaskText = todo[idInput].subtasks[i]['text'];
        let subtaskChecked = todo[idInput].subtasks[i]['checked'];
        let checkboxId = `checkbox${i}`;
        document.getElementById('checkboxes').innerHTML += `
            <div><input type="text" id="${checkboxId}" value="${subtaskText}" ${subtaskChecked ? 'checked' : ''}></div>`;
    }
    document.getElementById('end-section').innerHTML = `<span onclick="saveTodo('${idInput}')"><img src=img/save.svg>Save</span>`;
}

/**
 * Saves the edited details of a task in the detailed card view.
 *
 * @param {number} idInput - The ID of the task being edited.
 */
function saveTodo(idInput) {
    let titleinput = document.getElementById('titleinput').value;
    let textinput = document.getElementById('textinput').value;
    let dateinput = document.getElementById('dateinput').value;
    todo[idInput].title = titleinput;
    todo[idInput].description = textinput;
    todo[idInput].date = dateinput;
    for (let i = 0; i < todo[idInput].subtasks.length; i++) {
        let checkboxId = `checkbox${i}`;
        todo[idInput].subtasks[i]['text'] = document.getElementById(checkboxId).value;
        todo[idInput].subtasks[i]['checked'] = document.getElementById(checkboxId).checked;
    }
    updateDB();
    updateHTML();
    closeCard();
}

/**
 * Creates checkboxes for the subtasks of a task and appends them to the specified container.
 *
 * @param {number} id - The ID of the task.
 * @param {Array} subtasks - An array containing subtask information for the task.
 */
function createCheckboxes(id, subtasks) {
    let checkboxesContainer = document.getElementById('checkboxes');
    checkboxesContainer.innerHTML = '';
    for (let i = 0; i < todo[id].subtasks.length; i++) {
        let subtaskText = todo[id].subtasks[i]['text'];
        let subtaskChecked = todo[id].subtasks[i]['checked'];
        let checkboxId = `checkbox${i}`;
        checkboxesContainer.innerHTML += `<input type="checkbox" id="${checkboxId}" ${subtaskChecked ? 'checked' : ''} onchange="updateSubtaskStatus(${i}, ${id})"> ${subtaskText}<br>`;
    }
}

/**
 * Updates the status of a subtask and triggers database and HTML updates.
 *
 * @param {number} i - The index of the subtask.
 * @param {number} id - The ID of the task containing the subtask.
 */
function updateSubtaskStatus(i, id) {
    if (todo[id].subtasks[i]['checked'] == false) {
        todo[id].subtasks[i]['checked'] = true;
    } else
        todo[id].subtasks[i]['checked'] = false;
    updateDB();
    updateHTML();
}

/**
 * Gets the count of subtasks for a specific task.
 *
 * @param {Object} todo - The task object containing subtasks.
 * @param {number} id - The ID of the task.
 * @returns {number} The count of subtasks for the specified task.
 */
function getSubtaskCount(todo, id) {
    let subtasks = todo['subtasks'];
    return subtasks.length;
}

/**
 * Gets the count of completed subtasks for a specific task.
 *
 * @param {Object} todo - The task object containing subtasks.
 * @param {number} id - The ID of the task.
 * @returns {number} The count of completed subtasks for the specified task.
 */
function getCompletedSubtaskCount(todo, id) {
    let Subtasks = todo['subtasks'];
    let subtasksLength = Subtasks.filter(t => t['checked'] == true);
    return subtasksLength.length;
}

/**
 * Filters and displays tasks based on the title an description.
 */
async function filterTodos() {
    let searchInput = document.getElementById('search').value.trim().toLowerCase();
    let filteredTodos = todo.filter(t => t['title'].toLowerCase().includes(searchInput) || t['description'].toLowerCase().includes(searchInput));
    let filteredTodo = filteredTodos.filter(t => t['status'] == 'to-do');
    let filteredInprogress = filteredTodos.filter(t => t['status'] == 'in-progress');
    let filteredAwaitFeedback = filteredTodos.filter(t => t['status'] == 'await-feedback');
    let filteredDone = filteredTodos.filter(t => t['status'] == 'done');
    document.getElementById('todo').innerHTML = '';
    document.getElementById('in-progress').innerHTML = '';
    document.getElementById('await-feedback').innerHTML = '';
    document.getElementById('done').innerHTML = '';
    for (let i = 0; i < filteredTodo.length; i++) {
        let filterTodo = filteredTodo[i];
        document.getElementById('todo').innerHTML += generateKanbanHTML(filterTodo);
    } for (let i = 0; i < filteredInprogress.length; i++) {
        let filterInprogress = filteredInprogress[i];
        document.getElementById('in-progress').innerHTML += generateKanbanHTML(filterInprogress);
    } for (let i = 0; i < filteredAwaitFeedback.length; i++) {
        let filterAwaitFeedback = filteredAwaitFeedback[i];
        document.getElementById('await-feedback').innerHTML += generateKanbanHTML(filterAwaitFeedback);
    } for (let i = 0; i < filteredDone.length; i++) {
        let filterDone = filteredDone[i];
        document.getElementById('done').innerHTML += generateKanbanHTML(filterDone);
    }
}

/**
 * Deletes a task by its ID or title, updates the database, closes the card, and refreshes the HTML.
 *
 * @param {number} id - The ID of the task to delete.
 */
async function deleteTodo(id) {
    let titleToDelete = '';
    if (todo[id] !== undefined) {
        titleToDelete = todo[id]['title'];
        todo.splice(id, 1);
    } else {
        let bigCardTitleElement = document.querySelector('.headline-big');
        if (bigCardTitleElement) {
            titleToDelete = bigCardTitleElement.textContent;
            let indexToDelete = todo.findIndex(t => t['title'] === titleToDelete);
            todo.splice(indexToDelete, 1);
        }
    }
    await setItem('todos', JSON.stringify(todo));
    closeCard();
    updateHTML();
}

/**
 * Closes the opned task
 */
function closeCard() {
    document.getElementById('big-card').classList.add('d-none');
    document.getElementById('big-card-bg').style.display = 'none';
}

/**
 * Sets the current dragged element ID when starting the drag operation.
 *
 * @param {number} id - The ID of the element being dragged.
 */
function startDraggin(id) {
    currentDraggedElement = id;
}

/**
 * Allows a drop event by preventing the default behavior.
 *
 * @param {Event} ev - The drop event.
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * Moves the currently dragged task to the specified status category, updates the database, and refreshes the HTML.
 *
 * @param {string} status - The status category to move the task to.
 */
function moveTo(status) {
    todo[currentDraggedElement]['status'] = status;
    updateDB();
    updateHTML();
}

/**
 * Highlights the dragsection
 *
 * @param {string} id - The ID of the element which is dragged over the dragsection.
 */
function highlight(id) {
    document.getElementById(id).classList.add('dragsection-highlight');
}

/**
 * Removes the highlight of the dragsection
 *
 * @param {string} id - The ID of the element which is dragged over the dragsection.
 */
function removeHighlight(id) {
    document.getElementById(id).classList.remove('dragsection-highlight');
}

/**
 * Redirects the user to the 'addTask.html' page with an optional URL parameter.
 *
 * @param {string} urlParam - An optional URL parameter to include in the redirection.
 */
function addTask(urlParam) {
    var url = '/AddTask/addTask.html';
    if (urlParam !== undefined && urlParam !== null) {
        url += '?urlParam=' + urlParam;
    }
    window.location.href = url;
}

async function getInitials() {
    UserInitials = await getItem('userInitial');
    UserName = await getItem('userName');
    const kanban = document.getElementById("kanban");
    kanban.innerHTML += `<div onclick="displayOptions()">${UserInitials}</div>`;
}

async function displayOptions() {
    const options = document.getElementById("options");
    const isDisplayed = options.classList.toggle("dNone");
    if (isDisplayed) {
        document.getElementById('d_none_svg').style.display = 'none';
    }
    if (isDisplayed && !options.innerHTML.trim()) {
        options.innerHTML = /*html*/`
      <div class="option"><a href="/PrivacyPolicy/privacypolicy.html">Privacy Policy</a></div>
      <div class="option"><a href="/LegalNotice/legalnotice.html">Legal Notice</a></div>
      <div class="option" onclick="goToLogin()">Log out</div>
    `;
    }
}
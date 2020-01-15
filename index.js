(() => {
    let addNewListMarkup = () => {
        let markup = `
        <div class="header">
      <div class="title">Task Manager</div>
    </div>
      <div class="main-content">
    
        <div class="add-new-list">
        <div class="btn-heading add-new">+ Add new list</div>
        <div class="input-action d-none">
          <input
            id="listTile"
            type="text"
            placeholder="Add List title..."
            autofocus
            onkeyup="submitNewListOnEnter(event)"
          />
          <span class="tick-mark flex-item">
            <i class="fa fa-check fa-md"></i>
          </span>
          <span class="close-mark flex-item">
            <i class="fa fa-times fa-md"></i>
          </span>
        </div>
      </div>
      <div class="list-container"></div>
      </div>
        `
        var root = document.implementation.createHTMLDocument().body;
        root.innerHTML = markup;
        return root;
    }
    renderAddList = () => {
        let root = document.querySelector("#root");
        let taskMarkup = addNewListMarkup();
        root.appendChild(taskMarkup);
    }
    renderAddList();

    let addList = document.querySelector(".add-new-list");
    let closeMark = document.querySelector(".close-mark");
    let tickMark = document.querySelector(".tick-mark");
    let addNewTitle = addList.children[0];
    let addNewInput = addList.children[1];
    let addNewInputField = addNewInput.children[0];
    let listContainer = document.querySelector('.list-container');
    let TaskList = JSON.parse(window.localStorage.getItem('taskList')) && JSON.parse(window.localStorage.getItem('taskList')).length > 0 ? JSON.parse(window.localStorage.getItem('taskList')) : [{
        'title': 'Pending;',
        'tasks': [{
            "description": "This is pending"
        }]
    }, {
        'title': 'On Hold;',
        'tasks': [{
            "description": "This is onhold"
        }]
    }, {
        'title': 'Doing;',
        'tasks': [{
            "description": "This is in progress"
        }, {
            "description": "this is also in progress"
        }]
    }];

    createListMarkup = (val, index) => {
        let div = document.createElement('div');
        let markup = `
            <div class="list-item" data-idx=${index}>
                <div class="list-heading">
                    <div class="title" id="title${index}">${val}</div>
                    <div class="input-container d-none" id="input${index}">
                        <input type="text" value="${val}"/>
                    </div>
                    <div class="list-action">
                    <div class="edit-icon" id="edit${index}" onclick="editIndex(${index})">
                        <i class="fa fa-edit"></i>
                    </div>
                    <div class="edit-check-icon d-none" id="submit${index}" onclick="submitTitleEdit(${index})">
                        <i class="fa fa-check"></i>
                    </div>
                    <div class="delete-icon" id="delete${index}" onclick="removeList(${index})">
                        <i class="fa fa-trash"></i>
                    </div>
                    </div>
                    
                </div>
                <div class="list-content">
                    <div class="task-item-container">
                        <div class="task-list-items-container" id="taskListItemContainer${index}">
                        </div>
                        <div class="add-task-item-container" data-task-idx=${index}>
                            <textarea type="text" placeholder="Task description..." class="d-none" id="listTaskInput${index}"></textarea>
                            <div class="task-list-action d-none" id="task-list-action${index}">
                                <div class="edit-icon d-none" id="editTask${index}" onclick="editListTask(${index})">
                                    <i class="fa fa-edit"></i>
                                </div>
                                <div class="edit-check-icon" id="submitNewListTask${index}" onclick="submitNewListTask(${index})">
                                    <i class="fa fa-check"></i>
                                </div>
                                <div class="delete-icon" id="deleteListTask${index}" onclick="removeAddListTask(${index})">
                                    <i class="fa fa-trash"></i>
                                </div>
                            </div>    
                        </div>
                    </div>
                    <div class="add-task txt-center" onclick="addNewTaskToList(${index})"><span>+ Add new task</span></div>
                </div>
            </div>
        `
        var root = document.implementation.createHTMLDocument().body;
        root.innerHTML = markup;
        return root;
    }

    createTaskMarkup = (task, index, idx) => {
        let markup = `
            <div class="task-list-item" id="trackListItem${index}" ondrop="dropTask(event, ${index} , ${idx})" ondragover="allowDropTask(event, ${index}, ${idx})">
                <div class="show-on-drag-over d-none" id="taskDragOver${"" + index + idx}"></div>
                <div class="task-content" draggable="true" ondragstart="startTaskDrag(event, ${index},${idx})" ondragend="resetDragoverCss()">
                    <div class="task-info" id="taskValue${"" + index + idx}"><span>${task.description}</span></div>
                    <div class="list-action">
                        <div class="edit-icon" id="editTask${"" + index + idx}" onclick="editTaskIndex(${index + "," + idx})">
                            <i class="fa fa-edit"></i>
                        </div>
                        <div class="edit-check-icon d-none" id="submitTask${"" + index + idx}" onclick="submitTaskEdit(${index + "," + idx})">
                            <i class="fa fa-check"></i>
                        </div>
                        <div class="delete-icon" id="deleteTask${"" + index + idx}" onclick="removeTaskList(${index + "," + idx})">
                            <i class="fa fa-trash"></i>
                        </div>
                    </div>
                </div>
                <textarea type="text" class="input-task-item d-none" id="taskInput${"" + index + idx}">${task.description}</textarea>
            </div>
        `
        var root = document.implementation.createHTMLDocument().body;
        root.innerHTML = markup;
        return root;

    }
    renderList = () => {
        listContainer.innerHTML = '';
        TaskList.forEach((item, index) => {
            let markup = createListMarkup(item.title, index);
            listContainer.appendChild(markup);
            if (item.tasks.length > 0) {
                let taskListContainer = document.querySelector(`#taskListItemContainer${index}`)
                item.tasks.forEach((task, idx) => {
                    let taskMarkup = createTaskMarkup(task, idx, index);
                    taskListContainer.appendChild(taskMarkup);
                });
            }

        })
        window.localStorage.setItem('taskList', JSON.stringify(TaskList));
    }

    renderList();

    triggerAddNewList = () => {
        addNewTitle.classList.add('d-none');
        addNewInput.classList.remove('d-none')
        addNewInputField.focus();
    };

    hideAddNewList = () => {
        addNewTitle.classList.remove('d-none');
        addNewInput.classList.add('d-none');
    };

    dropTask = (evt, index, idx) => {
        var data = evt.dataTransfer.getData("task");
        var matches = data.match(/(\d+)/)[0].split('');
        let item = TaskList[matches[1]]['tasks'][matches[0]];
        TaskList[matches[1]]['tasks'].splice(matches[0], 1);
        TaskList[idx]['tasks'].splice(index, 0, item);
        renderList();
    }

    allowDropTask = (evt, index, idx) => {
        let taskContent = document.querySelector(".task-content");
        taskContent.classList.remove('dragging');
        let dragOverElement = document.querySelector(`#taskDragOver${"" + index + idx}`);
        let allDraggableItems = document.querySelectorAll('.show-on-drag-over');
        [...allDraggableItems].forEach(item => {
            item.classList.add('d-none');
        });
        taskContent.classList.add('dragging');
        dragOverElement.classList.remove('d-none');
        evt.preventDefault();
    }

    startTaskDrag = (evt, index, idx) => {
        evt.dataTransfer.setData("task", evt.target.children[0].id);
    }

    resetDragoverCss = () => {
        let allDraggableItems = document.querySelectorAll('.show-on-drag-over');
        [...allDraggableItems].forEach(item => {
            item.classList.add('d-none');
        });
    }


    removeList = (index) => {
        TaskList.splice(index, 1);
        renderList();
    }

    submitNewListTask = (index) => {
        let taskDesc = document.querySelector(`#listTaskInput${index}`);
        let taskObj = {
            "description": taskDesc.value
        }
        TaskList[index]['tasks'].push(taskObj);
        renderList();
        addNewTaskToList(index);
    }

    removeTaskList = (index, idx) => {
        TaskList[idx]['tasks'].splice(index, 1);
        renderList();
    }

    editTaskIndex = (index, idx) => {
        let editIcon = document.querySelector(`#editTask${"" + index + idx}`);
        let checkIcon = document.querySelector(`#submitTask${"" + index + idx}`);
        let item = document.querySelector(`#taskValue${"" + index + idx}`);
        let taskInput = document.querySelector(`#taskInput${"" + index + idx}`);
        editIcon.classList.add('d-none');
        checkIcon.classList.remove('d-none');
        item.classList.add('d-none');
        taskInput.classList.remove('d-none');
        taskInput.focus();
    }

    submitTaskEdit = (index, idx) => {
        let inputField = document.querySelector(`#taskInput${"" + index + idx}`);
        TaskList[idx]['tasks'][index]['description'] = inputField.value;
        renderList();
    }

    addNewTaskToList = (index) => {
        let listTaskInput = document.querySelector(`#listTaskInput${index}`);
        let listTaskAction = document.querySelector(`#task-list-action${index}`);
        listTaskAction.classList.remove('d-none');
        listTaskInput.classList.remove('d-none');
        listTaskInput.value = '';
        listTaskInput.focus();
    }

    removeAddListTask = (index) => {
        let listTaskInput = document.querySelector(`#listTaskInput${index}`);
        let listTaskAction = document.querySelector(`#task-list-action${index}`);
        listTaskAction.classList.add('d-none');
        listTaskInput.classList.add('d-none');
        listTaskInput.blur();
    }

    submitTitleEdit = index => {
        let inputIndex = document.querySelector(`#input${index}`);
        let titleIndex = document.querySelector(`#title${index}`);
        let editIcon = document.querySelector(`#edit${index}`);
        let editCheckIcon = document.querySelector(`#submit${index}`);
        editIcon.classList.remove('d-none');
        editCheckIcon.classList.add('d-none');
        inputIndex.classList.add('d-none');
        titleIndex.classList.remove('d-none');
        TaskList[index]['title'] = inputIndex.children[0].value;
        inputIndex.children[0].blur();
        renderList();
    }
    editIndex = index => {
        let inputIndex = document.querySelector(`#input${index}`);
        let titleIndex = document.querySelector(`#title${index}`);
        let editIcon = document.querySelector(`#edit${index}`);
        let editCheckIcon = document.querySelector(`#submit${index}`);
        editIcon.classList.add('d-none');
        editCheckIcon.classList.remove('d-none');
        inputIndex.classList.remove('d-none');
        titleIndex.classList.add('d-none');
        inputIndex.children[0].focus();
    }

    submitNewListOnEnter = (evt) => {
        if (event.which === "enter") {
            submitNewList();
        }
    }

    submitNewList = () => {
        let listObject = {
            'title': '',
            'tasks': []
        }
        listObject['title'] = addNewInputField.value;
        TaskList.unshift(listObject);
        renderList();
    }
    tickMark.onclick = (evt) => {
        submitNewList();
        //hideAddNewList();
        addNewInputField.value = '';
        addNewInputField.focus();
        evt.stopPropagation();
    }
    closeMark.onclick = (evt) => {
        hideAddNewList();
        addNewInputField.value = '';
        evt.stopPropagation();
    }
    addList.onclick = (evt) => {
        triggerAddNewList();
    }
    addNewInputField.onkeypress = evt => {
        evt.which === 13 ? tickMark.click() : '';
        evt.stopPropagation();
    }
    addNewInputField.onkeydown = evt => {
        evt.which === 27 ? closeMark.click() : '';
        evt.stopPropagation();
    }
})();
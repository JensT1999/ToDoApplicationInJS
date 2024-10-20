const textfield = document.getElementById("textInput");

const priorityInput = document.getElementById("priorityInput");
const lowest_Priority = "Niedrige Priorität";
const middle_Priority = "Mittlere Priorität";
const highest_Priority = "Höchste Priorität";
const lowest_Priority_Value = 0;
const middle_Priority_Value = 1;
const highest_Priority_Value = 2;

const dateInput = document.getElementById("dateInput");
const button = document.getElementById("button");
const delete_Button = document.getElementById("delete");

const delete_Selector = document.getElementById("deleteselector");
const delete_All_Text = "alle";
const delete_Marked_Text = "markierte";
const delete_All_Value = 0;
const delete_Marked_Value = 1;

const todotable = document.getElementById("todotable");
var tableRows;

var currentSelectedItem = null;
const descriptionInput = document.getElementById("descriptionInput");
const safeButton = document.getElementById("safeDescription");

const neededColumns = 4;

const unchecked_Value = 0;
const checked_Value = 1;
var checkBoxes;

var currentId = 0;
var todoarray;

document.addEventListener("DOMContentLoaded", function() {
    tableRows = [];
    checkBoxes = [];
    
    if(localStorage.length > 0) {
        todoarray = loadAllSavedToDos(true);
        showAllToDos();
    } else {
        todoarray = [];
    }
        
    console.log(currentId);
});

button.onclick = function() {
    
    if(allFilled() == true) {
        let todo = new ToDo(getCurrentId(), unchecked_Value, getTextInput(), getPriority(), getDateInput(), "");
        
        addToDo(todo); 
        
        textfield.value = "";
        dateInput.value = "";
    } else {
        alert("Bitte alle Felder ausfüllen!");
    }
}

delete_Button.onclick = function() {
    switch(transformDeleteSelection()) {
        case delete_All_Value: 
            removeAllTodos();
            break;
        case delete_Marked_Value:
            removeAllCheckedToDos();
            break;
    }
}

safeButton.onclick = function() {
    if(getDescriptionInput() != null && currentSelectedItem != null) {
        safeDescription(currentSelectedItem);
    }
}


function allFilled() {
    if(getTextInput() == null) return false;
    if(getDateInput() == null) return false;
    
    return true;
}

function getTextInput() {
    if(textfield.value != "" && textfield.value != null) {
        return textfield.value;
    }
    
    return null;
}

function getPriority() {
    return transformPriority(priorityInput.value);
}

function transformPriority(input) {
    let lowerCasedInput = input.toLowerCase();
    let result;
    
    switch(lowerCasedInput) {
        case lowest_Priority.toLowerCase():
            result = lowest_Priority_Value;
            break;
        case middle_Priority.toLowerCase():
            result = middle_Priority_Value;
            break;
        case highest_Priority.toLowerCase():
            result = highest_Priority_Value;
            break;
    }
    
    return result;
}

function backtransformPriority(input) {
    let result;
    
    switch(parseInt(input)) {
        case lowest_Priority_Value:
            result = lowest_Priority;
            break;
        case middle_Priority_Value:
            result = middle_Priority;
            break;
        case highest_Priority_Value:
            result = highest_Priority;
            break;
    }
        
    return result;
}

function getDateInput() {
    if(dateInput.value != "" && dateInput.value != null) {
        return transformDate(dateInput.value);
    }
    
    return null;
}

function transformDate(input) {
    let result = "";
    if(containsChar(input, "-") == true) {
        let splittedDate = input.split("-");
        
        result = splittedDate[2] + "." + splittedDate[1] + "." + splittedDate[0];
    }
    
    return result;
}

function containsChar(input, char) {
    if(input != "" && input != null) {
        input = input.toLowerCase();
        for(let i = 0; i < input.length; i++) {
            if(input[i] == char) {
                return true;
            }
        }
    }
    
    return false;
}

function getCurrentId() {
    let result = currentId;
    currentId++;
    return result;
}

function addToDo(input) {
    if(input != null) {
        removeAllTableRows();
        addToDoToArray(input);
        saveToDo(input);
        
        showAllToDos();
    }
}

function addToDoToArray(input, sorted) {
    if(input != null) {
        todoarray.push(input);
        sortAllToDosByPriority(todoarray);        
    }
}

function getToDobyId(id) {
    for(let i = 0; i < todoarray.length; i++) {
        if(todoarray[i].id == id) {
            return todoarray[i];
        }
    }
    
    return null;
}

function transformDeleteSelection() {
    let input = delete_Selector.value.toLowerCase();
    let result;
    
    switch(input) {
        case delete_All_Text:
            result = delete_All_Value;
            break;
        case delete_Marked_Text:
            result = delete_Marked_Value;
            break;
    }
    
    return result;
}

function deleteToDo(input) {
    if(input != null) {
        for(let i = 0; i < todoarray.length; i++) {
            if(parseInt(todoarray[i].id) == input.id) {
                todoarray.splice(i, 1);
                break;
            }
        }
    }
}

function replaceToDo(input, newInput) {
    if(input != null && newInput != null) {
        for(let i = 0; i < todoarray.length; i++) {
            if(todoarray[i].id == input.id) {
                todoarray.splice(i, 1);
                break;
            }
        }
        
        todoarray.push(newInput);
        sortAllToDosByPriority(todoarray);
    }
}

function removeAllTodos() {
    if(todoarray != null && todoarray.length > 0) {
        let temp_Array = [];
        for(let i = 0; i < todoarray.length; i++) {
            removeTableRow(todoarray[i]);
            deleteSavedToDo(todoarray[i]);
            temp_Array.push(todoarray[i]);
        }
        
        if(temp_Array.length == 0) return;
        
        for(let i = 0; i < temp_Array.length; i++) {
            deleteToDo(temp_Array[i]);
        }
        
        descriptionInput.value = "";
        descriptionInput.placeholder = "";
        currentSelectedItem = null;
    }
}

function removeAllCheckedToDos() {
    if(todoarray != null && todoarray.length > 0) {
        let temp_Array = [];
        for(let i = 0; i < todoarray.length; i++) {
            if(parseInt(todoarray[i].checked) == checked_Value) {
                temp_Array.push(todoarray[i]);
            }
        }
        
        if(temp_Array.length == 0) return;
        
        for(let i = 0; i < temp_Array.length; i++) {
            if(currentSelectedItem.id == temp_Array[i].id) {
                descriptionInput.value = "";
                descriptionInput.placeholder = "";
                currentSelectedItem = null;
            }
            
            removeTableRow(temp_Array[i]);
            deleteSavedToDo(temp_Array[i]);
            deleteToDo(temp_Array[i]);
        }
    }
}

function saveToDo(input) {
    let saveStr = convertToDoToString(input, false, true);
    localStorage.setItem(input.id, saveStr);
}

function deleteSavedToDo(input) {
    localStorage.removeItem(input.id);
}

function changeSavedToDo(input, whichValue, newValue) {
    if(input != null) {
        console.log(input.id);
        let todoString = localStorage.getItem(input.id);
        console.log(todoString);
        let splittedArray = todoString.split(",");
        
        switch(whichValue) {
            case "checked":
                splittedArray[0] = newValue;
                break;
            case "text": 
                splittedArray[1] = newValue;
                break;
            case "priority":
                splittedArray[2] = newValue;
                break;
            case "date":
                splittedArray[3] = newValue;
                break;
        }
        
        console.log(splittedArray);
        
        let result = "";
        for(let i = 0; i < splittedArray.length; i++) {
            if(i == splittedArray.length - 1) {
                result += splittedArray[i];
            } else {
                result += splittedArray[i] + ",";
            }            
        }
        
        localStorage.removeItem(input.id);
        localStorage.setItem(input.id, result);
    }
}

function loadAllSavedToDos(setCurrentId) {
    if(localStorage.length > 0) {
        let array = [];
        let idArray = getSortedIds();
        
        for(let i = 0; i < idArray.length; i++) {
            let id = idArray[i];
            let savedStr = localStorage.getItem(id).split(",");
            let todo;
            
            if(savedStr[4] != "" && savedStr[4] != null) {
                todo = new ToDo(id, savedStr[0], savedStr[1], savedStr[2], savedStr[3], savedStr[4]);
            } else {
                todo = new ToDo(id, savedStr[0], savedStr[1], savedStr[2], savedStr[3], "");
            }

            array.push(todo);
        }
        
        if(setCurrentId == true) {
            let highestid = parseInt(idArray[idArray.length - 1]);
            currentId = highestid + 1;
            console.log(currentId);
        }
        
        console.log(array);
        
        return sortAllToDosByPriority(array);
    }
    
    return null;
}

function sortAllToDosByPriority(input) {
    if(input != null) {
        input.sort((a, b) => parseInt(b.priority) - parseInt(a.priority));
        
        return input;
    }
    
    return null;
}

function getSortedIds() {
    if(localStorage.length > 0) {
        let temp_Array = [];
        for(let i = 0; i < localStorage.length; i++) {
            temp_Array.push(localStorage.key(i));
        }
        
        if(temp_Array.length == 0) return;
        
        console.log(temp_Array);
        temp_Array.sort((a, b) => a - b);
        return temp_Array;
    }
}

function showAllToDos() {
    if(todoarray != null && todoarray.length > 0) {
        console.log(todoarray);
        for(let i = 0; i < todoarray.length; i++) {
            addNewTableRow(todoarray[i]);
        }
    }
}

function addNewTableRow(input) {
    let tableRow = createTableRow(input);
    todotable.appendChild(tableRow);
}

function addClickTableRow(input) {
    input.onclick = function() {
        currentSelectedItem = getToDobyId(parseInt(input.id));
        showDescription(currentSelectedItem);
    }
}

function removeAllTableRows() {
    if(tableRows != null && tableRows.length > 0) {
        for(let i = 0; i < todoarray.length; i++) {
            removeTableRow(todoarray[i]);
        }
    }
}

function removeTableRow(input) {
    if(tableRows != null && tableRows.length > 0) {
        for(let i = 0; i < tableRows.length; i++) {
            if(parseInt(tableRows[i].id) == input.id) {
                todotable.removeChild(tableRows[i]);
                tableRows.splice(i, 1);
                break;
            }
        }
    }
}

function createTableRow(input) {
    let tableRow = document.createElement("tr");
    tableRow.className = "tableItems";
    tableRow.id = input.id;
                        
    for(let j = 0; j < neededColumns; j++) {
        let tableData = document.createElement("td");
                
        switch(j) {
            case 0:
                let checkbox = createCheckBox(input.id, input.checked);
                checkBoxes.push(checkbox);
                tableData.appendChild(checkbox);
                break;
            case 1:
                tableData.innerHTML = input.text;
                break;
            case 2:
                tableData.innerHTML = backtransformPriority(input.priority);
                break;
            case 3:
                tableData.innerHTML = input.date;
                break;
        }
        
        tableRow.appendChild(tableData);
    }
    
    addClickTableRow(tableRow);
    tableRows.push(tableRow);
        
    return tableRow;
}

function getTableRow(input) {
    if(input != null) {
        for(let i = 0; i < tableRows.length; i++) {
            if(parseInt(tableRows[i].id) == input.id) {
                return tableRows[i];
            }
        }
    }
    
    return null;
}

function createCheckBox(input1, input2) {
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = parseInt(input1);
    if(parseInt(input2) == checked_Value) {
        checkbox.checked = true;
    }
    
    clickCheckBox(checkbox);
        
    return checkbox;
}


function clickCheckBox(input) {
    input.onclick = function() {
        for(let i = 0; i < todoarray.length; i++) {
            if(parseInt(todoarray[i].id) == input.id) {
                let todo = todoarray[i];
                if(input.checked == true) {
                    todo.checked = checked_Value;
                } else {
                    todo.checked = unchecked_Value;
                }
                
                todoarray.splice(i, 0, todo);
                changeSavedToDo(todo, "checked", todo.checked);
                break;
            }
        }
    }
}

function convertToDoToString(input, convertPriority, includeChecked) {
    let priorityValue = input.priority;
        
    if(convertPriority == true) {
        priorityValue = backtransformPriority(input.priority);
    }
    
    let asString = input.text + "," + priorityValue + "," + input.date;
    
    if(includeChecked == true) {
        asString = input.checked + "," + asString;
    }  
    
    if(input.description != "") {
        asString += "," + input.description;
    }
        
    return asString;
}

function showDescription(input) {
    if(input != null) {
        if(input.description != "" && input.description != "undefined") {
            descriptionInput.value = input.description;
        } else {
            descriptionInput.value = "";
            descriptionInput.placeholder = "Noch keine Beschreibung hinzugefügt!";
        }
    }
}

function safeDescription(input) {
    if(input != null && descriptionInput.value != "" && descriptionInput.value != null) {
        input.description = descriptionInput.value;
        deleteSavedToDo(input);        
        saveToDo(input);
        replaceToDo(input, input);
    }
}

function getDescriptionInput() {
    if(descriptionInput.value != "" && descriptionInput.value != null) {
        return descriptionInput.value;
    }
    
    return null;
}


function ToDo(id, checked, text, priority, date, description) {
    this.id = id;
    this.checked = checked;
    this.text = text;
    this.priority = priority;
    this.date = date;
    this.description = description;
}
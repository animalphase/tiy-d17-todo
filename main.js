




/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Global Config
+++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

var $g_taskUl = $('#task-list');
var $g_taskInput = $('#task-input');
var $g_taskSubmitButton = $('#task-submit-button');
var $g_clearTasksLink = $('.clear-tasks-link');

var g_rootURL = 'http://tiny-za-server.herokuapp.com/collections/moon-todo/';

var g_getTaskSettings = {
  type: 'GET',
  dataType: 'json',
  url: g_rootURL
};

var exampleTask = {
  "task": "example task",
  "complete": false
};

/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++
    App behavior managed by event handlers
+++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

$g_taskSubmitButton.on('click', addTask);
$g_clearTasksLink.on('click', clearAllTasks);





/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Functions
+++++++++++++++++++++++++++++++++++++++++++++++++++++++ */


function addTask() {
  var inputText = $g_taskInput.val();
  if(inputText === '' || inputText === undefined) {
    console.log('no task input');
    return false;
  }
  $g_taskInput.val('');
  var newTask = {
    task: inputText,
    complete: false
  };
  var postSettings = {
    type: 'POST',
    contentType: 'application/json',
    url: g_rootURL,
    data: JSON.stringify(newTask)
  };
  $.ajax(postSettings).then(getTasks);
  return false;
}




function getTasks() {
  $.ajax(g_getTaskSettings).then(renderTasks);
}




function renderTasks(data, status, xhr) {
  console.log(data);
  $g_taskUl.html('');
  data.forEach(function(task, i, array){
    var $taskItem = $('<li>');
    $taskItem.html(task.task);

    var $deleteTaskButton = $('<button class="delete-task-button">X</button>');
    $taskItem.append($deleteTaskButton);

    var $completeTaskButton = $('<button class="complete-task-button">☐</button>');
    if (task.complete === true){
      $completeTaskButton.html('☑︎');
    } else {
      $completeTaskButton.html('☐');
    }
    $taskItem.prepend($completeTaskButton);

    $g_taskUl.append($taskItem);

    $deleteTaskButton.on('click', function(){deleteTask(task);});
    $completeTaskButton.on('click', function(){completeTask(task);});
  });
}




function deleteTask(task) {
  var id = task._id;
  var taskUrl = g_rootURL + id;
  var deleteSettings = {
    type: 'DELETE',
    url: taskUrl
  };
  $.ajax(deleteSettings).then(getTasks);
}




function clearAllTasks() {
  $.ajax(g_getTaskSettings).then(function(data, status, xhr){
    data.forEach(function(task){
      deleteTask(task);
    });
  });
}




function completeTask(task) {
  var id = task._id;
  var taskUrl = g_rootURL + id;
  task.complete = !task.complete;

  var taskUpdate = {
    task: task.task,
    complete: task.complete
  };

  var putSettings = {
    type: 'PUT',
    contentType: 'application/json',
    url: taskUrl,
    data: JSON.stringify(taskUpdate)
  };

  $.ajax(putSettings).then(getTasks);
}




// do the jQuery
$(function () {
  getTasks();
});

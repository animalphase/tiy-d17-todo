




/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++
    Global Config
+++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

var $g_taskUl = $('#task-list');
var $g_taskInput = $('#task-input');
var $g_taskSubmitButton = $('#task-submit-button');
var $g_clearTasksLink = $('.clear-tasks-link');
var $g_filterTasksLink = $('.filter-tasks-link');
var $g_showAllTasks = true;

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
$g_filterTasksLink.on('click', filterTasks);





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

    var $deleteTaskButton = $('<button class="delete-task-button"><i class="fa fa-trash-o" aria-hidden="true"></i></button>');
    $taskItem.append($deleteTaskButton);

    var $completeTaskButton = $('<button class="complete-task-button"></button>');
    if (task.complete === true){
      $completeTaskButton.html('<i class="fa fa-check-square-o" aria-hidden="true"></i>');
      $taskItem.addClass('complete');
    } else {
      $completeTaskButton.html('<i class="fa fa-square-o" aria-hidden="true"></i>');
    }
    $taskItem.prepend($completeTaskButton);

    $g_taskUl.append($taskItem);

    $deleteTaskButton.on('click', function(){deleteTask(task);});
    $completeTaskButton.on('click', function(){completeTask(task);});
  });
  updateFilterView();
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



function filterTasks() {
  $g_showAllTasks = !$g_showAllTasks;
  updateFilterView();
}

function updateFilterView() {
  if($g_showAllTasks) {
    $('.todo-list').removeClass('hide-complete');
    $g_filterTasksLink.html('<i class="fa fa-eye-slash" aria-hidden="true"></i> Hide Completed Tasks');
  } else {
    $('.todo-list').addClass('hide-complete');
    $g_filterTasksLink.html('<i class="fa fa-eye" aria-hidden="true"></i> Show Completed Tasks');
  }
}


// do the jQuery
$(function () {
  getTasks();
});

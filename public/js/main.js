'use strict';

$(document).ready(init);

function init() {
  var currentDate = moment().format('YYYY-MM-DD');
  $('#date').attr("min", currentDate);
  updateTasks();
  taskControl();
}

function taskControl() {
  $("form").submit(addTask);
  $("tbody").on("click", ".trashButton", deleteTask);
  $("tbody").on("click", ".done", toggleCompleted);
}

function updateTasks() {
  $.get('./tasks', function(data) {
    var $tasks = createTasks(data);
    $('#tasks').append($tasks);
  })
}

function createTasks(data) {
  console.log('hey');
  return data.map(function(task) {
    var $tr = $("#template").clone();
    $tr.removeAttr("id");
    $tr.children(".taskName").text(task.name);
    $tr.children(".dueDate").text(task.date);
    if (task.complete === "true"){
      $tr.find(".done").prop('checked', true);
    }
    return $tr;
  });
}

function addTask(e) {
  e.preventDefault();
  var description = $('#task').val();
  var dueDate = moment($('#date').val()).format('MM-DD-YYYY');
  if (dueDate ==="Invalid date"){
    dueDate = " ";
  }
  var newObj = {name: description, date: dueDate, complete: "false"};
  $.post('./task/add', newObj)
    .success(function(data){
      var $new = createTasks([newObj]);
      $('#tasks').append($new);
  })
  $("#newTask").trigger("reset");
}

function deleteTask() {
  var $tr = $(this).closest('tr');
  var remove = $tr.index() - 1;
  $.post('./task/delete', { "index": remove})
    .success(function(data){
    $tr.remove();
  })
}

function toggleCompleted() {
  var $tr = $(this).closest('tr');
  var indexToChange = $tr.index() - 1;
  $.post('./change/status', { "index": indexToChange})
    .success(function(data){
    $tr.addClass("strike");
  })
}

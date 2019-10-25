//S.Korecko, 2019
//S.Slovenkai, 2019

const tareaOut = document.getElementById('tareaResponse');

const back4appAppId = 'G0gnBMRBdJnVlS2THUjYQ0NRMQRz14fMqc431A1b';
const back4appApiKey = 'QN0rH8P55jTSHTK5WnPtNCKALTUqinhD51ai2cGL';


function sendRequest(url, method, data) {
    const options = {
      method: method,
      headers:{
        'Content-Type': 'application/json;charset=utf-8',
        'X-Parse-Application-Id': back4appAppId,
        'X-Parse-REST-API-Key' :back4appApiKey
      },
      body: data
    };
    fetch(url, options).then(
      (response) => {
        if (response.ok)
           return response.json();
        else
          writeErrMsg && writeErrMsg(response.status);
       }
      ).then(
        (data) => {
           writeSuccResponse && writeSuccResponse(data);
       }
     ).catch(
       (error) => {
         writeErrMsg && writeErrMsg(error);
       }
     );
}

/**
 * Processes a click on the "Add task" button.
 */
function addTask() { // eslint-disable-line no-unused-vars
  tareaOut.value='addTask started ...';

  const taskName = document.getElementById('inNewTask').value.trim();

  if (taskName=='') {
    tareaOut.value +='\nSorry, nothing to send.\nDone.';
    return;
  }

  const data = JSON.stringify({task: taskName, isDone: false});
  const url = 'https://parseapi.back4app.com/classes/Tasks/';

  sendRequest(url, 'POST', data);

}

/**
 * Processes a click on the "Edit  task (rewrite description)" button.
 */
function editTask() { // eslint-disable-line no-unused-vars
  tareaOut.value='editTask started ...';

  const taskName = document.getElementById('inNewTaskName').value.trim();

  if (taskName=='') {
    tareaOut.value +='\nSorry, no new task name set.\nDone.';
    return;
  }

  const taskId = document.getElementById('inTaskIdEdt').value.trim();

  if (taskId=='') {
    tareaOut.value +='\nSorry, no task id specified.\nDone.';
    return;
  }

  const data = JSON.stringify({task: taskName, isDone: false});
  const url = 'https://parseapi.back4app.com/classes/Tasks/'+taskId;

  sendRequest(url, 'PUT', data);
}

/**
 * Processes a click on the "Delete  task" button.
 */
function deleteTask() {// eslint-disable-line no-unused-vars
  tareaOut.value='deleteTask started ...';

  const taskId = document.getElementById('inTaskIdRem').value.trim();

  if (taskId=='') {
    tareaOut.value +='\nSorry, nothing to delete.\nDone.';
    return;
  }

  const url='https://parseapi.back4app.com/classes/Tasks/'+taskId;

  sendRequest(url, 'DELETE');
}

/**
 * Processes a click on the "Get all  tasks" button.
 * With fetch call using then and catch
 */

async function getTasks() { // eslint-disable-line no-unused-vars
  tareaOut.value='getTasks started ...';

  const url='https://parseapi.back4app.com/classes/Tasks/';
  sendRequest(url, 'GET');
}

/**
 * Processes a response object from a successful AJAX call.
 * @param {*} response object with the response
 */
function writeSuccResponse(response) {
  console.log(response);
  tareaOut.value='SUCCESS. \n\nResponse:\n'+JSON.stringify(response);
}

/**
 * Processes an error message (from a failed AJAX call.)
 * @param {*} message error message
 */
function writeErrMsg(message) {
  tareaOut.value='ERROR.\n'+ message;
}

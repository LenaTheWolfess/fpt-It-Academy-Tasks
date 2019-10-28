/* eslint-disable linebreak-style */
/* eslint-disable curly */
/* eslint-disable require-jsdoc */
/* eslint-disable new-cap */
const connector = new Connector(
    'IVMzl7V0hNf0FKUlWN8SGqeJ1WTIbZNUG2HjWXwu',
    '6pE0VrVuinRVW4oJ2AsL3DcVeo8UN6t09nQ7YH6D');

function setupConnector() {
  connector.setUrl('https://parseapi.back4app.com/classes/');
}

let maxSwLine = 0;
const listOfIds = [[]];

function getAllHandler(data) {
  if (!data.results || !data.results.length)
    return;
  const parent = document.getElementById('sLine'+data.results[0].swimline);
  let processed = 0;
  data.results.forEach((item) => {
    const elm = document.getElementById(item.objectId);
    processed++;
    if (elm) {
      const lastUpdate = elm.getAttribute('lastUpdate');
      const mTime = (new Date(lastUpdate)).getTime();
      const nTime = (new Date(item.updatedAt)).getTime();
      if (!lastUpdate || mTime < nTime) {
        elm.innerHTML = createHtmlForTaskData(item);
        elm.setAttribute('lastUpdate', item.updatedAt);
      }
    } else {
      if (!listOfIds[item.swimline])
        listOfIds[item.swimline] = [];
      listOfIds[item.swimline].push(item.objectId);
      parent.innerHTML += createHtmlForTask(item);
    }
  });
  if (listOfIds[data.results[0].swimline].length != processed) {
    listOfIds[data.results[0].swimline] = [];
    parent.innerHTML = '';
    data.results.forEach((item) => {
      if (!listOfIds[item.swimline])
        listOfIds[item.swimline] = [];
      listOfIds[item.swimline].push(item.objectId);
      parent.innerHTML += createHtmlForTask(item);
    });
  }
}

function getAllSWHandler(data) {
  if (!data.results)
    return;
  const sorted = data.results.sort(
      (a, b) => a.number - b.number
  );
  maxSwLine = sorted[sorted.length-1].number;
  sorted.forEach(
      (t) => {
        addSwimLine(t);
        updateSwimLine(t);
      }
  );
}

function getOneHandler(item) {
  const parent = document.getElementById('sLine'+item.swimline);
  const elm = document.getElementById(item.objectId);
  if (elm) {
    const lastUpdate = elm.getAttribute('lastUpdate');
    const mTime = (new Date(lastUpdate)).getTime();
    const nTime = (new Date(item.updatedAt)).getTime();
    if (!lastUpdate || mTime < nTime) {
      elm.innerHTML = createHtmlForTaskData(item);
      elm.setAttribute('lastUpdate', item.updatedAt);
    }
  } else {
    parent.innerHTML += createHtmlForTask(item);
  }
}

function handleInsertedTask(data) {
  connector.getOneObject('Tasks/' + data.objectId, getOneHandler, handleError);
}

function reloadData() {
  connector.getData('Swimlines/', getAllSWHandler, handleError);
}

function updateMovedTask(params) {
  const oldEl = document.getElementById(params.id);
  if (oldEl)
    oldEl.parentElement.removeChild(oldEl);
  handleInsertedTask({objectId: params.id});
}

// eslint-disable-next-line no-unused-vars
function moveTask(objectId, swimline) {
  if (swimline == maxSwLine)
    return;
  const newSwimline = swimline + 1;
  connector.updateData('Tasks/' + objectId,
      {swimline: newSwimline}, updateMovedTask,
      handleError,
      {id: objectId});
}

function createHtmlForTaskInner(data) {
  return `
     <h2 id =sLineName${data.number}>${data.caption}<h2>
     <div id='sLine${data.number}' class='${data.category}'>
    </div>
  `;
}

function createHtmlForSwimLine(data) {
  return `
  <div id='taskLineContainer${data.number}'>
     ${createHtmlForTaskInner(data)}
  </div>
 `;
}

function createHtmlForTaskData(data) {
  return `${data.task}`;
}

function createHtmlForTask(data) {
  return `
    <div lastUpdate=${data.updatedAt} class="task" id=${data.objectId}
    ondblclick="moveTask('${data.objectId}',${data.swimline})">
      ${createHtmlForTaskData(data)}
    </div>
  `;
}

function addSwimLine(data) {
  const cmp = document.getElementById(`taskLineContainer${data.number}`);
  if (cmp) {
    document.getElementById(`sLineName${data.number}`).innerHTML = data.caption;
    return;
  }
  const htmlCode = createHtmlForSwimLine(data);
  document.getElementById('tasksContainer').innerHTML += htmlCode;
}
function updateSwimLine(data) {
  connector.getData(`Tasks?where={"swimline":${data.number}}`,
      getAllHandler, handleError);
}
function handleError(msg) {
  console.error(msg);
}
function addListeners() {
  document.getElementById('btAddTask').addEventListener('click', () => {
    const text = document.getElementById('inNewTask').value.trim();
    if (!text) {
      return;
    }
    const task = {};
    task.task = text;
    task.swimline = 1;
    connector.addData('Tasks', task, handleInsertedTask, handleError);
    document.getElementById('inNewTask').value = '';
  });

  document.getElementById('btRemCmpl').addEventListener('click', () => {
    const parent = document.getElementById('sLine'+maxSwLine);
    const list = parent.children;
    while (list.length) {
      connector.removeData('Tasks/',
          list[0].getAttribute('id'),
          handleError);
      parent.removeChild(list[0]);
    }
  });
}

function starTimer() {
  setInterval(() => {
    reloadData();
  }, 60000);
}

window.onload = () => {
  addListeners();
  setupConnector();
  reloadData();
  starTimer();
};

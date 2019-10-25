/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
/* eslint-disable new-cap */
const connector = new Connector(
    'Qoa5pHzbhZ7GIPQdvHl4ZZdIiXwMUY1nlriF3Tor',
    'AEKA0e4b1yK0LwRHkR9kwgQc2L9tE4X6utOkpYpm');
const nKanban = 3;

function setupConnector() {
  connector.setUrl('https://parseapi.back4app.com/classes/KanBan/');
}

function getAllHandler(data) {
  JSON.parse(data).results.forEach((t) => addToHtlm(t));
}

function getOneHandler(data) {
  addToHtlm(JSON.parse(data));
}

function handleInsertedTask(data) {
  const parsedData = JSON.parse(data);
  connector.getOneObject(parsedData.objectId, getOneHandler);
}

function reloadData() {
  connector.getData(getAllHandler);
}

function addToHtlm(data) {
  const button = document.createElement('button');
  button.innerHTML = data.name;

  button.classList.add('taskAsBt');
  button.classList.add('inSLine'+data.sLine);

  button.setAttribute('objectId', data.objectId);
  button.setAttribute('type', 'button');

  button.addEventListener('click',
      () => {
        const prev = data.sLine;
        if (data.sLine == nKanban) {
          return;
        }
        data.sLine++;
        connector.updateData(data.objectId, {sLine: data.sLine});
        button.classList.replace('inSLine'+prev, 'inSLine'+(prev+1));
        document.getElementById('taskline'+prev).removeChild(button);
        document.getElementById('taskline'+data.sLine).appendChild(button);
      }
  );
  document.getElementById('taskline'+data.sLine).appendChild(button);
}

function addListeners() {
  document.getElementById('btAddTask').addEventListener('click', () => {
    const text = document.getElementById('inNewTask').value.trim();
    if (!text) {
      return;
    }
    const task = {};
    task.name = text;
    task.sLine = 1;
    connector.addData(task, handleInsertedTask);
    document.getElementById('inNewTask').value = '';
  });

  document.getElementById('btRemCmpl').addEventListener('click', () => {
    const list = document.getElementsByClassName('inSLine'+nKanban);
    const parent = document.getElementById('taskline'+nKanban);
    while (list.length) {
      connector.removeData(list[0].getAttribute('objectId'));
      parent.removeChild(list[0]);
    }
  });
}

window.onload = () => {
  addListeners();
  setupConnector();
  reloadData();
};

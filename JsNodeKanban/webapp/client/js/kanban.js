/* eslint-disable linebreak-style */
/* eslint-disable curly */
/* eslint-disable require-jsdoc */
/* eslint-disable new-cap */

var loggedUser = localStorage.getItem('loggedUser');

const connector = new Connector('');

function setupConnector() {
  connector.setUrl('http://localhost:5000/');
}

let maxSwLine = 0;
let listOfIds = [[]];
let reset = false;

let activeTags = [];

function getAllHandler(data) {
  if (!data.results || !data.results.length)
    return;
  const parent = document.getElementById('sLine'+data.results[0].swimline);
  let processed = 0;
  data.results.forEach((item) => {
    const elm = document.getElementById(item.objectId);
    processed++;
    if (elm) {
      const lastUpdate = elm.getAttribute('lastupdate');
      const mTime = (new Date(lastUpdate)).getTime();
      const nTime = (new Date(item.updatedAt)).getTime();
      if (!lastUpdate || mTime < nTime) {
        elm.innerHTML = createHtmlForTaskData(item);
        elm.setAttribute('lastupdate', item.updatedAt);
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

function getAllSWHandlerR(data) {
  if (!data.results)
    return;
  const sorted = data.results.sort(
      (a, b) => a.number - b.number
  );
  maxSwLine = sorted[sorted.length-1].number;
  sorted.forEach(
    (t) => {
      addSwimLine(t);
      document.getElementById('sLine'+t.number).innerHTML = '';
      updateSwimLine(t);
    }
);
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
  const elm = document.getElementById(item._id);
  if (elm) {
    const lastUpdate = elm.getAttribute('lastupdate');
    const mTime = (new Date(lastUpdate)).getTime();
    const nTime = (new Date(item.updatedAt)).getTime();

    if (!lastUpdate || mTime < nTime) {
      elm.innerHTML = createHtmlForTaskData(item);
      elm.setAttribute('lastupdate', item.updatedAt);
    }
  } else {
    parent.innerHTML += createHtmlForTask(item);
  }
}

function handleInsertedTask(data) {
  connector.getOneObject('tasks/' + data._id, getOneHandler, handleError);
}

function clearData() {
  document.getElementById('tasksContainer').innerHTML = 'You are not logged';
}

function reloadData(reset) {
  reset = true;
  if (reset)
    connector.getData('swimlines', getAllSWHandlerR, handleError);
  else
    connector.getData('swimlines', getAllSWHandler, handleError);
}

function updateMovedTask(params) {
  const oldEl = document.getElementById(params._id);
  if (oldEl)
    oldEl.parentElement.removeChild(oldEl);
  handleInsertedTask({_id: params._id});
}

// eslint-disable-next-line no-unused-vars
function moveTask(objectId, swimline, title) {
  if (swimline == maxSwLine)
    return;
  const newSwimline = swimline + 1;
  connector.updateData('tasks/' + objectId,
      {swimline: newSwimline, title: title }, updateMovedTask,
      handleError,
      {_id: objectId});
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

function createTags(list) {
  let str = "";
    for (let item of list) {
      str += item + " ";
    }
  return str;
}

function createHtmlForTaskData(data) {
  return `<h2>${data.title}</h2> ${createTags(data.tags)}`;
}

function createHtmlForTask(data) {
  return `
    <div lastupdate='${data.updatedAt}' class="task" id=${data._id}
    ondblclick="moveTask('${data._id}',${data.swimline}, '${data.title}')">
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
  let tt = '';
  if (activeTags && activeTags.length)
    tt = `, "tags": ${JSON.stringify(activeTags)}`;
  connector.getData(`tasks?where={"swimline":${data.number}${tt}}`,
      getAllHandler, handleError);
}
function handleError(msg) {
  msg.json().then((data) => console.error(data));
}
let lTags = [];

function removeTag(tag) {
  lTags = lTags.filter(name => name != tag);
  let elm = document.getElementById('tID'+tag);
  elm.parentElement.removeChild(elm);
}
function formatTags(tags) {
  let results = '';
  for (let tag of tags) {
    results += `<li contenteditable='false' class='tag' id='tID${tag}'>${tag}<div class='tremove' onclick=removeTag('${tag}')>X</div></li>`;
  }
  return results;
}

function handleTaging() {
     let tags = document.getElementById('nlistTags');
     let ptags = document.getElementById('listTags');
     let text = tags.innerHTML;
     if (!text)
       return;
     text = text.trim().replace(/nbsp;/g, '');
     if (!text.endsWith(",")) {
        return;
     }
     let sp = text.split('</li>');
     lTags.push(sp[sp.length-1].replace(',', '').trim());
     ptags.innerHTML = formatTags(lTags) + '<div class="nTag" contenteditable="true" oninput="handleTaging()" id="nlistTags"> </div>';
     let nt = document.getElementById('nlistTags');
     nt.focus();
}

function addListeners() {
  document.getElementById('btAddTask').addEventListener('click', () => {
    const text = document.getElementById('inNewTask').value.trim();
    if (!text) {
      return;
    }
    const ntags = document.getElementById('inTags').value.trim();
    tlist = ntags.split(',').filter((t) => t.length);

    const task = {};
    task.title = text;
    task.swimline = 1;
    task.tags = tlist;
    connector.addData('tasks', task, handleInsertedTask, handleError);
    document.getElementById('inNewTask').value = '';
  });

  document.getElementById('btRemCmpl').addEventListener('click', () => {
    const parent = document.getElementById('sLine'+maxSwLine);
    const list = parent.children;
    while (list.length) {
      connector.removeData('tasks/',
          list[0].getAttribute('id'),
          handleError);
      parent.removeChild(list[0]);
    }
  });

  document.getElementById('flistTags').addEventListener('click', () => {
    let f = document.getElementById('nlistTags');
    f.focus();
  });

  document.getElementById('nlistTags').addEventListener('input', () => {
     handleTaging();
  });

  document.getElementById('btSetTags').addEventListener('click', () => {
    activeTags = lTags;
    reloadData(true);
  });

  document.getElementById('btnLogg').addEventListener('click', () => {
    processLogg();
  });

  document.getElementById('btnRegg').addEventListener('click', () => {
    processRegg();
  });
}

function processRegg() {
  let name = document.getElementById('reggName').value;
    if (!name)
      return;
    name = name.trim();
    if (!name)
      return;
    let password = document.getElementById('reggPass').value;
    if (!password)
      return;
    password = password.trim();
    if (!password)
       return;
    register(name, password);
}

function processLogg() {
  let name = document.getElementById('loggName').value;
    if (!name)
      return;
    name = name.trim();
    if (!name)
      return;
    let password = document.getElementById('loggPass').value;
    if (!password)
      return;
    password = password.trim();
    if (!password)
       return;
    loggIn(name, password);
}

function handleLogg(data) {
   connector.setKey(data.token);
   document.getElementById('regg').innerHTML = '';
   document.getElementById('logg').innerHTML = `Logged as ${data.name} <button type="button" onclick='loggOut()'>Logg out</button>`;
   document.getElementById('tasksContainer').innerHTML = '';
   document.getElementById('taskMan').hidden = false;
   localStorage.setItem('loggedUser', JSON.stringify({name: data.name, token: data.token}));
   reloadData(true);
}

function handleRegg(data) {
  handleLogg(data);
}

function loggOut() {
  document.getElementById('logg').innerHTML = `<input type="text" id="loggName" placeholder="loggin name"><input type="text" id="loggPass" placeholder="password"><button onclick='processLogg()' class="anim" type="button" id="btnLogg">Logg</button>`;
  document.getElementById('regg').innerHTML = `
        <input type="text" id="reggName" placeholder="user name">
        <input type="text" id="reggPass" placeholder="new password">
        <button type="button" onclick='processRegg()' id="btnRegg">Register</button>`;
  document.getElementById('taskMan').hidden = true;
  connector.setKey('');
  clearData();
  localStorage.setItem('loggedUser', null);
}

function loggIn(name, psw) {
  connector.addData('logg', {name: name, password: psw}, handleLogg, handleError);
}

function register(name, psw) {
  connector.addData('regg', {name: name, password: psw}, handleRegg, handleError);
}

function starTimer() {
  return;
  setInterval(() => {
    reloadData();
  }, 6000);
}

function tryLogg() {
  if (!loggedUser)
    return false;
  let dt = JSON.parse(loggedUser);
  if (!dt || !dt.name || !dt.token)
    return false;
  handleLogg(dt);
  return true;
}

window.onload = () => {
  addListeners();
  setupConnector();
  if (!tryLogg()) {
    reloadData();
    document.getElementById('taskMan').hidden = true;
  }
  starTimer();
};

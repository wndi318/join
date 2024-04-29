let todoSum = [];



async function initSummary() {

  await includeHTML();
  loadtodoSums();
  await getInitials();
  displayOptions();
  greetingOnDailyTime();
  getCurrentDate();
}

/**
 * Loads and displays the summary of task counts based on priority and status.
 * Updates the corresponding HTML elements with the task count values.
 */
async function loadtodoSums() {
  try {
    let TasksUrgent = document.getElementById('task_urgend_number');
    let Tasks = document.getElementById('Tasks-ToDo-value');
    let Task_in_Progress = document.getElementById('Task-in-Progress_value');
    let Awaiting_feedback = document.getElementById('Awaiting-feedback_value');
    let Task_Done = document.getElementById('Task-Done_value');
    let TaskInBoard = document.getElementById('Task-in-Board_value');

    let todoSum = JSON.parse(await getItem('todos'));

    let UrgentTasks = todoSum.filter(t => t['priority'] == 'Urgent');
    let Tasks_value = todoSum.filter(t => t['status'] == 'to-do');
    let Task_in_Progress_value = todoSum.filter(t => t['status'] == 'in-progress');
    let Awaiting_feedback_value = todoSum.filter(t => t['status'] == 'await-feedback');
    let Task_Done_value = todoSum.filter(t => t['status'] == 'done');


    let totalTodos = todoSum.length;

    TaskInBoard.innerHTML = totalTodos.toString();

    Tasks.innerHTML = Tasks_value.length.toString();
    Task_in_Progress.innerHTML = Task_in_Progress_value.length.toString();
    Awaiting_feedback.innerHTML = Awaiting_feedback_value.length.toString();
    Task_Done.innerHTML = Task_Done_value.length.toString();
    TasksUrgent.innerHTML = UrgentTasks.length.toString();

  } catch (e) {
    console.error('Loading error:', e);
  }
}

/**
* this function is to get the user initials from the Backendserver
*@param {string} UserInitials - get the firstletter of the firstname and the firstletter of the lastname
*@param {string} UserName - get the Username from the User who is logging in
**/

async function getInitials() {
  UserInitials = await getItem('userInitial');
  UserName = await getItem('userName');
  const kanban = document.getElementById("kanban");
  kanban.innerHTML += `<div onclick="displayOptions()" id="initials">
      ${UserInitials}
      </div>`;
}

/**
* this function is to open the submenu when the user is clicking on the initial-logo
* @param {string} isDisplayed - if the user click on the initial-logo get opened if he click again it will be closed
**/
function displayOptions() {
  const options = document.getElementById("options");
  options.style.display = '';
  const isDisplayed = options.classList.toggle("dNone");

  if (isDisplayed) {
    document.getElementById('options').style.display = 'none';
  }

  if (isDisplayed && !options.innerHTML.trim()) {
    options.innerHTML = /*html*/`
      <div class="option"><a href="/PrivacyPolicy/privacypolicy.html">Privacy Policy</a></div>
      <div class="option"><a href="/LegalNotice/legalnotice.html">Legal Notice</a></div>
      <div class="option" onclick="goToLogin()">Log out</div>
    `;
  }

}

function goToLogin() {
  window.location.pathname = '/Login/login.html';
}

function goToBoard() {
  window.location.pathname = '/Board/board.html';
}

/**
* this function is to greet the user based on daily time and with his username
*@param {string} timeOfDay - this variable get the Time of the Day
*@param {string} userNameFlex - this variable get the Username who is loged-in with his account
**/
function greetingOnDailyTime() {
  const timeOfDay = getTimeOfDay();
  const userNameFlex = `<span id="media_query" style="color: #4589FF; font-weight: bold; font-size: 60px;">${UserName}</span>`;
  document.getElementById("timezone").innerHTML = `${timeOfDay}, ${userNameFlex}`;
}

/**
 * This function greets you depending on the time of the day
 * @param {number} currentHour - this variable get the exactly time 
 */
function getTimeOfDay() {
  const currentHour = new Date().getHours();
  if (currentHour >= 5 && currentHour < 12) return "Good Morning";
  if (currentHour >= 12 && currentHour < 18) return "Good Afternoon";
  if (currentHour >= 18 && currentHour < 22) return "Good Evening";
  return "Good Night";
}

/**
* this function is to get the current date
*@description - gets the current date in thise example in German language
*@param {string} currentDateElement.textContent - this variable returns the current date 
**/
function getCurrentDate() {
  let currentDateElement = document.getElementById("currentDate");
  let currentDate = new Date();
  let options = { year: 'numeric', month: 'long', day: 'numeric' };
  currentDateElement.textContent = currentDate.toLocaleDateString('en-US', options);
}

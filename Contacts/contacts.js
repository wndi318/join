let contacts = [];
let colors = ["#9327FF", "#FF7900", "#6E52FF", "#FC71FF", "#FFBB2C", "#1CD7C1", "#462F8A", "#FF4647"];

async function initBoard() {
  await getInitials();
  displayOptions();
}

/**
 * This funciton creates contacts and pushes different contact informations from the Input fields to the Contact Array.
 */
async function createContact() {
  contacts_length = JSON.parse(await getItem('contacts')) || [];
  let newcontactsId = contacts_length.length - 1;
  newcontactsId++;


  contacts = JSON.parse(await getItem('contacts')) || [];
  contacts.push({
    id: newcontactsId,
    name: nameInput.value,
    mail: mail.value,
    phone: phone.value,
    backgroundColor: getRandomColor()
  });

  nameInput.value = '';
  mail.value = '';
  phone.value = '';

  await setItem('contacts', JSON.stringify(contacts));
  closeCard();
  generateContacts();
  closeContactInformation();
}

/**
 * This funciton loads all contacts from the array and opens the generateContacts function.
 */
async function loadContacts() {
  try {
    contacts = JSON.parse(await getItem('contacts')) || [];
    generateContacts();
  } catch (e) {
    console.error('Loading error:', e);

  }
}

/**
 * This function Shows the addContact PopUp
 */
function addContact() {
  document.getElementById('contactContentContainer').classList.remove('displayNone');
  document.getElementById('addNewContact').classList.remove('displayNone');
  document.getElementById('bg').style.display = 'flex';
}

/**
 * This function ensures that only numbers can be entered in the input field.
 * @param {*} input - This is the input field which only shows numbers.
 */
function validateNumbers(input) {
  const inputValue = input.value;
  const numericValue = inputValue.replace(/\D/g, '');
  input.value = numericValue;
  2
}

/**
 * This function generates a random color from a predefined array of colors.
 *
 * @returns {string} A randomly selected color.
 */
function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

/**
 * This funcion generates and displays a list of contacts in the 'allContacts' element.
 * Contacts are sorted alphabetically by name, and a letter header is displayed for each unique initial.
 */
async function generateContacts() {

  document.getElementById('allContacts').innerHTML = '';

  contacts.sort((a, b) => a.name.localeCompare(b.name));

  let processedInitials = [];

  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    const initials = getContactInitials(contact.name);

    if (!processedInitials.includes(initials[0])) {
      document.getElementById('allContacts').innerHTML += `
        <div>
          <span class="alphabet">${initials[0]}<div class="borderBottom"></div></span>
        </div>
      `;
      processedInitials.push(initials[0]);
    }
    document.getElementById('allContacts').innerHTML += `
      <div id="${contact.id}" class="contact" onclick="openContact(${i}, '${contact.backgroundColor}')">
        <div class="contactSign" style="background-color: ${contact.backgroundColor}; color: white;">${initials}</div><span>${contact.name}</span>
      </div>
    `;
  }
}

/**
 * This function opens and displays detailed information about a specific contact.
 *
 * @param {number} i - The index of the contact in the 'contacts' array.
 */
async function openContact(i) {
  const contact = contacts[i];
  const initials = getContactInitials(contact.name);

  highlightContactByName(contact.name);
  document.getElementById('contactContent').classList.remove('displayNone');
  document.getElementById('contactContent').innerHTML = `
  <div class="contactId">
  
  <div class="bigContactSign" style="background-color: ${contact.backgroundColor}; color: white;">${initials}</div>
  <div class="contactName">
      <span>${contact.name}<div id="close_contact_information" onclick="closeContactInformation()" class="close-btn-cont">
      <img src="img/close.svg">
    </div></span>
      
      <span>
          <button onclick="editContact(${i})"><img src="img/edit.svg">Edit</button>
          <button onclick="deleteContactByName('${contact.name}')"><img src="img/delete.svg">Delete</button>
      </span>
  </div>
</div>
<div class="contactInfo">
  <h3>Contact Information</h3>
  <span><b>Email</b><br><br><a href="mailto:${contact.mail}">${contact.mail}</a></span>
  <br>
  <br>
  <span><b>Phone</b><br><br>${contact.phone}</span>
</div>
  `;
}

/**
 * This function closes the contact Information
 */
function closeContactInformation() {
  document.getElementById('contactContent').classList.add('displayNone');
}

function highlightContactByName(contactName) {
  const normalizedContactName = contactName.trim().toLowerCase();

  const contactsElements = document.querySelectorAll('.contact');

  contactsElements.forEach(contactElement => {
    contactElement.classList.remove('highlighted-contact');
  });

  const selectedContactElement = Array.from(contactsElements).find(contactElement => {
    const contact = contacts.find(c => c.id == contactElement.id);
    const normalizedComparisonName = contact ? contact.name.trim().toLowerCase() : '';
    return normalizedComparisonName === normalizedContactName;
  });

  if (selectedContactElement) {
    selectedContactElement.classList.add('highlighted-contact');
  }
}

/**
 * This function generates initials from the given full name.
 *
 * @param {string} name - The full name of the contact.
 * @returns {string} The initials extracted from the name.
 */
function getContactInitials(name) {
  const nameParts = name.split(' ');
  const firstNameInitial = nameParts[0][0];
  const lastNameInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : '';
  return firstNameInitial + lastNameInitial;
}

/**
 * This function close the add contact or edit contact pop up
 */
function closeCard() {
  document.getElementById('addNewContact').classList.add('displayNone');
  document.getElementById('editContainer').classList.add('displayNone');
  document.getElementById('bg').style.display = 'none';
}

/**
 * Opens the edit contact interface for a specific contact.
 *
 * @param {number} i - The index of the contact in the 'contacts' array.
 */

function editContact(i) {
  const contact = contacts[i];
  document.getElementById('bg').style.display = 'flex';
  document.getElementById('editContainer').classList.remove('displayNone');
  document.getElementById('editContainer').innerHTML = '';

  document.getElementById('editContainer').innerHTML += `
    <div id="editContact">
      <div class="editContactHeader">
        <button class="closeButton" onclick="closeCard()"><img src="img/close.svg"></button>
        <img class="addEditLogo" src="img/logo.svg">
        <h1>Edit Contact</h1>
      </div>
      <div class="addContactInfo">
      <img src="img/icon.svg">
      <form onsubmit="updateContact(${contact.id}); return false;">
          <div class="inputDiv">
              <input id="editName" required type="text" placeholder="Name" value="${contact.name}">
              <img src="img/person.svg">
          </div>
          <div class="inputDiv">
              <input id="editMail" required type="email" placeholder="E-Mail" value="${contact.mail}">
              <img src="img/mail.svg">
          </div>
          <div class="inputDiv">
              <input id="editPhone" required pattern="^[0-9]{5,20}$" type="text" placeholder="Phone" oninput="validateNumbers(this)" value="${contact.phone}">
              <img src="img/call.svg">
          </div>
          <div class="addContactButtons">
              <button id="deleteButton" type="button" onclick="deleteContactByName('${contact.name}')">Delete</button>
              <button id="saveButton" type="submit">Save<img src="img/check.svg"></button>
          </div>
      </form>
  </div>
  `;
}

/**
 * This function updates the information of a specific contact.
 *
 * @param {number} contactId - The ID of the contact to be updated.
 */
async function updateContact(contactId) {
  try {
    contacts = JSON.parse(await getItem('contacts')) || [];

    const indexToUpdate = contacts.findIndex(contact => contact.id === contactId);

    if (indexToUpdate !== -1) {
      const editedContact = {
        id: contactId,
        name: document.getElementById('editName').value,
        mail: document.getElementById('editMail').value,
        phone: document.getElementById('editPhone').value,
        backgroundColor: contacts[indexToUpdate].backgroundColor
      };

      contacts[indexToUpdate] = editedContact;
      await setItem('contacts', JSON.stringify(contacts));
      closeCard();
      openContact(contactId);
      generateContacts();
    } else {
      console.error('Contact with ID ' + contactId + ' not found.');
    }
  } catch (e) {
    console.error('Error updating contact:', e);
  }
}

/**
 * This function deletes the Contact choosen by the name
 *
 * @param {string} contactName - The name of the contact to be deleted.
 */
async function deleteContactByName(contactName) {
  try {
    contacts = JSON.parse(await getItem('contacts')) || [];

    const indexToDelete = contacts.findIndex(contact => contact.name === contactName);

    if (indexToDelete !== -1) {
      contacts.splice(indexToDelete, 1);
      await setItem('contacts', JSON.stringify(contacts));
      closeCard();
      location.reload();
    } else {
      console.error('Contact with name ' + contactName + ' not found.');
    }
  } catch (e) {
    console.error('Error deleting contact:', e);
  }

  document.getElementById('contactContent').classList.add('displayNone');
}

async function getInitials() {
  UserInitials = await getItem('userInitial');
  UserName = await getItem('userName');
  const kanban = document.getElementById("kanban");
  kanban.innerHTML += `<div onclick="displayOptions()" id="initials">
      ${UserInitials}
      </div>`;
}

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




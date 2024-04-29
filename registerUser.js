let users = [];

async function init() {
    loadUsers();
    checkPasswords();
}


/**
 * this function load the users from the backend server
 * loadUsers() - fetch the saved user from the backend server
 **/
async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error("loading error!", e);
    }
}

/**
 * this function push the userinput to the backend server//
 * @param {string} users - the Array users push the "user" = {name:, email:, password}
 * 
 **/
async function registerUser() {
    users.push({
        name: sign_up_name.value,
        email: sign_up_email.value.toLowerCase(),
        password: sign_up_password.value,
    });
    await setItem('users', JSON.stringify(users));
    resetUserInput();
    succesfullySignedUp()
}

function resetUserInput() {
    sign_up_name.value = '';
    sign_up_email.value = '';
    sign_up_password.value = '';
    sign_up_confirm_pw.value = '';

}


/**
 * this function pop-up a baner after signing up
 * 
 * @param {string} succes - this is the variable which is used to animate a pop-up banner after a user registration
 **/
function succesfullySignedUp() {
    let success = document.getElementById('popup_after_succesfully_signup');
    success.style.display = 'block';
    success.style.transition = "top 0.5s ease, transform 0.5s ease";
    setTimeout(() => {
        success.style.top = "106%";
    }, 1200);
    setTimeout(() => {
        success.style.bottom = "50%";
    }, 2800);
    setTimeout(() => {
        success.style.display = "none";
    }, 3200);
    setTimeout(() => {
        window.location.pathname = '/Login/login.html';
    }, 3200);
}


/**
 * this function is to check the password, if he match or dosent match
 * 
 * @param {string} password - this variable is where the user put his password init
 * @param {string} passwordConfirm - in this variable confirm the user his password 
 * @param {string} resultElement - this variable pop-up after the user is typing in the "password-confirm" field, if the password match = "Password does match!", if the Password not match "The Password does not match" in red color
 * 
 **/
function checkPasswords() {
    let password = document.getElementById('sign_up_password').value;
    let passwordConfirm = document.getElementById('sign_up_confirm_pw').value;
    let resultElement = document.getElementById('result_password_match');

    if (password.length > 0 && passwordConfirm.length > 0) {
        if (password === passwordConfirm) {
            resultElement.innerHTML = 'The Password match!';
            resultElement.style.color = 'Green';
        } else {
            resultElement.innerHTML = 'The Password do not match!';
            resultElement.style.color = 'Red';
        }
    } else {
        resultElement.innerHTML = '';
    }
    document.getElementById('sign_up_password').addEventListener('input', checkPasswords);
    document.getElementById('sign_up_confirm_pw').addEventListener('input', checkPasswords);

}

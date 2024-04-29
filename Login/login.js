let greetingName = [];

/**
 * to reset the Z-Index of the Logo-animation in the first
 **/
document.addEventListener('DOMContentLoaded', function () {
    const logoContainer = document.querySelector('.join-logo-container');

    if (logoContainer) {
        logoContainer.addEventListener('animationend', function () {
            logoContainer.remove();
        });
    }
    
});




function redirectToSignUp() {
    window.location.pathname = '/SignUP/signup.html';
}

/**
 * this function is to login as a guest
 **/
async function loginAsGuest() {
    await setItem('userInitial', 'G')
    await setItem('userName', 'Guest');
    window.location.pathname = '/Summary/summary.html';
}

/**
 *  this function is to login with your registered Email and Password && to save your Initials of your first and lastname
 * */ 
async function LoginRegistered() {
    const email = document.getElementById('login_email_input').value;
    const password = document.getElementById('login_password_input').value;

    try {
        const users = JSON.parse(await getItem('users'));
        const user = users.find(u => u.email === email && u.password === password);
        const userInitial = user.name.split(' ').map(word => word[0].toUpperCase()).join('');
        if (user) {
            await setItem('userName', JSON.stringify(user.name));
            await setItem('userInitial', JSON.stringify(userInitial));
            window.location.href = '/Summary/summary.html?name=' + encodeURIComponent(user.name);
        } else {
            console.warn('Benutzer oder Passwort falsch');
        }
    } catch (e) {
        console.error('Loading error', e);
    }


}

function goToLogin(){
    window.location.pathname = '/Login/login.html';
  }



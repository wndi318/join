function backToLogin() {
    window.location.pathname = '/Login/login.html';
}

/**
*You can't finish your sing-up befor you accept the term checkbox
*@param {string} signUpBtn - the sign-up button is disabled until you accept the term checkbox
**/
function enableTheBtn() {

    let checkboxAccepted = document.getElementById('accept_terms');
    let signUpBtn = document.getElementById('sign_up');

    if (checkboxAccepted.checked) {
        signUpBtn.disabled = false;
        signUpBtn.classList.remove('disabled-Button');
    } else {
        signUpBtn.disabled = true;
        signUpBtn.classList.add('disabled-Button');
    }
}
document.addEventListener('DOMContentLoaded', function () {
    enableTheBtn();
    document.getElementById('accept_terms').addEventListener('change', enableTheBtn());
});
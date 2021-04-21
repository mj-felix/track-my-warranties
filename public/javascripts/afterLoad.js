// auto hide flash message
if (document.querySelector('#flashContainer div.alert')) {
    app.utils.view.addAutoHide('#flashContainer');
}

// add date pattern to date input label for Safari
const datePatternSpans = document.querySelectorAll('span.datePattern');
if (datePatternSpans.length) {
    const dateInputTest = document.createElement('input');
    try {
        dateInputTest.type = 'date';
    } catch (e) {
        console.log(e.description);
    }
    if (dateInputTest.type === 'text') {
        for (let span of datePatternSpans) {
            span.textContent = '(YYYY-MM-DD)';
        }
    }
}

// add file uploader and file deleters
const fileInput = document.querySelector('#file');
if (fileInput) {
    fileInput.addEventListener('change', app.file.controler.uploadFile);
    const deleteAs = document.querySelectorAll('.deleteFile');
    for (let deleteA of deleteAs) {
        deleteA.addEventListener('click', app.file.controler.deleteFile);
    }
}

// add password not the same validation on register
const password2Input = document.querySelector('#password2');
if (password2Input) {
    document.querySelector("form").addEventListener("submit", app.auth.view.checkPasswords);
}

//disable submit button on submit
const forms = document.querySelectorAll('form');
if (forms.length && !password2Input) {
    for (let form of forms) {
        form.addEventListener("submit", app.utils.view.disableSubmit);
    }
}

//add spinner to button links on navigating to another page
const aButtons = document.querySelectorAll('a.btn');
for (let aButton of aButtons) {
    if (aButton.id !== 'aShowAllUsers') aButton.addEventListener("click", app.utils.view.addSpinner);
}

//prefill email and token on resetPassword
const tokenInput = document.querySelector('#token');
if (tokenInput) {
    app.utils.view.populateParamToFormField('token', '#token');
    app.utils.view.populateParamToFormField('email', '#email');
}
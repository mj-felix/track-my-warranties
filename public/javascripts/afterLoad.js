// auto hide flash message
if (document.querySelector('#flashContainer div.alert')) {
    app.utils.view.addAutoHide('#flashContainer');
}

// add date pattern to date input label for Safari
if (document.querySelector('span.datePattern')) {
    const dateInputTest = document.createElement('input');
    try {
        dateInputTest.type = 'date';
    } catch (e) {
        console.log(e.description);
    }
    if (dateInputTest.type === 'text') {
        for (let span of document.querySelectorAll('span.datePattern')) {
            span.textContent = '(YYYY-MM-DD)';
        }
    }
}

// add file uploader and file deleters
if (document.querySelector('#file')) {
    const fileInput = document.querySelector('#file');
    fileInput.addEventListener('change', app.file.controler.uploadFile);

    const deleteAs = document.querySelectorAll('.deleteFile');
    for (let dA of deleteAs) {
        dA.addEventListener('click', app.file.controler.deleteFile);
    }
}

// add password not the same validation on register
if (document.querySelector('#password2')) {
    document.querySelector("form").addEventListener("submit", app.auth.view.checkPasswords);
}

//disable submit button on submit
if (document.querySelector('form')) {
    document.querySelector('form').addEventListener("submit", app.utils.view.disableSubmit);
}
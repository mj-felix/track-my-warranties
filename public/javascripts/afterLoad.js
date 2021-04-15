// adjust layout basing on set bootstrap classes
const mainContainer = document.querySelector('#mainContainer');
for (const cl of colOffsetClasses.split(' ')) mainContainer.classList.add(cl);

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

// add file uploader
if (entryId) {
    const fileInput = document.querySelector('#file');
    fileInput.addEventListener('change', app.file.controler.uploadFile);
}

// add file deleter

if (entryId) {
    const deleteAs = document.querySelectorAll('.deleteFile');
    for (let dA of deleteAs) {
        dA.addEventListener('click', app.file.controler.deleteFile);
    }
}
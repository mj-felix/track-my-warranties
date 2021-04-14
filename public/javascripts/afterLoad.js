// adjust layout basing on set bootstrap classes
const mainContainer = document.querySelector('#mainContainer');
for (const cl of colOffsetClasses.split(' ')) mainContainer.classList.add(cl);

// auto hide flash message
if (document.querySelector('#flashContainer div.alert')) {
    const flash = document.getElementById('flashContainer');
    const intervalID = setInterval(function () {
        if (!flash.style.opacity) {
            flash.style.opacity = 1;
        }
        if (flash.style.opacity >= 0) {
            flash.style.opacity -= 0.1;
        } else {
            clearInterval(intervalID);
            flash.remove();
        }
    }, 200);
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
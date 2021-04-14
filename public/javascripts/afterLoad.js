// adjust layout basing on set bootstrap classes
const mainContainer = document.querySelector('#mainContainer');
for (const cl of colOffsetClasses.split(' ')) mainContainer.classList.add(cl);

// auto hide flash message
const flash = document.getElementById('flashContainer');
const intervalID = setInterval(function () {

    if (!flash.style.opacity) {
        flash.style.opacity = 1;
    }


    if (flash.style.opacity >= 0) {
        flash.style.opacity -= 0.1;
    }

    else {
        clearInterval(intervalID);
        flash.remove();
    }

}, 200);
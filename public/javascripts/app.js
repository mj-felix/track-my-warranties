const app = {
    auth: {
        view: {
            checkPasswords: function (event) {
                const password1 = document.querySelector('#password').value;
                const password2 = document.querySelector('#password2').value;
                if (password1 !== password2) {
                    app.utils.view.showFlash('Passwords do not match!', 'danger');
                    event.preventDefault();
                }
            }
        }
    },
    file: {
        controler: {
            uploadFile: function (event) {
                event.preventDefault();
                event.stopPropagation();

                //file size validation
                const file = event.target.files[0]; // document.querySelector('#file').files[0];
                if (file.size > 10 * 1024 * 1024) {
                    document.querySelector('#file').value = '';
                    app.utils.view.showFlash('File too large!', 'danger')
                    app.utils.view.addAutoHide('#flashContainer');
                    return false;
                }

                //spinner + disable upload input
                app.utils.view.show('#spinner');
                app.utils.view.disableInput('#file');

                //send file
                const formData = new FormData();
                formData.append("file", file);
                axios.post(`/entries/${entryId}/files`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }).then((res) => {
                    app.file.view.uploadedFile(res);
                }).catch((err) => {
                    app.utils.view.showFlash('Something went wrong  ... please try again.', 'danger');
                    document.querySelector('#file').value = '';
                    app.utils.view.hide('#spinner');
                    app.utils.view.enableInput('#file');
                })
            },
            deleteFile: function (event) {
                event.preventDefault();
                event.stopPropagation();
                app.utils.view.show('#spinner');
                axios.delete(event.target.rel)
                    .then((res) => {
                        event.target.parentNode.parentNode.remove();
                        app.utils.view.hide('#spinner');
                        // app.utils.view.showFlash('File deleted successfully', 'success');
                    }).catch((err) => {
                        app.utils.view.showFlash('Something went wrong  ... please try again.', 'danger');
                        app.utils.view.hide('#spinner');
                    });
            }

        },
        view: {
            uploadedFile: function (res) {
                if (typeof res.data.file !== 'undefined') {
                    document.querySelector('#file').value = '';
                    const file = res.data.file;
                    const fileSize = (file.size / 1024 / 1024).toFixed(2);
                    const newFile = document.createElement("tr");
                    newFile.innerHTML =
                        `<td><a href="${file.url}" target="_blank">${file.originalFileName}</a></td>
                <td>${fileSize} MB</td>
                <td class="text-end"><a href="#" rel="/entries/${entryId}/files/${file.storedFileName}"
                    class="my-1 btn btn-danger btn-sm deleteFile">Delete</a></td>`;
                    document.querySelector('#files tbody').prepend(newFile);
                    document.querySelector('#files a.deleteFile').addEventListener('click', app.file.controler.deleteFile);
                    // app.utils.view.showFlash('File uploaded successfully', 'success');
                    app.utils.view.hide('#spinner');
                    app.utils.view.enableInput('#file');
                };
            }
        }
    },
    utils: {
        view: {
            show: function (id) {
                document.querySelector(id).classList.add('visible');
                document.querySelector(id).classList.remove('invisible');
            },
            hide: function (id) {
                document.querySelector(id).classList.add('invisible');
                document.querySelector(id).classList.remove('visible');
            },
            disableInput: function (id) {
                document.querySelector(id).disabled = true;
            },
            enableInput: function (id) {
                document.querySelector(id).disabled = false;
            },
            showFlash: function (msg, type) {
                const divM = document.createElement('div');
                divM.classList.add('alert');
                divM.classList.add('alert-' + type);
                divM.classList.add('mt-5');
                const m = document.createTextNode(msg);
                divM.appendChild(m);
                document.querySelector('#flashContainer').append(divM);
                app.utils.view.addAutoHide('#flashContainer');
            },
            addAutoHide: function (id) {
                const flash = document.querySelector(id);
                const intervalID = setInterval(function () {
                    if (!flash.style.opacity) {
                        flash.style.opacity = 1;
                    }
                    if (flash.style.opacity >= 0) {
                        flash.style.opacity -= 0.1;
                    } else {
                        clearInterval(intervalID);
                        // flash.remove();
                        flash.textContent = '';
                        flash.style.opacity = 1
                    }
                }, 200);
            }
        }
    }
}
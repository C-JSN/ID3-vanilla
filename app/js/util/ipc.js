const {ipcRenderer} = require('electron')

window.ipc = window.ipc || {},
function(n) {
    ipc.messaging = {
        selectFileEvent: function() {
            ipcRenderer.send('selectFile', 'an-argument')
    },

    init: function() {
        $('#select-file').click( function () {
             ipc.messaging.selectFileEvent()
        })
    }

 };

 n(function() {
     ipc.messaging.init();
 })

}(jQuery);

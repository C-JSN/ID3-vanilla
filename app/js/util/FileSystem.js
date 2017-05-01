


function createNewFile(editor) {
  var content = editor.getValue();

  dialog.showSaveDialog(function (fileName) {
      if (fileName === undefined){
          console.log("You didn't save the file");
          return;
      }

      fs.writeFile(fileName, content, function (err) {
          if(err){
              alert("An error ocurred creating the file "+ err.message)
          }

          alert("The file has been succesfully saved");
      });
  });
}

function saveChanges(editor) {
  var actualFilePath = document.getElementById("actual-file").value;

  if(actualFilePath){
      saveChanges(actualFilePath,editor.getValue());
  }else{
      alert("Please select a file first");
  }
}

function deleteFile() {
  var actualFilePath = document.getElementById("actual-file").value;

  if(actualFilePath){
      deleteFile(actualFilePath);
      document.getElementById("actual-file").value = "";
      document.getElementById("content-editor").value = "";
  }else{
      alert("Please select a file first");
  }
}

function selectFile(editor) {
  dialog.showOpenDialog(function (fileNames) {
      if(fileNames === undefined){
          console.log("No file selected");
      }else{
          document.getElementById("actual-file").value = fileNames[0];
          readFile(fileNames[0], editor);
      }
  });
}

const amdRequire = global.require('monaco-editor/min/vs/loader.js').require;
const {dialog} = require('electron').remote;
var fs = require('fs');
const {ipcRenderer} = require('electron');

const path = require('path');
function uriFromPath(_path) {
  let pathName = path.resolve(_path).replace(/\\/g, '/');
  if (pathName.length > 0 && pathName.charAt(0) !== '/') {
    pathName = '/' + pathName;
  }
  return encodeURI('file://' + pathName);
}
amdRequire.config({
  baseUrl: uriFromPath(path.join(__dirname, '../node_modules/monaco-editor/min'))
});
// workaround monaco-css not understanding the environment
self.module = undefined;
// workaround monaco-typescript not understanding the environment
self.process.browser = true;

const onloadFile = fs.readFileSync(path.join(__dirname, '../assets/temp/onload.html')).toString();
console.log(path.join(__dirname, '../assets/temp/onload.html'));


var openedFiles = [];
amdRequire(['vs/editor/editor.main'], function () {
  let editor = monaco.editor.create(document.getElementById('editor'), {
    value: '//write code here',
    language: 'javascript',
    theme: 'vs-dark',
    wrappingColumn: 0,
  });

  var code = document.getElementById("code").contentWindow.document;
  code.open();
  code.writeln(onloadFile);
  code.close();

  window.onresize = () => {
    editor.layout();
  }

  // console.log(ipcRenderer.sendSync('synchronous-message', 'ping'))

  document.getElementById('create-new-file').addEventListener('click',function(){
      const content = '';
      createNewFile(content);
  },false);

  document.getElementById('save-changes').addEventListener('click',function(){
      // alert('saveFile!');
      var actualFilePath = openedFiles[0];
      console.log(actualFilePath);
      if(actualFilePath){
          saveChanges(actualFilePath, editor.getValue());
      }else{
          alert("Please select a file first");
      }
  },false);

  // document.getElementById('delete-file').addEventListener('click',function(){
  //     var actualFilePath = document.getElementById("actual-file").value;
  //
  //     if(actualFilePath){
  //         deleteFile(actualFilePath);
  //         document.getElementById("actual-file").value = "";
  //         document.getElementById("content-editor").value = "";
  //     }else{
  //         alert("Please select a file first");
  //     }
  // },false);

  document.getElementById('select-file').addEventListener('click',function(){

      dialog.showOpenDialog(function (fileNames) {
          if(fileNames === undefined){
              console.log("No file selected");
          }else{
            // console.log('Open File!!!');
            openedFiles = [];
            readFile(fileNames[0], editor);
            openedFiles.push(fileNames[0]);
            // console.log(openedFiles);
          }
          // compile(editor);
      });
  },false);


  document.getElementById("editor").onkeyup = function(){
    compile(editor);
  };

  document.getElementById("editor").addEventListener('keypress', function(event2) {
    console.log(event2.ctrlKey);
    console.log(event2.which);
    var absolutePath;
    if (event2.which === 19) {
      if (!openedFiles[0]) {
        let content = editor.getValue();
        createNewFile(content);
        // editor.setValue(' ');
      } else {
        saveChanges(openedFiles[0], editor.getValue());
      }
    }
  })


  // console.log(editor.getValue());
  // monaco vertical scroll
  editor.domElement.getElementsByClassName('monaco-scrollable-element')[0].style.width = '98%';
});

function createNewFile(content) {
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

function saveChanges(filepath,content){
    fs.writeFile(filepath, content, function (err) {
        if(err){
            alert("An error ocurred updating the file"+ err.message);
            console.log(err);
            return;
        }

        alert("The file has been succesfully saved");
    });
}

function deleteFile(filepath){
    fs.exists(filepath, function(exists) {
        if(exists) {
            // File exists deletings
            fs.unlink(filepath,function(err){
                if(err){
                    alert("An error ocurred updating the file"+ err.message);
                    console.log(err);
                    return;
                }
            });
        } else {
            alert("This file doesn't exist, cannot delete");
        }
    });
}

function readFile(filepath, editor) {
    fs.readFile(filepath, 'utf-8', function (err, data) {
        if(err){
            alert("An error ocurred reading the file :" + err.message);
            return;
        }
        editor.setValue(data);
        // document.getElementById("content-editor").value = data;
        compile(editor);
    });
}


function compile(editor) {
  var code = document.getElementById("code").contentWindow.document;
  var value = editor.getValue();
  code.open();
	code.writeln(value);
// code.writeln(html.value+"<style>"+css.value+"</style>"+"<script>" + js.value + "</script>");
  code.close();
};

function inputTextArea() {
    const textArea = document.getElementById("inputArea");
    textArea.style.height = "auto";
    textArea.style.height = textArea.scrollHeight + "px";
  }

  function displayTextArea() {
    const textArea = document.getElementById("resultDisplay");
    textArea.style.height = "auto";
    textArea.style.height = textArea.scrollHeight + "px";
  }
  function enableEdit() {
    document.getElementById("resultDisplayInput").disabled = false;
    document.getElementById("resultDisplayTextarea").disabled = false;
    document.getElementById("saveButton").style.display = "inline-block";
  }

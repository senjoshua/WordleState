// run when the popup is clicked 
document.addEventListener('DOMContentLoaded', async () => {
  for (let i=0; i<5; i++){
    var span = document.getElementById(i);
    // disable pasting into span
    span.addEventListener('paste', e => e.preventDefault());
    // change tile color when text added
    span.addEventListener('DOMSubtreeModified', function(){
      if(this.innerText){
        this.className = "tile absent";
        this.classList.add('pop');
      }
      else{
        this.className = "tile empty";
      }
    });
    // limit tile to one character
    span.addEventListener('keypress', function(e){
          this.textContent = "";
    });
    // shift focus to next tile
    span.addEventListener('keyup', function(e){
      if((/^[a-z0-9]$/i.test(e.key))){
        let j=i+1;
        while(j<5){
          if(!document.getElementById(j).className.includes("correct")){
            document.getElementById(j).focus(); 
            break;
          }
          j++;
        }
      }
      // shift focus to previous tile
      if(e.key == "Backspace" || e.key == "Delete"){
        document.getElementById(i).innerText = "";
        let j=i-1;
        while(j>=0){
          if(!document.getElementById(j).className.includes("correct")){
            document.getElementById(j).focus(); 
            break;
          }
          j--;
        }
      }
    });
  }
  
  // darkMode check
  document.getElementById("theme").addEventListener("change", function() {
    if (document.getElementById("theme").checked == true) {
      document.body.style.background = "#121213"; 
    } 
    else {
      document.body.style.background = "white"; 
    }
  });

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab.url == "https://www.nytimes.com/games/wordle/index.html") {
      // send message to get state
      await chrome.tabs.sendMessage(tab.id, {}, ({wordleState = {} , darkMode}) => {
        if(wordleState != {}){
          createBoard(wordleState, darkMode);
        }
      });
  }
})

function createBoard(wordleState, darkMode){
  const solved = [null, null, null, null, null];

  boardState = wordleState['boardState'];
  evaluations = wordleState['evaluations'];

  if(darkMode == "true"){
    document.getElementById("theme").checked = true;
  }
  else{
    document.getElementById("theme").checked = false;
    document.body.style.background = "white"; 
  }

  for (let i=0; i<evaluations.length; i++) {
      if(evaluations[i] === null){
          break;
      }
      for (let j=0; j<evaluations[0].length; j++) {
          if(evaluations[i][j] == 'correct'){
              solved[j] = boardState[i].charAt(j).toUpperCase();
              var span = document.getElementById(j);
              span.innerText = solved[j];
              span.className = "tile correct";
              span.classList.add('flip')
              span.setAttribute("contenteditable", false);
          }
      }
  }
}
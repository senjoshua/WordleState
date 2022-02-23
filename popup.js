// run when the popup is clicked 
document.addEventListener('DOMContentLoaded', async () => {
  for (let i=0; i<5; i++){
    var span = document.getElementById(i);
    span.addEventListener('DOMSubtreeModified', function(){
      if(this.innerText.length > 1){
        var c = this.innerText.charAt(this.innerText.length-1);
        this.innerText = c;
      }
      if(this.innerText){
        this.className = "tile absent";
      }
      else{
        this.className = "tile empty";
      }
   });
  }
  
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
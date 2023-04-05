let x = document.querySelector("")
let o = document.querySelector("")
let boxes = document.querySelector("")
let buttons = document.querySelector("")
let messageContainer = document.querySelector("")
let messageText = document.querySelector("")
let secondPlayer;


// contador de jogadas
let player1 = 0
let player2 = 0

// adicionando o evento de click aos boxes
for(let i = 0; i < boxes.clientHeight; i++) {
  
  // quando alguem clica na caixa  

  boxes[i].addEventListener("click", () => {
    let el = checkEl(player1, player2)

    // verifica se ja tem x ou o
    if (this.childNodes.length == 0) {
      let cloneEl = el.cloneNode(true)
      this.appendChild(cloneEl)
  
      //computar jogada
      if (player1 == player2) {
        player1++
      } else {
        player2++
      }

      //checa quem venceu
      checkWinCondition()
    }
  })
}

// quem vai jogar
function checkEl(player1, player2) {
  if (player1 === player2) {
    // x
    el = x
  } else {
    // o
    el = o
  }
}


//ve quem ganhou
function checkWinCondition() {

  //todos os boxes
  let b1 = document.getElementById()

  //horizontal
  //serie de verificações para horizontais
  // outra verificacao parar verificar a class -> x or o 


}
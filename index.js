console.log("AGUSTIN VALINOTI - PROYECTO JAVASCRIPT");

//LLAMADO FETCH LOCAL

const URL = "/data/data.json";

let questionary;

async function localApi() {
  let res = await fetch(URL);
  let data = await res.json();
  questionary = [...data];
  useDataApi(data);
}

localApi();

// ARMANDO EL CUESTIONARIO

function useDataApi() {
  let rightAnswer;                  // DEFINO LA RESPUESTA CORRECTA
  let currentQuestionIndex = 0;     // DEFINO DONDE EMPIEZA LA PRIMERA ENCUESTA
  let rightAnswers = 0;             // DEFINO CANTIDAD DE RESPUESTAS CORRECTAS
  let wrongAnswers = 0;             // DEFINO CANTIDAD DE RESPUESTAS INCORRECTAS
  let timeInterval;
  let time = 10;
  let timeInterval2;
  let ultimaPuntuacion;

    const printHTMLquestion = (i) => { //FUNCION QUE PINTA LA ENCUESTA EN EL DOM
    currentQuestionIndex++; //PASO A LA PROXIMA ENCUESTA SUMANDO 1 AL INDEX
    const q = questionary[i]; //TOMO LA DATA DE LA API
    let a = q.respuesta; //TRAIGO LAS RESPUESTAS
    rightAnswer = a[0]; //DEFINO LA RESPUESTA CORRECTA
    a = a.sort((a,b) => Math.floor(Math.random() * 3) -1); // DANDOLE ALEATORIEDAD A LA VISUALIZACION DE LAS RESPUESTAS

    const htmlAnswersArray = a.map( //RECORRO EL ARRAY DE RESPUESTAS
      (currentA) => `
        <p class="answer"><button class="btnScript" onClick="evaluateAnswer('${currentA}', this)"><span>${currentA}</span></button> </p>
        `
    );
    const htmlAnswers = htmlAnswersArray.join(" "); // LO AGREGO A UNA VARIABLE NUEVA SEPARADO POR ESPACIOS

    let htmlQuestionCode = `<p>${q.pregunta}</p> <img src="${q.img}"/> <div>${htmlAnswers}</div>`; // IMPRIMO EL CUESTIONARIO EN EL DOM
    document.querySelector(".pregunta").innerHTML = htmlQuestionCode;

    time = 10;
    document.querySelector('.time').innerHTML = time
    clearInterval(timeInterval)
    clearInterval(timeInterval2)
    timeInterval = setInterval( () => {
        time--;
        if (time == -1){
            swal("Se acabo el tiempo!", "Pasemos a la siguiente pregunta", {
                buttons: false,
                timer: 3000,
              });
            clearInterval(timeInterval) 
            wrongAnswers++; // SUMO +1 AL CONTADOR
            document.querySelector('.incorrectas').innerHTML = wrongAnswers // IMPRIMO EL CONTADOR
            timeInterval2 = setInterval(() => {printHTMLquestion(currentQuestionIndex);},3000)
        } else {
            document.querySelector('.time').innerHTML = time
        }
    },1000)

    if (currentQuestionIndex == 11) {
      swal(`Terminaste, tu puntaje fue de ${rightAnswers} respuestas correctas`, {
        buttons: {
          inicioBtn: {
            text: "Volver al Inicio",
        }},
        closeOnClickOutside: false,
        closeOnEsc: false,
      }).then(() => {
        window.location = '/index.html'
      });
      clearInterval(timeInterval)
      clearInterval(timeInterval2)
      ultimaPuntuacion = rightAnswers
      sessionStorage.setItem('ultPuntaje', ultimaPuntuacion)
      document.querySelector('.pregunta').style.visibility = 'hidden';
    }
  };

  evaluateAnswer = (answer, obj) => { //FUNCION PARA EVALUAR LAS RESPUESTAS

    document.querySelectorAll(".answer").forEach((a) => a.classList.remove("right", "wrong")); //RECORRO TODAS LAS RESPUESTAS PARA SACAR UNA CLASE U OTRA

    const parentP = obj.parentNode; // SELECCIONO EL NODO PADRE DEL OBJ

    if (answer == rightAnswer) { // CONDICIONAL DE RESPUESTA CORRECTA
      swal("Excelente", "Respuesta correcta!", "success", {
        buttons: false,
        timer: 3000,
        closeOnClickOutside: false,
        closeOnEsc: false,
      }); // AVISO DE RESPUESTA CORRECTA
      rightAnswers++; // SUMO +1 AL CONTADOR DE CORRECTAS
      document.querySelector('.correctas').innerHTML = rightAnswers // IMPRIMO EL CONTADOR
      clearInterval(timeInterval)
      timeInterval2 = setInterval(() => {printHTMLquestion(currentQuestionIndex);},3000)
      
    } else { // CONDICIONAL DE RESPUESTA INCORRECTA
        swal("Ops", "Eso no es correcto!", "error", {
          buttons: false,
          timer: 3000,
          closeOnClickOutside: false,
          closeOnEsc: false,
          });; // AVISO DE RESPUESTA INCORRECTA
      wrongAnswers++; // SUMO +1 AL CONTADOR
      document.querySelector('.incorrectas').innerHTML = wrongAnswers // IMPRIMO EL CONTADOR
      clearInterval(timeInterval)
      timeInterval2 = setInterval(() => {printHTMLquestion(currentQuestionIndex);},3000)
      
    } 
  };
  
  document.querySelector('.record').innerHTML = sessionStorage.getItem('ultPuntaje')
  printHTMLquestion(currentQuestionIndex);
}

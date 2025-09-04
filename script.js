/* Gestione dello slider */

// seleziono tutti gli slider
const sliders = document.querySelectorAll(".slider-anteprime"); //nodelist contenente i 4 div.slider-anteprime

for (var i = 0; i < sliders.length; i++) {
  (function (slider) {
    //slider è il parametro della funzione, rappresenta il singolo elemento della variabile sliders
    //pertanto le seguenti varibili sono variabili locali che selezionano gli elementi dentro ad ogni singolo slider
    //questo serve affinchè al click di un bottone la gestione dello slide sia circoscritta allo slider associato al bottone e non a tutti gli slider
    const track = slider.querySelector(".slider-track"); //contiene tutti i box anteprima
    const left_button = slider.querySelector(".slider-button.left"); //sono i bottoni per gestire lo slide
    const right_button = slider.querySelector(".slider-button.right");

    function aggiornaItemWidth(slider) {
      //questa funzione serve in quanto successivamente alcuni box vengono nascosti e poi fatti apparire di nuovo. inoltre ho intenzione di utilizzare delle mediaquery per adattare la pagina a laptop. in questo modo ogni volta che viene eseguita la funzione, restituisce la larghezza corretta del box anteprima
      const item = slider.querySelector(".box-anteprima");
      return item.offsetWidth + 20; // larghezza box + margine (10+10)
    }

    // Funzione per muovere a destra
    function destra() {
      let itemWidth = aggiornaItemWidth(slider); // ricalcolo ogni volta
      track.style.transition = "transform 0.5s ease"; //permette la transizione fluida ad ogni click (senza questo funzionerebbe per il primo click soltanto)
      track.style.transform = "translateX(-" + itemWidth + "px)"; //il contenitore delle anteprime si muove a sinistra proprio della dimensione del box + margin, espresso in px

      track.addEventListener("transitionend", function interrompi() {
        //questo evento è "la fine della transizione" (sia santificato w3school per questo)

        track.style.transition = "none";
        track.style.transform = "translateX(0)"; //queste due righe servono a riportare la posizione dello slider in posizione originale una volta finita la transizione. questo ci serve perchè immediatamente dopo facciamo cut-copy del box anteprima che abbiamo appena nascosto clickando il bottone. se non avessimo queste 2 righe di codice ci sarebbe un piccolo disastro nelle righe successive

        let primo_box = track.firstElementChild;
        track.appendChild(primo_box);

        //hat-trick per rendere lo slider ciclico. invece di impazzire su come far riapparire la prima anteprima dopo la decima o avere come effetto visivo lo slider che ricomincia da capo, manipolo il DOM spostando l'anteprima appena nascosta in fondo allo slide :)))

        track.removeEventListener("transitionend", interrompi); //per evitare che l'evento di transizione si attivi più volte
      });
    }

    // Funzione per muovere a sinistra (per questo ho dovuto cambiare approccio rispetto alla funzione destra perchè se avessi fatto la stessa cosa l'effetto grafico sarebbe stato pessimo)
    function sinistra() {
      //l'approccio qui è quello di manipolare il DOM come prima cosa, e far partire la transizione solo successivamente, ossia portare l'ultimo box in prima posizione (nascosto a sinistra dello schermo visibile) e poi far partire la transizione.

      let itemWidth = aggiornaItemWidth(slider); // ricalcolo ogni volta

      let ultimo_box = track.lastElementChild;
      track.insertBefore(ultimo_box, track.firstElementChild);

      track.style.transition = "none";
      track.style.transform = "translateX(-" + itemWidth + "px)";

      // il timeout di 20ms serve ad "assestare" la pagina ossia permettere al browser di calcolare il cambio del DOM e successivamente riportare lo slider a posizione X(0). questo crea un illusione di transizione

      setTimeout(function () {
        track.style.transition = "transform 0.5s ease";
        track.style.transform = "translateX(0)";
      }, 20);

      track.addEventListener("transitionend", function interrompi() {
        track.removeEventListener("transitionend", interrompi);
      });
    }

    //gli event listener sui bottoni
    right_button.addEventListener("click", destra);
    left_button.addEventListener("click", sinistra);
  })(sliders[i]); //qui invoco la funzione appena descritta passandogli come parametro lo slider corrente
}

/* Gestione dello slider */

/*gestione popup del video al click sulle anteprime */

const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popup-title");
const popupSinossi = document.getElementById("popup-sinossi");
const popupVideo = document.getElementById("popup-video");
const popupClose = document.querySelector(".close-popup");
const popupGuarda = document.getElementById("popup-guarda");

function apriPopup(titolo, sinossi, videoSrc) {
  popupTitle.textContent = titolo;
  popupSinossi.textContent = sinossi;
  popupVideo.src = videoSrc;
  popupVideo.currentTime = 0; // ripristina primo fotogramma
  popupVideo.loop = false; // toglie il loop dal video
  popupVideo.play();
  popup.classList.add("active"); //reso visibile tramite css
}

// Quando il video termina, rimane sul primo fotogramma
popupVideo.addEventListener("ended", function () {
  popupVideo.currentTime = 0;
  popupVideo.pause();
});

// funzione di chiusura popup
popupClose.addEventListener("click", function () {
  popup.classList.remove("active");
  popupVideo.pause();
  popupVideo.src = "";
});

// Chiudi popup al click fuori
popup.addEventListener("click", function (e) {
  if (e.target == popup) {
    popup.classList.remove("active");
    popupVideo.pause();
    popupVideo.src = "";
  }
});

// Evento click sulle anteprime
const anteprime = document.querySelectorAll(".box-anteprima");

anteprime.forEach(function (box) {
  box.addEventListener("click", function () {
    const titolo = box.querySelector(".titolo-descrizione").textContent;
    const sinossi = box.querySelector(".testo-descrizione").textContent;
    const videoSrc = box.querySelector("video").src;
    apriPopup(titolo, sinossi, videoSrc); //apre il popup con i dati dell'anteprima cliccata
  });
});

// Pulsante "GUARDA ORA" (personalizzabile)
popupGuarda.addEventListener("click", function () {
  alert(
    "Da qui in poi si comunica col backend per aprire la pagina del film o far partire il video"
  );
});

/* Al click di "home" e dell'immagine nel footer si torna su*/

document.getElementById("img-footer").addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth", // scroll rapido e fluido fino al topleft
  });
});
document.getElementById("home").addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
  /*dichiarazione costanti*/
  const accediLabel = document.querySelector('label[for="accesso"]');
  const articlePerte = document.getElementById("perte");
  const articleContinua = document.getElementById("continua");
  const articleMost = document.getElementById("most");
  const articleCartoni = document.getElementById("cartoni");
  /*dichiarazione costanti*/

  // questo if mi serve a capire se l'utente è loggato o no. se è loggato allora il pulsane accedi è nascosto, pertanto al click di home vengono mostrati tutti gli article slider
  if (accediLabel.classList.contains("hidden")) {
    articlePerte.classList.remove("hidden");
    articleMost.classList.remove("hidden");
    articleContinua.classList.remove("hidden");
    articleCartoni.classList.remove("hidden");
  }
});

/* Al click di "home" e dell'immagine nel footer si torna su*/

/* All'aggiornamento della pagina viene selezionato un video a caso da quelli già visibili e diventa anteprima hero. alla fine del video la funzione si ripete*/

function selezione_video_casuale() {
  // Cerca solo slider dentro ad articoli visibili (senza .hidden)
  let sliders = document.querySelectorAll(
    "article:not(.hidden) .slider-anteprime"
  );

  let randomSlider = sliders[Math.floor(Math.random() * sliders.length)];
  let videos = randomSlider.querySelectorAll(".video-anteprima");

  let randomVideo = videos[Math.floor(Math.random() * videos.length)];
  let box = randomVideo.closest(".box-anteprima");
  //la funzione restituisce un oggetto con le proprietà src, titolo e descrizione del video selezionato casualmente. successivamente queste proprietà verranno usate per essere iniettate nell'anteprima hero
  return {
    src: randomVideo.getAttribute("src"),
    titolo: box.querySelector(".titolo-descrizione").textContent,
    descrizione: box.querySelector(".testo-descrizione").textContent,
  };
}

document.addEventListener("DOMContentLoaded", function () {
  const heroVideo = document.querySelector("#hero video.vetrina");
  const heroContent = document.querySelector("#hero .content");

  function cambiaVideo() {
    heroVideo.style.transition = "opacity 0.3s ease";
    heroContent.style.transition = "opacity 0.3s ease";
    heroVideo.style.opacity = 0;
    heroContent.style.opacity = 0;

    setTimeout(function () {
      let randomVideo = selezione_video_casuale();

      heroVideo.setAttribute("src", randomVideo.src);
      heroVideo.load();
      heroVideo.play();

      heroContent.querySelector("h1").textContent = randomVideo.titolo;
      heroContent.querySelector("p").textContent = randomVideo.descrizione;

      heroVideo.style.opacity = 1;
      heroContent.style.opacity = 1;
    }, 200);
  }

  // richiamo la funzione al caricamento della pagina per inserire da subito un video nell'hero
  cambiaVideo();

  // Quando finisce un video nell'hero finisce viene richiamato un altro video
  heroVideo.addEventListener("ended", cambiaVideo);

  // MutationObserver: controlla gli article
  /* NOTA BENE:
  non conoscevo questa funzione e l'ho trovata su w3 al link https://www.w3schools.com/jsref/jsref_event.asp mentre cercavo un modo per far sì che ogni volta che un article venisse nascosto o mostrato (ossia al click sui bottoni della navbar) venisse aggiornato il video nell'hero.
  purtroppo w3 non spiega bene questa funzione, per cui ho fatto delle ricerche e ho provato a studiarla su https://it.javascript.info/mutation-observer
  ammetto che su questa funzione mi sono fatto aiutare da chatgpt perchè non sapevo come gestirne la sintassi */
  let observer = new MutationObserver(function (mutations) {
    for (let i = 0; i < mutations.length; i++) {
      let mutation = mutations[i];
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        cambiaVideo(); // ogni volta che cambia la classe hidden, il mutationobserver se ne accorge e aggiorna il video
      }
    }
  });

  // Attiva observer su tutti gli article
  let articles = document.querySelectorAll("article");
  for (let j = 0; j < articles.length; j++) {
    observer.observe(articles[j], { attributes: true });
  }
});
/* All'aggiornamento della pagina viene selezionato un video a caso e diventa anteprima hero*/

/* Gestione della simulazione log in*/

document.addEventListener("DOMContentLoaded", function () {
  //dichiarazione variabili
  const loginForm = document.querySelector(".login-popup form");

  const hiddenButtons = document.querySelectorAll(".bottone.hidden");

  const avatar = document.getElementById("avatar");
  const avatarMenu = document.getElementById("avatar-menu");
  const avatarImg = document.querySelector("#avatar img");

  const accediLabel = document.getElementById("btnAccedi");

  // gestione menu avatar
  avatar.addEventListener("click", function () {
    avatarMenu.classList.toggle("hidden"); // apre/chiude al click
  });

  // gestione bottone login
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault(); // evita refresh pagina

    // Mostra bottoni
    hiddenButtons.forEach(function (btn) {
      btn.classList.remove("hidden");
    });

    // Facendo login mostriamo gli articoli "Per te" e "Continua a guardare" che simulano il fatto che l'utente ha una cronologia di visione
    document.getElementById("perte").classList.remove("hidden");
    document.getElementById("continua").classList.remove("hidden");

    // chiusura popup login
    document.getElementById("accesso").checked = false; //ps non farò mai più gestione dei popup metà e metà js e css sono impazzito

    // Nascondi pulsante Accedi
    accediLabel.classList.add("hidden");

    // Mostra avatar
    avatarImg.classList.remove("hidden");
  });

  // gestione bottone logout
  document.getElementById("logout").addEventListener("click", function () {
    // al logout nascondiamo i bottoni e gli article che simulano la cronologia di visione
    document.getElementById("perte").classList.add("hidden");
    document.getElementById("continua").classList.add("hidden");

    // nascondiamo i bottoni che simulano le sezioni associate al profilo
    ["film", "serie", "bambini"].forEach(function (id) {
      let btn = document.getElementById(id);
      btn.classList.add("hidden");
    });

    //le prossime righe servono a resettare il form del login
    avatarImg.classList.add("hidden");
    accediLabel.classList.remove("hidden");
    avatarMenu.classList.add("hidden");
  });
});
/* Gestione della simulazione log in*/

/* Gestione dei pulsanti della navbar */

/*dichiarazione costanti*/
const accediLabel = document.querySelector('label[for="accesso"]');
const articlePerte = document.getElementById("perte");
const articleContinua = document.getElementById("continua");
const articleMost = document.getElementById("most");
const articleCartoni = document.getElementById("cartoni");
/*dichiarazione costanti*/

/* Gestione del pulsante Bambini */

document.addEventListener("DOMContentLoaded", function () {
  const liBambini = document.querySelector("li#bambini");

  liBambini.addEventListener("click", function () {
    // prendi tutti gli article
    const articles = document.querySelectorAll("article");

    // aggiungi hidden a tutti gli article
    articles.forEach(function (article) {
      article.classList.add("hidden");
    });

    // togli hidden solo all'article #cartoni in modo che appaia solo quello
    const targetArticle = document.querySelector("article#cartoni");
    targetArticle.classList.remove("hidden");
  });
});

/* Gestione del pulsante Bambini */

/* Gestione dei pulsanti Film, SerieTV */

document.addEventListener("DOMContentLoaded", function () {
  const btnFilm = document.getElementById("film");
  const btnSerie = document.getElementById("serie");

  btnFilm.addEventListener("click", function () {
    articlePerte.classList.remove("hidden");
    articleMost.classList.remove("hidden");

    articleContinua.classList.add("hidden");
    articleCartoni.classList.add("hidden");
  });

  btnSerie.addEventListener("click", function () {
    articleContinua.classList.remove("hidden");
    articleMost.classList.remove("hidden");

    articlePerte.classList.add("hidden");
    articleCartoni.classList.add("hidden");
  });
});

/* Gestione dei pulsanti Film, SerieTV */

/* Gestione dei pulsanti della navbar */

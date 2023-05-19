//import "https://unpkg.com/navigo" //Will create the global Navigo object used below
import "./navigo_EditedByLars.js"; //Will create the global Navigo, with a few changes, object used below
//import "./navigo.min.js" //Will create the global Navigo object used below

import {
  setActiveLink,
  adjustForMissingHash,
  renderTemplate,
  loadTemplate,
  handleHttpErrors
} from "./utils.js";

import { API_URL } from "./settings.js";

import { initEvents } from "./pages/events/events.js";
import { initNews } from "./pages/news/news.js";

window.addEventListener("load", async () => {
  const templateEvents = await loadTemplate("./pages/events/events.html");
  const templateServices = await loadTemplate("./pages/services/services.html");
  const templateAbout = await loadTemplate("./pages/about/about.html");
  const templateNews = await loadTemplate("./pages/news/news.html");

  adjustForMissingHash();
  const router = new Navigo("/", { hash: true });
  //Not especially nice, BUT MEANT to simplify things. Make the router global so it can be accessed from all js-files
  window.router = router;

  router
    .hooks({
      before(done, match) {
        setActiveLink("menu", match.url);
        done();
      },
    })
    .on({
      "/events": () => {
        renderTemplate(templateEvents, "content");
        document.getElementById("title").innerText = "Events";
        document.getElementById("news-box").style.display = "none";
        document.getElementById("second-hand").style.display = "none";
        document.getElementById(
          "top-box"
        ).style.backgroundImage = `url("./images/bar2.png")`;
        document.getElementById("top-box").style.height = "15%";
        document.getElementById("top-box").style.backgroundSize = "cover";
        document.getElementById("top-box").style.backgroundPosition =
          "center 65%";
        initEvents();
      },
      "/services": () => {
        renderTemplate(templateServices, "content");
        document.getElementById("title").innerText = "Services";
        document.getElementById("news-box").style.display = "none";
        document.getElementById("second-hand").style.display = "none";
        document.getElementById(
          "top-box"
        ).style.backgroundImage = `url("./images/butik.png")`;
        document.getElementById("top-box").style.backgroundSize = "cover";
      },
      "/about": () => {
        renderTemplate(templateAbout, "content");
        document.getElementById("title").innerText = "Om os";
        document.getElementById("title").style.paddingTop = "0.5%";
        document.getElementById("news-box").style.display = "none";
        document.getElementById("second-hand").style.display = "none";
        document.getElementById(
          "top-box"
        ).style.backgroundImage = `url("./images/about3.png")`;
        document.getElementById("top-box").style.backgroundSize = "cover";
        document.getElementById("top-box").style.backgroundPosition =
          "center 89%";
        document.getElementById("top-box").style.height = "9.1vw";
      },
      "/news": (match) => {
        renderTemplate(templateNews, "content");
        initNews(1, match);
        document.getElementById("title").innerText = "Nyheder";
        document.getElementById("news-box").style.display = "none";
        document.getElementById("second-hand").style.display = "none";
        document.getElementById("top-box").style.height = "15%";
        document.getElementById(
          "top-box"
        ).style.backgroundImage = `url("./images/news2.png")`;
        document.getElementById("top-box").style.backgroundSize = "cover";
        document.getElementById("top-box").style.backgroundPosition = "center";
      },
    })
    .notFound(() => {})
    .resolve();

  window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
    alert(
      "Error: " +
        errorMsg +
        " Script: " +
        url +
        " Line: " +
        lineNumber +
        " Column: " +
        column +
        " StackTrace: " +
        errorObj
    );
  };
});

getNews();

async function getNews(){
  const data = await fetch(API_URL + "news/?unpaged").then(handleHttpErrors);
  data.sort((a, b) => a.priority - b.priority);

  document.getElementById('news-headline').innerText = data[0].headline;
  document.getElementById('news-text').innerText = data[0].textField;
  document.getElementById("news-img").src="data:image/jpeg;base64,"+data[0].encodedImage;
}
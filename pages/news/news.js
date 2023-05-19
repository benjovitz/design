import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js";
import { API_URL } from "../../settings.js";
import { paginator } from "../../lib/paginator/paginate-bootstrap.js";

let URL = API_URL+"/news/"
const SIZE = 3

export async function initNews(pg,match){
    await getNews(pg, match)



    const clickableRows = document.querySelectorAll('.clickable-row');
    var popupClose = document.querySelector('.popup-close');

    clickableRows.forEach(row => {
        const newsId = row.dataset.eventId;

        row.addEventListener('click', () => {
            handleClick(newsId);
        });
    });

    popupClose.addEventListener('click', function() {
        document.getElementById("popup").style.display = 'none';
    });
}


    async function getNews(pg,match){
        const TOTAL = await getNewsTotal()

        const p = match?.params?.page || pg 
        let pageNo = Number(p)
        let queryString =  `?sort=priority,asc&size=${SIZE}&page=` + (pageNo-1)
        let navigoRef = `/news/?page=` + (pageNo)

        try {
            const news = await fetch(URL+queryString).then(handleHttpErrors)
            makeNewsRows(news)
        } catch (error) {
            console.log(error)
        }

        paginator({
            target: document.getElementById("news-paginator"),
            total: TOTAL,
            current: pageNo,
            click: getNews
          })

        window.router?.navigate(`/${navigoRef}`, { callHandler: false, updateBrowserURL: true })

    }

    function makeNewsRows(news) {
        const newsRows = news.map(singleNews => `
        <div class="row clickable-row" data-event-id="${singleNews.id}" style="max-height: 410px; border-top: solid; padding-bottom: 5px; padding-left: 5px">
            <div class="row">
            <div class="col-4" style="padding-top: 5px">
                <img src="data:image/jpeg;base64,${singleNews.encodedImage}" style="width: 100%; max-height: 25vw; max-width: 400px; border: 1px solid black; object-fit: cover; object-position: top">
            </div>
            <div class="col-8" style="padding-top: 1.7vw">
            <div class="row">
            <div class="col">
            <h3 style="text-align: center; font-size: 2.5vw;"><b>${singleNews.headline}</b></h3>
</div>
</div>
<div class="row">
<h3 class="text-container" style="font-size: 1.2vw;padding-top: 0.5vw">${singleNews.textField}</h3>
</div>

            </div>
            </div>
        </div>
    `)
        const sanitizedNewsRows = sanitizeStringWithTableRows(newsRows.join(''))
        document.getElementById("news-rows").innerHTML = sanitizedNewsRows
    }

async function handleClick(newsId) {
    try {
        const singleNews = await fetch(URL + newsId).then(handleHttpErrors)
        setUpNewsSite(singleNews)
        document.getElementById("popup").style.display ="block"
    } catch (error) {
        console.log(error)
    }
}

function setUpNewsSite(singleNews) {
    const newsSite = `
            <div class="row">
                <div class="col-6">
                <img src="data:image/jpeg;base64,${singleNews.encodedImage}" style="width: 100%; object-fit: none; object-position: top; max-height: 21vw; border: 1px solid black; object-fit: cover;">
                </div>
                <div class="col-6">
                    <h3 style="padding-top: 6.5vw; text-align: center; font-size: 3.2vw;"><b>${singleNews.headline}</b></h3>
                </div>
            </div>
            <div style="padding-top: 1.7vw">
                <p style="font-size: 1.3vw">${singleNews.textField}</p>
            </div>
    `
    document.getElementById("popup-content").innerHTML = sanitizeStringWithTableRows(newsSite);
}

async function getNewsTotal(){
    try{
        const response = await fetch(URL+"total")
        .then(handleHttpErrors)
        
        if(response<SIZE){
            return 1
        }
  
        return Math.ceil(response/ SIZE)
  
    }catch(err){
        document.getElementById("error-text").innerText = err.message
    }
  }
import axios from 'axios';

const pageBase = 'https://nytcrosswordanswers.org/wp-json/wp/v2/posts?f=b&slug=nyt-crossword-answers-'

function loadPage(date=null) {
    clearPage();

    if (date == null) {
        date = new Date();
    }
    const convertedDate = convertDate(date);
    document.getElementById('date').innerText = convertedDate;

    const page = pageBase + convertedDate;
    console.log(`Requesting from page ${page}`);

    const dummyDom = document.createElement('div');
    axios.get(page)
        .then(res => {
            const content = res.data[0].content.rendered;
            dummyDom.innerHTML = content;
            const [ answersAcross, answersVertical ] = answerTables(dummyDom);

            const across = answerTableHtml(answersAcross, 'Across');
            const vertical = answerTableHtml(answersVertical, 'Vertical');

            const answersContainer = document.getElementById('answers-container');
            answersContainer.appendChild(across);
            answersContainer.appendChild(vertical);

            [...answersContainer.getElementsByTagName('a')].forEach(e => e.removeAttribute('href'));
        })
}

function clearPage() {
    document.getElementById('answers-container').innerHTML = '';
}

function pad(n) {
    return n < 10 ? '0' + n : n;
}

function convertDate(isoDate) {
    // This stupid solution brought to you by iOS Safari
    if (!(isoDate instanceof Date)) {
        const datePieces = isoDate.split(/[- :]/);
        console.log(datePieces[0], datePieces[1]-1, datePieces[2], datePieces[3], datePieces[4], datePieces[5]);
        isoDate = new Date(datePieces[0], datePieces[1]-1, datePieces[2], datePieces[3], datePieces[4], datePieces[5]);
    }

    const day = pad(isoDate.getDate());
    const month = pad(isoDate.getMonth() + 1);
    const year = isoDate.getFullYear().toString().slice(2);
    return [month, day, year].join('-');
}

function convertDateHtml(isoDate) {
    const usaDate = convertDate(isoDate);
    const [ month, day, ] = usaDate.split('-');
    const year = isoDate.getFullYear().toString();
    return [year, month, day].join('-');
}

function answerTables(pageContent) {
    return [...pageContent.getElementsByTagName('ul')];
}

function answerTableHtml(answerTable, name) {
    const container = document.createElement('div');
    const header = document.createElement('h4');
    header.innerText = name;
    container.appendChild(header);

    container.setAttribute('class', 'answers');
    container.appendChild(answerTable);

    const answers = answerTable.getElementsByTagName('li');
    [...answers].forEach(answer => {
        answer.onclick = () => {
            answer.getElementsByTagName('span')[0].classList.toggle('visible');
        };
    });
    
    return container;
}

function setUpComponents() {
    let date = new Date();
    const htmlDate = convertDateHtml(date);

    const dateChangeInput = document.getElementById('change-date-input');
    dateChangeInput.setAttribute('max', htmlDate);
    
    loadPage(date);

    document.getElementById('change-date-form').onsubmit = e => {
        e.preventDefault();
        date = `${dateChangeInput.value} 00:00:00`;
        loadPage(date);
    }

    document.getElementsByTagName
}

setUpComponents()
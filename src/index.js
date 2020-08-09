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

            document.getElementById('answers-container').appendChild(across);
            document.getElementById('answers-container').appendChild(vertical);
        })
}

function clearPage() {
    document.getElementById('answers-container').innerHTML = '';
}

function pad(n) {
    return n < 10 ? '0' + n : n;
}

function convertDate(isoDate) {
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
    
    return container;
}

function setUpComponents() {
    let date = new Date();
    const htmlDate = convertDateHtml(date);

    const dateChangeInput = document.getElementById('change-date-input');
    dateChangeInput.setAttribute('max', htmlDate);
    
    loadPage(date);

    const dateChangeForm = document.getElementById('change-date-form');
    dateChangeForm.onsubmit = e => {
        e.preventDefault();
        date = new Date(`${dateChangeInput.value} 00:00`);
        loadPage(date);
    }
}

setUpComponents()
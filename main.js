// declare all variables
const apiKey = 'fed644cd';
const searchBtn = document.getElementById('search-btn');
const input = document.getElementById('input');
const container = document.querySelector('.container');
const results = document.querySelector('.results');
let display ='series';
let id = '';
let episodeRatings = [];
let chart = document.getElementById('myChart');
chart.style.display = 'none';

const xlabels = [];
const chartData = [];
const epName = [];

// add search button event listener
searchBtn.addEventListener('click', searchResults);

async function searchResults() {
    const response = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${input.value}`);
    const data = await response.json();
    input.value = '';
    //converts results to series only
    const seriesOnly = data.Search.filter(result => {
        return result.Type === 'series' 
    });
    console.log(seriesOnly);

    // display results of search
    for (let i = 0; i<seriesOnly.length; i++ )
    results.innerHTML += `
        <div class ="sub"id="${seriesOnly[i].imdbID}">${seriesOnly[i].Title} (${seriesOnly[i].Year})</div>
    `
    // add display seasons of series event listener
    results.addEventListener('click', function(e){
        // event delegation for display === 'series'
        if(e.target && e.target.nodeName == "DIV" && display==='series') {
            async function displaySeasons() {
                const response = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${e.target.id}`);
                const data = await response.json();
                console.log(data);
                id = e.target.id;
                results.innerHTML = '<div>Season:</div>';
                for (let i = 0; i < data.totalSeasons; i++){
                    results.innerHTML += 
                    `
                        <span class="sub seasons"id="${i+1}">${i+1}</span>
                    `
                }
            }
            displaySeasons();
            display = 'seasons';
        }
        // event delegation for display === 'seasons'
        else if(e.target && e.target.nodeName == "SPAN" && display==='seasons') {
            async function displayEpisodes() {
                const response = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${id}&Season=${e.target.id}`);
                const data = await response.json();
                console.log(data);
                results.innerHTML = '';
                for (let i = 0; i < data.Episodes.length; i++){
                    // results.innerHTML += 
                    // `
                    //     <div>Episode ${i+1} "${data.Episodes[i].Title}": ${data.Episodes[i].imdbRating}</div>
                    // `

                    episodeRatings.push({
                        'episode': data.Episodes[i].Episode,
                        'name': data.Episodes[i].Title,
                        'rating': data.Episodes[i].imdbRating,
                });
                }
                // sort
                // episodeRatings.sort(function(a,b) {
                //     return b.rating - a.rating;
                // })

                for (let i = 0; i < data.Episodes.length; i++){
                    // results.innerHTML += 
                    // `
                    //     <div>Episode: ${episodeRatings[i].episode} "${episodeRatings[i].name}": ${episodeRatings[i].rating}</div>
                    // `
                  xlabels.push(`ep${episodeRatings[i].episode} "${episodeRatings[i].name}"`);
                  chartData.push(episodeRatings[i].rating);
                }
            chart.style.display = 'block';
            }
            displayEpisodes();
            display = 'ratings';
            chartIt();


        }
    })
}




function chartIt() {
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: xlabels,
            datasets: [{
                label: 'Rating',
                data: chartData,
                backgroundColor: [


                ],
                borderColor: [

                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

}
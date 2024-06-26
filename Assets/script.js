google.charts.load('current', {'packages':['corechart']});

let currentRound = 0;
let totalCorrect = 0;  // Track the total number of correct guesses
let totalGuesses = 0;  // Track the total number of guesses
let teamLogos = {};    // Store team logos fetched from the API

const rounds = [
  
      // Round 1
    [
        {id: 1, team1: 'Palmeiras', team2: 'Cuiabá', correctOutcome: 'team1'},
        {id: 2, team1: 'América-MG', team2: 'Fluminense', correctOutcome: 'team2'},
        {id: 3, team1: 'Botafogo', team2: 'São Paulo', correctOutcome: 'team1'}
    ],
    // Round 2
    [
        {id: 4, team1: 'Atlético Mineiro', team2: 'Coritiba', correctOutcome: 'team1'},
        {id: 5, team1: 'Santos', team2: 'Fortaleza', correctOutcome: 'team1'},
        {id: 6, team1: 'Internacional', team2: 'Red Bull Bragantino', correctOutcome: 'draw'},
        {id: 7, team1: 'Avaí', team2: 'Athletico Paranaense', correctOutcome: 'draw'},
        {id: 8, team1: 'Bahia', team2: 'Ceará', correctOutcome: 'team1'},
        {id: 9, team1: 'Cruzeiro', team2: 'Flamengo', correctOutcome: 'draw'},
        {id: 10, team1: 'Coritiba', team2: 'Vasco da Gama', correctOutcome: 'team1'}
    ],
    // Round 3
    [
        {id: 11, team1: 'Fluminense', team2: 'Atlético Goianiense', correctOutcome: 'draw'},
        {id: 12, team1: 'São Paulo', team2: 'Goiás', correctOutcome: 'draw'},
        {id: 13, team1: 'Fortaleza', team2: 'Juventude', correctOutcome: 'team1'},
        {id: 14, team1: 'Red Bull Bragantino', team2: 'Bragantino', correctOutcome: 'team1'},
        {id: 15, team1: 'Ceará', team2: 'América-MG', correctOutcome: 'draw'},
        {id: 16, team1: 'Flamengo', team2: 'Avaí', correctOutcome: 'team1'},
        {id: 17, team1: 'Vasco da Gama', team2: 'Santos', correctOutcome: 'team1'},
        {id: 18, team1: 'Athletico Paranaense', team2: 'Bahia', correctOutcome: 'team1'},
        {id: 19, team1: 'Palmeiras', team2: 'Cruzeiro', correctOutcome: 'team1'}
    ]

];

document.addEventListener('DOMContentLoaded', function() {
    fetchTeamLogos();
    document.getElementById('startGame').addEventListener('click', startGame);
});

function fetchTeamLogos() {
    const apiUrl = 'https://api.football-data.org/v2/competitions/BSA/teams';
    fetch(apiUrl, {
        headers: { 'X-Auth-Token': '51ef7437f1c74894876fccd2f0373d15' }
    })
    .then(response => response.json())
    .then(data => {
        data.teams.forEach(team => {
            teamLogos[team.name] = team.crestUrl; // Map team names to logo URLs
        });
    })
    .catch(error => console.error('Failed to fetch team logos:', error));
}

function startGame() {
    this.style.display = 'none';  // Hide the start game button
    loadRound();
}

function loadRound() {
    const matches = rounds[currentRound];
    let matchHtml = `<h2>Round ${currentRound + 1}</h2>`;
    matches.forEach(match => {
        const homeLogo = teamLogos[match.team1] || 'path_to_default_logo.png';
        const awayLogo = teamLogos[match.team2] || 'path_to_default_logo.png';

        matchHtml += `
            <div class="match">
                <div class="match-header">
                    <img src="${homeLogo}" alt="${match.team1}" class="team-logo">
                    ${match.team1} vs ${match.team2}
                    <img src="${awayLogo}" alt="${match.team2}" class="team-logo">
                </div>
                <div class="match-body" id="match_${match.id}">
                    <button onclick="selectOutcome(${match.id}, 'team1')">Home Win</button>
                    <button onclick="selectOutcome(${match.id}, 'draw')">Draw</button>
                    <button onclick="selectOutcome(${match.id}, 'team2')">Away Win</button>
                </div>
            </div>
        `;
    });
    matchHtml += '<button onclick="submitGuesses()">Submit Guess</button>';
    document.getElementById('matches').innerHTML = matchHtml;
}

function selectOutcome(matchId, outcome) {
    const matchElement = document.getElementById(`match_${matchId}`);
    Array.from(matchElement.children).forEach(child => {
        child.classList.remove('selected');
    });
    document.querySelector(`#match_${matchId} [onclick="selectOutcome(${matchId}, '${outcome}')"]`).classList.add('selected');
}

function submitGuesses() {
    let resultsHtml = '<h2>Results</h2>';
    let roundCorrect = 0;
    rounds[currentRound].forEach(match => {
        const matchElement = document.getElementById(`match_${match.id}`);
        const selectedElement = matchElement.querySelector('.selected');
        let userGuess = null;

        if (selectedElement) {
            userGuess = selectedElement.classList.contains('team-logo') ? 
                        (selectedElement.alt === match.team1 ? 'team1' : 'team2') :
                        'draw';
        }

        const result = userGuess === match.correctOutcome ? 'Correct' : 'Wrong';
        resultsHtml += `<p>${match.team1} vs ${match.team2}: Your guess was ${result}.</p>`;
        if (result === 'Correct') roundCorrect++;
    });
    totalCorrect += roundCorrect;
    totalGuesses += rounds[currentRound].length;
    document.getElementById('results').innerHTML = resultsHtml;

    if (currentRound + 1 < rounds.length) {
        document.getElementById('matches').innerHTML += '<button onclick="nextRound()">Next Round</button>';
    } else {
        document.getElementById('matches').innerHTML += '<button onclick="displayFinalResults()">See Final Score</button>';
    }
}

function nextRound() {
    currentRound++;
    document.getElementById('results').innerHTML = '';
    loadRound();
}

function displayFinalResults() {
    let winningPercentage = (totalCorrect / totalGuesses) * 100;
    document.getElementById('matches').innerHTML = `
        <h2>Game Over! Here are your results:</h2>
        <p>Total Guesses: ${totalGuesses}</p>
        <p>Correct Guesses: ${totalCorrect}</p>
        <p>Winning Percentage: ${winningPercentage.toFixed(2)}%</p>
        <div id="chart_div" style="width: 400px; height: 300px;"></div>
    `;
    google.charts.setOnLoadCallback(drawChart);
}

function drawChart() {
    let winningPercentage = (totalCorrect / totalGuesses) * 100;
    var data = google.visualization.arrayToDataTable([
        ['Result', 'Percentage'],
        ['Correct', winningPercentage],
        ['Incorrect', 100 - winningPercentage],
    ]);

    var options = {
        title: 'Winning Percentage',
        pieHole: 0.4,
        colors: ['#8BC34A', '#f44336'],
    };

    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

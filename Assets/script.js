google.charts.load('current', {'packages':['corechart']});

let currentRound = 0;
let totalCorrect = 0;
let totalGuesses = 0;

const rounds = [
    // Include your round data here as previously defined
];

document.getElementById('startGame').addEventListener('click', startGame);

function startGame() {
    this.style.display = 'none';
    loadRound();
}

function loadRound() {
    const matches = rounds[currentRound];
    let matchHtml = `<h2>Round ${currentRound + 1}</h2>`;
    matches.forEach(match => {
        matchHtml += `
            <div class="match">
                <div class="match-header">${match.team1} vs ${match.team2}</div>
                <div class="match-body" id="match_${match.id}">
                    <img src="team1_logo.png" alt="${match.team1}" class="team-logo" onclick="selectOutcome(${match.id}, 'team1')">
                    <div class="draw" onclick="selectOutcome(${match.id}, 'draw')">X</div>
                    <img src="team2_logo.png" alt="${match.team2}" class="team-logo" onclick="selectOutcome(${match.id}, 'team2')">
                </div>
            </div>
        `;
    });
    matchHtml += '<button onclick="submitGuesses()">Submit Guess</button>';
    document.getElementById('matches').innerHTML = matchHtml;
}

function selectOutcome(matchId, outcome) {
    const matchElement = document.getElementById(`match_${matchId}`);
    Array.from(matchElement.children).forEach(child => child.classList.remove('selected'));
    document.querySelector(`#match_${matchId} [onclick="selectOutcome(${matchId}, '${outcome}')"]`).classList.add('selected');
}

function submitGuesses() {
    let resultsHtml = '<h2>Results</h2>';
    let roundCorrect = 0;
    rounds[currentRound].forEach(match => {
        const matchElement = document.getElementById(`match_${match.id}`);
        const selectedElement = matchElement.querySelector('.selected');
        let userGuess = selectedElement ? selectedElement.getAttribute('onclick').split("'")[3] : null;
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
    google.charts.setOnLoadCallback(() => drawChart(winningPercentage));
}

function drawChart(winningPercentage) {
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

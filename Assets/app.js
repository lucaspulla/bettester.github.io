let currentRound = 0;
let totalCorrect = 0;
let totalGuesses = 0;

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
    // Round 
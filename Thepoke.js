const pokemonCache = {};   // This will cache objects to store previously fetched pokemon data

let currentPokemon = null;// Stores the current pokemon details for adding to the team

const findBtn = document.getElementById('findBtn');// The DOM Elements
const addBtn = document.getElementById('addBtn');
const pokeInput = document.getElementById('pokeInput');
const pokeImage = document.getElementById('pokeImage');
const pokeAudio = document.getElementById('pokeAudio');
const moveSelects = [
    document.getElementById('move1'),
    document.getElementById('move2'),
    document.getElementById('move3'),
    document.getElementById('move4')
];
const teamTableBody = document.querySelector('#teamTable tbody');

findBtn.addEventListener('click', async () => {// This is the event listener for the find button
    const query = pokeInput.value.trim().toLowerCase();
    if (!query) return;

    if (pokemonCache[query]) {                 // Will check if data is already in the cache
        console.log("Loading from cache:", query);
        updateUI(pokemonCache[query]);
    } else {
        console.log("Fetching from API:", query);
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`); //Please work lol
            
            if (!response.ok) {                // Added for a failed serch
                throw new Error('Pokemon not found');
            }
            
            const data = await response.json();
            
            pokemonCache[query] = data;        // Saves to cache for future requests
            
            updateUI(data);
        } catch (error) {
            alert('Could not find that Pokemon. Please check the Name or ID.');
            console.error(error);
        }
    }
});

function updateUI(data) {                      // Function needed to update the DOM with fetched data
    const spriteUrl = data.sprites.front_default;     // Will first update Image
    pokeImage.src = spriteUrl;
    pokeImage.style.display = 'block';

    const audioUrl = data.cries.latest;        // Next will update Audio
    pokeAudio.src = audioUrl;

    const moveNames = data.moves.map(m => m.move.name);// Lastlestly updates moves thats a dropdown 
    
    moveSelects.forEach(select => {
        select.innerHTML = '';                 // Clears out old options
        
        moveNames.forEach(move => {
            const option = document.crea       // Adds new option
            option.value = move;
            option.textContent = move;
            select.appendChild(option);
        });
    });

    currentPokemon = {                          // Saves the state for the "Add to Team" button
        sprite: spriteUrl
    };
}

addBtn.addEventListener('click', () => {        // The event listener for the Add to Team button
    if (!currentPokemon) {
        alert("Please find a Pokemon first!");
        return;
    }

    const selectedMoves = moveSelects.map(select => select.value); // Gets the selected moves

    const row = document.createElement('tr');   // Creates a new table row

    const spriteCell = document.createElement('td'); // Creates cell for the sprite
    spriteCell.className = 'team-sprite-cell';
    const img = document.createElement('img');
    img.src = currentPokemon.sprite;
    spriteCell.appendChild(img);

    const movesCell = document.createElement('td');// Creates cell for the Moves List
    movesCell.className = 'team-moves-cell';
    const ul = document.createElement('ul');
    
    selectedMoves.forEach(move => {
        const li = document.createElement('li');
        li.textContent = move;
        ul.appendChild(li);
    });
    movesCell.appendChild(ul);

    row.appendChild(spriteCell);// fianllly will append cells to row, and row to table body
    row.appendChild(movesCell);
    teamTableBody.appendChild(row);
});
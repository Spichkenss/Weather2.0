// Обращаемся к полю ввода и сохраняем его в соответствующую переменную
const search = document.querySelector('.search-input input');
const matchList = document.querySelector('.match-list');

const searchStates = async searchText => {
    const cities = await fetch('cities.json');
    const citiesJSON = await cities.json();
    
    let matches = citiesJSON.filter(state => {
        const regex = new RegExp(`^${searchText}`, 'gi');
        return state.name.match(regex);
    });


    if (searchText.length === 0){
        matches = [];
        matchList.innerHTML = "";
    }
    outputHTML(matches);
};


const outputHTML = matches => {

    if (matches.length > 0 && matches.length < 100) {
        const html = matches.map(match =>
        `
                <div class="match">
                    ${match.name}
                </div>
        `);
        matchList.innerHTML = html.join('');
    }
}

search.addEventListener('input', () => searchStates(search.value));
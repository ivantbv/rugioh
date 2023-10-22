import { RenderCards } from "./renderCards.js";
const renderCards = new RenderCards();

renderCards.loadCardsData().then(data => {

          const searchCards = new SearchCards(data); //Create an instance of SearchCards and pass the data
          searchCards.search();
          renderCards.searchCards = searchCards;
        });

class SearchCards {
    constructor(allCards) {
        this.allCards = allCards;
        this.searchRes = [];
    }

    search() {
        const searchContainer = renderCards.createElemWithClass('div', 'search-container');
        const searchBar = renderCards.createElemWithClass('input', 'search-cards');
        const searchBtn = renderCards.createElemWithClass('button', 'search-cards-btn');
        const numberOfFoundCards = renderCards.createElemWithClass('div', 'found-cards-div');
        const resetSearchBtn = renderCards.createElemWithClass('button', 'reset-search-btn');

        resetSearchBtn.textContent = 'Reset Search';
        searchBtn.textContent = 'Search';
        searchBar.setAttribute('type', 'text');
        searchBar.placeholder = 'Type to search cards...';
        searchContainer.append(searchBar, searchBtn, numberOfFoundCards);
        const body = document.querySelector('body');
        body.append(searchContainer);

        searchBtn.addEventListener('click', () => {
            const scrollPosition = renderCards.cardsList.scrollTop;
            renderCards.currentPage = 1;
            renderCards.cardsList.scrollTop = 0;
            renderCards.appendCards(renderCards.currentPage, renderCards.allCards);
            const searchStr = searchBar.value.toLowerCase();
            while (renderCards.cardsList.hasChildNodes()) {
                renderCards.cardsList.removeChild(renderCards.cardsList.firstChild);
              }
            //add a check for radio buttons "search within the current results", "search all cards"
            //after the initial search - buttons will show in the DOM and the marker will be placed
            //on the "search withint current results"
            const searchRes = this.allCards.filter(card => 
                card.name.toLowerCase().includes(searchStr) || 
                card.effectText.toLowerCase().includes(searchStr));
            this.searchRes = searchRes;
            renderCards.allCards = searchRes;

            if (searchRes.length < 1) {
                while (renderCards.cardsList.firstChild) {
                    renderCards.cardsList.removeChild(renderCards.cardsList.firstChild);
                }
                renderCards.currentPage = 1;
                renderCards.cardsList.scrollTop = 0; // Reset the scroll position after removing the elements
                renderCards.appendCards(renderCards.currentPage, this.searchRes);
            } else {
                    renderCards.appendCards(renderCards.currentPage, this.searchRes);
            }
        
            numberOfFoundCards.style.display = 'block';
            numberOfFoundCards.innerHTML = `<b>${searchRes.length}</b> cards have met the search criteria`
            
            searchContainer.append(resetSearchBtn);
        })

        resetSearchBtn.addEventListener('click', () => {
            renderCards.currentPage = 1;
            renderCards.cardsList.scrollTop = 0;
            renderCards.allCards = [...renderCards.originalAllCards];
            while (renderCards.cardsList.hasChildNodes()) {
                renderCards.cardsList.removeChild(renderCards.cardsList.firstChild);
              }
            this.searchRes = [];
            renderCards.appendCards(renderCards.currentPage, renderCards.allCards);
            numberOfFoundCards.style.display = 'none';
            searchContainer.removeChild(resetSearchBtn);
        })
    }
}
//console.log(renderCards.allCards, 'test')
import { RenderCards } from "./renderCards.js";

const renderCards = new RenderCards();

renderCards.loadCardsData().then(data => {

          const searchCards = new SearchCards(data); // Create an instance of SearchCards and pass the data
          searchCards.search();
          //console.log('ASD QWE CURRENT PAGEEE:', renderCards.currentPage);
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
        
        searchBtn.textContent = 'Search';
        searchBar.setAttribute('type', 'text');
        searchBar.placeholder = 'Type to search cards...';
        searchContainer.append(searchBar, searchBtn)
        const body = document.querySelector('body');
        body.append(searchContainer);

        searchBtn.addEventListener('click', () => {
            renderCards.currentPage = 1;
            renderCards.cardsList.scrollTo = 0;
            renderCards.appendCards(renderCards.currentPage, renderCards.allCards);
            const searchStr = searchBar.value.toLowerCase();
            while (renderCards.cardsList.hasChildNodes()) {
                renderCards.cardsList.removeChild(renderCards.cardsList.firstChild);
              }
            const searchRes = this.allCards.filter(card => 
                card.name.toLowerCase().includes(searchStr) || 
                card.effectText.toLowerCase().includes(searchStr));
            
            renderCards.appendCards(renderCards.currentPage, searchRes);
            console.log(searchRes.length, 'SEARCH LENGTH');
            this.searchRes = searchRes;
        })
    }
}
//console.log(renderCards.allCards, 'test')
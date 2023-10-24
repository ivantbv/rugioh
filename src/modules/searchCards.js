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
        this.searchContainer = renderCards.createElemWithClass('div', 'search-container');
        this.searchWithinDiv = renderCards.createElemWithClass('div', 'search-within-container');
        this.searchWithinDiv.innerHTML = `
        <div class="checkbox-search">
            <input type="checkbox" id="search-all" name="search-all" value="search-all" />
            <label for="search-all">Search within the current search results</label>
        </div>
        `
    }

    search() {
        
        const searchBar = renderCards.createElemWithClass('input', 'search-cards');
        const searchBtn = renderCards.createElemWithClass('button', 'search-cards-btn');
        const numberOfFoundCards = renderCards.createElemWithClass('div', 'found-cards-div');
        const resetSearchBtn = renderCards.createElemWithClass('button', 'reset-search-btn');
        resetSearchBtn.textContent = 'Reset Search';
        searchBtn.textContent = 'Search';
        searchBar.setAttribute('type', 'text');
        searchBar.placeholder = 'Type to search cards...';
        this.searchContainer.append(searchBar, searchBtn, numberOfFoundCards);
        const body = document.querySelector('body');
        body.append(this.searchContainer);

       

        searchBtn.addEventListener('click', () => {
            const scrollPosition = renderCards.cardsList.scrollTop;
            renderCards.currentPage = 1;
            renderCards.cardsList.scrollTop = 0;
            renderCards.appendCards(renderCards.currentPage, renderCards.allCards);
            const searchStr = searchBar.value.toLowerCase();
            while (renderCards.cardsList.hasChildNodes()) {
                renderCards.cardsList.removeChild(renderCards.cardsList.firstChild);
              }
            this.searchContainer.append(this.searchWithinDiv);
            const checkBox = document.querySelector('input[name="search-all"]');

            if(checkBox && checkBox.checked) {
                this.renderSearchResults(this.searchRes, searchStr);
                checkBox.checked = false;
            } else {
                this.renderSearchResults(this.allCards, searchStr);
                checkBox.checked = false;
            }
            //check whats the value of this.selectedSearch 
            //then perform the search either on the searchRes or the original cards array
            numberOfFoundCards.style.display = 'block';
            numberOfFoundCards.innerHTML = `<b>${this.searchRes.length}</b> cards have met the search criteria`
            
            
            this.searchContainer.append(resetSearchBtn);
        })

        resetSearchBtn.addEventListener('click', () => {
            const checkBox = document.querySelector('input[name="search-all"]');
            
            renderCards.currentPage = 1;
            renderCards.cardsList.scrollTop = 0;
            renderCards.allCards = [...renderCards.originalAllCards];
            while (renderCards.cardsList.hasChildNodes()) {
                renderCards.cardsList.removeChild(renderCards.cardsList.firstChild);
              }
            this.searchRes = [];
            renderCards.appendCards(renderCards.currentPage, renderCards.allCards);
            numberOfFoundCards.style.display = 'none';
            this.searchContainer.removeChild(resetSearchBtn);
            this.searchContainer.removeChild(this.searchWithinDiv);
            checkBox.checked = false;
        })
    }

    renderSearchResults(cardsArr, searchStr) {
        const searchRes = cardsArr.filter(card => //this.allCards or this.searchRes
            card.name.toLowerCase().includes(searchStr) || 
            card.effectText.toLowerCase().includes(searchStr));
        this.searchRes = searchRes;
        renderCards.allCards = searchRes;

        if (searchRes.length < 1) {
            while (renderCards.cardsList.firstChild) {
                renderCards.cardsList.removeChild(renderCards.cardsList.firstChild);
            }
            renderCards.currentPage = 1;
            renderCards.cardsList.scrollTop = 0; //Reset the scroll position after removing the elements
            renderCards.appendCards(renderCards.currentPage, this.searchRes);
        } else {
                renderCards.appendCards(renderCards.currentPage, this.searchRes);
        }
    }

    narrowSearch() {
        //narrow the search or current search by:
        //card frame
        //type
        //attribute
        //level/rank
        //pend scale
        //spell/card icon
        //key search (tuner, synchro, gain control etc.)
        //forbidden/limited for when I get to understand how to fetch the banlists
    }
}
//console.log(renderCards.allCards, 'test')
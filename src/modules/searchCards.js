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
        `;
        this.narrowSearchBtn = renderCards.createElemWithClass('button', 'narrow-search-btn');
        this.narrowSearchBtn.textContent = 'Narrow Search';
        this.cardFrameNarrowBtn = renderCards.createElemWithClass('button', 'card-frame-btn');
        this.cardFrameNarrowBtn.textContent = 'Search by card frame:';
        this.narrowSearch();
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
        this.searchContainer.append(searchBar, searchBtn, numberOfFoundCards, this.narrowSearchBtn);
        const body = document.querySelector('body');
        body.append(this.searchContainer);

        searchBtn.addEventListener('click', () => {
            const scrollPosition = renderCards.cardsList.scrollTop;
            renderCards.currentPage = 1;
            renderCards.cardsList.scrollTop = 0;
            renderCards.appendCards(renderCards.currentPage, renderCards.allCards);
            const searchStr = searchBar.value.toLowerCase();
            this.clearCardsList();
            this.searchContainer.append(this.searchWithinDiv);
            const checkBox = document.querySelector('input[name="search-all"]');

            if(checkBox && checkBox.checked) {
                this.renderSearchResults(this.searchRes, searchStr);
                checkBox.checked = true;
            } else {
                this.renderSearchResults(this.allCards, searchStr);
                checkBox.checked = true;
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
            this.clearCardsList();
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
        const narrowSearchModal = renderCards.createElemWithClass('div', 'narrow-search-modal');
        const narrowSearchContainer = renderCards.createElemWithClass('div', 'narrow-search-container');
        const byCardFrameContainer = renderCards.createElemWithClass('div', 'card-frame-cont');
        
        byCardFrameContainer.append(this.cardFrameNarrowBtn);
        narrowSearchContainer.append(byCardFrameContainer);
        narrowSearchModal.append(narrowSearchContainer);
        function createNarrowSearchCheckboxes(...elems) {
            elems.map(elem => {
                const container = renderCards.createElemWithClass('div', 'narrowsrch-checkbox-div');
                container.innerHTML = `
                    <div class="checkbox-narrow-search">
                        <input type="checkbox" id="${elem}" name="narrow-search-settings" value="${elem}" />
                        <label for="${elem}">${elem}</label>
                    </div>`;
                byCardFrameContainer.appendChild(container);
            });
        }
        createNarrowSearchCheckboxes("Normal", "Effect", "Ritual", "Pendulum",
                                     "Fusion", "Synchro", "Xyz")
        this.narrowSearchBtn.addEventListener('click', () => {
            this.searchContainer.append(narrowSearchModal);
            this.updateCheckBoxChoice();

        })
        //narrow the search or current search by:
        //card frame (normal, effect, ritual, pendulum, pendulum/effect, fusion, synchro, Xyz, spell, trap
            // POSSIBLE dark synchro when I add the anime/game original cards).
        //open a modal window where you can choose card frames (with checkboxes)
        //assign each choice to an array, e.g. is multiple choice - ['Effect', 'Normal', 'Pendulum']

        //type
        //attribute
        //level/rank
        //pend scale
        //spell/card icon
        //key search (tuner, synchro, gain control etc.)
        //forbidden/limited for when I get to understand how to fetch the banlists
    }
   
    updateCheckBoxChoice() {
        //check if the checkboxes are present in the DOM
         //add eventlistener to them
        const checkboxes = document.querySelectorAll('.checkbox-narrow-search');
        const narrowSearchCheckboxes = 
                        document.querySelectorAll("input[type=checkbox][name=narrow-search-settings]");
        let chosenNarrowSettings = [];
        narrowSearchCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                chosenNarrowSettings = 
                    Array.from(narrowSearchCheckboxes)
                    .filter(i => i.checked) // Use Array.filter to remove unchecked checkboxes.
                    .map(i => i.value)
                    console.log(chosenNarrowSettings, 'CHOSEN NARROW SETTINGS')
            })
        })
        
        this.cardFrameNarrowBtn.addEventListener('click', () => {
            this.searchContainer.append(this.searchWithinDiv);
            //checkboxes.forEach(check => check.childNodes.forEach(checkbox => {


                if (chosenNarrowSettings.length > 0) {
                    let narrowedCardFrames = []
                    chosenNarrowSettings.forEach(searchStr => {
                        const filteredCards = this.narrowByCardFrame(this.allCards, searchStr);
                        narrowedCardFrames.push({ searchStr, filteredCards });
                      });

                    const NarrowedFrameCardsWithDuplicates =
                        narrowedCardFrames.flatMap(result => result.filteredCards)
                    
                        //order the found cards by their frames (properties)!!!!!!!!!!!!!!!!!!!!!!!
                    const updatedNarrowedFrameCards =
                     this.removeDuplicatedCardObjects(NarrowedFrameCardsWithDuplicates);
                   // const chosenCardFrames = chosenNarrowSettings.join(' ');

                    const checkBox = document.querySelector('input[name="search-all"]');
                    this.clearCardsList();
                    renderCards.currentPage = 1;
                    renderCards.cardsList.scrollTop = 0;

                    console.log(updatedNarrowedFrameCards, 'NEW THIS CHECK NARROWED FRAME CARDS')

                    if(checkBox && checkBox.checked) {
                        //order the found cards by their frames (properties)
                        this.searchRes = updatedNarrowedFrameCards;
                        console.log(this.searchRes, 'search res')
                        //this.renderSearchResults(this.searchRes, searchStr);
                        renderCards.appendCards(renderCards.currentPage, this.searchRes);
                        checkBox.checked = true;
                    } else {
                        //clear all the cards from the cards container first.
                        this.searchRes = updatedNarrowedFrameCards;
                        //this.narrowByCardFrame(this.allCards, chosenCardFrames);
                        console.log(this.searchRes, 'search res')
                        renderCards.appendCards(renderCards.currentPage, this.searchRes);
                        //checkBox.checked = true;
                    }

                }
            //}))
        })
       
        //write the checkboxes choice  in an array
        //feed it to narrowByCardFrame
        //get the result from narrowByCardFrame method and use rendrCards
    }
    
 //TO REWORK THIS METHOD
    narrowByCardFrame(cards, searchArr) {
        //turn searchArr into string
        //effect monster card frame can by union or spirit as well.

        //const searchStr = "Effect Xyz";
        let searchProperties = []; 
        if (searchArr && searchArr.length > 1) {
            searchProperties = searchArr.split(" ");
        } else {
            //searchProperties = ["Effect", "Ritual", "Pendulum", "Fusion", "Synchro", "Xyz"];
            searchProperties = searchArr
        }
        
        const filteredCards = cards.filter(card => {
        const cardProperties = card.properties;

        if (searchProperties.every(prop => cardProperties && cardProperties.includes(prop))) {
            const otherProperties = cardProperties.filter(property => !searchProperties.includes(property));
            return searchProperties.every(prop => !otherProperties.includes(prop));
        }
        return false;
        });

        return filteredCards;
    }

    clearCardsList() {
        while (renderCards.cardsList.hasChildNodes()) {
            renderCards.cardsList.removeChild(renderCards.cardsList.firstChild);
        }
    }

    removeDuplicatedCardObjects(cards) {
        const uniqueCardsMap = cards.reduce((uniqueCards, card) => {
            if (!uniqueCards[card.id]) {
              uniqueCards[card.id] = card;
            }
            return uniqueCards;
          }, {});
          
          // Convert the uniqueCards object back to an array
          return Object.values(uniqueCardsMap);
    }
}
//console.log(renderCards.allCards, 'test')
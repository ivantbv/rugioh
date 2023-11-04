import { RenderCards } from "./renderCards.js";
const renderCards = new RenderCards();

renderCards.loadCardsData().then(data => {

          const searchCards = new SearchCards(data); //Create an instance of SearchCards and pass the data
          searchCards.search();
          searchCards.narrowSearch();
          renderCards.searchCards = searchCards;
        });

class SearchCards {
    constructor(allCards) {
        this.allCards = allCards;
        this.searchRes = [];
        this.searchContainer = this.createElemWithClass('div', 'search-container');
        this.searchWithinDiv = this.createElemWithClass('div', 'search-within-container');
        this.searchWithinDiv.innerHTML = `
        <div class="checkbox-search">
            <input type="checkbox" id="search-all" name="search-all" value="search-all" />
            <label for="search-all">Search within the current search results</label>
        </div>
        `;
        this.narrowSearchBtn = this.createElemWithClass('button', 'narrow-search-btn');
        this.narrowSearchBtn.textContent = 'Narrow Search';
        this.cardFrameNarrowBtn = this.createElemWithClass('button', 'card-frame-btn');
        this.cardFrameNarrowBtn.textContent = 'Search by card frame:';
        this.resetSearchBtn = this.createElemWithClass('button', 'reset-search-btn');
        this.resetSearchBtn.textContent = 'Reset Search';
    
        this.resetSearchBtn.addEventListener('click', this.resetSearch.bind(this));
    
        this.updateCheckBoxChoice();
        this.narrowSearch();
    }
    
    search() {
        const searchBar = this.createElemWithClass('input', 'search-cards');
        const searchBtn = this.createElemWithClass('button', 'search-cards-btn');
        const numberOfFoundCards = this.createElemWithClass('div', 'found-cards-div');
    
        searchBtn.textContent = 'Search';
        searchBar.setAttribute('type', 'text');
        searchBar.placeholder = 'Type to search cards...';
        this.searchContainer.append(searchBar, searchBtn, numberOfFoundCards, this.narrowSearchBtn);
        const body = document.querySelector('body');
        body.append(this.searchContainer);
    
        searchBtn.addEventListener('click', this.performSearch.bind(this, searchBar, numberOfFoundCards));
    }
    
    performSearch(searchBar, numberOfFoundCards) {
        const scrollPosition = renderCards.cardsList.scrollTop;
        renderCards.currentPage = 1;
        renderCards.cardsList.scrollTop = 0;
        renderCards.appendCards(renderCards.currentPage, renderCards.allCards);
        const searchStr = searchBar.value.toLowerCase();
        this.clearCardsList();
        this.searchContainer.append(this.searchWithinDiv);
        const checkBox = document.querySelector('input[name="search-all"]');
    
        if (checkBox && checkBox.checked) {
        this.renderSearchResults(this.searchRes, searchStr);
        checkBox.checked = true;
        } else {
        renderCards.allCards = [...renderCards.originalAllCards];
        this.renderSearchResults(this.allCards, searchStr);
        checkBox.checked = true;
        }
    
        numberOfFoundCards.style.display = 'block';
        numberOfFoundCards.innerHTML = `<b>${this.searchRes.length}</b> cards have met the search criteria`;
    
        this.searchContainer.append(this.resetSearchBtn);
    }
    
    resetSearch() {
        const checkBox = document.querySelector('input[name="search-all"]');
    
        renderCards.currentPage = 1;
        renderCards.cardsList.scrollTop = 0;
        renderCards.allCards = [...renderCards.originalAllCards];
        this.clearCardsList();
        this.searchRes = [];
        renderCards.appendCards(renderCards.currentPage, renderCards.allCards);
        const numberOfFoundCards = document.querySelector('.found-cards-div');
        numberOfFoundCards.style.display = 'none';
        this.searchContainer.removeChild(this.resetSearchBtn);
        this.searchContainer.removeChild(this.searchWithinDiv);
        checkBox.checked = false;
    }
    
    renderSearchResults(cardsArr, searchStr) {
        const searchRes = cardsArr.filter((card) =>
        card.name.toLowerCase().includes(searchStr) ||
        card.effectText.toLowerCase().includes(searchStr)
        );
        this.searchRes = searchRes;
        renderCards.allCards = searchRes;
    
        if (searchRes.length < 1) {
        this.clearCardsList();
        }
        renderCards.appendCards(renderCards.currentPage, this.searchRes);
    }
    
    narrowSearch() {
        if (!this.narrowSearchModal) {
            this.narrowSearchModal = this.createElemWithClass('div', 'narrow-search-modal');
            this.narrowSearchModal.style.display = 'none'; // Hide the modal by default
        
            const narrowSearchContainer = this.createElemWithClass('div', 'narrow-search-container');
            const byCardFrameContainer = this.createElemWithClass('div', 'card-frame-cont');
        
            byCardFrameContainer.append(this.cardFrameNarrowBtn);
            narrowSearchContainer.append(byCardFrameContainer);
            this.createNarrowSearchCheckboxes(byCardFrameContainer, "Normal", "Effect", "Ritual", "Pendulum", "Fusion", "Synchro", "Xyz", "Link", "Spell", "Trap");
        
            this.narrowSearchModal.append(narrowSearchContainer);
            document.body.appendChild(this.narrowSearchModal);
          }
        
          this.updateCheckBoxChoice();
        
          this.narrowSearchBtn.addEventListener('click', () => {
            // Show the modal when the button is clicked
            this.narrowSearchModal.style.display = 'block';
          });
    }
    
    createNarrowSearchCheckboxes(container, ...elems) {
        elems.map((elem) => {
        const checkboxContainer = this.createElemWithClass('div', 'narrowsrch-checkbox-div');
        checkboxContainer.innerHTML = `
            <div class="checkbox-narrow-search">
            <input type="checkbox" id="${elem}" name="narrow-search-settings" value="${elem}" />
            <label for="${elem}">${elem}</label>
            </div>`;
        container.appendChild(checkboxContainer);
        });
    }
    
    showNarrowSearchModal(narrowSearchModal) {
        this.searchContainer.append(narrowSearchModal);
        this.updateCheckBoxChoice();
    }
    
    updateCheckBoxChoice() {
        const checkboxes = document.querySelectorAll('.checkbox-narrow-search');
        const narrowSearchCheckboxes = document.querySelectorAll("input[type=checkbox][name=narrow-search-settings]");
        let chosenNarrowSettings = [];
        narrowSearchCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
            chosenNarrowSettings = Array.from(narrowSearchCheckboxes).filter((i) => i.checked).map((i) => i.value);
            console.log(chosenNarrowSettings, 'CHOSEN NARROW SETTINGS');
        });
        });
    
        this.cardFrameNarrowBtn.addEventListener('click', () => {
            this.searchContainer.append(this.resetSearchBtn);
            this.searchContainer.append(this.searchWithinDiv);
            const checkBox = document.querySelector('input[name="search-all"]');
            this.clearCardsList();
            renderCards.currentPage = 1;
            renderCards.cardsList.scrollTop = 0;
        
            if (checkBox && !checkBox.checked) {
                renderCards.allCards = [...renderCards.originalAllCards];
            }
            if (checkBox && checkBox.checked) {
                renderCards.allCards = this.searchRes;
            }
    
            if (chosenNarrowSettings.length > 0) {
                console.log(checkBox.checked, 'ESLI CHECKED');
                let narrowedCardFrames = [];
        
                chosenNarrowSettings.forEach((searchStr) => {
                    const filteredCards = this.narrowByCardFrame(checkBox && checkBox.checked ? this.searchRes : this.allCards, searchStr);
                    narrowedCardFrames.push({ searchStr, filteredCards });
                });
        
                const NarrowedFrameCardsWithDuplicates = 
                                narrowedCardFrames.flatMap((result) => result.filteredCards);
        
                const updatedNarrowedFrameCards = 
                                this.removeDuplicatedCardObjects(NarrowedFrameCardsWithDuplicates);
        
                this.searchRes = updatedNarrowedFrameCards;
                if (!updatedNarrowedFrameCards || updatedNarrowedFrameCards.length < 1 && checkBox.checked) {
                    this.searchRes = updatedNarrowedFrameCards;
                    checkBox.checked = true;
                    this.clearCardsList();
                    return;
                }
        
                if (checkBox && checkBox.checked) {
                    this.clearCardsList();
                    this.searchRes = updatedNarrowedFrameCards;
                    console.log(this.searchRes, 'search res');
                    renderCards.appendCards(renderCards.currentPage, this.searchRes);
                    checkBox.checked = true;
                    return;
                } else {
                    this.clearCardsList();
                    this.searchRes = updatedNarrowedFrameCards;
                    console.log(this.searchRes, 'search res');
                    renderCards.appendCards(renderCards.currentPage, this.searchRes);
                    return;
                }
            }
        });
    }
    
    narrowByCardFrame(cards, searchStr) {
        const searchProperties = ["Normal", "Effect", "Ritual", "Pendulum", "Fusion", "Synchro", "Xyz", "Link"];
        const isEffectSearch = searchStr === "Effect";
        const filteredCards = cards.filter((card) => {
        if (!card.properties && card.localizedAttribute) {
            return card.localizedAttribute.includes(searchStr.toUpperCase());
        }
        if (card.properties) {
            if (isEffectSearch) {
            if (card.properties.includes("Effect")) {
                return !searchProperties.some((prop) => card.properties.includes(prop) && prop !== "Effect");
            }
            } else {
            return card.properties.includes(searchStr);
            }
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
        return Object.values(uniqueCardsMap);
    }
    
    createElemWithClass(tag, className) {
        const elem = document.createElement(tag);
        elem.classList.add(className);
        return elem;
    }
}
//console.log(renderCards.allCards, 'test')
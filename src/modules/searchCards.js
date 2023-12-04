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
        this.monsterAttributeNarrowBtn = this.createElemWithClass('button', 'monster-attr-btn');
        this.monsterAttributeNarrowBtn.textContent = 'Search by attribute:';
        this.monsterTypeNarrowBtn = this.createElemWithClass('button', 'monster-attr-btn');
        this.monsterTypeNarrowBtn.textContent = 'Search by type:';
        this.levelRankNarrowBtn = this.createElemWithClass('button', 'lvl-rank-pend-btn');
        this.levelRankNarrowBtn.textContent = 'Search by LVL/Rank';
        
        this.resetSearchBtn = this.createElemWithClass('button', 'reset-search-btn');
        this.resetSearchBtn.textContent = 'Reset Search';
    
        this.resetSearchBtn.addEventListener('click', this.resetSearch.bind(this));
        this.numberOfFoundCards = this.createElemWithClass('div', 'found-cards-div');
        this.chosenNarrowSettings = [];
        //this.performNarrowSearch('narrow-search-settings', this.narrowByCardFrame, this.cardFrameNarrowBtn);
        //this.performNarrowSearch('type-search-settings', this.narrowByMonsterAttribute, this.monsterAttributeNarrowBtn)
        this.narrowSearch();
    }
    
    search() {
        const searchBar = this.createElemWithClass('input', 'search-cards');
        const searchBtn = this.createElemWithClass('button', 'search-cards-btn');
        //const numberOfFoundCards = this.createElemWithClass('div', 'found-cards-div');
    
        searchBtn.textContent = 'Search';
        searchBar.setAttribute('type', 'text');
        searchBar.placeholder = 'Type to search cards...';
        this.searchContainer.append(searchBar, searchBtn, this.numberOfFoundCards, this.narrowSearchBtn);
        const body = document.querySelector('body');
        body.append(this.searchContainer);
    
        searchBtn.addEventListener('click', this.performTextSearch.bind(this, searchBar, this.numberOfFoundCards));
    }
    
    performTextSearch(searchBar, numberOfFoundCards) {
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
    
        // numberOfFoundCards.style.display = 'block';
        // numberOfFoundCards.innerHTML = `<b>${this.searchRes.length}</b> cards have met the search criteria`;
        this.displayNumberOfFoundCards(numberOfFoundCards);
        this.searchContainer.append(this.resetSearchBtn);
    }

    displayNumberOfFoundCards(numberOfFoundCards) {
        numberOfFoundCards.style.display = 'block';
        numberOfFoundCards.innerHTML = `<b>${this.searchRes.length}</b> cards have met the search criteria`;
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
            const byMonsterAttrContainer = this.createElemWithClass('div', 'monster-attr-cont');
            const byMonsterTypeContainer = this.createElemWithClass('div', 'monster-type-cont');
            const byLevelRank = this.createElemWithClass('div', 'lvl-rank-pend-cont');

            byCardFrameContainer.append(this.cardFrameNarrowBtn);
            byMonsterAttrContainer.append(this.monsterAttributeNarrowBtn);
            byMonsterTypeContainer.append(this.monsterTypeNarrowBtn);
            byLevelRank.append(this.levelRankNarrowBtn);
            narrowSearchContainer.append(byCardFrameContainer);
            narrowSearchContainer.append(byMonsterAttrContainer);
            narrowSearchContainer.append(byMonsterTypeContainer);
            narrowSearchContainer.append(byLevelRank);
            this.createNarrowSearchCheckboxes(byCardFrameContainer, "narrow-search-settings", 
                                                                    "normal", "effect", "ritual",
                                                                    "fusion", "synchro", "xyz",
                                                                    "link", "normal pendulum", "effect pendulum",
                                                                    "ritual pendulum", "fusion pendulum",
                                                                    "synchro pendulum", "xyz pendulum",
                                                                    "spell","trap");
            this.createNarrowSearchCheckboxes(byMonsterAttrContainer, "attr-search-settings", 
                                                                    "DARK", "DIVINE", "EARTH", "FIRE", 
                                                                    "LIGHT", "WATER", "WIND");
            this.createNarrowSearchCheckboxes(byMonsterTypeContainer, 'type-search-settings',
                                                                    'Aqua', 'Beast', 'Beast-Warrior', 
                                                                    'Cyberse', 'Dinosaur', 'Divine-Beast', 
                                                                    'Dragon', 'Fairy', 'Fiend', 
                                                                    'Fish', 'Illusion Type', 'Insect', 
                                                                    'Machine', 'Plant', 'Psychic', 'Pyro', 
                                                                    'Reptile', 'Rock', 'Sea Serpent', 
                                                                    'Spellcaster', 'Thunder', 'Warrior', 
                                                                    'Winged Beast', 'Wyrm', 'Zombie');
            this.createNarrowSearchNumberField(byLevelRank);
            this.narrowSearchModal.append(narrowSearchContainer);
            document.body.appendChild(this.narrowSearchModal);
          }
        
          this.performNarrowSearch('narrow-search-settings', this.narrowByFrameType, this.cardFrameNarrowBtn);
          this.performNarrowSearch('attr-search-settings', this.narrowByMonsterAttribute, this.monsterAttributeNarrowBtn)
          this.performNarrowSearch('type-search-settings', this.narrowByCardFrame, this.monsterTypeNarrowBtn);
          //add the search by rank/lvl/pend here
          this.performNarrowSearchByLvlRank(this.levelRankNarrowBtn, this.narrowbyLevelRank);
          this.narrowSearchBtn.addEventListener('click', () => {
            // Show the modal when the button is clicked
            this.narrowSearchModal.style.display = 'block';
          });
    }
    
    createNarrowSearchCheckboxes(container, searchSettings, ...elems) {
        elems.map((elem) => {
        const checkboxContainer = this.createElemWithClass('div', 'narrowsrch-checkbox-div');
        checkboxContainer.innerHTML = `
            <div class="checkbox-narrow-search">
            <input type="checkbox" id="${elem}" name="${searchSettings}" value="${elem}" />
            <label for="${elem}">${elem}</label>
            </div>`;
        container.appendChild(checkboxContainer);
        });
    }
    
    narrowbyLevelRank(cards, lvlOrRankArray) {
        const comparisonOperators = {
          '=': (a, b) => a == b,
          '<=': (a, b) => a <= b,
          '>=': (a, b) => a >= b,
        };
      
        const filteredCards = cards.filter((card) => {
          // Check if lvlOrRankArray is an array with at least one object
          if (Array.isArray(lvlOrRankArray) && lvlOrRankArray.length > 0) {
            return Object.entries(lvlOrRankArray[0]).some(([key, value]) => {
      
              if (key === 'LvlOrRank' && value === 'Level') {
                const comparisonFunction = comparisonOperators[lvlOrRankArray[0].CompareValue];
                if (comparisonFunction) {
                  return comparisonFunction(card.level, lvlOrRankArray[0].LevelRankValue);
                }
              }
              if (key === 'LvlOrRank' && value === 'Rank') {
                const comparisonFunction = comparisonOperators[lvlOrRankArray[0].CompareValue];
                if (comparisonFunction) {
                  return comparisonFunction(card.rank, lvlOrRankArray[0].LevelRankValue);
                }
              }
              // Handle other cases as needed
              return false;
            });
          }
      
          // Handle the case when lvlOrRankArray is not an array or is empty
          return false;
        });
      
        console.log('filtered cards', filteredCards);
        return filteredCards;
    }
      

    performNarrowSearchByLvlRank(narrowSearchBtn, narrowBy) { //narrowBy is to be made function that will take 4 arguments - cards array, and level/rank values and filter the cards array based on that
        const radioBtnsLvlRank = document.querySelectorAll('input[name="lvl-rank-search"]')
        const equalsSigns = document.querySelector('#signs');
        const levelRankInputFiled = document.querySelector('#number-search');
        
        narrowSearchBtn.addEventListener('click', () => {
            radioBtnsLvlRank.forEach(radioBtn => {
                if (radioBtn.checked) {
                    this.chosenNarrowSettings = [{'LvlOrRank': radioBtn.value}];
                }
            })
            this.chosenNarrowSettings[0].LevelRankValue = levelRankInputFiled.value;
            this.chosenNarrowSettings[0].CompareValue = equalsSigns.value;
            console.log(this.chosenNarrowSettings, 'NARROW SETTINGS FROM LVL RANK')
            if (!this.chosenNarrowSettings[0].LevelRankValue) {
                return;
            }

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

            if (this.chosenNarrowSettings.length > 0) {
                // console.log(checkBox.checked, 'ESLI CHECKED');
                let narrowedCardFrames = [];
                
                const filteredCards = narrowBy(checkBox && checkBox.checked ? this.searchRes : this.allCards, this.chosenNarrowSettings);
                narrowedCardFrames.push(filteredCards);
                
                this.updateSearchResults(narrowedCardFrames, checkBox);
            }
            
        })

    }

    createNarrowSearchNumberField(container) {
        const numberSearchContainer = this.createElemWithClass('div', 'narrow-lvl-rank-div');
        numberSearchContainer.innerHTML = `
            <div class="input-number-narrow-search">
            <label for="signs">Choose a value:</label>
                <select id="signs" name="signs">
                    <option value="=" selected>=</option>
                    <option value="\<=">≤</option>
                    <option value="\>=">≥</option>
                </select>
                <input type="number" id="number-search" />
                <input type="radio" id="level-search" name="lvl-rank-search" value="Level" checked />
                <label for="level-search">Level</label>
                <input type="radio" id="rank-search" name="lvl-rank-search" value="Rank" />
                <label for="rank-search">Rank</label>
            </div>
        `;
        container.appendChild(numberSearchContainer);
    }

    // showNarrowSearchModal(narrowSearchModal) {
    //     this.searchContainer.append(narrowSearchModal);
    //     this.performNarrowSearch('narrow-search-settings', this.narrowByCardFrame, this.cardFrameNarrowBtn);
    //     this.performNarrowSearch('type-search-settings', this.narrowByMonsterAttribute, this.monsterAttributeNarrowBtn)
    // }
    //try to use this method for narrowByMonsterAttribute
    performNarrowSearch(narrowSearchSettings, narrowBy, narrowSearchButton) {
        const checkboxes = document.querySelectorAll('.checkbox-narrow-search');
        const narrowSearchCheckboxes = document.querySelectorAll(`input[type=checkbox][name=${narrowSearchSettings}]`);
        //let chosenNarrowSettings = [];
       
        narrowSearchButton.addEventListener('click', () => {
            narrowSearchCheckboxes.forEach((checkbox) => {
                if (checkbox.checked) {
                    this.chosenNarrowSettings = 
                        Array.from(narrowSearchCheckboxes).filter((i) => i.checked).map((i) => i.value);
                    console.log(this.chosenNarrowSettings, 'CHOSEN NARROW SETTINGS');
                }     
            });

            console.log(this.chosenNarrowSettings, 'CHOSEN NARROW SETTINGS inside narrowSearchButton');
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
            console.log(this.chosenNarrowSettings, 'narrow setting')
            if (this.chosenNarrowSettings.length > 0) {
                
                console.log(checkBox.checked, 'ESLI CHECKED');
                let narrowedCardFrames = [];
        
                this.chosenNarrowSettings.forEach((searchStr) => {
                    const filteredCards = narrowBy(checkBox && checkBox.checked ? this.searchRes : this.allCards, searchStr);
                    narrowedCardFrames.push({ searchStr, filteredCards });
                });
                
                // const NarrowedFrameCardsWithDuplicates = 
                //                 narrowedCardFrames.flatMap((result) => result.filteredCards);
        
                // const updatedNarrowedFrameCards = 
                //                 this.removeDuplicatedCardObjects(NarrowedFrameCardsWithDuplicates);
        
                // this.searchRes = updatedNarrowedFrameCards;
                // if (!updatedNarrowedFrameCards || updatedNarrowedFrameCards.length < 1 && checkBox.checked) {
                //     this.searchRes = updatedNarrowedFrameCards;
                //     checkBox.checked = true;
                //     this.clearCardsList();
                //     this.displayNumberOfFoundCards(this.numberOfFoundCards);
                //     return;
                // }
        
                // if (checkBox && checkBox.checked) {
                //     this.clearCardsList();
                //     this.searchRes = updatedNarrowedFrameCards;
                //     console.log(this.searchRes, 'search res');
                //     renderCards.appendCards(renderCards.currentPage, this.searchRes);
                //     checkBox.checked = true;
                //     this.displayNumberOfFoundCards(this.numberOfFoundCards);
                //     console.log(this.searchRes, 'SEARCH RESS ARR HERE')
                //     return;
                // } else {
                //     this.clearCardsList();
                //     this.searchRes = updatedNarrowedFrameCards;
                //     console.log(this.searchRes, 'search res');
                //     renderCards.appendCards(renderCards.currentPage, this.searchRes);
                //     this.displayNumberOfFoundCards(this.numberOfFoundCards);
                //     console.log(this.searchRes, 'SEARCH RESS ARR HERE')
                //     return;
                // }
                this.updateSearchResults(narrowedCardFrames, checkBox);
            }
        });
    }

    narrowByFrameType(cards, searchStr) {
        const filteredCards = cards.filter((card) => {
            if (card.frameType) {
                if (searchStr.includes(' ')) {
                    if (card.frameType.replace('_', ' ') === searchStr.toLowerCase()) {
                        return card.frameType.replace('_', ' ') == searchStr.toLowerCase();
                    }
                } else {
                    return card.frameType == searchStr.toLowerCase();
                }   
            }
                return false;
            });
        console.log('filtered cards', filteredCards);
        return filteredCards;
    }
    //Illusion Type is also a type (like Warrior, Beast etc)
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

    narrowByMonsterAttribute(cards, searchStr) {
        const filteredCards = cards.filter((card) => {
            if (card.localizedAttribute) {
                return card.localizedAttribute.includes(searchStr.toUpperCase());
            }
                return false;
            });
        console.log('filtered cards', filteredCards);
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

    updateSearchResults(narrowedCardFrames, checkBox) {
        const NarrowedFrameCardsWithDuplicates = narrowedCardFrames.flatMap((result) => result.filteredCards ? result.filteredCards : result);
        const updatedNarrowedFrameCards = this.removeDuplicatedCardObjects(NarrowedFrameCardsWithDuplicates);
    
        this.searchRes = updatedNarrowedFrameCards;
    
        if (!updatedNarrowedFrameCards || updatedNarrowedFrameCards.length < 1 && checkBox.checked) {
          this.searchRes = updatedNarrowedFrameCards;
          checkBox.checked = true;
          this.clearCardsList();
          this.displayNumberOfFoundCards(this.numberOfFoundCards);
          return;
        }
    
        if (checkBox && checkBox.checked) {
          this.clearCardsList();
          this.searchRes = updatedNarrowedFrameCards;
          console.log(this.searchRes, 'search res');
          renderCards.appendCards(renderCards.currentPage, this.searchRes);
          checkBox.checked = true;
          this.displayNumberOfFoundCards(this.numberOfFoundCards);
          console.log(this.searchRes, 'SEARCH RESS ARR HERE');
        } else {
          this.clearCardsList();
          this.searchRes = updatedNarrowedFrameCards;
          console.log(this.searchRes, 'search res');
          renderCards.appendCards(renderCards.currentPage, this.searchRes);
          this.displayNumberOfFoundCards(this.numberOfFoundCards);
        }
      }

}
//console.log(renderCards.allCards, 'test')
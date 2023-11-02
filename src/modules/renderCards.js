import { fetchData } from '../../public/index.js';

class GetCards {
    renderCards() {
        return fetchData().then(data => {
            return data
            // Perform rendering and other tasks with the data
          });
    }
}
// function renderCards() {
//     fetchData().then(data => {
//       console.log('Received data in renderCards:', data);
//       // Perform rendering and other tasks with the data
//     });
//   }

export class RenderCards {
    constructor() {
        this.cardsList = document.querySelector('.cards-list');
        this.cardsPerPage = 30;
        this.currentPage = 1;
        this.allCards = [];
        this.originalAllCards = [];
        //this.loadCardsData();
    }

    loadCardsData() {
      return new Promise((resolve, reject) => {
        const getCards = new GetCards();
        getCards.renderCards()
          .then(data => {
            this.allCards = data;
            this.originalAllCards = [...data];
            this.appendCards(this.currentPage, this.allCards);
            this.scrollListener();
            this.displayCardInfo();
            resolve(data); // Resolve the Promise with the data
          })
          .catch(error => {
            reject(error); // Reject the Promise if there's an error
          });
      });
    } 

    appendCards(page, allCards) {
        const startIndex = (page - 1) * this.cardsPerPage;
        const endIndex = startIndex + this.cardsPerPage;
        let cardsLoaded = 0; // Initialize the counter
        for (let i = startIndex; i < endIndex && i < allCards.length; i++) {
          // Render each card here
            let card = allCards[i];
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('card');
            cardDiv.setAttribute('data-card-id', card.id);
            
            const img = document.createElement('img');
            img.src = card.cardImage;
            img.alt = 'Card Image';
            cardDiv.appendChild(img);
            this.cardsList.appendChild(cardDiv);
            cardsLoaded++
        }
        console.log('Number of cards loaded:', cardsLoaded);
      }
    scrollListener() {
        this.cardsList.addEventListener('scroll', () => {
          const container = this.cardsList;
          if (container.scrollTop + container.clientHeight > container.scrollHeight - 5) {
            this.currentPage++;
            if (this.searchCards && this.searchCards.searchRes.length > 0) {
              this.appendCards(this.currentPage, this.searchCards.searchRes);
              console.log(this.searchCards, 'SEARCH CARDS ASD')
              //this.searchCards.searchRes = [];
            } else {
             
              this.appendCards(this.currentPage, this.allCards);
            }
            console.log(this.currentPage, ' CURRENT PAGE!!!')
            
          }
        });
      }

    convertToArrows(arr) {
      const arrowMap = {
        "1": "↙",
        "2": "↓",
        "3": "↘",
        "4": "←",
        "6": "→",
        "7": "↖",
        "8": "↑",
        "9": "↗",
      };
    
      const customOrder = ["1", "4", "7", "2", "8", "3", "6", "9"];
      const arrowArray = arr
        .map((num) => `[${arrowMap[num]}]`)
        .sort((a, b) => {
          const indexA = customOrder.indexOf(arr.find((item) => arrowMap[item] === a));
          const indexB = customOrder.indexOf(arr.find((item) => arrowMap[item] === b));
          return indexA - indexB;
        });
    
      return arrowArray.join('');
    }

    displayCardInfo() {
      const body = document.querySelector('body');
      const divCardInfoContainer = document.createElement('div');
      divCardInfoContainer.classList.add('card-info-container');
    
      // Remove any previous card info container
      const previousCardInfoContainer = document.querySelector('.card-info-container');
      if (previousCardInfoContainer) {
        body.removeChild(previousCardInfoContainer);
      }
      console.log(this.cardsList, 'CARDS LIST!')
    
      this.cardsList.addEventListener('click', (event) => {
        const card = event.target.closest('.card');
        console.log(card, 'EVENT CLICK CARD')
    
        if (card) {
          const cardId = card.getAttribute('data-card-id');
          const cardData = this.allCards.find((cardObj) => Number(cardObj.id) === Number(cardId));
    
          if (cardData) {
            const cardInfoComponents = [];
            let divCardInfoContainer = document.querySelector('.card-info-container');

            if (!divCardInfoContainer) {
              divCardInfoContainer = document.createElement('div');
              divCardInfoContainer.classList.add('card-info-container');
            }

            while (divCardInfoContainer.hasChildNodes()) {
              divCardInfoContainer.removeChild(divCardInfoContainer.firstChild);
            }
            // Card Name
            const divCardName = this.createElemWithClass('div', 'card-name');
            divCardName.textContent = cardData.name;
            cardInfoComponents.push(divCardName);
    
            const divCardAttribute = this.createElemWithClass('div', 'card-attr');
            divCardAttribute.textContent = `[${cardData.localizedAttribute}${cardData.localizedProperty ? `/${cardData.localizedProperty}` : ''}]`;
            cardInfoComponents.push(divCardAttribute);
            
            // Assign Monster Cards (ATK, DEF, Level, Link Arrows, etc.)
            const divAtkAndDef = this.createElemWithClass('div', 'atk-def-container');
            this.assignMonsterCards(cardData, divAtkAndDef);
            if (divAtkAndDef.childNodes.length > 0) {
              cardInfoComponents.push(divAtkAndDef);
            }

            // Card Effect
            // const divCardEffect = this.createElemWithClass('card-effect');
            // divCardEffect.textContent = cardData.effectText;
            // cardInfoComponents.push(divCardEffect);
            divCardInfoContainer.innerHTML = '';
            // Add all card info components to the card info container
            cardInfoComponents.forEach(component => divCardInfoContainer.appendChild(component));
            body.appendChild(divCardInfoContainer);

          }
        }
      });
    }
            
    createElemWithClass(elem, className) {
      const div = document.createElement(elem);
      div.classList.add(className);
      return div;
    }

    assignMonsterCards(cardData, divAtkAndDef) {
      const componentsAtkDef = []; //card's atk/def/link-rating
      const componentsProperties = []; //[Dragon/Synchro/Pendulum/Effect]
      const componentEffectText = [];
      const componentsRankLevel = [];
      const componentsLinkArrows = [];
      const componentPendScale = [];
      const componentPendEffect = [];

      if (cardData.hasOwnProperty('atk')) {
        const divCardAtk = this.createElemWithClass('div', 'atk-def');
        divCardAtk.textContent = `ATK/${cardData.atk}`;
        componentsAtkDef.push(divCardAtk);
      } 
    
      if (cardData.hasOwnProperty('def')) {
        const divCardDef = this.createElemWithClass('div', 'atk-def');
        divCardDef.textContent = `DEF/${cardData.def}`;
        componentsAtkDef.push(divCardDef);
      }

      if (cardData.properties) {
        const thirdProperty = cardData.properties[2] ? '/' + cardData.properties[2] : '';
        const fourthProperty = cardData.properties[3] ? '/' + cardData.properties[3] : '';
        const divCardProperties = this.createElemWithClass('div', 'props');
        divCardProperties.textContent = `[${cardData.properties[0]}/${cardData.properties[1]}${thirdProperty}${fourthProperty}]`;
        componentsProperties.push(divCardProperties);
      }

      if (cardData.effectText) {
        const divCardEffect = this.createElemWithClass('div', 'card-effect');
        divCardEffect.textContent = cardData.effectText;
        componentEffectText.push(divCardEffect);
      }
    
      if (cardData.hasOwnProperty('linkRating')) {
        const divLinkRating = this.createElemWithClass('div', 'atk-def');
        divLinkRating.textContent = `Link-${cardData.linkRating}`;
        componentsAtkDef.push(divLinkRating);
      } 
    
      if (cardData.hasOwnProperty('level')) {
        const divCardLvl = this.createElemWithClass('div', 'lvl');
        divCardLvl.textContent = `☆${cardData.level}`;
        componentsRankLevel.push(divCardLvl);
      }
    
      if (cardData.hasOwnProperty('rank')) {
        const divCardRank = this.createElemWithClass('div', 'rank');
        divCardRank.textContent = `★${cardData.rank}`;
        componentsRankLevel.push(divCardRank);
      }
    
      if (cardData.hasOwnProperty('linkArrows')) {
        const divLinkArrows = this.createElemWithClass('div', 'link-arrows');
        divLinkArrows.textContent = this.convertToArrows(cardData.linkArrows);
        componentsLinkArrows.push(divLinkArrows);
      }

      if (cardData.hasOwnProperty('pendScale')) {
        const divCardPendScale = this.createElemWithClass('div', 'pend-scale');
        divCardPendScale.textContent = `◈${cardData.pendScale}`;
        componentPendScale.push(divCardPendScale);
      }
    
      if (cardData.pendEffect) {
        const divCardPendEffect = this.createElemWithClass('div', 'pend-effect');
        divCardPendEffect.textContent = `[Pendulum Effect]\n ${cardData.pendEffect}`;
        componentPendEffect.push(divCardPendEffect);
      }
      
      componentPendScale.forEach(component => divAtkAndDef.appendChild(component));
      componentsRankLevel.forEach(component => divAtkAndDef.appendChild(component));
      componentsAtkDef.forEach(component => divAtkAndDef.appendChild(component));
      componentsLinkArrows.forEach(component => divAtkAndDef.appendChild(component));
      componentsProperties.forEach(component => divAtkAndDef.appendChild(component));
      componentEffectText.forEach(component => divAtkAndDef.appendChild(component))
      componentPendEffect.forEach(component => divAtkAndDef.appendChild(component));
    }
            
 }

//const renderCards = new RenderCards();
//renderCards.scrollListener()
// export { renderCards };
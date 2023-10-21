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

class RenderCards {
    constructor() {
        this.cardsList = document.querySelector('.cards-list');
        this.cardsPerPage = 30;
        this.currentPage = 1;
        this.allCards = [];
        this.loadCardsData();
    }
    loadCardsData() {
        const getCards = new GetCards();
        getCards.renderCards().then(data => {
          this.allCards = data;
          this.appendCards(this.currentPage);
          this.scrollListener();
          this.displayCardInfo();
        });
      }

    appendCards(page) {
        const startIndex = (page - 1) * this.cardsPerPage;
        const endIndex = startIndex + this.cardsPerPage;
        let cardsLoaded = 0; // Initialize the counter
        for (let i = startIndex; i < endIndex && i < this.allCards.length; i++) {
          // Render each card here
            let card = this.allCards[i];
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
            console.log(this.currentPage, ' CURRENT PAGE!!!')
            this.appendCards(this.currentPage);
          }
        });
      }
     // appendCards(currentPage);

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
    
      this.cardsList.addEventListener('click', (event) => {
        const card = event.target.closest('.card');
    
        if (card) {
          const cardId = card.getAttribute('data-card-id');
          const cardData = this.allCards.find((cardObj) => Number(cardObj.id) === Number(cardId));
    
          if (cardData) {
            const cardInfoComponents = [];
            while (divCardInfoContainer.hasChildNodes()) {
              divCardInfoContainer.removeChild(divCardInfoContainer.firstChild);
            }
            // Card Name
            const divCardName = this.createDivWithClass('card-name');
            divCardName.textContent = cardData.name;
            cardInfoComponents.push(divCardName);
    
            const divCardAttribute = this.createDivWithClass('card-attr');
            divCardAttribute.textContent = `[${cardData.localizedAttribute}${cardData.localizedProperty ? `/${cardData.localizedProperty}` : ''}]`;
            cardInfoComponents.push(divCardAttribute);
            
            // Assign Monster Cards (ATK, DEF, Level, Link Arrows, etc.)
            const divAtkAndDef = this.createDivWithClass('atk-def-container');
            this.assignMonsterCards(cardData, divAtkAndDef);
            if (divAtkAndDef.childNodes.length > 0) {
              cardInfoComponents.push(divAtkAndDef);
            }

            // Card Effect
            // const divCardEffect = this.createDivWithClass('card-effect');
            // divCardEffect.textContent = cardData.effectText;
            // cardInfoComponents.push(divCardEffect);
    
            // Add all card info components to the card info container
            cardInfoComponents.forEach(component => divCardInfoContainer.appendChild(component));
            body.appendChild(divCardInfoContainer);

          }
        }
      });
    }
            
    createDivWithClass(className) {
      const div = document.createElement('div');
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
        const divCardAtk = this.createDivWithClass('atk-def');
        divCardAtk.textContent = `ATK/${cardData.atk}`;
        componentsAtkDef.push(divCardAtk);
      } 
    
      if (cardData.hasOwnProperty('def')) {
        const divCardDef = this.createDivWithClass('atk-def');
        divCardDef.textContent = `DEF/${cardData.def}`;
        componentsAtkDef.push(divCardDef);
      }

      if (cardData.properties) {
        const thirdProperty = cardData.properties[2] ? '/' + cardData.properties[2] : '';
        const fourthProperty = cardData.properties[3] ? '/' + cardData.properties[3] : '';
        const divCardProperties = this.createDivWithClass('props');
        divCardProperties.textContent = `[${cardData.properties[0]}/${cardData.properties[1]}${thirdProperty}${fourthProperty}]`;
        componentsProperties.push(divCardProperties);
      }

      if (cardData.effectText) {
        const divCardEffect = this.createDivWithClass('card-effect');
        divCardEffect.textContent = cardData.effectText;
        componentEffectText.push(divCardEffect);
      }
    
      if (cardData.hasOwnProperty('linkRating')) {
        const divLinkRating = this.createDivWithClass('atk-def');
        divLinkRating.textContent = `Link-${cardData.linkRating}`;
        componentsAtkDef.push(divLinkRating);
      } 
    
      if (cardData.hasOwnProperty('level')) {
        const divCardLvl = this.createDivWithClass('lvl');
        divCardLvl.textContent = `☆${cardData.level}`;
        componentsRankLevel.push(divCardLvl);
      }
    
      if (cardData.hasOwnProperty('rank')) {
        const divCardRank = this.createDivWithClass('rank');
        divCardRank.textContent = `★${cardData.rank}`;
        componentsRankLevel.push(divCardRank);
      }
    
      if (cardData.hasOwnProperty('linkArrows')) {
        const divLinkArrows = this.createDivWithClass('link-arrows');
        divLinkArrows.textContent = this.convertToArrows(cardData.linkArrows);
        componentsLinkArrows.push(divLinkArrows);
      }

      if (cardData.hasOwnProperty('pendScale')) {
        const divCardPendScale = this.createDivWithClass('pend-scale');
        divCardPendScale.textContent = `◈${cardData.pendScale}`;
        componentPendScale.push(divCardPendScale);
      }
    
      if (cardData.pendEffect) {
        const divCardPendEffect = this.createDivWithClass('pend-effect');
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

const renderCards = new RenderCards();
//renderCards.scrollListener()
// Export any functions or modules you need
//export { renderCards };
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
  //renderCards();

class RenderCards {
    constructor() {
        this.cardsList = document.querySelector('.cards-list');
        this.cardsPerPage = 30;
        this.currentPage = 1;
        this.allCards = [];
        this.loadCardsData();
        //this.allCards = GetCards.renderCards();
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

    
    
    displayCardInfo() {
      const body = document.querySelector('body');
      const divCardName = document.createElement('div')
      divCardName.classList.add('card-name');
      const divCardAttribute = document.createElement('div')
      divCardAttribute.classList.add('card-attr');
      const divCardEffect = document.createElement('div');
      divCardEffect.classList.add('card-effect');
      const divCardPendEffect = document.createElement('div');
      divCardPendEffect.classList.add('card-pend-effect');
      const divCardPendScale = document.createElement('div');
      divCardPendScale.classList.add('card-pend-scale');

      const divCardAtk = document.createElement('div');
      const divCardDef = document.createElement('div');
      const divAtkAndDef = document.createElement('div');
      const divCardLvl = document.createElement('div');
      const divCardProperties = document.createElement('div');
      const divCardInfoContainer = document.createElement('div');
      divCardInfoContainer.classList.add('card-info-container');

      this.cardsList.addEventListener('click', (event) => {
        const card = event.target.closest('.card');

        if (card) {
          const cardId = card.getAttribute('data-card-id');
          const cardData = this.allCards.find((cardObj) => Number(cardObj.id) === Number(cardId));
  
          if (cardData) {
            divCardName.textContent = cardData.name;
            if (cardData.localizedProperty) {
              divCardAttribute.textContent = `[${cardData.localizedAttribute}/${
                                                cardData.localizedProperty}]`;
            } else {
              divCardAttribute.textContent = `[${cardData.localizedAttribute}]`
            }
            function convertToArrows(arr) {
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
            
              // Define the custom order of arrow symbols
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
            
            function assignMonsterCards() {

                if (cardData.hasOwnProperty('atk')) {
                  divCardAtk.textContent = `ATK/${cardData.atk}`
                  divAtkAndDef.appendChild(divCardAtk);
                } 
                if (cardData.hasOwnProperty('def')) {
                  divCardDef.textContent = `DEF/${cardData.def}`
                  divAtkAndDef.appendChild(divCardDef);
                } 
                if (cardData.hasOwnProperty('linkRating')) {
                  divCardDef.textContent = `Link-${cardData.linkRating}`;
                  divAtkAndDef.appendChild(divCardDef);
                } //ALREADY IN THE divCardLvl!
                if (cardData.hasOwnProperty('level') || cardData.hasOwnProperty('rank') ||
                    cardData.hasOwnProperty('linkArrows') || cardData.hasOwnProperty('linkRating')) {
                  cardData.hasOwnProperty('level') ? divCardLvl.textContent = `☆${cardData.level}` :
                  cardData.hasOwnProperty('rank') ? divCardLvl.textContent = `★${cardData.rank}` :
                  cardData.hasOwnProperty('linkArrows') ? 
                  divCardLvl.textContent = convertToArrows(cardData.linkArrows) : ''
                }
                if (cardData.properties) {
                  let thirdProperty = '';
                  let fourthProperty = '';
                  if (cardData.properties[2]) {
                    thirdProperty = '/' + cardData.properties[2]
                  }
                  if (cardData.properties[3]) {
                    fourthProperty = '/' + cardData.properties[3];
                  }
                  divCardProperties.textContent = 
                                        '[' + cardData.properties[0] + '/' + 
                                        cardData.properties[1] + thirdProperty + fourthProperty + ']'
                } 
                if (cardData.pendEffect) {
                  divCardPendEffect.textContent = `[Pendulum Effect]\n ${cardData.pendEffect}`;
                }
                if (cardData.hasOwnProperty('pendScale')) {
                  divCardPendScale.textContent = `◈${cardData.pendScale}`;
                }
              }
            
            divCardEffect.textContent = cardData.effectText;
            if (cardData.hasOwnProperty('pendScale') || cardData.pendEffect) {
              assignMonsterCards();
              divCardInfoContainer.append(divCardPendScale, divCardLvl || '',
              divAtkAndDef || '', divCardAttribute, divCardName, 
              divCardProperties || '', divCardEffect, 
              divCardPendEffect || '');
              body.append(divCardInfoContainer);
            } else if (cardData.hasOwnProperty('atk') || cardData.properties) {
              if (document.querySelector('.card-pend-effect')) {
                while (divCardInfoContainer.hasChildNodes()) {
                  divCardInfoContainer.removeChild(divCardInfoContainer.firstChild);
                }
              }
              if (document.querySelector('.card-pend-scale')) {
                while (divCardInfoContainer.hasChildNodes()) {
                  divCardInfoContainer.removeChild(divCardInfoContainer.firstChild);
                }
              }
              assignMonsterCards();
              divCardInfoContainer.append(divCardLvl || '',
              divAtkAndDef || '', divCardAttribute, divCardName, 
              divCardProperties || '',
              divCardEffect);
              body.append(divCardInfoContainer)
            } else {
              if (document.querySelector('.card-info-container')) {
                while (divCardInfoContainer.hasChildNodes()) {
                  divCardInfoContainer.removeChild(divCardInfoContainer.firstChild);
                }
                body.removeChild(divCardInfoContainer);
              }
              divCardInfoContainer.append(divCardName, 
                                        divCardAttribute,
                                        divCardEffect);
              body.append(divCardInfoContainer)
            }

          }
        }
      });
    }
    // assignSpellAndTrapCards() {

    // }
}

const renderCards = new RenderCards();
//renderCards.scrollListener()
// Export any functions or modules you need
//export { renderCards };
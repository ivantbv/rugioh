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
}

const renderCards = new RenderCards();
//renderCards.scrollListener()

// const cardsPerPage = 50;
// // Keep track of the current page
// let currentPage = 1;

// // Function to render cards for a specific page
// function appendCards(page) {
//   const startIndex = (page - 1) * cardsPerPage;
//   const endIndex = startIndex + cardsPerPage;

//   for (let i = startIndex; i < endIndex && i < allCards.length; i++) {
//     // Render each card here

//   }
// }
// // Initial render
// appendCards(currentPage);

// // When the user scrolls to the bottom of the page, load more cards
// window.addEventListener('scroll', () => {
//   if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
//     currentPage++;
//     appendCards(currentPage);
//   }
// });

// Export any functions or modules you need
//export { renderCards };
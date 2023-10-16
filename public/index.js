let fetchedData;
function fetchData() {
  return fetch('http://localhost:3000/api/all-cards')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      //12180 cards in the all_cards_data.json
      fetchedData = data;
      return data;
      //console.log('Received data from the server:', data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}
export { fetchData };
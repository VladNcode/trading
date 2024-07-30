let favoriteSymbols = [];
let allSymbols = [];

const moveSymbol = (sourceArray, targetArray, symbol) => {
  const index = sourceArray.findIndex(s => s.symbol === symbol);
  if (index !== -1) {
    const [ticker] = sourceArray.splice(index, 1);
    targetArray.push(ticker);
  }
};

const getData = async () => {
  const response = await fetch('/api/tickers');
  const data = await response.json();

  favoriteSymbols = data.favorites;
  allSymbols = data.all;

  return data;
};

const handleFavoriteClick = async (event, symbol, action) => {
  event.preventDefault();

  // Optimistic update
  if (action === 'add') {
    moveSymbol(allSymbols, favoriteSymbols, symbol);
  } else {
    moveSymbol(favoriteSymbols, allSymbols, symbol);
  }

  updateTables(false);

  try {
    await fetch('/api/tickers/favorites', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol, action }),
    });
  } catch (error) {
    // Revert optimistic update on failure
    updateTables();
  }
};

const createTable = (data, containerId, title) => {
  const isFavorite = title === 'Favorite Symbols';

  const container = document.getElementById(containerId);
  container.innerHTML = ''; // Clear the container

  // Create table element
  const table = document.createElement('table');
  table.style.width = '70%';
  table.style.borderCollapse = 'collapse';
  table.style.margin = '50px 0';
  table.style.fontSize = '18px';
  table.style.textAlign = 'left';

  // Create table title
  if (title) {
    const caption = document.createElement('caption');
    caption.textContent = title;
    table.appendChild(caption);
  }

  // Create table header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  const symbolHeader = document.createElement('th');
  symbolHeader.textContent = 'Symbol';
  symbolHeader.style.padding = '12px';
  symbolHeader.style.borderBottom = '1px solid #ddd';
  headerRow.appendChild(symbolHeader);

  const priceHeader = document.createElement('th');
  priceHeader.textContent = 'Price';
  priceHeader.style.padding = '12px';
  priceHeader.style.borderBottom = '1px solid #ddd';
  headerRow.appendChild(priceHeader);

  const askHeader = document.createElement('th');
  askHeader.textContent = 'Ask';
  askHeader.style.padding = '12px';
  askHeader.style.borderBottom = '1px solid #ddd';
  headerRow.appendChild(askHeader);

  const bidHeader = document.createElement('th');
  bidHeader.textContent = 'Bid';
  bidHeader.style.padding = '12px';
  bidHeader.style.borderBottom = '1px solid #ddd';
  headerRow.appendChild(bidHeader);

  const actionHeader = document.createElement('th');
  actionHeader.textContent = 'Action';
  actionHeader.style.padding = '12px';
  actionHeader.style.borderBottom = '1px solid #ddd';
  headerRow.appendChild(actionHeader);

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement('tbody');

  for (const item of data) {
    const row = document.createElement('tr');

    const symbolCell = document.createElement('td');
    symbolCell.textContent = item.symbol;
    symbolCell.style.padding = '12px';
    symbolCell.style.borderBottom = '1px solid #ddd';
    row.appendChild(symbolCell);

    const priceCell = document.createElement('td');
    priceCell.textContent = item.price;
    priceCell.style.padding = '12px';
    priceCell.style.borderBottom = '1px solid #ddd';
    row.appendChild(priceCell);

    const askCell = document.createElement('td');
    askCell.textContent = item.ask;
    askCell.style.padding = '12px';
    askCell.style.borderBottom = '1px solid #ddd';
    row.appendChild(askCell);

    const bidCell = document.createElement('td');
    bidCell.textContent = item.bid;
    bidCell.style.padding = '12px';
    bidCell.style.borderBottom = '1px solid #ddd';
    row.appendChild(bidCell);

    const actionCell = document.createElement('td');
    actionCell.style.padding = '12px';
    actionCell.style.borderBottom = '1px solid #ddd';
    const actionButton = document.createElement('button');
    actionButton.textContent = isFavorite ? 'Remove from favorites' : 'Add to favorites';
    actionButton.addEventListener('click', event =>
      handleFavoriteClick(event, item.symbol, isFavorite ? 'remove' : 'add'),
    );
    actionCell.appendChild(actionButton);
    row.appendChild(actionCell);

    tbody.appendChild(row);
  }

  table.appendChild(tbody);
  container.appendChild(table);
};

const updateTables = async (shouldFetch = true) => {
  const data = shouldFetch ? await getData() : { favorites: favoriteSymbols, all: allSymbols };

  createTable(data.favorites, 'favoriteTableContainer', 'Favorite Symbols', true);
  createTable(
    data.all.filter(item => !favoriteSymbols.includes(item.symbol)),
    'tableContainer',
    'All Symbols',
    false,
  );
};

document.addEventListener('DOMContentLoaded', async () => {
  await updateTables();
});

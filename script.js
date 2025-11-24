const newsGrid = document.getElementById("newsGrid");

function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  const themeIcon = document.getElementById('themeIcon');
  const themeText = document.getElementById('themeText');
  
  if (newTheme === 'dark') {
    themeIcon.innerHTML = '<img src="./assets/sun-1.svg">';
    themeText.textContent = 'Light Mode';
  } else {
    themeIcon.innerHTML = '<img src="./assets/moon.svg">';
    themeText.textContent = 'Dark Mode';
  }
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  const themeIcon = document.getElementById('themeIcon');
  const themeText = document.getElementById('themeText');
  
  if (savedTheme === 'dark') {
    themeIcon.innerHTML = '<img src="./assets/sun-1.svg">';
    themeText.textContent = 'Light Mode';
  }
}

function buildCard(item) {
  const thumbnail = item.thumbnail || item.enclosure?.url || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop';
  const description = item.description || 'Click to read the full story...';
  
  return `
    <div class="card">
      <img src="${thumbnail}" alt="${item.title}" />
      <div class="card-content">
        <div class="card-title">${item.title}</div>
        <div class="card-desc">${description}</div>
        <a href="${item.link}" target="_blank" class="read-more">
          Read full story →
        </a>
      </div>
    </div>
  `;
}

async function loadNews() {
  newsGrid.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading the latest news...</p></div>';
  try {
    const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://feeds.bbci.co.uk/news/rss.xml');
    const data = await res.json();
    
    if (!data.items || data.items.length === 0) {
      newsGrid.innerHTML = '<div class="loading"><p>No news available at the moment. Please try again later.</p></div>';
      return;
    }
    
    newsGrid.innerHTML = '<div class="news-grid">' + data.items.map(buildCard).join('') + '</div>';
  } catch (err) {
    newsGrid.innerHTML = '<div class="loading"><p>Oops! Failed to load news. Please check your connection and try again.</p></div>';
    console.error(err);
  }
}

loadTheme();
window.onload = loadNews;
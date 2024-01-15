const global = {
    currentPage: window.location.pathname,
    search: {
      term: '',
      type: '',
      page: 1,
      totalPages: 1,
      totalResults: 0,
    },
    api: {
      apiKey: 'ff1866aee414c0801edfa64de3a28981',
      apiUrl: 'https://api.themoviedb.org/3/'
    }
};

// FETCHING 20 POPULAR MOVIES AND INJECCTING INTO THE DIV OF POPULAR MOVIIES
async function displayPopularMovies() {
    const {results} = await fetchAPIData('movie/popular')
    
    results.forEach(movie => {
        const div = document.createElement('div')
        div.classList.add('card')
        div.innerHTML = `
        <a href="show-details.html?id=${movie.id}">
        ${
           movie.poster_path
           ? `<img 
           src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
           class="card-img-top" 
           alt="${movie.title}">`
            : `<img 
           src="images/no-image.jpg" 
           class="card-img-top" 
           alt="${movie.title}">`
        }
    </a>
    <div class="body-card">
        <h5 class="card-ttle">${movie.title} </h5>
        <p class="card-text">
            <small class="text-muted">Release: ${movie.release_date}</small>
        </p>
    </div>
        `;

        document.querySelector('#popular-movies').appendChild(div)
    });
}

// FETCHING 20 TV SHOWS AND INJECCTING INTO THE DIV OF TV SHOWS
async function displayPopularShows() {
    const {results} = await fetchAPIData('tv/popular')
    
    results.forEach(show => {
        const div = document.createElement('div')
        div.classList.add('card')
        div.innerHTML = `
        <a href="tv-details.html?id=${show.id}">
        ${
           show.poster_path
           ? `<img 
           src="https://image.tmdb.org/t/p/w500${show.poster_path}" 
           class="card-img-top" 
           alt="${show.name}">`
            : `<img 
           src="images/no-image.jpg" 
           class="card-img-top" 
           alt="${show.name}">`
        }
    </a>
    <div class="body-card">
        <h5 class="card-ttle">${show.name} </h5>
        <p class="card-text">
            <small class="text-muted">Air Date: ${show.first_air_date}</small>
        </p>
    </div>
        `;

        document.querySelector('#popular-shows').appendChild(div)
    });
}

// DISPLAYING MOVIE DETAILS WHEN CLICKED ON A PARTICULAR MOVIE
async function displayMovieDetails() {
    const movieId = window.location.search.split('=')[1];


    const movie = await fetchAPIData(`movie/${movieId}`)


    // OVERLAY FOR BACKGROUND IMAGE
    displayBackgroundImage('movie', movie.backdrop_path);


    const div = document.createElement('div');
    div.innerHTML = `  <div class="details-top">
    <div>
    ${
        movie.poster_path
        ? `<img 
        src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
        class="card-img-top" 
        alt="${movie.title}">`
         : `<img 
        src="images/no-image.jpg" 
        class="card-img-top" 
        alt="${movie.title}">`
     }
    </div>
    <div>
      <h2>${movie.title}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${movie.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Release Date: ${movie.release_date} </p>
      <P>
        ${movie.overview}
      </P>
      <h5>Genres</h5>
      <ul class="list-group">
        ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
      </ul>
      <a href="3" target="_blank" class="btn">${movie.homepage}</a>
    </div>
  </div>
  <div class="Details-bottom">
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Budget:</span>$${addCommasToNumber(movie.budget)}</li>
      <li><span class="text-secondary">Revenue:</span>$${addCommasToNumber(movie.revenue)}</li>
      <li><span class="text-secondary">Runtime:</span>${movie.runtime} Minutes</li>
      <li><span class="text-secondary">Status:</span>${movie.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${movie.production_companies.map((company) => `<span>${company.name}</span>`).join('')}</div>
  </div>`;

  document.querySelector('#movie-details').appendChild(div);
}



// DISPLAYING SHOW DETAILS
async function displayShowDetails() {
    const showId = window.location.search.split('=')[1];


    const show = await fetchAPIData(`tv/${showId}`)


    // OVERLAY FOR BACKGROUND IMAGE
    displayBackgroundImage('tv', show.backdrop_path);


    const div = document.createElement('div');
    div.innerHTML = `  <div class="details-top">
    <div>
    ${
        show.poster_path
        ? `<img 
        src="https://image.tmdb.org/t/p/w500${show.poster_path}" 
        class="card-img-top" 
        alt="${show.name}">`
         : `<img 
        src="images/no-image.jpg" 
        class="card-img-top" 
        alt="${show.name}">`
     }
    </div>
    <div>
      <h2>${show.name}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${show.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Last Air Date: ${show.last_air_date} </p>
      <P>
        ${show.overview}
      </P>
      <h5>Genres</h5>
      <ul class="list-group">
        ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
      </ul>
      <a href="3" target="_blank" class="btn">${show.homepage}</a>
    </div>
  </div>
  <div class="Details-bottom">
    <h2>Show Info</h2>
    <ul>
      <li><span class="text-secondary">Number Of Episodes:</span> ${show.number_of_episodes}</li>
      <li><span class="text-secondary">Last Episode To Air:</span> ${show.last_episode_to_air.name}</li>
      <li><span class="text-secondary">Status:</span> ${show.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${show.production_companies.map((company) => `<span>${company.name}</span>`).join('')}</div>
  </div>`;

  document.querySelector('#show-details').appendChild(div);
}

// DISPLAY BACKDROP ON DETAIL PAGES
function displayBackgroundImage(type, backgroundPath) {
    const overLayDiv = document.createElement('div');
    overLayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
    overLayDiv.style.backgroundSize = 'cover';
    overLayDiv.style.backgroundPosition = 'center';
    overLayDiv.style.backgroundRepeat = 'no-repeat';
    overLayDiv.style.height = '100vh';
    overLayDiv.style.width = '100vw';
    overLayDiv.style.position = 'absolute';
    overLayDiv.style.top = '0';
    overLayDiv.style.left = '0';
    overLayDiv.style.zIndex = '-1';
    overLayDiv.style.opacity = '0.1';

    if (type === 'movie') {
        document.querySelector('#movie-details').appendChild(overLayDiv);
    } else {
      document.querySelector('#show-details').appendChild(overLayDiv);  
    }
}

// SEARCHING FOR MOVIES/SHOWS
async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');

  if (global.search.term !== '' && global.search.term !== null) {
    const { results, total_pages, page, total_results } = await searchAPIData();

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    
    if (results.length === 0) {
      showAlert('No results found');
      return;
    }

    displaySearchResults(results);

    document.querySelector('#search-term').value = '';
  } else {
    showAlert('please enter a search term');
  }
}

function displaySearchResults(results) {
  // CLEAR PREVIOUS RESULTS
  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';
  


  results.forEach(result => {
    const div = document.createElement('div')
    div.classList.add('card')
    div.innerHTML = `
    <a href="${global.search.type}-details.html?id=${result.id}">
    ${
       result.poster_path
       ? `<img 
       src="https://image.tmdb.org/t/p/w500/${result.poster_path}" 
       class="card-img-top" 
       alt="${global.search.type === 'movie' ? result.title : result.name}">`
        : `<img 
       src="images/no-image.jpg" 
       class="card-img-top" 
       alt="${global.search.type === 'movie' ? result.title : result.name}">`
    }
  </a>
  <div class="body-card">
    <h5 class="card-ttle">${global.search.type === 'movie' ? result.title : result.name} </h5>
    <p class="card-text">
        <small class="text-muted">Release: ${global.search.type === 'movie' ? result.release_date : result.first_air_date}</small>
    </p>
  </div>
    `;

    document.querySelector('#search-results-heading').innerHTML = `
             <h2>${results.length} of ${global.search.totalResults} results for ${global.search.term}</h2>
    `;

    document.querySelector('#search-results').appendChild(div);
});

displayPagination();

}

// CREATE AND DISPLAY PAGINATION FOR SEARCH
function displayPagination() {
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = `
  <button class="btn btn-primary" id="prev">Prev</button>
  <button class="btn btn-primary" id="next">Next</button>
  <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
  `;

  document.querySelector('#pagination').appendChild(div);

  // Disable prev button if on first page
  if (global.search.page === 1) {
    document.querySelector('#prev').disabled = true;
  }

  // Disable next button if on last page
  if (global.search.page === global.search.totalPages) {
    document.querySelector('#next').disabled = true;
  }

  // Next page
  document.querySelector('#next').addEventListener('click', async () => {
    global.search.page++;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });

  // Prev page
  document.querySelector('#prev').addEventListener('click', async () => {
    global.search.page--;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });
}



// FETCHING 20 TV SHOWS AND INJECCTING INTO THE DIV OF TV SHOWS
async function displayPopularShows() {
const {results} = await fetchAPIData('tv/popular')

results.forEach(show => {
    const div = document.createElement('div')
    div.classList.add('card')
    div.innerHTML = `
    <a href="tv-details.html?id=${show.id}">
    ${
       show.poster_path
       ? `<img 
       src="https://image.tmdb.org/t/p/w500${show.poster_path}" 
       class="card-img-top" 
       alt="${show.name}">`
        : `<img 
       src="images/no-image.jpg" 
       class="card-img-top" 
       alt="${show.name}">`
    }
</a>
<div class="body-card">
    <h5 class="card-ttle">${show.name} </h5>
    <p class="card-text">
        <small class="text-muted">Air Date: ${show.first_air_date}</small>
    </p>
</div>
    `;

    document.querySelector('#popular-shows').appendChild(div)
});
}


//  DISPLAY SLIDER MOVIES/ DISPLAYING "NOW PLAYING"
async function displaySlider() {
  const {results} = await fetchAPIData('movie/now_playing');

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');
    div.innerHTML = `
     <a href="movie-details.html?id=${movie.id}">
     <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      </a>
      <h4 class="swiper-rating">
      <i class="fas fa-star text-secondary"></i> ${movie.vote_average}
      </h4>
    `;

    document.querySelector('.swiper-wrapper').appendChild(div);

     initSwiper();
  });
 }

 function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2
      },
      700: {
        slidesPerView: 3
      },
      1200: {
        slidesPerView: 4
      },
    }
  });
 }

// FETCHING DATA FROM TDMB API AND JOINING WITH API KEY
async function fetchAPIData(endpoint) {
    const API_KEY = global.api.apiKey;
    const API_URL = global.api.apiUrl;

    showSpinner();

    const response = await fetch(
        `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
    );

    const data = await response.json();

    hideSpinner();

    return data;
} 

function showSpinner() {
    document.querySelector('.spinner').classList.add('show');
};

function hideSpinner() {
    document.querySelector('.spinner').classList.remove('show');
};
// SEARCH API 
async function searchAPIData() {
  const API_KEY ='ff1866aee414c0801edfa64de3a28981';
  const API_URL ='https://api.themoviedb.org/3/';

  showSpinner();

  const response = await fetch(
      `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`);

  const data = await response.json();

  hideSpinner();

  return data;
} 

function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
};

function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
};



//  HIGHLIGHTING / CHANGING THE COLOR OF THE CURRENT PAGE LINK
function highlightActiveLink() {
    const links = document.querySelectorAll('.nav-link')
    links.forEach(link => {
        if (link.getAttribute('href') === global.currentPage) {
            link.classList.add('active')
        }
    });
} 

// FUNCTION TO SHOW ALERT WHEN SEARCH TERM IS EMPTY
function showAlert(message, classNmame = 'error') {
  const alertEl = document.createElement('div')
  alertEl.classList.add('alert', classNmame);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(alertEl);
  
  setTimeout(() => {
    alertEl.remove();
  }, 3000);
}


function addCommasToNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// init app

// BASIC ROUTER FOR EACH PAGE
function init() {
    switch (global.currentPage) {
        case '/':   
        case '/index.html': 
        displaySlider();
        displayPopularMovies();   
            break;
        case '/shows.html':  
        displayPopularShows();
            break; 
        case '/movie-details.html':   
            displayMovieDetails();
            break;
        case '/search.html':
          search();
            break;
        case '/tv-details.html':
            displayShowDetails();
            break;
    
        default:
            break;
    }

    highlightActiveLink()    
}

document.addEventListener('DOMContentLoaded', init);
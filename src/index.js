import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('input#search-box'),
  listCountry: document.querySelector('.country-list'),
  infoCountry: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener(
  'input',
  debounce(onSearchCountries, DEBOUNCE_DELAY)
);

function onSearchCountries(e) {
  const nameCountry = e.target.value.trim();

  if (!nameCountry.length) {
    removeMarkup(refs.listCountry, refs.infoCountry);

    return;
  }

  fetchCountries(nameCountry)
    .then(countries => {
      if (countries.length > 10) {
        removeMarkup(refs.listCountry);

        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );

        return;
      }

      if (countries.length >= 2) {
        removeMarkup(refs.infoCountry);
        addMarkup(refs.listCountry, createListCountriesMarkup(countries));

        return;
      }

      removeMarkup(refs.listCountry);
      addMarkup(refs.infoCountry, createInfoCountryMarkup(countries));
    })
    .catch(() => {
      removeMarkup(refs.listCountry, refs.infoCountry);

      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function createListCountriesMarkup(countries) {
  return countries
    .map(
      country => `
        <li class="country-list__item">
            <img class="country-list__img" src="${country.flags.svg}" alt="${country.name.official}" />
            <p class="country-list__name">${country.name.official}</p>
          </a>
        </li>
    `
    )
    .join('');
}

function createInfoCountryMarkup([country]) {
  return `<div class="country-info-title">
            <img class="country-info-title__img" src="${
              country.flags.svg
            }" alt="${country.name.official}" />
            <p class="country-info-title__name">${country.name.official}</p>
          </div>
          <ul class="country-info-list">
            <li class="country-info-list__item">
                <p class="country-info-list__text"><b>Capital: </b>${
                  country.capital
                }</p>
            </li>
            <li class="country-info-list__item">
                <p class="country-info-list__text"><b>Population: </b>${
                  country.population
                }</p>
            </li>
            <li class="country-info-list__item">
                <p class="country-info-list__text"><b>Languages: </b>${Object.values(
                  country.languages
                ).join(', ')}</p>
            </li>
          </ul>
  `;
}

function addMarkup(ref, markup) {
  ref.innerHTML = markup;
}

function removeMarkup(...refs) {
  refs.forEach(ref => {
    ref.innerHTML = '';
  });
}

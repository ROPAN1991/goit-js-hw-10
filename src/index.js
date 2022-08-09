import './css/styles.css';
import { fetchCountries } from './fetchCountries'
import debounce from 'lodash.debounce'
import Notiflix from 'notiflix'

const DEBOUNCE_DELAY = 300;

const countryList = document.querySelector('.country-list')
const countryInfo = document.querySelector('.country-info')
const input = document.querySelector('#search-box')

function renderCountryFromList(country) {
  const {name: {official}, flags} = country
  return `
    <li>
      <img src='${flags.svg}' alt='flag'>
      <span>${official}</span>
    </li>
  `
}

function renderCountry(country) {
  const {name: {official}, capital: [capital], population, flags, languages} = country
  const lngs = Object.values(languages).join(', ')
  return `
    <div><img src='${flags.svg}' alt='flag'> <h1>${official}</h1></div>
    <ul>
      <li><b>Capital:</b> <span>${capital}</span></li>
      <li><b>Population:</b> <span>${population}</span></li>
      <li><b>Languages:</b> <span>${lngs}</span></li>
    </ul>
  `
}

const onInput = async (e) => {
  const value = e.target.value.trim()

  if (!value.length) return

  try {
    const response = await fetchCountries(value)
    const countries = await response.json()

    countryList.innerHTML = ''
    countryInfo.innerHTML = ''

    if (countries.length > 10) {
      Notiflix.Notify.warning("Too many matches found. Please enter a more specific name.");
    } else if (countries.length > 2 && countries.length < 10) {
      let html = ''
      countries.forEach(country => {
        html += renderCountryFromList(country)
      })
      countryList.insertAdjacentHTML('beforeend', html)

    } else if (countries.length === 1) {
      let html = ''
      countries.forEach(country => {
        html += renderCountry(country)
      })
      countryInfo.insertAdjacentHTML('beforeend', html)

    } else {
      if (response.status === 404) {
        Notiflix.Notify.failure("Oops, there is no country with that name");
      }
    }
  } catch {
    Notiflix.Notify.failure("Oops, there is no country with that name");
  }
}

const debouncedOnInput = debounce(onInput, DEBOUNCE_DELAY)

input.addEventListener('input', debouncedOnInput)
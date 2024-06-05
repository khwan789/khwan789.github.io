/*jslint es6:true*/
/* eslint-env es6 */
/* eslint-disable */


const englishSection = document.getElementById('english');
const koreanSection = document.getElementById('korean');

const englishLink = document.querySelector('header nav ul li:first-child a');
const koreanLink = document.querySelector('header nav ul li:last-child a');

englishLink.addEventListener('click', showEnglish);
koreanLink.addEventListener('click', showKorean);

function showEnglish(event) {
  event.preventDefault();
  englishSection.style.display = 'block';
  koreanSection.style.display = 'none';
}

function showKorean(event) {
  event.preventDefault();
  koreanSection.style.display = 'block';
  englishSection.style.display = 'none';
}
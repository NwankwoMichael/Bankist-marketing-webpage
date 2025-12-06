'use strict';

const navigation = document.querySelector('.nav');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');
const allSections = document.querySelectorAll('.section');
const header = document.querySelector('.header');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const images = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');

///////////////////////////////////////
////////////// Functions //////////////

///////////////////////////////////////
// Navigation bar fade out effect junction

const navFadeOutEffect = function (event) {
  event.preventDefault();

  // looping through nav links to pinpoint intended event originator
  navigation.querySelectorAll('.nav__link').forEach(link => {
    // Gaurd clause
    if (!event.target.classList.contains('nav__link')) return;

    // reducing the opacity to implement the fadeout effect
    navigation.querySelector('img').style.opacity = '0.5';
    link.style.opacity = '0.5';

    // Setting the opacity of event originator to 1
    event.target.style.opacity = '1';
  });

  // undoing the mouseover effect
  navigation.addEventListener('mouseout', function () {
    navigation.querySelectorAll('.nav__link').forEach(link => {
      link.style.opacity = '1';
    });
    navigation.querySelector('img').style.opacity = '1';
  });
};

/////// Modal functions //////
// Function for displaying modal
const showModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

// Function for closing modal
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

const closeModalByEsc = function (e) {
  // Gaurd clause
  if (e.key !== 'Escape') return;

  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// Function for closung modal at the click of any part of the screen
const screenClickModalClose = function () {
  closeModal();
};

//////////////////////////////////////////////
// Implementing sticky bar
const navHeight = navigation.getBoundingClientRect();

const stickyCallback = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    navigation.classList.add('sticky');
  } else navigation.classList.remove('sticky');
  console.log();
};

const headerObserver = new IntersectionObserver(stickyCallback, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight.height}px`,
});

headerObserver.observe(header);

////////////////////////////////////////////
// Implementing section display based on scroll

// intersection callback function
const sectionDisplay = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');

    observer.unobserve(entry.target);
  });
};

// new intersection observer
const sectionObserver = new IntersectionObserver(sectionDisplay, {
  root: null,
  threshold: 0.15,
});

// looping through sections and observing each
allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

/////////////////////////////////////////////
// Web page Image Display

// imgcallback for intersectionObserver
const imgDisplayCallback = function (entries, observer) {
  // looping through entries
  entries.forEach(entry => {
    // pass condition that triggers the desired effects on target
    if (entry.isIntersecting) {
      // Replacing low quality image with higher digital quality image
      entry.target.src = entry.target.dataset.src;

      // Listening for load event and removing lazy-img class
      entry.target.addEventListener('load', function () {
        entry.target.classList.remove('lazy-img');
      });

      //Unobserving the target
      observer.unobserve(entry.target);
    }
  });
};

// intersectionObserver option argument
const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: '200px',
};
const imgObserver = new IntersectionObserver(imgDisplayCallback, obsOptions);

images.forEach(image => {
  imgObserver.observe(image);
});

// //////Implementing the slide component ////////

// variable for tracking current slide
let activeSlide = 0;
const maxSlides = slides.length - 1;

// Function for slide display
const displaySlide = function (s) {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${(i - s) * 100}%)`;
  });
};

// function for nexting slides
const nextSlide = function (s) {
  // Checking current slide's position

  if (activeSlide === maxSlides) {
    activeSlide = 0;
  } else {
    activeSlide++;
  }

  displaySlide(activeSlide);

  // Calling the function that implements the dot representation of active slide
  displayActiveDot(activeSlide);
};

// function for selecting previous slides
const prevSlide = function (s) {
  // Checking current slide's position
  if (activeSlide === 0) {
    activeSlide = maxSlides;
  } else {
    activeSlide--;
  }

  // display slide
  displaySlide(activeSlide);

  // Calling the function that implements the dot representation of active slide
  displayActiveDot(activeSlide);
};

// function for displaying slider's composnent dot indicator
const displayDots = function () {
  slides.forEach((_, i) => {
    // string for dynamically created HTML button element
    const html = `<button class="dots__dot" data-slide="${i}"></button>`;
    dotsContainer.insertAdjacentHTML('beforeend', html);
  });

  // implementing dot representation of default active slide
  displayActiveDot(activeSlide);
};

const displayActiveDot = function (s) {
  document.querySelectorAll('.dots__dot').forEach(dot => {
    dot.classList.remove('dots__dot--active');
  });

  document
    .querySelector(`.dots__dot[data-slide="${s}"]`)
    .classList.add('dots__dot--active');
};

// function for default display
const init = function () {
  // initial slide display (DEFAULT)
  displaySlide(0);

  // Default dots display
  displayDots();
};

init();
////////////// Event Handler ///////////

// mouseover effect on navigation bar via delegation
navigation.addEventListener('mouseover', navFadeOutEffect);

// ///////////// Modal window ////////////////////

// Displaying modal at the click of btnsOpenModal
btnsOpenModal.forEach(btn => {
  btn.addEventListener('click', showModal);
});

// CLosing modal at the click of btnCloseModal
btnCloseModal.addEventListener('click', closeModal);

// closing modal if escape key is pressed
document.addEventListener('keydown', closeModalByEsc);

// Closing modal at the click of any part of the screen except the modal
overlay.addEventListener('click', screenClickModalClose);

// Smoth scroll
btnScrollTo.addEventListener('click', function () {
  section2.scrollIntoView({ behavior: 'smooth' });
});

// ///// Navigation Bar Smoth Scroll //////////

// handling navigation click event via delegation
navigation.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (!e.target.classList.contains('nav__link')) return;

  const targetId = e.target.getAttribute('href');
  document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
});

// /////// Handling the operations buttons click event ////////
tabContainer.addEventListener('click', function (e) {
  // Gaurd clause
  if (!e.target.classList.contains('operations__tab')) return;

  // looping through each button
  tabContainer.querySelectorAll('.operations__tab').forEach(btn => {
    // Removing the active class from each button
    btn.classList.remove('operations__tab--active');
  });

  // Remove active class from each tab content
  tabsContent.forEach(tab => {
    tab.classList.remove('operations__content--active');
  });

  const index = e.target.dataset.tab;
  // adding the active class to the source of the event
  e.target.classList.add('operations__tab--active');

  // Display related tab content
  document
    .querySelector(`.operations__content--${index}`)
    .classList.add(`operations__content--active`);
});

// ////// Event handler for slide component

// Handling the click of the right button
btnRight.addEventListener('click', nextSlide);

// Handling the click event of the left button
btnLeft.addEventListener('click', prevSlide);

// Handling the keydown event of the right and left arrow keys
document.addEventListener('keydown', function (e) {
  // setting condition for right key functionality
  if (e.key === 'ArrowRight') nextSlide(activeSlide);

  // Setting condition for left key functionality
  if (e.key === 'ArrowLeft') prevSlide(activeSlide);
});

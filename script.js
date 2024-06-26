'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const header = document.querySelector('.header');
const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  'We use cookies to improve functionality and for analytical purposes. <button class="btn btn--close-cookie">Got it!</button>';
header.append(message);

document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

message.style.backgroundColor = '#37383d';
message.style.width = '104%';
message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();

  // Rough scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  //Smooth scrolling (old way)
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  //Smooth scrolling (new way)
  section1.scrollIntoView({ behavior: 'smooth' });
});

const links = document.querySelector('.nav__links');
links.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    document
      .querySelector(e.target.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  }
});

//Tabs
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabContents = document.querySelectorAll('.operations__content');

tabContainer.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('operations__tab')) {
    const clicked = e.target.closest('.operations__tab');
    tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
    clicked.classList.add('operations__tab--active');
    tabContents.forEach(content =>
      content.classList.remove('operations__content--active')
    );
    document
      .querySelector(`.operations__content--${clicked.dataset.tab}`)
      .classList.add(`operations__content--active`);
  }
});

//Menu fade
function handleHover(e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(sibling => {
      if (sibling !== link) sibling.style.opacity = this;
    });
    logo.style.opacity = this;
  }
}
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//Sticky menu (inefficient method)
// const stickyCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   if (this.window.scrollY > stickyCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

//Sticky menu
function stickyMenuMain() {
  function stickyMenu(entries) {
    const entry = entries[0];
    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
  }
  const stickyOptions = {
    root: null,
    threshold: 0,
    rootMargin: `-${nav.getBoundingClientRect().height}px`,
  };
  const headerObserver = new IntersectionObserver(stickyMenu, stickyOptions);
  headerObserver.observe(header);
}

//Section reveal
function sectionReveal() {
  function revealSection(entries, observer) {
    const entry = entries[0];
    if (entry.isIntersecting) {
      entry.target.classList.remove('section--hidden');
      observer.unobserve(entry.target);
    }
  }
  const sectionOptions = {
    root: null,
    threshold: 0.2,
  };
  const sectionObserver = new IntersectionObserver(
    revealSection,
    sectionOptions
  );
  const allSections = document.querySelectorAll('.section');
  allSections.forEach(function (section) {
    section.classList.add('section--hidden');
    sectionObserver.observe(section);
  });
}

//Lazy images
function lazyImages() {
  const images = document.querySelectorAll('img[data-src]');
  function revealImage(entries, observer) {
    const entry = entries[0];
    if (entry.isIntersecting) {
      entry.target.setAttribute('src', entry.target.dataset.src);
      entry.target.addEventListener('load', function () {
        entry.target.classList.remove('lazy-img');
      });
      observer.unobserve(entry.target);
    }
  }
  const imageOptions = {
    root: null,
    threshold: 0.2,
    rootMargin: '200px',
  };
  const imageObserver = new IntersectionObserver(revealImage, imageOptions);

  images.forEach(image => imageObserver.observe(image));
}

//Slider
function slider() {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  let currentSlide = 0;
  const maxSlide = slides.length - 1;
  slides.forEach(
    (slide, i) => (slide.style.transform = `translateX(${100 * i}%)`)
  );

  function createDots() {
    slides.forEach(function (slide, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  }

  function displayCurrentDot(slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(d => d.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  }

  function goToSlide(s) {
    slides.forEach(
      (slide, i) => (slide.style.transform = `translateX(${100 * (i - s)}%)`)
    );
    displayCurrentDot(s);
  }

  function nextSlide() {
    if (currentSlide === maxSlide) currentSlide = 0;
    else currentSlide++;
    goToSlide(currentSlide);
  }

  function previousSlide() {
    if (currentSlide === 0) currentSlide = maxSlide;
    else currentSlide--;
    goToSlide(currentSlide);
  }

  function init() {
    createDots();
    goToSlide(0);
  }

  init();

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', previousSlide);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') previousSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      currentSlide = Number(e.target.dataset.slide);
      goToSlide(currentSlide);
    }
  });
}

stickyMenuMain();
sectionReveal();
lazyImages();
slider();

'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header');
const learnMore = document.querySelector('.btn--scroll-to');
const sectionLearnMore = document.getElementById('section--1');
const message = document.createElement('div');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window

const openModal = function (event) {
  event.preventDefault();
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

message.classList.add('cookie-message');
message.innerHTML = `We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>`;
header.prepend(message);
document.querySelector('.btn--close-cookie').addEventListener('click', function(event) {
  event.preventDefault();
  message.remove();
})

learnMore.addEventListener('click', function() {
  sectionLearnMore.scrollIntoView({behavior: "smooth"});
})

document.querySelector('.nav__links').addEventListener('click', function(event) {
  if (event.target.classList.contains('nav__link')) {
    event.preventDefault();
    document.querySelector(event.target.getAttribute('href')).scrollIntoView({behavior: "smooth"});
  }    
});

tabsContainer.addEventListener('click', function(event) {
  if (!event.target.closest('.operations__tab')) return;
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  event.target.closest('.operations__tab').classList.add('operations__tab--active');
  tabContent.forEach(elem => elem.classList.remove('operations__content--active'));
  document.querySelector(`.operations__content--${event.target.closest('.operations__tab').dataset.tab}`).classList.add('operations__content--active');
})

const fadeInOut = function(event, opac) {
  if (event.target.classList.contains('nav__link')) {
    const link = event.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = opac;
      };      
    });
    logo.style.opacity = opac;
  }
}
nav.addEventListener('mouseover', event => fadeInOut(event, 0.5));
nav.addEventListener('mouseout', event => fadeInOut(event, 1));

const navHeight = nav.getBoundingClientRect().height;
const obsHeaderOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
}
const obsHeaderCallback = function(entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }  
}
const headerObserver = new IntersectionObserver(obsHeaderCallback, obsHeaderOptions);
headerObserver.observe(header);

const sections = document.querySelectorAll('.section');
const revealSection = function(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    return;
  }
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);  
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15
}); 
sections.forEach(function(section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

const lazyImgs = document.querySelectorAll('img[data-src]');
const lazyShow = function(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function() {
     entry.target.classList.remove('lazy-img');
  }) 
  observer.unobserve(entry.target);
}
const lazyObserver = new IntersectionObserver(lazyShow, {
  root: null,
  threshold: 0,
  rootMargin: '200px'
});
lazyImgs.forEach(img => lazyObserver.observe(img));

const slider = function() {
  const slides = document.querySelectorAll('.slide');
  let currSlide = 0;
  const maxSlide = slides.length;
  const goToSlide = function(slide) {
    slides.forEach((s, index) => {
      s.style.transform = `translateX(${(index - slide) * 100}%)`;
    })
  }
  const nextSlide = function() {
    if (currSlide === maxSlide - 1) {
      currSlide = 0;
    } else {
      currSlide++;
    }  
    goToSlide(currSlide);
    activateDot(currSlide);
  };
  const prevSlide = function() {
    if (currSlide === 0) {
      currSlide = maxSlide - 1;
    } else {
      currSlide--;   
    }
    goToSlide(currSlide);
    activateDot(currSlide);
  };
  document.querySelector('.slider__btn--left').addEventListener('click', prevSlide);
  document.querySelector('.slider__btn--right').addEventListener('click', nextSlide);

  document.addEventListener('keydown', function(event) {
    if (event.key === "ArrowRight") {
      nextSlide();
    } else if (event.key === "ArrowLeft") {
      prevSlide();
    }
  });
  const dotContainer = document.querySelector('.dots');
  const createDots = function() {
    slides.forEach(function(_, index) {
      dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${index}"></button>`);
    })
  }
  const activateDot = function(slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  }
  dotContainer.addEventListener('click', function(event) {
    if (event.target.classList.contains) {
      const {slide} = event.target.dataset;
      goToSlide(slide); 
      activateDot(slide);   
    }
  })
  const init = function() {
    createDots();
    goToSlide(0);
    activateDot(0);
  }
  init();
};
slider();
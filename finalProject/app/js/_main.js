const header = document.querySelector('.header');

// loading page
document.documentElement.classList.add('loading');
const loader = document.querySelector('.page-loader');
const loadingTime = 2000;
if(loader){
	setTimeout(function(){
		loader.classList.add('fade');
	}, loadingTime - 500);
	setTimeout(function(){
		document.documentElement.classList.remove('loading');
		loader.remove();
	}, loadingTime);
}



// blog section
let blogItems = document.querySelector('.blog__items').children;

// progressBar
const progressBar = document.querySelector('.header-progressBar');
document.addEventListener('scroll', function(){
	const maxScrollOffset = document.body.clientHeight - window.outerHeight;
	progressBar.style.width = `${scrollY / (maxScrollOffset / 100)}%`;

	for(const item of blogItems){
		const itemOffset = item.getBoundingClientRect().top;
		if(scrollY > itemOffset){
		}
		if(itemOffset <(window.outerHeight - (window.outerHeight / 5))){
			item.classList.add('active');
		}
		else{ item.classList.remove('active'); }
	}
});

// burger
const burgerBtn = document.querySelector('.header__burger');
const headerContent = document.querySelector('.header__content');
burgerBtn.addEventListener('click', function(){
	headerContent.classList.toggle('open');
	this.classList.toggle('active');
});

// header links
const links	= document.querySelectorAll('.header__list-link');
links.forEach(link => {
	link.addEventListener('click', function(event){
		event.preventDefault();

		const block = document.querySelector(link.getAttribute('href'));
		window.scrollTo(0, block.offsetTop - header.clientHeight);

		headerContent.classList.remove('open');
		burgerBtn.classList.remove('active');
	});
});



// theme
const modeSwitch = document.querySelector('.header-theme');
modeSwitch.addEventListener('click', function(){
	this.classList.toggle('switched');

	document.documentElement.getAttribute('data-theme') == 'light' ?
	document.documentElement.setAttribute('data-theme', 'dark') :
	document.documentElement.setAttribute('data-theme', 'light');
});
let date = new Date();
if(date.getHours() >= 21 || date.getHours() <= 6){
	modeSwitch.classList.toggle('switched');
	document.documentElement.setAttribute('data-theme', 'dark');
}



slider
class Slider{
	constructor(htmlObject){
		this.htmlObject = htmlObject;
		this.sliderTrack = this.htmlObject
		.querySelector(`.${this.htmlObject.classList[0]}__items`);
		this.slides = this.sliderTrack.children;

		this.prevArrow = this.htmlObject
		.querySelector(`.${this.htmlObject.classList[0]}__prev`);
		this.nextArrow = this.htmlObject
		.querySelector(`.${this.htmlObject.classList[0]}__next`);

		this.currentSlide = 0;
		this.slidesAmount = this.slides.length;

		this.displaySlide();


		this.prevArrow.addEventListener('click', () => this.prevSlide());
		this.nextArrow.addEventListener('click', () => this.nextSlide());
	}
	prevSlide(){
		(this.currentSlide - 1) < 0 ?
			this.currentSlide = this.slidesAmount - 1 : --this.currentSlide;
		this.displaySlide();
	}
	nextSlide(){
		(this.currentSlide + 1) >= this.slidesAmount ?
			this.currentSlide = 0 : ++this.currentSlide;
		this.displaySlide();
	}
	get prevSlideIndex(){
		return (this.currentSlide - 1) < 0 ?
			this.slidesAmount - 1 : this.currentSlide - 1;
	}
	get nextSlideIndex(){
		return (this.currentSlide + 1) >= this.slidesAmount ?
			0 : this.currentSlide + 1;
	}
	displaySlide(){
		for(const slide of this.slides){
			if(slide == this.slides[this.currentSlide]) continue; 
			slide.classList.remove('active');
			slide.classList.remove('prevSlide');
			slide.classList.remove('nextSlide');
		}
		this.slides[this.currentSlide].classList.add('active');
		this.slides[this.currentSlide].classList.remove('prevSlide');
		this.slides[this.currentSlide].classList.remove('nextSlide');

		this.slides[this.prevSlideIndex].classList.add('prevSlide');
		this.slides[this.nextSlideIndex].classList.add('nextSlide');
	}
}
const retroSlider = new Slider(document.querySelector('.retro-slider'));



// filters
const filters = document.querySelector('.portfolio__filters');
const selectedFilters = [];
const categories = ['html', 'css', 'js', 'responsive', 'slider', 'wordpress', 'php', 'videos', 'design'];
categories.forEach(category => {
	let filter = document.createElement('p');
	filter.textContent = category;
	filter.classList.add('portfolio__filters-item')
	filters.append(filter);
})
filters.addEventListener('click', function(event){
	const target = event.target;
	if(target.classList.contains('portfolio__filters-item')){
		const targetClassList = target.classList;

		if(targetClassList.contains('active')){
			targetClassList.remove('active');
			selectedFilters.splice(selectedFilters.indexOf(target.textContent), 1);
		}else{
			targetClassList.add('active');
			selectedFilters.push(target.textContent);
		}
	}

	console.log(selectedFilters);
	loadItemsFromFile('../posts/portfolio.txt', {
		destination: document.querySelector('.portfolio__items'),
		HTMLFunction: portfolioItem_formHTML,
		filterBy: {
			key: 'categories',
			values: selectedFilters
		},
		// amount: 6
	});
});

// loading pots from file
async function loadItemsFromFile(src, options){
  const response = await fetch(src);
  const text = await response.text();

  let itemsFromFile = text.split('\r\n').map(item => {
  	if(item !== undefined) return JSON.parse(item);
  });
  if('filterBy' in options){
  	if(options.filterBy.values.length > 0){
	  	itemsFromFile = itemsFromFile.filter(item => {
	  		if(item[options.filterBy.key].some(key => options.filterBy.values.includes(key))) return item;
	  	})
  	}
  }
  if('amount' in options && options.amount > -1){
  	itemsFromFile = itemsFromFile.splice(0, options.amount);
  }
  
  options.destination.innerHTML = '';
  itemsFromFile.forEach(item => {
  	options.destination.innerHTML += options.HTMLFunction(item);
  });
}
function portfolioItem_formHTML(object){
	return `
	<div class="portfolio__item" data-category="${object.categories.join(' ')}">
    <div class="portfolio__item-top">
      <img src="img/content/portfolio/${object.imgName}" alt="photo">
      <div class="portfolio__item-content">
        <p class="portfolio__item-name">Name: ${object.name}</p>
        <p class="portfolio__item-date">Date: ${object.date}</p>
        <p class="portfolio__item-technologies">Technologies: ${object.categories.join(' ')}</p>
        <p class="portfolio__item-price">Price: ${object.price}</p>
      </div>
    </div>
    <div class="portfolio__item-categoryIcon">
      ${object.svgIcon}
    </div>
    <p class="portfolio__item-title">${object.title}</p>
  </div>`;
}
function blogItem_formHTML(object){
	return `
	<div class="blog__item">
		<div class="blog__item-img">
		 <img src="img/content/blog/${object.imgName}" alt="item">
		</div>
		<div class="blog__item-content">
		 <p class="blog__item-name">${object.name}</p>
		 <div class="blog__item-info">
		   <p class="blog__item-date">${object.date}</p>
		   <p class="blog__item-author">${object.author}</p>
		   <p class="blog__item-categories">${object.categories.join(' ')}</p>
		   <p class="blog__item-responses">${object.responses}</p>
		 </div>
		 <p class="blog__item-text">
		   ${object.text}
		   <a class="blog__item-link" href="#">(MORE...)</a>
		 </p>
		</div>
	</div>`;
}

// loading file for portfolio section
loadItemsFromFile('../posts/portfolio.txt', {
	destination: document.querySelector('.portfolio__items'),
	HTMLFunction: portfolioItem_formHTML,
	amount: 6
});

// portfolio__btn click event
document.querySelector('.portfolio__btn')
.addEventListener('click', function(){
	this.classList.toggle('clicked');

	if(this.classList.contains('clicked')){
		this.textContent = 'hide';
		for(const child of filters.children){
			if(!child.classList.contains('active')) child.click();
		}
	}else{
		this.textContent = 'browse all';
		for(const child of filters.children){
			if(child.classList.contains('active')) child.click();
		}
		loadItemsFromFile('../posts/portfolio.txt', {
			destination: document.querySelector('.portfolio__items'),
			HTMLFunction: portfolioItem_formHTML,
			amount: 6
		});
	}
});

// loading file for blog section
let blogPostsAmount = 3;
loadItemsFromFile('../posts/blog.txt', {
	destination: document.querySelector('.blog__items'),
	HTMLFunction: blogItem_formHTML,
	amount: blogPostsAmount
});
document.querySelector('.blog__btn')
.addEventListener('click', function(){
	this.classList.toggle('clicked');
	blogPostsAmount += 3;
	loadItemsFromFile('../posts/blog.txt', {
		destination: document.querySelector('.blog__items'),
		HTMLFunction: blogItem_formHTML,
		amount: blogPostsAmount
	});
});



// checkAFK
let check_for_afk = true;

if(check_for_afk) AFK(60000);
function AFK(AFKTime){
	let timeout = 0;
	let countBeforeClose = 0;

	timer();

	window.addEventListener('mousemove', active);
	window.addEventListener('click', active);
	window.addEventListener('keydown', active);

	function timer(){
		timeout = setTimeout(function(){
			const confirmationWindow = document.createElement('div');
			confirmationWindow.classList.add('confirmation');
			confirmationWindow.innerHTML = `<div class="confirmation__inner">
	      <p class="text">Are you still with here?</p>
	      <div class="confirmation__timer"></div>
	      <button class="confirmation__btn btn">Yes</button>
	    </div>`;
			document.body.appendChild(confirmationWindow);
			const confirmationWindowBtn = confirmationWindow.querySelector('.confirmation__btn');
			const confirmationWindowTimer = confirmationWindow.querySelector('.confirmation__timer');

			setTimeout(() => confirmationWindow.classList.add('active'), 10);

			let currentTime = 0;
			countBeforeClose = setInterval(function(){
				active();
				const maxTime = 15000;

				if(currentTime >= maxTime) {
					window.open('', '_self', ''); window.close();
				}
				currentTime+=10;

				let timerProgress = currentTime / (maxTime / 100);
				confirmationWindowTimer.style.background = `conic-gradient(var(--blue) 0% ${timerProgress}%, transparent ${timerProgress}% 100%)`;
			}, 10);
			

			confirmationWindowBtn.addEventListener('click', function(){
				active();
				confirmationWindow.classList.remove('active');
				if(countBeforeClose) clearInterval(countBeforeClose);
			});
		}, AFKTime);
	}

	function active(){
		if(timeout) clearTimeout(timeout);
		
		timer();
	}
}


// API
const weather = document.querySelector('.weather__inner');
async function loadWeather(){
	const city = 'Lviv';

	const server = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=36da5764f4b1644d82c2f7cc456da1a5`;
	const response = await fetch(server, {
		method: 'GET'
	});
	const responseResult = await response.json();

	if(response.ok){
		getWeather(responseResult);
	}
}
function getWeather(data){
	const location 	= data.name;
	const temp 			= Math.round(data.main.temp);
	const feelsLike = Math.round(data.main.feels_like);
	const status 		= data.weather[0].main;
	const icon 			= data.weather[0].icon;

	weather.innerHTML = `
	<div class="weather__top">
    <p class="weather__location">${location}</p>
    <div class="weather__icon">
      <img src="http://openweathermap.org/img/w/${icon}.png" alt="${status}">
    </div>
  </div>
  <div class="weather__content">
    <p class="weather__temperature">temperature: <span>${temp}</span></p>
    <p class="weather__feelsLike">Feels like: <span>${feelsLike}</span></p>
    <p class="weather__status">status: <span>${status}</span></p>
  </div>`;
}
if(weather) loadWeather();



// form
const form = document.querySelector('.contacts__form');
const form_btn = form.querySelector('#contacts-btn');
const formElements = Array.from(form.querySelectorAll('.contacts__form-input'));

form_btn.addEventListener('click', function(){
	if(!formElements.every(element => element.validity.valid)){
		return;
	}
	
	const fromRequest = {};
	formElements.forEach(element => {
		fromRequest[element.getAttribute('name')] = element.value;
		element.value = '';
	});
	localStorage.setItem('form_request', JSON.stringify(fromRequest));
	console.log(localStorage);

	// animation
	if(fromRequest.message.includes('зробити замовлення')){
  	const successAnimationDiv = document.createElement('div');
  	successAnimationDiv.classList.add('success-animation');
  	successAnimationDiv.innerHTML = `<p class="success-animation__text">Success</p>
      <span class="success-animation__element">
        <svg width="13" height="10" viewBox="0 0 13 10" xmlns="http://www.w3.org/2000/svg"><path d="M2.71019 5.28999C2.52188 5.10169 2.26649 4.9959 2.00019 4.9959C1.73388 4.9959 1.47849 5.10169 1.29019 5.28999C1.10188 5.4783 0.996094 5.73369 0.996094 5.99999C0.996094 6.26629 1.10188 6.52169 1.29019 6.70999L4.29019 9.70999C4.38363 9.80267 4.49444 9.876 4.61628 9.92576C4.73812 9.97553 4.86858 10.0008 5.00019 9.99999C5.13708 9.99565 5.27163 9.96323 5.39548 9.90475C5.51934 9.84626 5.62986 9.76295 5.72019 9.65999L12.7202 1.65999C12.8818 1.45932 12.9597 1.204 12.9377 0.947275C12.9157 0.690547 12.7955 0.452226 12.602 0.282002C12.4086 0.111778 12.1569 0.0227911 11.8995 0.0335951C11.642 0.0443991 11.3987 0.15416 11.2202 0.339993L5.00019 7.53999L2.71019 5.28999Z"/></svg>
      </span>
      <p class="success-animation__text">We'll contact you soon</p>`;
  	document.body.appendChild(successAnimationDiv);

  	setTimeout(() => successAnimationDiv.classList.add('active'), 10);
		setTimeout(function(){
			successAnimationDiv.classList.remove('active');
			setTimeout(() => successAnimationDiv.remove(), 300);
		}, 2000);
	}
});
// console.log(localStorage.getItem('form_request'));
// console.log(JSON.parse(localStorage.getItem('form_request')));
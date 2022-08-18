// header vars
const header 							= document.querySelector('.header');
const headerBurgerBtn 		= document.querySelector('.header__burger');
const headerProgressBar 	= document.querySelector('.header-progressBar');
const headerContent 			= document.querySelector('.header__content');
const headerLinks					= document.querySelectorAll('.header__list-link');
const modeSwitch 					= document.querySelector('.header-theme');

// portfilio vars
const filtersContainer 		= document.querySelector('.portfolio__filters');
const categories 					= ['html', 'css', 'js', 'responsive', 'slider', 'wordpress', 'php', 'videos', 'design'];
const selectedCategories 	= [];
const portfolioBtn 				= document.querySelector('.portfolio__btn');
let portfolioPostsNumber	= 6;

// blog vars
const blogBtn 						= document.querySelector('.blog__btn');
let blogItems 						= document.querySelector('.blog__items').children;
let blogPostsNumber 			= 3;
let currentNumberOfPosts  = blogPostsNumber;

// forms vars
const formBtn 						= document.querySelector('.contacts__form-btn');
const formInputs 					= Array.from(document.querySelectorAll('.contacts__form-input'));

// other vars
let date = new Date();
const postsData = JSON.parse(posts);

const loader = document.querySelector('.page-loader');
const loadingTime = 5000;



// loading page
document.documentElement.classList.add('loading');
if(loader){
	setTimeout(function(){
		loader.classList.add('fade');
	}, loadingTime - 500);
	setTimeout(function(){
		document.documentElement.classList.remove('loading');
		loader.remove();
	}, loadingTime);
}

// progressBar
document.addEventListener('scroll', function(){
	// header progress bar
	const windowHeight = window.outerHeight;
	const maxScrollOffset = document.body.clientHeight - windowHeight;
	headerProgressBar.style.width = `${scrollY / (maxScrollOffset / 100)}%`;

	// blog items animation
	for(const item of blogItems){
		const itemOffset = item.getBoundingClientRect().top;
		if(itemOffset <(windowHeight - (windowHeight / 5))){
			item.classList.add('active');
		}
		else{ item.classList.remove('active'); }
	}
});


// header events
// -------------
// header burger
headerBurgerBtn.addEventListener('click', function(){
	headerContent.classList.toggle('open');
	this.classList.toggle('active');
});
// header nav
headerLinks.forEach(link => {
	link.addEventListener('click', function(event){
		event.preventDefault();

		const blockName = link.getAttribute('href')
		const block = document.querySelector(blockName);
		scrollTo_function(block);

		headerContent.classList.remove('open');
		headerBurgerBtn.classList.remove('active');
	});
});
function scrollTo_function(dest){
	if(!isNaN(dest)){
		window.scrollTo(0, dest - header.clientHeight);
		return;
	}
	// window.scrollTo(0, dest.offsetTop - header.clientHeight);
	window.scrollTo(0, dest.offsetTop - header.clientHeight);
}


// theme
modeSwitch.addEventListener('click', function(){
	this.classList.toggle('switched');

	document.documentElement.getAttribute('data-theme') == 'light' ?
	document.documentElement.setAttribute('data-theme', 'dark') :
	document.documentElement.setAttribute('data-theme', 'light');
});
if(date.getHours() >= 21 || date.getHours() <= 6){
	modeSwitch.classList.toggle('switched');
	document.documentElement.setAttribute('data-theme', 'dark');
}



// slider
class Slider{
	constructor(htmlObject){
		this.htmlObject = htmlObject;
		this.sliderTrack = this.htmlObject
		.querySelector(`.${this.htmlObject.classList[0]}__items`);
		this.slides = this.sliderTrack.children;

		this.prevArrow = document.createElement('button');
		this.nextArrow = document.createElement('button');
		this.prevArrow.classList.add('retro-slider__arrow', 'retro-slider__prev');
		this.nextArrow.classList.add('retro-slider__arrow', 'retro-slider__next');
		this.prevArrow.innerHTML = `<svg width="21" height="33" viewBox="0 0 21 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.20711 15.7929L15.7929 3.20711C16.1834 2.81658 16.8166 2.81658 17.2071 3.20711L17.7929 3.79289C18.1834 4.18342 18.1834 4.81658 17.7929 5.20711L7.20711 15.7929C6.81658 16.1834 6.81658 16.8166 7.20711 17.2071L17.7929 27.7929C18.1834 28.1834 18.1834 28.8166 17.7929 29.2071L17.2071 29.7929C16.8166 30.1834 16.1834 30.1834 15.7929 29.7929L3.20711 17.2071C2.81658 16.8166 2.81658 16.1834 3.20711 15.7929Z" stroke-width="4"/></svg>`;
		this.nextArrow.innerHTML = `<svg width="21" height="33" viewBox="0 0 21 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.7929 17.2072L5.20711 29.793C4.81658 30.1835 4.18342 30.1835 3.79289 29.793L3.20711 29.2072C2.81658 28.8167 2.81658 28.1835 3.20711 27.793L13.7929 17.2072C14.1834 16.8167 14.1834 16.1835 13.7929 15.793L3.20711 5.20723C2.81658 4.8167 2.81658 4.18354 3.20711 3.79302L3.79289 3.20723C4.18342 2.8167 4.81658 2.8167 5.20711 3.20723L17.7929 15.793C18.1834 16.1835 18.1834 16.8167 17.7929 17.2072Z" stroke-width="4"/></svg>`;

		this.htmlObject.appendChild(this.prevArrow);
		this.htmlObject.appendChild(this.nextArrow);

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
categories.forEach(category => {
	let filter = document.createElement('p');
	filter.textContent = category;
	filter.classList.add('portfolio__filters-item')
	filtersContainer.append(filter);
})
filtersContainer.addEventListener('click', function(event){
	const target = event.target;
	if(target.classList.contains('portfolio__filters-item')){
		const targetClassList = target.classList;

		if(targetClassList.contains('active')){
			targetClassList.remove('active');
			selectedCategories.splice(selectedCategories.indexOf(target.textContent), 1);
		}else{
			targetClassList.add('active');
			selectedCategories.push(target.textContent);
		}
	}

	loadPosts('portfolio', {
		destination: document.querySelector('.portfolio__items'),
		HTMLFunction: portfolioItem_formHTML,
		filterBy: {
			key: 'categories',
			values: selectedCategories
		},
		amount: portfolioPostsNumber
	});
});


// loading pots from file
function ObjectToArray(object){
	return Object.keys(object).map(index => object[index]);
}
async function loadPosts(postsFor, options){
	let _posts = ObjectToArray(postsData[postsFor]);

	if('filterBy' in options){
		if(options.filterBy.values.length > 0){
	  	_posts = _posts.filter(post => {
	  		if(post[options.filterBy.key].some(key => options.filterBy.values.includes(key))) return post;
	  	})
  	}
	}
	if('amount' in options && options.amount > -1){
		_posts = _posts.splice(0, options.amount);
	}

	if(postsFor == 'blog') currentNumberOfPosts = _posts.length;

	options.destination.innerHTML = '';
	_posts.forEach(post => {
		options.destination.innerHTML += options.HTMLFunction(post);
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
    <p class="portfolio__item-title">${object.name}</p>
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


loadPosts('portfolio', {
	destination: document.querySelector('.portfolio__items'),
	HTMLFunction: portfolioItem_formHTML,
	amount: portfolioPostsNumber
});
loadPosts('blog', {
	destination: document.querySelector('.blog__items'),
	HTMLFunction: blogItem_formHTML,
	amount: blogPostsNumber
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
const city = 'Lviv';
const weather = document.querySelector('.weather__inner');
async function loadWeather(){
	const server = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=36da5764f4b1644d82c2f7cc456da1a5`;
	const response = await fetch(server, { method: 'GET' });
	const responseResult = await response.json();

	if(response.ok) getWeather(responseResult);
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



// btn's click events
portfolioBtn.addEventListener('click', function(){
	this.classList.toggle('clicked');

	if(this.classList.contains('clicked')){
		this.textContent = 'hide';
		for(const child of filtersContainer.children){
			if(!child.classList.contains('active')) child.click();
		}
		portfolioPostsNumber = -1;
	}else{
		this.textContent = 'browse all';
		for(const child of filtersContainer.children){
			if(child.classList.contains('active')) child.click();
		}
		portfolioPostsNumber = 6;
	}

	loadPosts('portfolio', {
		destination: document.querySelector('.portfolio__items'),
		HTMLFunction: portfolioItem_formHTML,
		amount: portfolioPostsNumber
	});
});
blogBtn.addEventListener('click', function(){
	this.classList.toggle('clicked');
	blogPostsNumber += 3;
	let newPosts = currentNumberOfPosts;
	loadPosts('blog', {
		destination: document.querySelector('.blog__items'),
		HTMLFunction: blogItem_formHTML,
		amount: blogPostsNumber
	});
	newPosts = Math.abs(newPosts - currentNumberOfPosts);
	scrollTo_function(blogItems[blogItems.length - newPosts].offsetTop + blogItems[blogItems.length - newPosts].offsetParent.offsetTop - 30);
});
formBtn.addEventListener('click', function(){
	if(!formInputs.every(element => element.validity.valid)) return;
	
	const formData = {};
	formInputs.forEach(input => {
		formData[input.getAttribute('name')] = input.value;
		input.value = '';
	});
	localStorage.setItem('form_request', JSON.stringify(formData));
	console.log(localStorage);

	// animation
	if(formData.message.includes('зробити замовлення')){
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
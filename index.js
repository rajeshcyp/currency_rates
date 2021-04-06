const sourceCurrency = document.getElementById('source_currency');
const sourceAmount = document.getElementById('source');
const targetCurrency = document.getElementById('target_currency');
const targetAmount = document.getElementById('target')
const result = document.getElementById('result');
const baseCurrency = document.getElementById('base_currency');
const rateData = document.getElementById('rateData');  

let currencyInfo = Object.assign({}, currency_info ); 
let rateInfo = {}; 

async function getData (base = 'USD') {

	console.log('Base :', base)

	const url = `https://api.exchangerate.host/latest?base=${base}`
	console.log('url ', url); 
	const resp = await fetch(url);
	const data = await resp.json();
	return data;
}

function populateRates() {
	const {rates, base, date } = rateInfo;  
	for( key in rates ) {
		const currency_rate= rates[key]; 
		let cobj = currencyInfo[key]; 
		if( cobj !== undefined ) {
			cobj["rate"]= currency_rate; 
		}
	}
}

function populateCountryCodes() {
	for( currency in currencyInfo) {
        let option1 = document.createElement('option'); 
        option1.value = currency; 
        option1.text = currency; 
        sourceCurrency.add(option1);
 		
	 	let option2 = document.createElement('option'); 
        option2.value = currency; 
        option2.text = currency; 
        targetCurrency.add(option2);

		let option3 = document.createElement('option'); 
        option3.value = currency; 
        option3.text = currency; 
        baseCurrency.add(option3);
    }
	sourceCurrency.value='USD';
    targetCurrency.value='EUR';
	sourceAmount.value=1;
}

async function init() {
	rateInfo = await getData(); 
	populateCountryCodes(); 
	calcluateRate(false);
	initRates();
	displayRates();
}

onload = function(){ 
	var x = document.querySelectorAll('.number-only');
	for (i = 0; i < x.length; i++) {
		x[i].onkeypress = function(e) {
			if(isNaN(this.value+''+String.fromCharCode(e.charCode)))
				return false;
			}
			x[i].onpaste = function(e){
			e.preventDefault();
			}
	  }
	init(); 
}

function calcluateRate(reverse) {
	let fromCurrency = sourceCurrency.value; 
	let toCurrency = targetCurrency.value; 
	let fromAmount = sourceAmount.value; 

	if (reverse === true ) {
		fromCurrency = targetCurrency.value; 
		toCurrency = sourceCurrency.value;
		fromAmount = targetAmount.value; 	
	}	

	let converted_amount = (Number(Number(fromAmount) * (Number(rateInfo.rates[toCurrency]) / Number(rateInfo.rates[fromCurrency]))).toFixed(5));

	if ( reverse===true ) {
		sourceAmount.value = converted_amount; 
	}
	else {
		targetAmount.value = converted_amount; 
	}
	displayResult(); 
}

function displayResult() {
	let sourceCurrencyName = Number(sourceAmount.value) > 1 ? currencyInfo[sourceCurrency.value].name_plural : currencyInfo[sourceCurrency.value].name ; 
	let targetCurrencyName = Number(targetAmount.value) > 1 ? currencyInfo[targetCurrency.value].name_plural : currencyInfo[targetCurrency.value].name ; 
	result.innerHTML = sourceAmount.value + ' ' + sourceCurrencyName + ' is ' + targetAmount.value + ' ' + targetCurrencyName;
} 


function swap() {
	let temp = targetCurrency.value; 
	targetCurrency.value=sourceCurrency.value
	sourceCurrency.value=temp; 
	calcluateRate(false);
}

function initRates() {
	for( currency in rateInfo.rates ){

		let pdiv = document.createElement('div'); 
		let cdiv = document.createElement('div');
		let rdiv = document.createElement('div');

		cdiv.innerHTML = currency + ' - ' + ( currencyInfo[currency] !== undefined? currencyInfo[currency].name : 'undefined'); 
		rdiv.innerHTML = rateInfo.rates[currency];
		pdiv.id = 'x-' + currency; 
		pdiv.className = 'currency-line';
		cdiv.id = 'c-' + currency; 
		rdiv.id = 'r-' + currency; 

		pdiv.appendChild(cdiv);
		pdiv.appendChild(rdiv);
		rateData.appendChild(pdiv);
	}
}

function displayRates() {
	for( currency in rateInfo.rates ){
		let id = 'r-'+currency; 
		let rateline = document.getElementById(id);
		rateline.innerHTML=rateInfo.rates[currency];
	}
}

async function selectBase() {
	console.log('select Base')
	let base = baseCurrency.value;
	rateInfo = await getData(base); 
	calcluateRate(false);
	displayRates(); 
}

sourceCurrency.addEventListener('change', function () { calcluateRate(false);});
targetCurrency.addEventListener('change', function () { calcluateRate(false);});
sourceAmount.addEventListener('input', function () { calcluateRate(false);});
targetAmount.addEventListener('input', function () { calcluateRate(true);}); 



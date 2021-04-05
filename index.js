
const sourceCurrency = document.getElementById('source_currency');
const sourceAmount = document.getElementById('source');
const targetCurrency = document.getElementById('target_currency');
const targetAmount = document.getElementById('target')

let currencyInfo = Object.assign({}, currency_info );
let rateInfo = {}; 


async function getData (base = 'USD') {
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


onload = function(){ 
	var ele = document.querySelectorAll('.number-only')[0];
	ele.onkeypress = function(e) {
	   if(isNaN(this.value+''+String.fromCharCode(e.charCode)))
		  return false;
	}
	ele.onpaste = function(e){
	   e.preventDefault();
	}
	init(); 
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
    }
	sourceCurrency.value='USD';
    targetCurrency.value='EUR';
	sourceAmount.value=1;
}


function calcluate(reverse) {
	let fromCurrency = sourceCurrency.value; 
	let toCurrency = targetCurrency.value; 
	let fromAmount = sourceAmount.value; 

	if (reverse === true ) {
		fromCurrency = targetCurrency.value; 
		toCurrency = sourceCurrency.value;
		fromAmount = targetAmount.value; 	
	}	

	let source_rate = currencyInfo[fromCurrency].rate; 
	let target_rate = currencyInfo[toCurrency].rate; 
	let converted_amount = (Number(Number(fromAmount) * (Number(target_rate) / Number(source_rate))).toFixed(5));

	if ( reverse===true ) {
		sourceAmount.value = converted_amount; 
	}
	else {
		targetAmount.value = converted_amount; 
	}
}


function swap() {
	let temp = targetCurrency.value; 
	targetCurrency.value=sourceCurrency.value
	sourceCurrency.value=temp; 
	calcluate(false);
}


async function init() {
	rateInfo = await getData(); 
	populateRates(); 
	populateCountryCodes(); 
	calcluate(false);
}


sourceCurrency.addEventListener('change', function () { calcluate(false);});
targetCurrency.addEventListener('change', function () { calcluate(false);});
sourceAmount.addEventListener('input', function () { calcluate(false);});
targetAmount.addEventListener('input', function () { calcluate(true);}); 



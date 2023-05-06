 let data;

 fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
     .then(response => response.json())
     .then(json => showData(json));

 const grid = document.querySelector('.grid');
 const headerDate = document.querySelector('.header__date');
 const currency_one = document.querySelector('#currency_one');
 const currency_two = document.querySelector('#currency_two');
 const reset = document.querySelector('#reset');
 const amountCurrency = document.querySelector('#amountCurrency');
 const result = document.querySelector('#result');
 const output = document.querySelector('.output');

 function showData(data) {
     data.forEach(function(el) {
         if (el.r030 !== 959 && el.r030 !== 962 && el.r030 !== 960 && el.r030 !== 961 && el.r030 !== 964) {
             let html = `<div class="grid__item">
                                <div class="grid__itemName">${el.txt}</div>
                                <div class="grid__itemRate">${el.rate}</div>
                                <div class="grid__itemAbbrev">${el.cc}</div>                                      
                                <div class="grid__itemCodeCurrency">${el.r030}</div>
                            </div>`
             data.sort(function(a, b) {
                 return a.txt.localeCompare(b.txt);
             });
             grid.insertAdjacentHTML('beforeend', html);
             let option = document.createElement('option');
             option.innerHTML = el.txt;
             currency_one.appendChild(option);
         }
     });

     headerDate.innerText += data[0].exchangedate;

     let arr = [];
     for (i = 0; i < currency_one.options.length; i++) {
         arr.push(currency_one.options[i].innerText);
     }
     arr.sort(function(a, b) {
         return a.localeCompare(b);
     });
     let newArr = Array.from(currency_one.options);
     newArr.forEach(function(el, i) {
         el.innerText = arr[i];
     });

     let firstCurr = 1;
     let secondCurr = 1;
     let amountCurrencyValue;

     function showResult() {
         let converter;
         amountCurrencyValue = amountCurrency.value;
         if (amountCurrencyValue < 0) {
             result.innerText = '0.00';
         } else {
             converter = amountCurrencyValue * (firstCurr / secondCurr);
             result.innerText = converter.toFixed(2);
         }
     }
     amountCurrency.addEventListener('click', function() {
         amountCurrency.value = "";
     })

     let newData;
     fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
         .then(response => response.json())
         .then(json => showNewData(json));

     function showNewData(newData) {
         currency_one.addEventListener('change', function() {
             if (optionUA.innerText == 'Українська гривня') {
                 firstCurr = 1;
             }
             newData.forEach(function(el) {
                 if (el.txt === currency_one.options[currency_one.selectedIndex].text) {
                     firstCurr = el.rate;
                 }
             });
             showResult()
         });

         currency_two.addEventListener('change', function() {
             if (optionUA.innerText == 'Українська гривня') {
                 secondCurr = 1;
             }
             newData.forEach(function(el) {
                 if (el.txt === currency_two.options[currency_two.selectedIndex].text) {
                     secondCurr = el.rate;
                     console.log(secondCurr);
                 }
             });
             showResult();
         });
     }

     amountCurrency.addEventListener('input', showResult);
     reset.addEventListener('click', function() {
         //amountCurrency.value = 0;
         result.innerText = '0.00';
         firstCurr = 1;
         secondCurr = 1;
     });

     let optionUA = document.createElement('option');
     optionUA.innerText = 'Українська гривня';
     currency_one.insertAdjacentElement('afterbegin', optionUA);
     optionUA.setAttribute('selected', 'selected');

     let currency_two = currency_one.cloneNode(true);
     currency_two.id = 'currency_two';
     output.insertAdjacentElement('afterend', currency_two);
 }
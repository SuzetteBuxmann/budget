//****** UI CONTROLLER ******//
var uiController = (function() {
	
	var domStrings = {
		inputType: '.add__type',
		inputDesc: '.add__description',
		inputValue: '.add__value',
		btnAdd: '.add__btn', 
		titleDate: '.budget__title--month',
		incomeList: '.income__list',
		expenseList: '.expenses__list',
		totalIncome: '.budget__income--value',
		totalExpense: '.budget__expenses--value',
		cashAvail: '.budget__value',
		percOfInc: '.budget__expenses--percentage',
		thisMonth: '.budget__title--month',
		itemContainer: '.container',
		expPercent: '.item__percentage'
	}
	
	var formatNumber = function(num, type) {
		/* + or - before the number, 2 decimal points, comma separating the 1000s */
		
		//abs removes the + or -
		//toFixed is a method of the Number prototype
		num = Math.abs(num).toFixed(2);
		//Number('10000').toLocaleString() => // 10,000
		//number.toLocaleString(undefined, { minimumFractionDigits: 4 })
		num = Number(num).toLocaleString(undefined, { minimumFractionDigits: 2 });		
		if(type) {
			return (type === 'inc' ? '+ ' : '- ') + num;
		} else {
			return num;
		}		
	};
	
	/***********very useful function!! ************/
	/***********very useful function!! ************/
	/***********very useful function!! ************/
	//used in displayPercentages and changedType to loop through querySelectorAll nodes
	var nodeListForEach = function(list, callback) {
		for(var i=0; i<list.length; i++) {
			callback(list[i], i);
		}
	};
	
	return {
		getInput: function() {
			return {
				type: document.querySelector(domStrings.inputType).value,
				desc: document.querySelector(domStrings.inputDesc).value,
				val: parseFloat(document.querySelector(domStrings.inputValue).value)
			};	
		},
		
		addListItem: function(obj, type) {
			var html, newHTML, el;
			
			//create the html string
			if(type === 'inc') {
				el = domStrings.incomeList;
				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="far fa-times-circle"></i></button></div></div></div>';
			} else if(type === 'exp') {
				el = domStrings.expenseList;
				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage"></div><div class="item__delete"><button class="item__delete--btn"><i class="far fa-times-circle"></i></button></div></div></div>';
			}
			
			//replace the placeholder with the actual data
			newHTML = html.replace('%id%', obj.id);
			newHTML = newHTML.replace('%description%', obj.desc);
			newHTML = newHTML.replace('%value%', formatNumber((obj.val * 100) / 100, type));
			
			//insert the html into the UI
			document.querySelector(el).insertAdjacentHTML('beforeend', newHTML);			
		},
		
		delListItem: function(elementID) {
			var el = document.getElementById(elementID);
			//we can't remove a child... we need to target the child via the parent node
			el.parentNode.removeChild(el);
		},
		
		clearFields: function() {
			//document.querySelector(domStrings.inputType).selectedIndex = 0;
			document.querySelector(domStrings.inputDesc).value = "";
         document.querySelector(domStrings.inputValue).value = "";
         document.querySelector(domStrings.inputDesc).focus();
			
			
			//OR use something like this:
			//var x = document.querySelectorAll("h2, div, span");
			//var i;
			//for (i = 0; i < x.length; i++) {
			//	x[i].style.backgroundColor = "red";
			//}
			
			//OR JONAS SOLUTION (not necessary in higher versions of ecmascript because array is built in):
         //***clear the input fields
			//var fields, fieldsArray;
			//***pass multiple inputs into the queryselector all (e.g. var x = document.querySelectorAll("h2, div, span");)
			//fields = document.querySelectorAll(domStrings.inputType+ ', ' +domStrings.inputDesc+ ', ' +domStrings.inputValue);
			//***tricking the method into thinking it's an array
			//Array.prototype.slice.call(fields);
			//***using a foreach to loop through the fields
			//fieldsArray.forEach(function(curr, i, arr) { //current, index, array
			//	curr.value = "";
			//});
		},
		displayBudget: function(obj) {
			document.querySelector(domStrings.totalIncome).textContent = formatNumber(obj.totalInc, 'inc');
			document.querySelector(domStrings.totalExpense).textContent = formatNumber(obj.totalExp, 'exp');
			
			if(obj.totalExp>obj.totalInc) {
				document.querySelector(domStrings.cashAvail).innerHTML = '<span class="red">- &pound;' + formatNumber(obj.availCash) +'</span>';
			} else {
				document.querySelector(domStrings.cashAvail).innerHTML = '+ &pound;' + formatNumber(obj.availCash);
			}
			
			
			if(obj.percOfIncome > 0) {
				document.querySelector(domStrings.percOfInc).textContent = obj.percOfIncome + '%';
			} else {
				document.querySelector(domStrings.percOfInc).textContent = '--';
			}
		},
		displayMonth: function() {
			var dt = new Date();
			//var christmas = new Date(2019, 12, 25);
			var monthNames = ["January", "February", "March", "April", "May","June","July", "August", "September", "October", "November","December"];
			document.querySelector(domStrings.thisMonth).textContent = monthNames[dt.getMonth()] + ' ' + dt.getFullYear();
		},
		displayPerentages: function(obj) {
			//we don't know how many expense items are going to be on the list, so we use QselectorALL
			//this returns a node list (on the DOM, each element is called a node)
			var els = document.querySelectorAll(domStrings.expPercent); 
						
			nodeListForEach(els, function(current, index) {
				if(obj[index] > 0) {
					current.textContent = obj[index] + '%';
				} else {
					current.textContent = '--';
				}				
			});			
		},
		
		changedType: function() {
			var fields = document.querySelectorAll(domStrings.inputDesc + ',' + domStrings.inputValue + ', ' + domStrings.inputType);
			nodeListForEach(fields, function(curr) {
				curr.classList.toggle('red');
				curr.classList.toggle('red-focus');
			});
			document.querySelector(domStrings.btnAdd).classList.toggle('red');
		},
		
		getDOMstrings: function() {
			return domStrings;
		}
	}
})();
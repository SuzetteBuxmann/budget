//****** DATA (BUDGET) CONTROLLER ******//
var budgetController = (function() {
	
	var Expense = function(id, desc, val) {
		this.id = id;
		this.desc = desc;
		this.val = val;
		this.perc = -1;
	}
	Expense.prototype.calcPerc = function(totalIncome) {
		if(totalIncome>0) {
			this.perc = Math.round((this.val/totalIncome)*100);
		} else {
			this.perc = -1;
		}
	};
	Expense.prototype.getPerc = function() {
		return this.perc;
	};
	
	var Income = function(id, desc, val) {
		this.id = id;
		this.desc = desc;
		this.val = val;
	}
	
	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		},
		availCash: 0, 
		percOfIncome: -1
	}
	
	var calculateTotal = function(type) {
		var sum = 0;
		data.allItems[type].forEach(function(curr) {
			sum += curr.val;
		});
		data.totals[type] = sum;
		console.log('total: ' +sum);
	}
	
	return {
		addItem: function(tp, ds, vl) {
			var newItem, id;
			
			id = data.allItems[tp].length;
			
			//create new id
			if(id>0) {
				id = data.allItems[tp][data.allItems[tp].length-1].id + 1; 
			} else {
				id = 0;
			}
			
			//create new expense or income
			if(tp === 'exp') {
				//add expense
				newItem = new Expense(id, ds, vl);
			} else if(tp ==='inc') {
				//add income
				newItem = new Income(id, ds, vl);
			}
			//push the new item into the relative array
			data.allItems[tp].push(newItem);
			
			//return the new item
			return newItem;
		},
		
		deleteItem: function(type, id) {
			
			var ids, index;
			//can't just delete from the array using the id
			//if id comes through as 3, but there have been others deleted
			//so using 3 to just delete, would delete index 5 in this case:
			//[1 2 4 5 7] (ids below)
			
			//loop through the array with the map method:
			//map returns a brand new array
			ids = data.allItems[type].map(function(curr) {
				return curr.id;
			});
			
			//index will become "3" (see comments above)
			index = ids.indexOf(id);
			if(index !== -1) { //if the index exists
				//delete the item				
				data.allItems[type].splice(index, 1);
			}
		},
			
		calculateBudget: function() {
			//calc the total inc and exp
			calculateTotal('exp');
			calculateTotal('inc');
			
			//calc the budget - income minus expense
			data.availCash = data.totals.inc - data.totals.exp;
			
			//calc the % of income that we spent
			if(data.totals.inc > 0) {
				data.percOfIncome = Math.round((data.totals.exp/data.totals.inc)*100);
			} else {
				data.percOfIncome = -1;
			}			
		},
		
		calculatePercentages: function() {
			data.allItems.exp.forEach(function(curr) {
				curr.calcPerc(data.totals.inc);
			});
		},
		
		getPercentages: function() {
			var allPerc = data.allItems.exp.map(function(curr) {
				return curr.getPerc();
			});
		return allPerc;
		},
		
		getBudget: function() {
			return {
				availCash: data.availCash,
				percOfIncome: data.percOfIncome,
				totalExp: data.totals.exp,
				totalInc: data.totals.inc				
			};
		},
		
		//to use in the console: budgetController.testing();
		testing: function() {
            console.log(data);
        }
	}
	
})();


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


//****** GLOBAL APP CONTROLLER ******//
var controller = (function(budgetCtrl, uiCtrl) {
	
	var setUpEventListeners = function() {
		
		var domStrings = uiController.getDOMstrings();
		
		//add an income or expense
		document.querySelector(domStrings.btnAdd).addEventListener('click', ctrlAddItem);
	
		//add the item to the list
		document.addEventListener('keypress', function(event) {
			if(event.keyCode === 13 || event.which === 13) { //which is for older browswers that don't use keyCode
				ctrlAddItem();
			}
		});
		
		//delete an item from the list
		document.querySelector(domStrings.itemContainer).addEventListener('click', ctrlDelItem);
		
		//change the input colour depending on whether or not its an income or expense
		document.querySelector(domStrings.inputType).addEventListener('change', uiCtrl.changedType);
	}
	
	var ctrlAddItem = function() {
		var input, newItem;
		
		//1. Get the filled input data
		input = uiCtrl.getInput();
		
		if(input.desc !== "" && (isNaN(input.val) == false)) {
			//2. Add the item to the budget controller
			newItem = budgetCtrl.addItem(input.type, input.desc, input.val);
		
			//3. Add the item to the UI
			uiCtrl.addListItem(newItem, input.type);
		
			//4. Clear the fields
			uiCtrl.clearFields();
		
			//5. Calculate and update budget
			updateBudget();
			
			//6. Calulate and update the percentages
			updatePercentages();
			}		
	}
	
	var ctrlDelItem = function(e) {
		//1. Get the line that needs to be deleted
		
		// The event (e) has a property called target that is the item (element) that was clicked upon, we store this in 'el'
		var el, itemID, splitItem, type, id;
		el = e.target;
		
		//find this  <div class="item clearfix" id="income-0">
		//return if the target element is neither the button or the icon. ie: the rest of this code won't run.
		if(!el.classList.contains('item__delete--btn') && !el.classList.contains('fa-times-circle')) {
			return;
			}
		
		// If it doesn't have the class '.item' we need to look at the element above it (its parent), so we set the 
      // 'el = el.parentNode'. ie we now look at its parent for the class of '.item'
      // Every loop we do the same until we reach the element with that class 
        
      while(!el.classList.contains('item')){ 
          el = el.parentNode;
      }
      // We know we've got the correct element, so if you look at the '.item' element in the html, we know it's got an id tag
      itemID = el.id;
		
		// Because the listener is on the 'container', we need to ignore anything that isn't a click on the delete--btn - in this case, if it doesn't have an id set
		if(itemID) {
			//the item id will either be exp-0 or inc-0 (0 being the line we've selected), so we can...
			splitItem = itemID.split('-');
			type = splitItem[0];
			id = parseInt(splitItem[1]);
			
			//2. Delete it from the data structure (budget controller)
			budgetCtrl.deleteItem(type, id);
			
			//3. Delete the items from the UI
			uiCtrl.delListItem(itemID);
			
			//4. Update the budget
			updateBudget();
			
			//5. Calculate and update the percentages
			updatePercentages();
		}
	};
	
	var updateBudget = function() {
		//1. Calculate the budget
		budgetCtrl.calculateBudget();
		//2. Return the budge
		var budget = budgetCtrl.getBudget();
		//3. Display the budget on the UI
		uiCtrl.displayBudget(budget);
	};
	
	var updatePercentages = function() {
		//1. Calculate the percentages
		budgetCtrl.calculatePercentages();
		//2. Return the percentages
		var percentages = budgetCtrl.getPercentages();
		//3. Display the percentages on the UI
		uiCtrl.displayPerentages(percentages);	
	};
	
	return {
		init: function() {
			setUpEventListeners();
			uiCtrl.displayMonth();
			uiCtrl.displayBudget({
				availCash: 0,
				percOfIncome: -1,
				totalExp: 0,
				totalInc: 0
			});
			uiCtrl.clearFields();
		}
	}
	
})(budgetController, uiController);

controller.init();
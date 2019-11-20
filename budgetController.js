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
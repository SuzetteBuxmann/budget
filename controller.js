


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
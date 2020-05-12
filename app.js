// Lecture 90 completed

// Budget Controller

var budgetController = (function(){
    
    
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    
    var calculateTotal = function(type){
        var sum = 0;
        
        data.allItems[type].forEach(function (cur){
            sum += cur.value 
        });
        data.totals[type] = sum;
    };
    
    
    var data = {
        allItems: {
            exp : [],
            inc : []
        },
        totals:{
            exp: 0,
            inc: 0
        },
        
        budget: 0,
        percentage: -1
    };
    
    
    return {
    addNewItem : function(type, des, val){
        var newItem, ID;
        
        // Create new ID
        if (data.allItems[type].length > 0){
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1;                     
        }else {
            ID = 0;
            
        }
        
        // Create new item based on 'inc' or 'exp' type
        if(type === 'exp'){
            newItem = new Expense(ID, des, val); 
            
        }else if(type === 'inc'){
            newItem = new Income(ID, des, val);    
        }
        
        // Push it into our data structure 
        data.allItems[type].push(newItem); 
        
        // Return the new element 
        return newItem;
    }, 
        
        deleteItem : {
             //     0  1  2  3  4    
            // inc [2, 5, 6, 7, 9]
            /*
                        
            
            
            
            
            */
            
            
            
            
    },
        
        calculateBudget : function(){
            
            
            // Calculate total income 
            calculateTotal('inc');
            
            // Calculate total expense 
            calculateTotal('exp');
            
            // Caluculate budget: total income - total expense
            data.budget = data.totals.inc - data.totals.exp;
            
            // Calculate the percentage of income that we spent on certain commodity : expense/income*100            
            if(data.totals.inc > 0){

                data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
                
            }else{
                data.percentage = -1;
            };
        },
        
        getBudget : function(){
          return {
              budget: data.budget,
              totalIncome: data.totals.inc,
              totalExpense: data.totals.exp,
              percentage: data.percentage
          };  
        },
        
        testing: function (){
          console.log(data);  
        }

    };
    
    
    
})();


// UI Controller

var UIController = (function(){
    
        
    var DOMString = {
        inputType:  '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        addButton : '.add__btn',
        incomeContainer : '.income__list',
        expensesContainer : '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
        
        
    };
    
    
    
    
    return {
      getInput : function(){
          return {
            type : document.querySelector(DOMString.inputType).value,
            description : document.querySelector(DOMString.inputDescription).value,
            value :  parseFloat(document.querySelector(DOMString.inputValue).value)    
          };
        },
        
        addListItem : function(obj, type){
            var html, newHtml, element;
            
          // Create HTML string with placeholder text
            if(type === 'inc'){
                element = DOMString.incomeContainer;
                 
            html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';                
            } else if (type === 'exp'){
                element = DOMString.expensesContainer;
           html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';                
            }

          // Replace the placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
                
          // Insert the HTML into the DOM   
            
           document.querySelector(element).insertAdjacentHTML('beforeend', newHtml); 
        },
        
        clearFields: function(){
            
            var fields, fieldsArr;
            
            // Selecting string to clear from UI
            fields = document.querySelectorAll(DOMString.inputDescription + ',' + DOMString.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current, value, array){
            current.value = "";    
            });
            
            fieldsArr[0].focus();
        },
        
        
        displayBudget : function(obj){
            document.querySelector(DOMString.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMString.incomeLabel).textContent = obj.totalIncome;
            document.querySelector(DOMString.expensesLabel).textContent = obj.totalExpense;
            document.querySelector(DOMString.percentageLabel).textContent = obj.percentage;
            
            if(obj.percentage > 0){
                document.querySelector(DOMString.percentageLabel).textContent = obj.percentage + '%';
            }else{
                document.querySelector(DOMString.percentageLabel).textContent = '---';
            }
        },
        
        
        getDOMstrings: function (){
          return DOMString;  
        }
    
        };
 
   
   
  
})();


// Global Controller

var controller = (function(budgetCtrl, UICtrl){
    
    // Assigning UIController variables to local variables
    var DOM = UICtrl.getDOMstrings();
    
    //Event listener function
    var setUpEventlisteners = function (){        
        
    //Event listeners
    
    document.querySelector(DOM.addButton).addEventListener('click', ctrlAddItem);
    
    document.addEventListener('keypress', function(e){
        
        if(e.keycode === 13 || e.which === 13){
          ctrlAddItem(); 
        }
        
        });
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        
    };
    
    var updateBudget = function(){
        var budget;
        
        // 1. Calculate the buget
        budgetCtrl.calculateBudget();
        
        // 2. Return the budget
        
        budget = budgetCtrl.getBudget();
    
        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
        
    };
    
    
    // Take the values from event listeners below 
    
    var ctrlAddItem = function (){
    
        var input, newItem;
        
        // 1. Get the field input data
        
        input = UICtrl.getInput();
        
        
        if(input.description !== "" && !isNaN(input.value)){
        // 2. Add the item to the budget controller
        
        newItem = budgetCtrl.addNewItem(input.type, input.description, input.value);
        
        // 3. Add the item to the UI
        
        UICtrl.addListItem(newItem, input.type);
        
        // 4. Clearing field data from DOM 
        
        UICtrl.clearFields();
        
        // 5. Calculate and update budget
        
        updateBudget();            
        };
        
    };
    
    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        splitID = itemID.split('-');
        type = splitID[0];
        ID = splitID[1];
        console.log(splitID);    
        
        // Delete the item from data structure
        
        
        // Delete the item from UI
        
        
        // Update the budget
        
        
        
    };
    


    return{
        init: function(){
            UICtrl.displayBudget({
              budget: 0,
              totalIncome: 0,
              totalExpense: 0,
              percentage: -1
          });
            return setUpEventlisteners();
        }
    };    
    
    
})(budgetController, UIController);



controller.init();


































































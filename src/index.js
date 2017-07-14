import React from 'react';
import ReactDOM from 'react-dom';

class CustomFood {
  constructor(food, ingredients){
    this._food = food;
    this._ingredients = ingredients;
    switch(food){
      case "Pizza":
        this._price = 5;
        break;
      case "Hamburger":
        this._price = 4;
        break;
      case "Hot Dog":
        this._price = 3;
        break;
      case "Ice Cream":
        this._price = 4;
        break;
    }
  }
  
  get ingredients(){
    return this._ingredients;
  }
  
  get food(){
    return this._food;
  }
  
  get price(){
    return this._price;
  }
  
  set ingredients(ingredients){
    this._ingredients = ingredients;
  }
  
  set food(newFood){
    this._food = newFood;
  }
}

class Menu extends React.Component {
  constructor() {
    super();
    this.state = {
      foods: [{"food": "Pizza", "price": 5}, {"food": "Hamburger", "price": 4}, {"food": "Hot Dog", "price": 3}, {"food": "Ice Cream", "price": 4}],
      hideOptions: false,
      selectedFood: null,
      foodAmount: 0,
      confirmedFood: [],
      hotItem: 0,
      displayItem: 1,
      askForMore: false,
      reminderText: false,
      readyToAddIngredients: false,
      currentIngredients: [],
      orderConfirmPageReady: false,
      showReceipt: false
    };
  }
  
  handleFoodClick(food){
    this.setState({
      selectedFood: food
    });
    
  }
  
  handleIngredientClick(ingredient){
    console.log(ingredient);
  }

  handleQuantityChange(event){
    this.setState({
      foodAmount: event.target.value
    })
  }
  
  handleConfirmQuantity(){
    let order=[];
    for(let i = 0 ; i < this.state.foodAmount; i++){
      order.push(new CustomFood(this.state.selectedFood, []));
    }

    this.setState({
      confirmedFood: this.state.confirmedFood.concat(order),
      askForMore: true,
      foodAmount: 0,
      hideOptions: true,
      reminderText: false
    });
    
  }
  
  backToOriginal(){
    let latestFood;
    if(this.state.confirmedFood[this.state.hotItem]){
      latestFood = this.state.confirmedFood[this.state.hotItem].food;
      this.setState({
        readyToAddIngredients:true,
        reminderText: false,
        selectedFood: latestFood
      });
    }else{
      this.setState({
        orderConfirmPageReady: true,
        hideOptions: true,
        reminderText: false,
        askForMore: false,
        readyToAddIngredients: true
      });
    }
  
    
  }
  
  increaseOrder(){
    this.setState({
      selectedFood: null,
      askForMore: false,
      hideOptions: false,
      reminderText: true
    })
  }
  
  proceed(){
    this.setState({
      readyToAddIngredients: true,
      reminderText: false,
      selectedFood: this.state.confirmedFood[this.state.hotItem].food
    })
  }
  
  handleCheckToggle(event){
    const ingIndex = this.state.currentIngredients.indexOf(event.target.value)
    if ( ingIndex < 0 ){
      this.setState({
        currentIngredients: this.state.currentIngredients.concat(event.target.value)
      });
    } else{
      let newList = this.state.currentIngredients;
      newList.splice(ingIndex, 1);
      console.log('new list: ' + newList);
      this.setState({
        currentIngredients: newList
      });
    }
    console.log(this.state.confirmedFood);
    
  }
  
  handleNextItem(event){
    event.preventDefault();
    this.state.confirmedFood[this.state.hotItem].ingredients = this.state.currentIngredients;
    if(this.state.hotItem < this.state.confirmedFood.length - 1){
      this.setState({
        hotItem: (this.state.hotItem + 1),
        displayItem: (this.state.displayItem + 1),
        currentIngredients: [],
        selectedFood: this.state.confirmedFood[this.state.hotItem + 1].food
      });
    }
    if(this.state.hotItem >= this.state.confirmedFood.length - 1){
      this.setState({
        hotItem: (this.state.hotItem + 1),
        currentIngredients: [],
        orderConfirmPageReady: true
      })
    }
    const ings = Array.from(document.getElementsByClassName("ingredient"));
    ings.forEach((item) => {
      item.checked = false;
    })
  }
  
  handlePrevItem(event){
    event.preventDefault();
    if(this.state.hotItem > 0){
      this.setState({
        hotItem: (this.state.hotItem - 1),
        currentIngredients: [],
        displayItem: this.state.displayItem - 1
      })
    }
    const ings = Array.from(document.getElementsByClassName("ingredient"));
    ings.forEach((item) => {
      item.checked = false;
    })
  }
  
  handleAddMoreFood(){
    this.setState({
      orderConfirmPageReady: false,
      readyToAddIngredients: false,
      selectedFood: null,
      foodAmount: 0,
      reminderText: true,
      hideOptions: false,
      askForMore: false
    })
  }
  
  handleCompleteOrder(){
    this.setState({
      showReceipt: true
    })
  }
  
  render() {
    let foodList;
    const selectFood = this.handleFoodClick.bind(this);
    foodList = this.state.foods;
    let heading="Menu";
    if(this.state.showReceipt){
      heading="Receipt";
    }
    
    let reminder;
    if(this.state.reminderText){
      reminder = "Select Your Additional item."
    }
    return (
      <div>
        <div className="main">
          <h1>{heading}</h1>
          <p className="reminder">{reminder}</p>
          <FoodItems foods={foodList} hide={this.state.readyToAddIngredients} alsoHide={this.state.hideOptions} onClick={selectFood}/>
          <Counter selectedFood={this.state.selectedFood} hide={this.state.readyToAddIngredients} alsoHide={this.state.hideOptions} onChange={this.handleQuantityChange.bind(this)}/>
          <AmountSubmit amount={this.state.foodAmount} 
                        hide={this.state.readyToAddIngredients} 
                        alsoHide={this.state.hideOptions} 
                        selectedFood={this.state.selectedFood} 
                        onClick={this.handleConfirmQuantity.bind(this)}/>
          <MoreFoodButton askForMore={this.state.askForMore} hide={this.state.readyToAddIngredients} onClick={this.increaseOrder.bind(this)}/>
          <ProceedToIngredientsButton confirmedFood={this.state.confirmedFood} 
                                      hide={this.state.readyToAddIngredients} 
                                      reminderText={this.state.reminderText} 
                                      onClick={this.proceed.bind(this)}
                                      onSkip={this.backToOriginal.bind(this)} />
          <FoodIngredients food={this.state.selectedFood} 
                           ready={this.state.readyToAddIngredients} 
                           currentItem={this.state.hotItem}
                           displayItem={this.state.displayItem}
                           confirmedFood={this.state.confirmedFood}
                           toggleCheck = {this.handleCheckToggle.bind(this)}
                           prevItem={this.handlePrevItem.bind(this)}
                           nextItem={this.handleNextItem.bind(this)}
                           show={!this.state.orderConfirmPageReady}/>
           <ConfirmPage ready={this.state.orderConfirmPageReady} 
                        allFood={this.state.confirmedFood}
                        hide={this.state.showReceipt}
                        onComplete={this.handleCompleteOrder.bind(this)} 
                        onAddMoreFood={this.handleAddMoreFood.bind(this)}/>
           <Receipt show={this.state.showReceipt} allFood={this.state.confirmedFood}/>
        </div> 
        <div className="running">
          <RunningOrder confirmedFood={this.state.confirmedFood} 
                        hotItem={this.state.hotItem} 
                        ready={this.state.readyToAddIngredients} 
                        hide={this.state.orderConfirmPageReady}/>
        </div>
      </div> 
    );
  }
}

class FoodItems extends React.Component{
  

  render() {
    const foods = this.props.foods.map((item, index) =>
        <li key={index}><Food value={item["food"]} cost={item["price"]} onClick={this.props.onClick}/></li>
    );
    if(!this.props.hide && !this.props.alsoHide){
      return (
        <ul className="food-list">
          {foods}
        </ul>
      );
    }else{
      return null;
    }
  }

}

class Food extends React.Component {
  
  render() {
    return (
      <div className="food-item"
           onClick={() => this.props.onClick(this.props.value)}>
        <p className="food-info"><span className="food-name">{this.props.value}</span> <span className="cost">${this.props.cost}</span></p>
      </div>
    );
  }
}

class MoreFoodButton extends React.Component{
  render(){
    if(this.props.askForMore && !this.props.hide){
        return(
        <div>
          <button className="btn warn" onClick={this.props.onClick}>Add More Food</button>
        </div>
      );
    }else{
      return null
    }
  }
}

class ProceedToIngredientsButton extends React.Component{
  render(){
    
    if(this.props.confirmedFood.length > 0 && !this.props.hide && !this.props.reminderText){
        return(
        <div>
          <button className="btn confirm" onClick={this.props.onClick}>Proceed to Add Ingredients</button>
        </div>
      );
    }else if(this.props.confirmedFood.length > 0 && !this.props.hide && this.props.reminderText){
      return(
      <div>
        <button className="btn warn" onClick={this.props.onSkip}>Just stick with what I already had</button>
      </div>
      );
    }
    else{ 
       return null;
    }
  }
}

class Counter extends React.Component {
  render(){
    if(this.props.selectedFood && !this.props.hide && !this.props.alsoHide){
      return(
        <div className="counter-section">
          <h4 className="counter-prompt"> How many {this.props.selectedFood}s would you like? </h4>
          <input id="counter" type="number" onChange={this.props.onChange} autofocus></input>
        </div>
      );
    }else{
      return null;
    }
  }
}

class AmountSubmit extends React.Component {
  render(){
    if (this.props.amount && this.props.amount > 0 && !this.props.hide && !this.props.alsoHide){
      let buttonText = "Confirm";
      
      return(
        <button className="confirm btn" type="button" onClick={() => this.props.onClick()}>{buttonText}</button>
      );
    }else{
      return null;
    }
  }
}

class FoodIngredients extends React.Component {
  
  renderIngredient(value){
    return(
      <Ingredient value={value} />
    );
  }
  
  render(){
    let ingredients;
  

    switch (this.props.food) {
      case "Pizza":
        ingredients = ["Pepperoni", "Sausage", "Pineapple", "Peanut Butter", "Gumballs", "Mushrooms", "Ham", "Bacon"];
        break;
      case "Hamburger":
        ingredients = ["Ketchup", "Pickles", "Mustard", "Onions", "Lettuce", "Cheese", "Mayonnaise", "Bacon"];
        break;
      case "Hot Dog":
        ingredients = ["Relish", "Mustard", "Onions", "Ketchup"];
        break;
      case "Ice Cream":
        ingredients = ["Chocolate", "Vanilla", "Strawberry", "Chocolate Syrup", "Sprinkles", "Gummy Bears", "Sour Gummy Worms", "Cherry", "Cookie Dough"];
        break;
      default:
        ingredients = [];
        break;
        
    }
    
    let buttonText;
    if (this.props.currentItem < this.props.confirmedFood.length -1){
      buttonText = "Next Item";
    }else {
      buttonText = "Complete Ingredient Specification"
    }
    
    
    if(this.props.ready && this.props.show){
      const specificIngredients = ingredients.map((item, index) => 
         <Ingredient value={item} key={index} onChange={this.props.toggleCheck}/>
      )
      return(
        <div className="ingredient-section">
          <h4>What would you like on this {this.props.food}?</h4>
          <div className="ingredient-list">
            {specificIngredients}
            <button className="confirm pull-right btn" type="button" onClick={this.props.nextItem}>{buttonText}</button> 
            <PreviousButton className="back-btn warn btn" hotItem={this.props.currentItem} prevButton={this.props.prevItem} />
               
          </div>
          
        </div>
      );
    }else{
      return null;
    }
  }
}

class PreviousButton extends React.Component{
  render(){
    if(this.props.hotItem > 0){
      return (
        <div>
          <button className="warn btn" onClick={this.props.prevButton}>Previous Item</button>
        </div>);
    }else{
      return null;
    }
  }
}

class Ingredient extends React.Component {
  render(){
  
      return(
        <div>
          <input className="ingredient" type="checkbox" id={this.props.value} name="ingredient" value={this.props.value} onChange={this.props.onChange}></input>
          <label htmlFor={this.props.value}>{this.props.value}</label>
        </div>
    )
    
  }
}

class ConfirmPage extends React.Component {
  buildList(){
    
    const foodList=this.props.allFood.map(function(foodItem, index){
        let theseIngredients;
        if (foodItem.ingredients.length>0){
          theseIngredients = foodItem.ingredients.join(", ");
        }else{
          theseIngredients = "No fixin's";
        }
        return (<li className="confirmation-item" key={index}>{foodItem.food} with {theseIngredients}</li>);
    });
  
    return foodList;

  }
  
  render(){
    
    const foodList = this.buildList();
    
    if (this.props.ready && !this.props.hide){
      return(
        <div>
          <h4>Your order so far includes:</h4>
          <ul className="order-list">
            {foodList}
          </ul>
          <button className="warn btn pull-left" type="button" onClick={this.props.onAddMoreFood}>Add more to this order</button>
          <button className="confirm btn pull-right" type="button" onClick={this.props.onComplete}>Complete Order</button>
        </div>
      );
    }else{
      return null;
    }
  }
}

class Receipt extends React.Component{
  buildList(){
    
    if(this.props.show){
      
      const foodList=this.props.allFood.map(function(foodItem, index){
          let theseIngredients;
          if (foodItem.ingredients.length>0){
            theseIngredients = foodItem.ingredients.join(", ");
          }else{
            theseIngredients = "No fixin's";
          }
          return (<li className="confirmation-item" key={index}>{foodItem.food} with {theseIngredients}</li>);
      });
    
      return foodList;
    }

  }
  render(){
    const items = this.buildList();
    let sum=0;
    this.props.allFood.forEach(function(item){
      sum += item.price;
    });
    if(this.props.show){
      return(
        <div>
          <h3>Thank you for eating with us!</h3>
          <p>Your Items:</p>
          <ul className="order-list">
            {items}
          </ul>
          <p>Total: ${sum}</p>
          <form>
            <button className="btn confirm" type="submit">New Order</button>
          </form>
        </div>
      );
    }else{
      return null;
    }
  }
}

class RunningOrder extends React.Component{

  render(){
    const order = this.props.confirmedFood.concat();
    const soFar = order.slice(0, this.props.hotItem)
    
    const output = soFar.map(function(foodItem){
        let ingredients;
        if (foodItem.ingredients){
          ingredients = foodItem.ingredients.join(", ")
        }else{
          ingredients = "No fixin's"
        }
        return (<li>A {foodItem.food} with {ingredients} for ${foodItem.price}</li>);
    })
    
    if(this.props.ready && !this.props.hide){
      return (
        <div>
          <p>So far, you've got: </p>
          <ul className="running-order">
            {output}
          </ul>
        </div>
      )
    }else{
      return null;
    }
  }
}

ReactDOM.render(<Menu />, document.getElementById('root'));


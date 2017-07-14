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
      selectedFood: null,
      foodAmount: 0,
      confirmedFood: [],
      hotItem: 0,
      displayItem: 1,
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
      readyToAddIngredients: true
    });
    
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
    this.setState({
      hotItem: (this.state.hotItem + 1),
      displayItem: (this.state.displayItem + 1),
      currentIngredients: []
    });
    if(this.state.hotItem >= this.state.confirmedFood.length - 1){
      this.setState({
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
        currentIngredients: []
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
      displayItem: 1
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
    return (
      <div className="main">
        <h1>{heading}</h1>
        <FoodItems foods={foodList} hide={this.state.readyToAddIngredients} onClick={selectFood}/>
        <Counter selectedFood={this.state.selectedFood} hide={this.state.readyToAddIngredients} onChange={this.handleQuantityChange.bind(this)}/>
        <AmountSubmit amount={this.state.foodAmount}  hide={this.state.readyToAddIngredients} selectedFood={this.state.selectedFood} onClick={this.handleConfirmQuantity.bind(this)}/>
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
    );
  }
}

class FoodItems extends React.Component{
  

  render() {
    const foods = this.props.foods.map((item, index) =>
        <li key={index}><Food value={item["food"]} cost={item["price"]} onClick={this.props.onClick}/></li>
    );
    if(!this.props.hide){
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

class Counter extends React.Component {
  render(){
    if(this.props.selectedFood && !this.props.hide){
      return(
        <div className="counter-section">
          <h2 className="counter-prompt"> How many {this.props.selectedFood}s would you like? </h2>
          <input id="counter" type="number" onChange={this.props.onChange}></input>
        </div>
      );
    }else{
      return null;
    }
  }
}

class AmountSubmit extends React.Component {
  render(){
    if (this.props.amount && this.props.amount > 0 && !this.props.hide){
      let buttonText;
      if (this.props.amount == 1){
        buttonText = `Proceed to select ingredients for this ${this.props.selectedFood}`;
      } else {
        buttonText = `Proceed to select ingredients for these ${this.props.amount} ${this.props.selectedFood}s`;
      }
      return(
        <button className="amount-submit" type="button" onClick={() => this.props.onClick()}>{buttonText}</button>
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
        ingredients = ["Ketchup", "Pickles", "Mustard", "Onions", "Lettuce", "Cheese"];
        break;
      case "Hot Dog":
        ingredients = ["Relish", "Mustard", "Onions", "Ketchup"];
        break;
      case "Ice Cream":
        ingredients = ["Chocolate Syrup", "Sprinkles", "Gummy Bears", "Strawberries", "Cherry"];
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
          <h2>What would you like on {this.props.food} number {this.props.displayItem}?</h2>
          <form className="ingredient-list" onSubmit={this.props.nextItem}>
            {specificIngredients}
          
            <button type="submit">{buttonText}</button>
            
          </form>
          <PreviousButton hotItem={this.props.currentItem} prevButton={this.props.prevItem} />
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
          <button onClick={this.props.prevButton}>Previous Item</button>
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
    );
  }
}

class ConfirmPage extends React.Component {
  buildList(){
    
    if(this.props.ready && !this.props.hide){
      
      const foodList=this.props.allFood.map((foodItem, index) =>
          <li key={index}>{foodItem.food} with {foodItem.ingredients}</li>
      );
    
      return foodList;
    }

  }
  
  render(){
    
    const foodList = this.buildList();
    
    if (this.props.ready && !this.props.hide){
      return(
        <div>
          <h2>Your order so far includes:</h2>
          <ul>
            {foodList}
          </ul>
          <button type="button" onClick={this.props.onAddMoreFood}>Add more to this order</button>
          <button type="button" onClick={this.props.onComplete}>Complete Order</button>
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
      
      const foodList=this.props.allFood.map((foodItem, index) =>
          <li key={index}>{foodItem.food} with {foodItem.ingredients}</li>
      );
    
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
          <ul>
            {items}
          </ul>
          <p>Total: ${sum}</p>
          <form>
            <button type="submit">New Order</button>
          </form>
        </div>
      );
    }else{
      return null;
    }
  }
}

ReactDOM.render(<Menu />, document.getElementById('root'));


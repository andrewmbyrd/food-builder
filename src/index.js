import React from 'react';
import ReactDOM from 'react-dom';

class CustomFood {
  constructor(food, ingredients){
    this._food = food;
    this._ingredients = ingredients;
  }
  
  get ingredients(){
    return this._ingredients;
  }
  
  get food(){
    return this._food;
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
      totalPrice: 0, 
      confirmedFood: [],
      currentOrderIndex: 0,
      hotItem: 0,
      readyToAddIngredients: false
    };
  }
  
  handleFoodClick(food){
    this.setState({
      selectedFood: food
    })
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
      confirmedFood: this.state.confirmedFood.concat([order]),
      readyToAddIngredients: true
    })
  }
  
  handleCheckToggle(event){
    console.log(event.target.value);
  }
  
  handleNextItem(event){
    event.preventDefault();
    if(this.state.hotItem < this.state.confirmedFood[this.state.currentOrderIndex].length - 1){
      this.setState({
        hotItem: (this.state.hotItem + 1)
      })
    }
  }
  
  render() {
    let foodList;
    const selectFood = this.handleFoodClick.bind(this);
    foodList = this.state.foods;

    
    
    return (
      <div className="main">
        <h1>Menu</h1>
        <FoodItems foods={foodList} hide={this.state.readyToAddIngredients} onClick={selectFood}/>
        <Counter selectedFood={this.state.selectedFood} hide={this.state.readyToAddIngredients} onChange={this.handleQuantityChange.bind(this)}/>
        <AmountSubmit amount={this.state.foodAmount}  hide={this.state.readyToAddIngredients} selectedFood={this.state.selectedFood} onClick={this.handleConfirmQuantity.bind(this)}/>
        <FoodIngredients food={this.state.selectedFood} 
                         ready={this.state.readyToAddIngredients} 
                         currentOrder={this.state.confirmedFood[this.state.currentOrderIndex]} 
                         currentItem = {this.state.hotItem}
                         toggleCheck = {this.handleCheckToggle.bind(this)}
                         nextItem={this.handleNextItem.bind(this)}/>
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
    }
    if(this.props.ready){
      const specificIngredients = ingredients.map((item, index) => 
        <Ingredient value={item} onChange={this.props.toggleCheck}/>
      )
      return(
        <div className="ingredient-section">
          <h2>What would you like on {this.props.food} number {this.props.currentItem + 1}?</h2>
          <form className="ingredient-list" onSubmit={this.props.nextItem}>
            {specificIngredients}
          
            <button type="submit">Next Item</button>
          </form>
        </div>
      );
    }else{
      return null;
    }
  }
}

class Ingredient extends React.Component {
  render(){
      return(
      <div className="ingredient">
        <input type="checkbox" id={this.props.value} name="ingredient" value={this.props.value} onChange={this.props.onChange}></input>
        <label htmlFor={this.props.value}>{this.props.value}</label>
      </div>
    );
  }
}




ReactDOM.render(<Menu />, document.getElementById('root'));


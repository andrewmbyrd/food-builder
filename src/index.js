import React from 'react';
import ReactDOM from 'react-dom';


class Menu extends React.Component {
  constructor() {
    super();
    this.state = {
      foods: [{"food": "Pizza", "price": 5}, {"food": "Hamburger", "price": 4}, {"food": "Hot Dog", "price": 3}, {"food": "Ice Cream", "price": 4}],
      selectedFood: null,
      foodAmount: 0,
      totalPrice: 0
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
    
  }
  render() {
    let foodList;
    const selectFood = this.handleFoodClick.bind(this);
    foodList = this.state.foods;

    
    
    return (
      <div className="main">
        <h1>Menu</h1>
        <FoodItems foods={foodList} onClick={selectFood}/>
        <Counter selectedFood={this.state.selectedFood} onChange={this.handleQuantityChange.bind(this)}/>
        <AmountSubmit selectedFood={this.state.selectedFood}/>
        <FoodIngredients food={this.state.selectedFood}/>
      </div>  
    );
  }
}

class FoodItems extends React.Component{
  

  render() {
    const foods = this.props.foods.map((item, index) =>
        <li key={index}><Food value={item["food"]} cost={item["price"]} onClick={this.props.onClick}/></li>
    );
    return (
      <ul className="food-list">
        {foods}
      </ul>
    );
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
    if(this.props.selectedFood){
      let counterBox = document.getElementById('counter');
      return(
        <div className="counter-section">
          <h2> How many {this.props.selectedFood}s would you like? </h2>
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
    if (this.props.selectedFood){
      return(
        <button className="amount-submit" type="button">Select Ingredients for these {this.props.selectedFood}s</button>
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
    if(this.props.food){
      const specificIngredients = ingredients.map((item, index) => 
        <li key={index} className="ingredient-item"><Ingredient value={item}/></li>
      )
      return(
        <div className="ingredient-section">
          <h2>What would you like on your {this.props.food}?</h2>
          <ul className="ingredient-list">
            {specificIngredients}
          </ul>
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
        <p>{this.props.value}</p>
      </div>
    );
  }
}




ReactDOM.render(<Menu />, document.getElementById('root'));


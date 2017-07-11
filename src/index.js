import React from 'react';
import ReactDOM from 'react-dom';

class Menu extends React.Component {
  constructor() {
    super();
    this.state = {
      foods: ["Pizza", "Hamburger", "Hot Dog", "Ice Cream"],
      selectedFood: null
    };
  }
  
  handleFoodClick(food){
    console.log(food);
    this.setState({
      selectedFood: food
    })
  }
  
  handleIngredientClick(ingredient){
    console.log(ingredient);
  }

  
  render() {
    let foodList;
    const selectFood = this.handleFoodClick.bind(this);
    foodList = this.state.foods;

    
    
    return (
      <div className="main">
        <h1>Hello! Please Select which type of food you would like:</h1>
        <FoodItems foods={foodList} onClick={selectFood}/>
        <h2>What would you like on your {this.state.selectedFood}?</h2>
        <FoodIngredients food={this.state.selectedFood}/>
      </div>  
    );
  }
}

class FoodItems extends React.Component{
  renderFood(food){
    return(
      <Food value={food} onClick={this.props.onClick}/>
    );
  }

  render() {
    return (
      <ul className="food-list">
        {this.renderFood(this.props.foods[0])}
        {this.renderFood(this.props.foods[1])}
        {this.renderFood(this.props.foods[2])}
        {this.renderFood(this.props.foods[3])}
      </ul>
    );
  }

}

class Food extends React.Component {
  
  render() {
    return (
      <div className="food-item"
           onClick={() => this.props.onClick(this.props.value)}>
        <p>{this.props.value}</p>
      </div>
    );
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
        ingredients = ["Pepperoni", "Sausage"];
        break;
      case "Hamburger":
        ingredients = ["Ketchup", "Pickles"];
        break;
      case "Hot Dog":
        ingredients = ["Relish", "Mustard"];
        break;
      case "Ice Cream":
        ingredients = ["Chocolate Syrup", "Sprinkles"];
        break;
      default:
        ingredients = ["dumb", "stupid"];
    }
    
    return(
      <ul className="ingredient-list">
        <li>{this.renderIngredient(ingredients[0])}</li>
        <li>{this.renderIngredient(ingredients[1])}</li>
      </ul>
    );
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


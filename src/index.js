import React from 'react';
import ReactDOM from 'react-dom';

class Menu extends React.Component {
  constructor() {
    super();
    this.state = {
      foods: ["Pizza", "Hamburger", "Hot Dog", "Ice Cream"],
      showFoods: true,
      menuHeading: "Hello! Please Select which type of food you would like"
    };
  }
  
  handleFoodClick(food){
    console.log(food);
    this.setState({
      showFoods: !this.state.showFoods,
      menuHeading: `Select what you would like on your ${food}`
    });
  }

  
  render() {
    let foodList;
    const clickAction = this.handleFoodClick.bind(this);
    
    if( this.state.showFoods ) {
      foodList = this.state.foods.map(function(food, index) {
        return (<li className={`${food.split(' ').join('')}-option`}>
                  <Food value={food} 
                        key={index} 
                        onClick={clickAction}
                  />  
                </li>);
        
      });
    }
    
    return (
      <div className="main">
        <h1>{this.state.menuHeading}</h1>
        <ul className="food-list">
          {foodList}
        </ul>
      </div>  
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


ReactDOM.render(<Menu />, document.getElementById('root'));


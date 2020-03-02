import React, { Component } from 'react';
import './App.css';

const list = [
  {
  title: 'React',
  url: 'https://reactjs.org/',
  author: 'Jordan Walke',
  num_comments: 3,
  points: 4,
  objectID: 0,
  },
  {
  title: 'Redux',
  url: 'https://redux.js.org/',
  author: 'Dan Abramov, Andrew Clark',
  num_comments: 2,
  points: 5,
  objectID: 1,
  },
  ];

const isSearched = searchTerm => item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  //The App class extends from the Component class
  //meaning it inherits funcionality from the Component class
  //The Component class encapsulates all the implementation details of a React component, which allows
  //developers to use classes as components in React
class App extends Component { //Class component

  constructor(props){ //Constructor for initialize a local component state
    super(props)
    this.state = {//**Local component state** //Object Inicializer
      list, // If the property name is the same as your variable name, you can avoid repetition.
      aboutMe:{
        name:"Brenda",
        age:24,
        from: "Mexico"
      },
      searchTerm: ""
    }//This can be avoided using JavaScript ES6 arrow functions 
    this.onDismiss = this.onDismiss.bind(this)// In order to define the onDismiss() as class method, you have to bind it in the constructor
    this.onSearchChange = this.onSearchChange.bind(this)
  }
  onClickMe = () => {
    console.log(this);
  }
  onDismiss(id) {
    const updatedList = this.state.list.filter(item => item.objectID !== id)
    this.setState({ list: updatedList}) // class method to update the local component state.
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value})
  }

  //JSX mixes up HTML and JavaScript to define the output of React components in their render methods  
  render(){//It's a method from the Component class it defines the output of a React Component
    const {searchTerm, list, aboutMe } = this.state // ES6 Destructuring. The same concept applies to arrays.
  return (
      <div className="page">
        <div className="interactions">
          <h1>I am {aboutMe.name}</h1>
          <Search
            value = { searchTerm }
            onChange = {this.onSearchChange}>
              Search
          </Search>
          <Table 
            list = {list}
            pattern = {searchTerm}
            onDismiss = {this.onDismiss}
          />
          <button onClick={this.onClickMe} type="button">Click Me </button>
        </div>
        
      </div>
    );
  } 
}

const Search = ({ value, onChange, children})  =>
      <form>
       {children} <input
          type = "text"
          value = {value}
          onChange = {onChange}
        />
      </form>


const largeColumn = {
  width: '40%',
};
const midColumn = {
  width: '30%',
};
 const smallColumn = {
  width: '10%',
};
  
const Table = ({ list, pattern, onDismiss }) => 
      <div className ="table">
          {list.filter(isSearched(pattern)).map(item=>
            <div key={item.objectID} className="table-row">
                      <span style={largeColumn}><a href={item.url}>{item.title}</a></span>
                      <span style={midColumn}>{item.author}</span>
                      <span style={smallColumn}>{item.num_comments}</span>
                      <span style={smallColumn}>{item.points}</span>
                      <span style={smallColumn}>
                      <Button onClick={()=> onDismiss(item.objectID)} className="button-inline">
                        Dismiss 
                      </Button>
                         {/*
                        <button onClick={()=>console.log(item.objectID)} type="button" >
                          Dismiss
                        </button>*/}
                    </span>
              </div>       
            )}
      </div>

const Button = ({ onClick, className = '', children }) =>
      <button
        onClick = {onClick}
        className = {className}
        type = "button"
      >
        {children}
      </button>

export default App;

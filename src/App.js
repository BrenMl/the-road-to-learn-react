import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100'
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page='
const PARAM_HPP = 'hitsPerPage='

//const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

/*const isSearched = searchTerm => item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())*/
  //The App class extends from the Component class
  //meaning it inherits funcionality from the Component class
  //The Component class encapsulates all the implementation details of a React component, which allows
  //developers to use classes as components in React
class App extends Component { //Class component

  constructor(props){ //Constructor for initialize a local component state
    super(props)
    this.state = {//**Local component state** //Object Inicializer
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null
    }//This can be avoided using JavaScript ES6 arrow functions 
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this)
    this.onDismiss = this.onDismiss.bind(this)// In order to define the onDismiss() as class method, you have to bind it in the constructor
    this.onSearchChange = this.onSearchChange.bind(this)
    this.setSeachTopStories = this.setSeachTopStories.bind(this)
    this.onSearchSubmit = this.onSearchSubmit.bind(this)
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this)
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm]
  }

  setSeachTopStories(result){
    const { hits, page} = result
    const { searchKey, results } = this.state

    const oldHits = results && results[searchKey]
     ?results[searchKey].hits : []
    
    const updateHits = [
      ...oldHits,
      ...hits
    ]
    this.setState({
      results: {
        ...results,
        [searchKey]: {hits: updateHits, page}
      }
    })
  }
 
  componentDidMount(){
    const {searchTerm } = this.state
    this.setState({ searchKey: searchTerm})
    this.fetchSearchTopStories(searchTerm);
  }

  onClickMe = () => {
    console.log(this);
  }
  onDismiss(id) {
    const { searchKey, results } = this.state
    const { hits, page } = results[searchKey]
    const isNotId = item => item.objectID !== id
    const updatedHits = hits.filter(isNotId)
    //this.setState({result: Object.assign({}, this.state.result, { hits: updatedHits }) // class method to update the local component state.
    this.setState({results: {...results, 
      [searchKey]:{ hits: updatedHits, page } }})
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(result => this.setSeachTopStories(result.data))
      .catch(error => this.setState({error}))
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value})
  }

  onSearchSubmit(event){
    const { searchTerm } = this.state
    this.setState({ searchKey: searchTerm })
    if(this.needsToSearchTopStories(searchTerm)){
      this.fetchSearchTopStories(searchTerm)
    }
    event.preventDefault()
  }
  //JSX mixes up HTML and JavaScript to define the output of React components in their render methods  
  render(){//It's a method from the Component class it defines the output of a React Component
    const {searchTerm, results, searchKey, error } = this.state // ES6 Destructuring. The same concept applies to arrays.
    const page = (results && results[searchKey] && results[searchKey].page) || 0
    const list = (results && results[searchKey] && results[searchKey].hits) || [] 
    //if (!result) { return null}
    
    return (
  <div className="page">{/*Styling CSS */}
        <div className="interactions">
          <Search
            value = { searchTerm }
            onChange = {this.onSearchChange}
            onSubmit={this.onSearchSubmit}>
              Search
          </Search>
          {error 
            ? <div className= "interactions">
                <p>Something went wrong.</p>
              </div>
            : <Table 
                list = {list}
                onDismiss = {this.onDismiss}
              />
          }
          
          <div className = "iteractions">
            <Button onClick = {() => this.fetchSearchTopStories(searchKey, page + 1)}>
              More
            </Button>
          </div>
          <button onClick={this.onClickMe} type="button">Click Me </button>
        </div>
        
      </div>
    );
  } 
}

{/*Functional Stateles Components */}
const Search = ({ value, onChange, onSubmit, children})  =>
      <form onSubmit={onSubmit}>
        <input
          type = "text"
          value = {value} 
          onChange = {onChange}
        />
        <button type ="submit">
          {children}
        </button>
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
  
const Table = ({ list, onDismiss }) => 
      <div className ="table">
          {list.map(item=>
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

import * as React from 'react';

interface Props {}

interface Planet {
  name: string;
}

class App extends React.Component {

  state = { 
    planets: []
  }

  async componentDidMount () {
    console.log('mount')
    try {
      const data = await fetch('https://swapi.co/api/planets').then(response => response.json());
      console.log(data);
      this.setState({
        planets: data.results
      })
    } catch (err) {
      console.log(err);
    }
  }
  
  public render () {
    const { planets } = this.state;
    return (
      <div>
        <h1>Star Wars Planets</h1>
        <ul>
          {planets.map((planet: Planet) => <li key={planet.name}>{planet.name}</li>)}
        </ul>
      </div>
    );
  }

};

export default App;
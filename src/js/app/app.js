/** @jsx React.DOM */
(function() {

  cabbie.nav = {

    options: {
      home: {
        text: 'home'
      },
      tryRoute: {
        text: 'Try route',
        action: function(){
        
          
        }
      }
    }
  };

  var App = React.createClass({
  getInitialState: function() {
    return {map: 'off', slider: 'on'};
  },
  render: function() {

    var Nav = cabbie.components.Nav;
    var Map = cabbie.components.Map;
    var Slider = cabbie.components.Slider;
    var JsonInput = cabbie.components.JsonInput;

    return (
      <div className="pure-g-r content id-layout">
        <Nav options={cabbie.nav.options} />
        <Map state={this.state.map} />
        <Slider state={this.state.slider} />
      </div>
    );
  }
});

  window.onload = function(){

    React.renderComponent(<App />, document.body);
  };

}());
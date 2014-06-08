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
          cabbie.slider.open();
        }
      },
      redraw: {
        text: 'Replay route',
        action: function(){
          cabbie.map.replay();
        },
        isDisabled: true
      }
    }
  };

  cabbie.nav.setOption = function(id, bool){
  
    cabbie.nav.options[id].isDisabled = bool;
    cabbie.renderAll();
  };

  var App = React.createClass({
  getInitialState: function() {
    return {
      map: 'off',
      loading: 'none'
    };
  },
  showLoading: function(bool){
  
    this.setState({
      loading: bool
    });

  },
  render: function() {

    var Nav = cabbie.components.Nav;
    var Map = cabbie.components.Map;
    var Slider = cabbie.components.Slider;
    var JsonInput = cabbie.components.JsonInput;

    return (
      <div className="pure-g-r content id-layout">
        <Nav options={cabbie.nav.options} />
        <Map state={this.state.map} loading={this.state.loading} />
        <Slider state='on' />
      </div>
    );
  }
});

cabbie.renderAll = function(){
  cabbie.App = React.renderComponent(<App />, document.body);
};

window.onload = function(){
  cabbie.renderAll();
};


}());
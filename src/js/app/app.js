/** @jsx React.DOM */
(function() {

  cabbie.nav = { 
    options: {
      code: {
        text: 'code',
        action: function(){
          //  go to github source code
          location.href = "https://github.com/AntouanK/cabbie";
        }
      },
      tryRoute: {
        text: 'Try route',
        action: function(){
          //  open slider
          cabbie.App.setState({isSliderOn: true});
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
      loading: 'none',
      isSliderOn: true
    };
  },
  showLoading: function(bool){
  
    this.setState({
      loading: bool
    });

  },
  showSlider: function(bool){
  
    this.setState({
      isSliderOn: bool
    });
  },
  render: function() {

    var Nav = cabbie.components.Nav;
    var Map = cabbie.components.Map;
    var Slider = cabbie.components.Slider;
    var JsonInput = cabbie.components.JsonInput;

    console.log(this.state);

    return (
      <div className="pure-g-r content id-layout">
        <Nav options={cabbie.nav.options} />
        <Map state={this.state.map} loading={this.state.loading} />
        <Slider state={this.state.isSliderOn} />
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
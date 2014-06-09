/** @jsx React.DOM */
(function() {

  //  our top Nav bar options
  //  'text' has the text to display
  //  'action' is the callback on click
  //  'isDisabled' boolean to enable/disable this option
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

  //  enable/disable an option
  cabbie.nav.setOption = function(id, bool){
  
    cabbie.nav.options[id].isDisabled = bool;
    cabbie.renderAll();
  };

  //  our main App top level component
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


    //  our basic HTML structure of the app
    return (
      <div className="pure-g-r">
        <Nav options={cabbie.nav.options} />
        <Map state={this.state.map} loading={this.state.loading} />
        <Slider state={this.state.isSliderOn} />
      </div>
    );
  }
});

//  force render on top level
cabbie.renderAll = function(){
  cabbie.App = React.renderComponent(<App />, document.body);
};

window.onload = function(){
  cabbie.renderAll();
};


}());
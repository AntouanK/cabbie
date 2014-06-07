/** @jsx React.DOM */
(function() {

'use strict';

cabbie.components = {};


cabbie.components.Nav = React.createClass({
  render: function(){

    var options = this.props.options;
    var optionsToRender = [];
    Object.keys(options)
    .forEach(function(key){
      optionsToRender.push(
        <li><a href="#">{options[key].text}</a></li>
      );
    });

    console.log(options);

    return (
      <div className="home-menu pure-menu pure-menu-open pure-menu-horizontal pure-menu-fixed">
        <ul>
            {optionsToRender}
        </ul>
      </div>
    );
  }
});

cabbie.components.JsonInput = React.createClass({
  getInitialState: function() {
    return {value: ''};
  },
  handleChange: function(event) {
    this.setState({value: event.target.value});
  },
  form: {
    textareaValue: ''
  },
  render: function(){

    var thisEle = this;
    var value = this.state.value;
    var onSubmitJson = function(e){

      var json;

      try {
        json = JSON.parse(thisEle.state.value);

        console.log(json);
        if(typeof thisEle.props.callback === 'function'){
          thisEle.props.callback(json);
        }

        //  setting state back to empty
        thisEle.setState({ value: '' });
        e.preventDefault();
      } catch (e) {
        return false;
      }
    };

    return (
      <form onSubmit={onSubmitJson}>
        <textarea name="textarea"
          placeholder="Write your json here"
          onChange={this.handleChange}
          value={value} />
        <button>check route</button>
      </form>
    );
  }
});

cabbie.components.Slider = React.createClass({
  getInitialState: function(){
    // set the initial state from the properties
    return {
      state: this.props.state
    };
  },
  render: function() {
    var thisEle = this;
    var sliderClass = 'slider ' + this.state.state;
    var JsonInput = cabbie.components.JsonInput;
    var makeRoute = function(data){

      cabbie.map.tryRoute(data);
      thisEle.setState({state: 'off'});
    };

    console.log('rendering with class', sliderClass);

    return (
      <div className={sliderClass}>
        <JsonInput callback={makeRoute}/>
      </div>
    );
  }
});

cabbie.components.Map = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function() {
    return (
      <div id="map-container">
        <div id="map-canvas"></div>
      </div>
    );
  }
});



}());
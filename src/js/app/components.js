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

    // fill in the textarea with fake sample data
    var tryFake = function(e){

      thisEle.setState({
        value: JSON.stringify(window._sample_points)
      });
      e.preventDefault();
    };

    return (
      <div className="pure-g">
        <form onSubmit={onSubmitJson} className="pure-form pure-u-11-12">
          <fieldset>
            <legend>Give your route details in JSON format</legend>

            <div className="pure-g">
              <div className="pure-u-3-4">
              <textarea name="textarea"
                rows="20"
                style={{
                  width: '100%'
                }}
                placeholder="Write your json here"
                onChange={this.handleChange}
                value={value} />
              </div>
              <div className="pure-u-1-4">
                <button className="pure-button pure-button-primary">check route</button>
                <a className="pure-button" href="#" onClick={tryFake}>try sample data</a>
              </div>
            </div>
          </fieldset>
        </form>
      </div>
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
    var sliderClass = 'slider pure-g ' + this.state.state;
    var JsonInput = cabbie.components.JsonInput;
    var makeRoute = function(data){

      cabbie.map.tryRoute(data);
      thisEle.setState({state: 'off'});
    };

    console.log('rendering with class', sliderClass);

    return (
      <div className={sliderClass}>
        <div className="pure-u-1-12 text-center">
          <span className="icon-open"></span>
        </div>
        <div className="pure-u-11-12">
          <div className="whenOn">
            <JsonInput callback={makeRoute}/>
          </div>
          <div className="whenOff">
            info here
          </div>
        </div>
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
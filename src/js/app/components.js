/** @jsx React.DOM */
(function() {

'use strict';

cabbie.components = {};

cabbie.components.Nav = React.createClass({
  getInitialState: function() {
    return {
      options: this.props.options
    };
  },
  options: function(options){
  
    var thisEle = this;

    thisEle.setState({
      options: options
    });
  },
  setOption: function(id, bool){
  
    this.state.options[id].isDisabled = bool;
  },
  render: function(){

    var options = this.state.options;
    var optionsToRender = [];
    Object.keys(options)
    .forEach(function(key){

      var liClass = options[key].isDisabled ? 'pure-menu-disabled' : '';
      optionsToRender.push(
        <li className={liClass}>
          <a href="#" 
            onClick={options[key].action}>
          {options[key].text}
          </a>
        </li>
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


cabbie.components.Counter = React.createClass({
  getInitialState: function(){
    return {
      value: this.props.value
    };
  },
  oneUp: function(){

    if(this.state.value === 30){
      return;
    }

    var newValue = this.state.value += 1;

    this.setState({
      value: newValue
    });

    this.getDOMNode().setAttribute('value', newValue);
  },
  oneDown: function(){
  
    if(this.state.value === 0){
      return;
    }

    var newValue = this.state.value -= 1;

    this.setState({
      value: newValue
    });

    this.getDOMNode().setAttribute('value', newValue);
  },
  render: function(){
  
    var thisEle = this,
        value = this.state.value;

    return (
      <div className="pure-g counter" value={value}>
        <div className="pure-u-1-4 text-center">
          <span className="icon-minus" onClick={thisEle.oneDown}></span>
        </div>
        <div className="pure-u-1-2 text-center">
          <span className="counter-value">{value}</span>
        </div>
        <div className="pure-u-1-4 text-center">
          <span className="icon-plus" onClick={thisEle.oneUp}></span>
        </div>
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

    var thisEle = this,
        value = this.state.value,
        speedValue = 10,  //  default speed
        Counter = cabbie.components.Counter;
    
    var onSubmitJson = function(e){

      var json;

      try {
        json = JSON.parse(thisEle.state.value);
        var el = thisEle.getDOMNode();
        speedValue = +el.getElementsByClassName('counter')[0].attributes['value'].value;

        console.log(json);
        if(typeof thisEle.props.callback === 'function'){
          thisEle.props.callback(json, speedValue);
        }

        //  setting state back to empty
        thisEle.setState({ value: '' });
        e.preventDefault();
      } catch (e) {
        throw Error(e);
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
                <div className="pure-g">
                  <div className="pure-u-1-1">
                    <div className="l-box">
                      <button className="pure-button expand pure-button-primary">check route</button>
                    </div>
                  </div>
                </div>
                <div className="pure-g">
                  <div className="pure-u-1-1">
                    <div className="l-box">
                      <button className="pure-button expand" href="#" onClick={tryFake}>try sample data</button>
                    </div>
                  </div>
                </div>
                <div className="pure-g">
                  <div className="pure-u-1-1">
                    <div className="l-box">
                      <strong>how slow?</strong>
                      <Counter value={speedValue} />
                    </div>
                  </div>
                </div>
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
  open: function(){
  
    this.setState({
      state: 'on'
    });
  },
  close: function(){
  
    this.setState({
      state: 'off'
    });
  },
  makeRoute: function(data, speed){

    debugger;
    cabbie.map.tryRoute(data, speed);
    this.close();
    console.log('making route with speed', speed);
  },
  render: function() {
    var thisEle = this;
    var sliderClass = 'slider pure-g ' + thisEle.state.state;
    var JsonInput = cabbie.components.JsonInput;

    console.log('rendering with class', sliderClass);

    return (
      <div className={sliderClass}>
        <div className="pure-u-1-12 text-center">
          <span className="icon-maximize" onClick={thisEle.open}></span>
          <span className="icon-minimize" onClick={thisEle.close}></span>
        </div>
        <div className="pure-u-11-12">
          <div className="whenOn">
            <JsonInput callback={thisEle.makeRoute}/>
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
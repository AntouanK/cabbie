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
    return { map: 'off' };
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
(function() {

"use strict";

window._sample_points = [
  {
    "latitude": "51.498714933833",
    "longitude": "-0.16011779913771",
    "timestamp": "1326378718"
  },
  {
    "latitude": "51.498405862027",
    "longitude": "-0.16040688237893",
    "timestamp": "1326378723"
  },
  {
    "latitude": "51.498205021215",
    "longitude": "-0.16062694283829",
    "timestamp": "1326378728"
  },
  {
    "latitude": "51.498041549679",
    "longitude": "-0.16053670343517",
    "timestamp": "1326378733"
  },
  {
    "latitude": "51.497699480198",
    "longitude": "-0.16045812165606",
    "timestamp": "1326378738"
  },
  {
    "latitude": "51.497339979407",
    "longitude": "-0.16068209714038",
    "timestamp": "1326378743"
  },
  {
    "latitude": "51.497093692083",
    "longitude": "-0.16079097399996",
    "timestamp": "1326378748"
  },
  {
    "latitude": "51.497047271966",
    "longitude": "-0.16075816569863",
    "timestamp": "1326378753"
  },
  {
    "latitude": "51.497039084809",
    "longitude": "-0.16074381872414",
    "timestamp": "1326378758"
  },
  {
    "latitude": "51.496962231832",
    "longitude": "-0.16115347616116",
    "timestamp": "1326378763"
  },
  {
    "latitude": "51.496898186924",
    "longitude": "-0.16181680151894",
    "timestamp": "1326378768"
  },
  {
    "latitude": "51.496832022603",
    "longitude": "-0.1625463356632",
    "timestamp": "1326378773"
  },
  {
    "latitude": "51.496701197287",
    "longitude": "-0.16298497183143",
    "timestamp": "1326378778"
  },
  {
    "latitude": "51.496664330194",
    "longitude": "-0.16303419601201",
    "timestamp": "1326378783"
  },
  {
    "latitude": "51.496456202351",
    "longitude": "-0.16321782957309",
    "timestamp": "1326378788"
  },
  {
    "latitude": "51.496238338237",
    "longitude": "-0.16337078081442",
    "timestamp": "1326378793"
  },
  {
    "latitude": "51.496085489167",
    "longitude": "-0.16299822359853",
    "timestamp": "1326378798"
  },
  {
    "latitude": "51.495775945681",
    "longitude": "-0.16278601421789",
    "timestamp": "1326378803"
  },
  {
    "latitude": "51.495125120998",
    "longitude": "-0.16268601102417",
    "timestamp": "1326378813"
  },
  {
    "latitude": "51.494872502279",
    "longitude": "-0.16277497487834",
    "timestamp": "1326378818"
  },
  {
    "latitude": "51.495021062914",
    "longitude": "-0.16314752418692",
    "timestamp": "1326378823"
  },
  {
    "latitude": "51.495363761768",
    "longitude": "-0.16356176496922",
    "timestamp": "1326378828"
  },
  {
    "latitude": "51.495707289394",
    "longitude": "-0.16374090218231",
    "timestamp": "1326378833"
  },
  {
    "latitude": "51.495882577737",
    "longitude": "-0.16374607154559",
    "timestamp": "1326378838"
  },
  {
    "latitude": "51.495882580174",
    "longitude": "-0.16374607131387",
    "timestamp": "1326378843"
  },
  {
    "latitude": "51.495882580174",
    "longitude": "-0.16374607131387",
    "timestamp": "1326378855"
  },
  {
    "latitude": "51.495882580174",
    "longitude": "-0.16374607131387",
    "timestamp": "1326378857"
  },
  {
    "latitude": "51.495882580174",
    "longitude": "-0.16374607131387",
    "timestamp": "1326378886"
  },
  {
    "latitude": "51.495882580174",
    "longitude": "-0.16374607131387",
    "timestamp": "1326378903"
  },
  {
    "latitude": "51.495882580174",
    "longitude": "-0.16374607131387",
    "timestamp": "1326378915"
  },
  {
    "latitude": "51.495882580174",
    "longitude": "-0.16374607131387",
    "timestamp": "1326378927"
  },
  {
    "latitude": "51.495882580174",
    "longitude": "-0.16374607131387",
    "timestamp": "1326378932"
  },
  {
    "latitude": "51.495882580174",
    "longitude": "-0.16374607131387",
    "timestamp": "1326378943"
  },
  {
    "latitude": "51.495882580174",
    "longitude": "-0.16374607131387",
    "timestamp": "1326378953"
  },
  {
    "latitude": "51.495882580174",
    "longitude": "-0.16374607131387",
    "timestamp": "1326378963"
  },
  {
    "latitude": "51.495882580174",
    "longitude": "-0.16374607131387",
    "timestamp": "1326378984"
  },
  {
    "latitude": "51.495882580174",
    "longitude": "-0.16374607131387",
    "timestamp": "1326378993"
  },
  {
    "latitude": "51.495882580174",
    "longitude": "-0.16374607131387",
    "timestamp": "1326379002"
  },
  {
    "latitude": "51.495882580174",
    "longitude": "-0.16374607131387",
    "timestamp": "1326379012"
  },
  {
    "latitude": "51.495882580174",
    "longitude": "-0.16374607131387",
    "timestamp": "1326379018"
  },
  {
    "latitude": "51.495882580174",
    "longitude": "-0.16374607131387",
    "timestamp": "1326379028"
  },
  {
    "latitude": "51.495882580174",
    "longitude": "-0.16374607131387",
    "timestamp": "1326379035"
  },
  {
    "latitude": "51.495882580174",
    "longitude": "-0.16374607131387",
    "timestamp": "1326379045"
  },
  {
    "latitude": "51.495882580174",
    "longitude": "-0.16374607131387",
    "timestamp": "1326379050"
  },
  {
    "latitude": "51.495882580174",
    "longitude": "-0.16374607131387",
    "timestamp": "1326379065"
  },
  {
    "latitude": "51.495882580174",
    "longitude": "-0.16374607131387",
    "timestamp": "1326379074"
  },
  {
    "latitude": "51.495882580174",
    "longitude": "-0.16374607131387",
    "timestamp": "1326379095"
  },
  {
    "latitude": "51.495882580174",
    "longitude": "-0.16374607131387",
    "timestamp": "1326379103"
  },
  {
    "latitude": "51.495882580174",
    "longitude": "-0.16374607131388",
    "timestamp": "1326379113"
  },
  {
    "latitude": "51.496024220286",
    "longitude": "-0.16374018364534",
    "timestamp": "1326379126"
  },
  {
    "latitude": "51.496279150623",
    "longitude": "-0.16350567289519",
    "timestamp": "1326379130"
  },
  {
    "latitude": "51.496565238427",
    "longitude": "-0.16315570241499",
    "timestamp": "1326379135"
  },
  {
    "latitude": "51.496739759278",
    "longitude": "-0.1629408409709",
    "timestamp": "1326379141"
  },
  {
    "latitude": "51.496744866212",
    "longitude": "-0.16293423642828",
    "timestamp": "1326379146"
  },
  {
    "latitude": "51.496838130182",
    "longitude": "-0.16259841152216",
    "timestamp": "1326379152"
  },
  {
    "latitude": "51.496886892427",
    "longitude": "-0.16186532149791",
    "timestamp": "1326379157"
  },
  {
    "latitude": "51.496963152025",
    "longitude": "-0.16094624165062",
    "timestamp": "1326379162"
  },
  {
    "latitude": "51.49715586367",
    "longitude": "-0.15933387624066",
    "timestamp": "1326379172"
  },
  {
    "latitude": "51.497191046823",
    "longitude": "-0.15915982089467",
    "timestamp": "1326379178"
  },
  {
    "latitude": "51.497191046823",
    "longitude": "-0.15915982089467",
    "timestamp": "1326379184"
  },
  {
    "latitude": "51.497191046823",
    "longitude": "-0.15915982089467",
    "timestamp": "1326379198"
  },
  {
    "latitude": "51.497229833317",
    "longitude": "-0.15878035181158",
    "timestamp": "1326379206"
  },
  {
    "latitude": "51.497288650092",
    "longitude": "-0.15816729520732",
    "timestamp": "1326379211"
  },
  {
    "latitude": "51.497360785754",
    "longitude": "-0.15760849811115",
    "timestamp": "1326379216"
  },
  {
    "latitude": "51.497388589039",
    "longitude": "-0.15735332351902",
    "timestamp": "1326379220"
  },
  {
    "latitude": "51.497428151787",
    "longitude": "-0.15677856224426",
    "timestamp": "1326379225"
  },
  {
    "latitude": "51.497483751963",
    "longitude": "-0.1560206499171",
    "timestamp": "1326379231"
  },
  {
    "latitude": "51.497488819382",
    "longitude": "-0.155422453186",
    "timestamp": "1326379235"
  },
  {
    "latitude": "51.497567432436",
    "longitude": "-0.15467130936286",
    "timestamp": "1326379240"
  },
  {
    "latitude": "51.497725084039",
    "longitude": "-0.15434417463009",
    "timestamp": "1326379246"
  },
  {
    "latitude": "51.497750474163",
    "longitude": "-0.15430388757953",
    "timestamp": "1326379250"
  },
  {
    "latitude": "51.497809756579",
    "longitude": "-0.1542154569219",
    "timestamp": "1326379255"
  },
  {
    "latitude": "51.49800006423",
    "longitude": "-0.15395552006239",
    "timestamp": "1326379260"
  },
  {
    "latitude": "51.49815136045",
    "longitude": "-0.15379850613312",
    "timestamp": "1326379265"
  },
  {
    "latitude": "51.51138670225",
    "longitude": "-0.17560958862388",
    "timestamp": "1326379271"
  },
  {
    "latitude": "51.498804631697",
    "longitude": "-0.1545503467458",
    "timestamp": "1326379276"
  },
  {
    "latitude": "51.499081254751",
    "longitude": "-0.15482374473359",
    "timestamp": "1326379280"
  },
  {
    "latitude": "51.499441037299",
    "longitude": "-0.15472292894966",
    "timestamp": "1326379285"
  },
  {
    "latitude": "51.499858348523",
    "longitude": "-0.15411358719916",
    "timestamp": "1326379291"
  },
  {
    "latitude": "51.500091108708",
    "longitude": "-0.15355052560274",
    "timestamp": "1326379296"
  },
  {
    "latitude": "51.500035558459",
    "longitude": "-0.1529852992773",
    "timestamp": "1326379300"
  },
  {
    "latitude": "51.499660208182",
    "longitude": "-0.15229835499463",
    "timestamp": "1326379305"
  },
  {
    "latitude": "51.499359842316",
    "longitude": "-0.15182118757283",
    "timestamp": "1326379310"
  },
  {
    "latitude": "51.499575075261",
    "longitude": "-0.15140472743165",
    "timestamp": "1326379315"
  },
  {
    "latitude": "51.499853006078",
    "longitude": "-0.15102502378143",
    "timestamp": "1326379321"
  },
  {
    "latitude": "51.499968367133",
    "longitude": "-0.15084293068496",
    "timestamp": "1326379325"
  },
  {
    "latitude": "51.500090874059",
    "longitude": "-0.15064067648444",
    "timestamp": "1326379331"
  },
  {
    "latitude": "51.500139008189",
    "longitude": "-0.15049859196637",
    "timestamp": "1326379335"
  },
  {
    "latitude": "51.500148291482",
    "longitude": "-0.15045036079831",
    "timestamp": "1326379341"
  },
  {
    "latitude": "51.50016233219",
    "longitude": "-0.15043493800081",
    "timestamp": "1326379345"
  },
  {
    "latitude": "51.500190289616",
    "longitude": "-0.15039602679753",
    "timestamp": "1326379350"
  },
  {
    "latitude": "51.500190289616",
    "longitude": "-0.15039602679753",
    "timestamp": "1326379355"
  },
  {
    "latitude": "51.511520245835",
    "longitude": "-0.17449378967286",
    "timestamp": "1326379365"
  },
  {
    "latitude": "51.500258026911",
    "longitude": "-0.15035591639452",
    "timestamp": "1326379371"
  },
  {
    "latitude": "51.500303689102",
    "longitude": "-0.15030449775124",
    "timestamp": "1326379376"
  },
  {
    "latitude": "51.500476916428",
    "longitude": "-0.15008530536283",
    "timestamp": "1326379381"
  },
  {
    "latitude": "51.50062527805",
    "longitude": "-0.14987894318086",
    "timestamp": "1326379386"
  },
  {
    "latitude": "51.500784720129",
    "longitude": "-0.14999280400909",
    "timestamp": "1326379391"
  },
  {
    "latitude": "51.501139597585",
    "longitude": "-0.15069264578245",
    "timestamp": "1326379396"
  },
  {
    "latitude": "51.50154635582",
    "longitude": "-0.15130148851973",
    "timestamp": "1326379401"
  },
  {
    "latitude": "51.501736804223",
    "longitude": "-0.15155444340624",
    "timestamp": "1326379406"
  },
  {
    "latitude": "51.50174466789",
    "longitude": "-0.15156534738706",
    "timestamp": "1326379411"
  },
  {
    "latitude": "51.501746850885",
    "longitude": "-0.15156670060094",
    "timestamp": "1326379416"
  },
  {
    "latitude": "51.501757541048",
    "longitude": "-0.15156577298097",
    "timestamp": "1326379428"
  },
  {
    "latitude": "51.501757541048",
    "longitude": "-0.15156577298097",
    "timestamp": "1326379433"
  },
  {
    "latitude": "51.502037503565",
    "longitude": "-0.15182915469462",
    "timestamp": "1326379440"
  },
  {
    "latitude": "51.502454316619",
    "longitude": "-0.15210387941866",
    "timestamp": "1326379445"
  },
  {
    "latitude": "51.502647639507",
    "longitude": "-0.15221781889151",
    "timestamp": "1326379449"
  },
  {
    "latitude": "51.502687713579",
    "longitude": "-0.15223618233113",
    "timestamp": "1326379455"
  },
  {
    "latitude": "51.502706013534",
    "longitude": "-0.1522483261981",
    "timestamp": "1326379460"
  },
  {
    "latitude": "51.502903378022",
    "longitude": "-0.15235266449159",
    "timestamp": "1326379465"
  },
  {
    "latitude": "51.50312784378",
    "longitude": "-0.15204932952648",
    "timestamp": "1326379470"
  },
  {
    "latitude": "51.503219781119",
    "longitude": "-0.15157193371048",
    "timestamp": "1326379474"
  },
  {
    "latitude": "51.503424508516",
    "longitude": "-0.15110461986141",
    "timestamp": "1326379480"
  },
  {
    "latitude": "51.503826112137",
    "longitude": "-0.15123364378493",
    "timestamp": "1326379485"
  },
  {
    "latitude": "51.504077331748",
    "longitude": "-0.15159125979935",
    "timestamp": "1326379489"
  },
  {
    "latitude": "51.504292181311",
    "longitude": "-0.15212866278398",
    "timestamp": "1326379494"
  },
  {
    "latitude": "51.504729950368",
    "longitude": "-0.15205350102101",
    "timestamp": "1326379500"
  },
  {
    "latitude": "51.505370895601",
    "longitude": "-0.1519046165486",
    "timestamp": "1326379505"
  },
  {
    "latitude": "51.505857621753",
    "longitude": "-0.15203232708918",
    "timestamp": "1326379509"
  },
  {
    "latitude": "51.506660978532",
    "longitude": "-0.1526934377325",
    "timestamp": "1326379515"
  },
  {
    "latitude": "51.507325582598",
    "longitude": "-0.15344857370049",
    "timestamp": "1326379520"
  },
  {
    "latitude": "51.507947123056",
    "longitude": "-0.15416305248745",
    "timestamp": "1326379525"
  },
  {
    "latitude": "51.508399739429",
    "longitude": "-0.1547134666414",
    "timestamp": "1326379529"
  },
  {
    "latitude": "51.50882543912",
    "longitude": "-0.15526277223081",
    "timestamp": "1326379535"
  },
  {
    "latitude": "51.509001407974",
    "longitude": "-0.15548804838618",
    "timestamp": "1326379540"
  },
  {
    "latitude": "51.509090458627",
    "longitude": "-0.15561689652463",
    "timestamp": "1326379544"
  },
  {
    "latitude": "51.5092602903",
    "longitude": "-0.15588486069872",
    "timestamp": "1326379550"
  },
  {
    "latitude": "51.50952539624",
    "longitude": "-0.15622717769546",
    "timestamp": "1326379555"
  },
  {
    "latitude": "51.509745502984",
    "longitude": "-0.15653728169188",
    "timestamp": "1326379559"
  },
  {
    "latitude": "51.510006938691",
    "longitude": "-0.1568445794227",
    "timestamp": "1326379564"
  },
  {
    "latitude": "51.510216586415",
    "longitude": "-0.15706097065596",
    "timestamp": "1326379570"
  },
  {
    "latitude": "51.51026711272",
    "longitude": "-0.15711546419052",
    "timestamp": "1326379575"
  },
  {
    "latitude": "51.510369141095",
    "longitude": "-0.15723469839357",
    "timestamp": "1326379580"
  },
  {
    "latitude": "51.511306575914",
    "longitude": "-0.17294883728027",
    "timestamp": "1326379585"
  },
  {
    "latitude": "51.510751705824",
    "longitude": "-0.15752846989928",
    "timestamp": "1326379589"
  },
  {
    "latitude": "51.510780050406",
    "longitude": "-0.15754360755715",
    "timestamp": "1326379599"
  },
  {
    "latitude": "51.51080919202",
    "longitude": "-0.15754496495688",
    "timestamp": "1326379602"
  },
  {
    "latitude": "51.511258438365",
    "longitude": "-0.1559159907942",
    "timestamp": "1326379663"
  },
  {
    "latitude": "51.51156050845",
    "longitude": "-0.15488621158668",
    "timestamp": "1326379678"
  },
  {
    "latitude": "51.511721727122",
    "longitude": "-0.15498841444075",
    "timestamp": "1326379681"
  },
  {
    "latitude": "51.513067932798",
    "longitude": "-0.15573168531188",
    "timestamp": "1326379715"
  },
  {
    "latitude": "51.513589825765",
    "longitude": "-0.15607670175857",
    "timestamp": "1326379755"
  },
  {
    "latitude": "51.513735036849",
    "longitude": "-0.15607904202964",
    "timestamp": "1326379757"
  },
  {
    "latitude": "51.514246126762",
    "longitude": "-0.15606494523102",
    "timestamp": "1326379767"
  },
  {
    "latitude": "51.514637818446",
    "longitude": "-0.15632649666677",
    "timestamp": "1326379774"
  },
  {
    "latitude": "51.51488069954",
    "longitude": "-0.15647826633502",
    "timestamp": "1326379787"
  },
  {
    "latitude": "51.514977402935",
    "longitude": "-0.15648698890666",
    "timestamp": "1326379790"
  },
  {
    "latitude": "51.516054292528",
    "longitude": "-0.15704624311745",
    "timestamp": "1326379827"
  },
  {
    "latitude": "51.517116611",
    "longitude": "-0.15755563830553",
    "timestamp": "1326379837"
  },
  {
    "latitude": "51.517327137681",
    "longitude": "-0.15764522866701",
    "timestamp": "1326379839"
  },
  {
    "latitude": "51.518678965621",
    "longitude": "-0.15823449489989",
    "timestamp": "1326379852"
  },
  {
    "latitude": "51.518888499418",
    "longitude": "-0.15833071042483",
    "timestamp": "1326379862"
  },
  {
    "latitude": "51.518888499418",
    "longitude": "-0.15833071042483",
    "timestamp": "1326379864"
  },
  {
    "latitude": "51.518888499418",
    "longitude": "-0.15833071042483",
    "timestamp": "1326379870"
  },
  {
    "latitude": "51.520727023159",
    "longitude": "-0.15913501471453",
    "timestamp": "1326379900"
  },
  {
    "latitude": "51.521030197637",
    "longitude": "-0.15927217437073",
    "timestamp": "1326379907"
  },
  {
    "latitude": "51.521121133016",
    "longitude": "-0.15932706949533",
    "timestamp": "1326379915"
  },
  {
    "latitude": "51.521121133016",
    "longitude": "-0.15932706949533",
    "timestamp": "1326379917"
  },
  {
    "latitude": "51.521121133016",
    "longitude": "-0.15932706949533",
    "timestamp": "1326379924"
  },
  {
    "latitude": "51.521121133016",
    "longitude": "-0.15932706949533",
    "timestamp": "1326379948"
  },
  {
    "latitude": "51.521121133016",
    "longitude": "-0.15932706949533",
    "timestamp": "1326379959"
  },
  {
    "latitude": "51.521377205166",
    "longitude": "-0.15944484410062",
    "timestamp": "1326379970"
  },
  {
    "latitude": "51.521377205166",
    "longitude": "-0.15944484410062",
    "timestamp": "1326379973"
  },
  {
    "latitude": "51.521377205166",
    "longitude": "-0.15944484410062",
    "timestamp": "1326379988"
  },
  {
    "latitude": "51.521377205166",
    "longitude": "-0.15944484410062",
    "timestamp": "1326380008"
  },
  {
    "latitude": "51.521377205166",
    "longitude": "-0.15944484410062",
    "timestamp": "1326380048"
  },
  {
    "latitude": "51.521476244028",
    "longitude": "-0.15947245244408",
    "timestamp": "1326380051"
  },
  {
    "latitude": "51.52179905784",
    "longitude": "-0.15961511753923",
    "timestamp": "1326380059"
  },
  {
    "latitude": "51.522274257145",
    "longitude": "-0.15742191268046",
    "timestamp": "1326380081"
  },
  {
    "latitude": "51.522329756535",
    "longitude": "-0.15717396549298",
    "timestamp": "1326380083"
  },
  {
    "latitude": "51.522506144062",
    "longitude": "-0.1562675184983",
    "timestamp": "1326380089"
  },
  {
    "latitude": "51.522756683831",
    "longitude": "-0.15455794765052",
    "timestamp": "1326380099"
  },
  {
    "latitude": "51.522850986627",
    "longitude": "-0.1540343713153",
    "timestamp": "1326380102"
  },
  {
    "latitude": "51.523226434495",
    "longitude": "-0.15197857138739",
    "timestamp": "1326380114"
  },
  {
    "latitude": "51.523290412028",
    "longitude": "-0.15161045590463",
    "timestamp": "1326380117"
  },
  {
    "latitude": "51.523359897638",
    "longitude": "-0.15017037697218",
    "timestamp": "1326380129"
  },
  {
    "latitude": "51.528290206973",
    "longitude": "-0.18110275268554",
    "timestamp": "1326380144"
  },
  {
    "latitude": "51.523809738908",
    "longitude": "-0.14638370169924",
    "timestamp": "1326380159"
  },
  {
    "latitude": "51.510371582676",
    "longitude": "-0.14917373657562",
    "timestamp": "1326380169"
  },
  {
    "latitude": "51.5238607395",
    "longitude": "-0.1461065097586",
    "timestamp": "1326380171"
  },
  {
    "latitude": "51.5238985615",
    "longitude": "-0.14596122985676",
    "timestamp": "1326380190"
  },
  {
    "latitude": "51.523938778992",
    "longitude": "-0.14579532989714",
    "timestamp": "1326380195"
  },
  {
    "latitude": "51.523967365065",
    "longitude": "-0.14566135623403",
    "timestamp": "1326380197"
  },
  {
    "latitude": "51.524137778272",
    "longitude": "-0.14478280620246",
    "timestamp": "1326380206"
  },
  {
    "latitude": "51.52415531721",
    "longitude": "-0.1443945730236",
    "timestamp": "1326380210"
  },
  {
    "latitude": "51.524080780268",
    "longitude": "-0.14206313780644",
    "timestamp": "1326380231"
  },
  {
    "latitude": "51.524655336708",
    "longitude": "-0.13952230291586",
    "timestamp": "1326380245"
  },
  {
    "latitude": "51.524948625509",
    "longitude": "-0.13862532139097",
    "timestamp": "1326380249"
  },
  {
    "latitude": "51.525141474391",
    "longitude": "-0.13770140561784",
    "timestamp": "1326380253"
  },
  {
    "latitude": "51.525562744627",
    "longitude": "-0.13603358966369",
    "timestamp": "1326380261"
  },
  {
    "latitude": "51.525790599697",
    "longitude": "-0.13494283611591",
    "timestamp": "1326380270"
  },
  {
    "latitude": "51.527188959817",
    "longitude": "-0.13130907659162",
    "timestamp": "1326380272"
  },
  {
    "latitude": "51.526043275049",
    "longitude": "-0.13410749888364",
    "timestamp": "1326380277"
  },
  {
    "latitude": "51.524659019479",
    "longitude": "-0.12767314910872",
    "timestamp": "1326380295"
  },
  {
    "latitude": "51.52611605156",
    "longitude": "-0.13393218721521",
    "timestamp": "1326380305"
  },
  {
    "latitude": "51.526214908253",
    "longitude": "-0.13394297556616",
    "timestamp": "1326380319"
  },
  {
    "latitude": "51.526335414766",
    "longitude": "-0.13381189295248",
    "timestamp": "1326380323"
  },
  {
    "latitude": "51.526744175843",
    "longitude": "-0.13267720322771",
    "timestamp": "1326380334"
  },
  {
    "latitude": "51.527188959817",
    "longitude": "-0.13130907659162",
    "timestamp": "1326380344"
  },
  {
    "latitude": "51.527581896228",
    "longitude": "-0.13021487561418",
    "timestamp": "1326380354"
  },
  {
    "latitude": "51.527722512235",
    "longitude": "-0.12986486060101",
    "timestamp": "1326380357"
  },
  {
    "latitude": "51.528048117882",
    "longitude": "-0.12887806406718",
    "timestamp": "1326380369"
  },
  {
    "latitude": "51.528130161198",
    "longitude": "-0.12861910780241",
    "timestamp": "1326380372"
  },
  {
    "latitude": "51.528218684576",
    "longitude": "-0.1282697239056",
    "timestamp": "1326380378"
  },
  {
    "latitude": "51.528376683829",
    "longitude": "-0.12758298126883",
    "timestamp": "1326380383"
  },
  {
    "latitude": "51.528505160365",
    "longitude": "-0.12734465071454",
    "timestamp": "1326380386"
  },
  {
    "latitude": "51.528778545791",
    "longitude": "-0.12695981010384",
    "timestamp": "1326380391"
  },
  {
    "latitude": "51.528949575039",
    "longitude": "-0.12660857525044",
    "timestamp": "1326380397"
  },
  {
    "latitude": "51.528949575039",
    "longitude": "-0.12660857525044",
    "timestamp": "1326380403"
  },
  {
    "latitude": "51.529901246664",
    "longitude": "-0.12442987349065",
    "timestamp": "1326380451"
  },
  {
    "latitude": "51.530262764404",
    "longitude": "-0.12361496949841",
    "timestamp": "1326380462"
  },
  {
    "latitude": "51.530476448878",
    "longitude": "-0.12306053676569",
    "timestamp": "1326380468"
  },
  {
    "latitude": "51.530585551433",
    "longitude": "-0.12274012419932",
    "timestamp": "1326380472"
  },
  {
    "latitude": "51.530673596512",
    "longitude": "-0.12247238302532",
    "timestamp": "1326380477"
  },
  {
    "latitude": "51.530673596512",
    "longitude": "-0.12247238302532",
    "timestamp": "1326380480"
  },
  {
    "latitude": "51.530874390795",
    "longitude": "-0.12048734197168",
    "timestamp": "1326380530"
  },
  {
    "latitude": "51.530899460885",
    "longitude": "-0.11967800873471",
    "timestamp": "1326380540"
  },
  {
    "latitude": "51.530871710065",
    "longitude": "-0.1194381071698",
    "timestamp": "1326380542"
  },
  {
    "latitude": "51.530822145924",
    "longitude": "-0.11919979579595",
    "timestamp": "1326380544"
  },
  {
    "latitude": "51.530230983472",
    "longitude": "-0.1168152404539",
    "timestamp": "1326380560"
  },
  {
    "latitude": "51.530106583457",
    "longitude": "-0.11635410191019",
    "timestamp": "1326380566"
  },
  {
    "latitude": "51.5300772471",
    "longitude": "-0.11627341851132",
    "timestamp": "1326380580"
  },
  {
    "latitude": "51.5300772471",
    "longitude": "-0.11627341851132",
    "timestamp": "1326380583"
  },
  {
    "latitude": "51.530010634349",
    "longitude": "-0.1160725454077",
    "timestamp": "1326380603"
  },
  {
    "latitude": "51.529962342111",
    "longitude": "-0.11598191841355",
    "timestamp": "1326380605"
  },
  {
    "latitude": "51.529758576628",
    "longitude": "-0.11556121143262",
    "timestamp": "1326380614"
  }
];

 
}());
(function() {

'use strict';

var DistanceMatrixService;

//  make a google maps point
var point = function(lat, lng){

  return new google.maps.LatLng(+lat, +lng);
};

// To add the marker to the map, use the 'map' property
var getMarker = function(coords, title){

  if(coords === undefined){
    throw Error('no coordinates given');
  }

  cabbie.map.markers.push(new google.maps.Marker({
      position: coords,
      // animation: google.maps.Animation.DROP,
      map: cabbie.map.ele,
      title: title
  }));
};

var clearMarkers = function(){

  cabbie.map.markers.forEach(function(marker){

    //  remove marker from map
    marker.setMap(null);
  });

  //   delete array
  cabbie.map.markers.length = 0;
};

  //  MAKE BATCH
var calcDistance = function(origins, destinations, deferred){

  deferred = deferred || Q.defer();

  if(calcDistance.isBusy){
    // console.log('busy, adding to queue');
    calcDistance.queue.push({
      origins: origins,
      destinations: destinations,
      deferred: deferred
    });
    return deferred.promise;
  } else {
    calcDistance.isBusy = true;
    setTimeout(function(){

      calcDistance.isBusy = false;
      
      if(calcDistance.queue.length > 0){
        
        var nextArg = calcDistance.queue[0];
        calcDistance.queue = calcDistance.queue.slice(1);
        calcDistance(nextArg.origins, nextArg.destinations, nextArg.deferred);
      }

    }, 40);
  }

  var originsNorm = [],
      destinationsNorm = [];

  //  transform arrays to google map points
  origins.forEach(function(or){
    originsNorm.push(point(or.latitude, or.longitude));
  });

  destinations.forEach(function(or){
    destinationsNorm.push(point(or.latitude, or.longitude));
  });

  //  make the call to the distance service
  DistanceMatrixService.getDistanceMatrix({
    origins: originsNorm,
    destinations: destinationsNorm,
    travelMode: google.maps.TravelMode.DRIVING,
    durationInTraffic: true,
    avoidHighways: false,
    avoidTolls: false
  }, function(res, status){
  
    // console.log('status', status);
    if(status !== 'OK'){
      console.log('no OK, retrying');
      calcDistance(origins, destinations, deferred);
    } else {
      deferred.resolve(res);
    }
  });

  return deferred.promise;
};
calcDistance.queue = [];


var groupsOf = function(divider){

  return function(total){
  
    var raw = total/divider;
    var rounded = parseInt(total/divider, 10);
    return raw > rounded ? rounded+1 : rounded;
  };
};

var calcRouteDistances = function(routePoints){

  var deferred = Q.defer(),
      destinations = routePoints.slice(1),
      errors = [],
      groupsBy = 1,
      groups,
      i;

  //  remove last point ( it's only in destinations )
  routePoints.pop();
  groups = groupsOf(groupsBy)(routePoints.length);
  console.log(routePoints.length, groups);

  var start = 0;
  var end = 0;
  var resultPromises = [];
  for(i=0; i < groups; i+=1){
      
    start = i*groupsBy;
    end = start + groupsBy > routePoints.length ? routePoints.length : start+groupsBy;

    resultPromises.push( calcDistance(
      routePoints.slice(start, end), 
      destinations.slice(start, end)
    ) );
  }

  Q.all(resultPromises)
  .then(function(googleResults){

    googleResults.forEach(function(res, i){
    
      var resData = res.rows[0].elements[0];
      var delay = (+destinations[i].timestamp) - (+routePoints[i].timestamp);

      console.log(resData.distance.value,
      '\t should be \t',
      resData.duration.value,
      '\t we did \t',
      delay,
      (resData.duration.value/delay).toFixed(2) );

      if((resData.duration.value/delay).toFixed(2) > 5){
        errors.push(i);
      }
    });

    deferred.resolve(errors);
  });

  return deferred.promise;
};

var drawRoute = function(routePoints, delayScale){

  //  turn 'replay' option off
  cabbie.nav.setOption('redraw', false);

  //  TODO : check if number, check routePoints
  var startPoint = routePoints[0];
  delayScale = delayScale || 1;

  routePoints
  .forEach(function(routePoint, i){

    // calculate the delay
    var delay = (+routePoint.timestamp) - (+startPoint.timestamp);

    setTimeout(function(){
      var mapsPoint = point(routePoint.latitude, routePoint.longitude);
      getMarker(mapsPoint, "point "+i);
      cabbie.map.ele.setCenter(mapsPoint);

      if(i === routePoints.length){
        //  turn 'replay' option on
        cabbie.nav.setOption('redraw', true);
      }
    }, delay*delayScale);
  });

};

var isInitialized = false;

function initialize() {

  DistanceMatrixService = new google.maps.DistanceMatrixService();
  var mapOptions = {
    center: new google.maps.LatLng(51.530585551433, -0.12274012419932),
    zoom: 15
  };
  cabbie.map.ele = 
  new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}
//google.maps.event.addDomListener(window, 'load', initialize);

cabbie.map = {
  ele: {},
  markers: [],
  tryRoute: function(routePoints, speed){
  
    if(!isInitialized){
      initialize();
    }

    speed = speed || 10;
    var filteredPoints = [];

    calcRouteDistances(routePoints)
    .then(function(errors){

      routePoints
      .forEach(function(p, i){
      
        if(errors.indexOf(i) !== -1){
          // console.log('skipping error ', i, push);
          return;
        }

        filteredPoints.push(p);
      });

      //  save last route
      cabbie.map.lastRoute = {
        routePoints: filteredPoints
      };

      setTimeout(function(){

        drawRoute(filteredPoints, speed);
      }, 250);
    });
  },
  replay: function(speed){

    console.log('replaying...');
    clearMarkers();
    speed = speed || 12;
    drawRoute(cabbie.map.lastRoute.routePoints, speed);
  }
};


}());


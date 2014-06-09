cabbie
--------

A simple demo for filtering route point errors.

####How to use

Once you load the [website](http://antouank.github.io/cabbie/deploy/) you have a text area in which to load your JSON route data.

Example :
```javascript
[
	{
		"latitude":"51.498714933833",
		"longitude":"-0.16011779913771",
		"timestamp":"1326378718"
	},
	{
		"latitude":"51.498405862027",
		"longitude":"-0.16040688237893",
		"timestamp":"1326378723"
	},
	{
		"latitude":"51.498205021215",
		"longitude":"-0.16062694283829",
		"timestamp":"1326378728"
	}
]
```

If you want to get the sample JSON, just click the `try sample data` button, and the form will be automatically filled with a sample JSON, including some wrong points.

Next, there are two counters to help you 'configure' the result route.
- First is the `Speed` in which you want to see the route animated in the map. ( ratio is always preserved to the timestamps you provide ).
- Second is the error margin with which you want to filter out errors.
For example, if between any two given points, the timestamps difference is 4 mins, and for the same two points google maps driving distance is 40 mins, then the estimation ratio is `10`.
So if you have the `Error margin` set under 10, it's going to filter out this point as "wrong".

When you have everything set, just click the `check route` button.

A loading screen will appear, while points are being calculated, and as soon as everything is ready, you will see the route animated on the map.

When the route animation is over, you can replay it by clicking the `Replay route` button in the top nav bar.


####Ingredients

This web-app is a result of:
- [React.js](http://facebook.github.io/react/index.html)
- [Q](https://github.com/kriskowal/q)
- [PureCSS](http://purecss.io/)
- [gulp.js](http://gulpjs.com/)

We apologize for the poor UI/UX.

[Demo source code](https://github.com/AntouanK/cabbie)

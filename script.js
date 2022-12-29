// extreme sync
function syncExtremes(e) {
  var thisChart = this.chart;

  if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
    Highcharts.each(Highcharts.charts, function(chart) {
      if (chart !== thisChart) {
        if (chart.xAxis[0].setExtremes) { // It is null while updating
          chart.xAxis[0].setExtremes(
            e.min,
            e.max,
            undefined,
            false, {
              trigger: 'syncExtremes'
            }
          );
        }
      }
    });
  }
}

// return the chart2 (15m corresponding data array index)
function syncid(v) {
    var z;
    var c2data = chart2.series[0].processedXData
    z = c2data.findIndex(ele => ele >= v);
    if (c2data[z] != v) {
	z = z -1;
    }
    return z
}

// crosshair sync
function synchronize(point) {

    if (chart1.customCrosshair) { // destroy previous crosshair
	chart1.customCrosshair.element.remove()
    }
    if (chart2.customCrosshair) {
	chart2.customCrosshair.element.remove()
    }

    // show tooltip on second chart
    var c2idx = syncid(point.x);
    chart2.tooltip.refresh(chart2.series[0].points[c2idx]);

  // render crosshairs
  chart1.customCrosshair = chart1.renderer.rect(point.plotX + chart1.plotLeft - 1, chart1.plotTop, 1, chart1.plotSizeY).attr({
    fill: 'red'
  }).add()

  chart2.customCrosshair = chart2.renderer.rect(chart2.series[0].points[c2idx].plotX + chart2.plotLeft - 1, chart2.plotTop, 1, chart2.plotSizeY).attr({
    fill: 'red'
  }).add()
}

var chart1;
var chart2;

Highcharts.getJSON('z5m.json', function (data) {

    // split the data set into ohlc and volume
    var ohlc = [],
        volume = [],
        dataLength = data.length,
        i = 0;

    for (i; i < dataLength; i += 1) {
        ohlc.push([
            data[i][0], // the date
            data[i][1], // open
            data[i][2], // high
            data[i][3], // low
            data[i][4] // close
        ]);

        volume.push([
            data[i][0], // the date
            data[i][5] // the volume
        ]);
    }

    // create the chart
    chart1 = Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'TFX 5min'
        },

        yAxis: [{
            height: '70%',
            lineWidth: 1,
            resize: {
                enabled: true
            }
        }, {
            top: '70%',
            height: '30%',
            offset: 0,
            lineWidth: 2
        }],

        tooltip: {
            split: true
        },

	xAxis: {
	    events: {
	    setExtremes: syncExtremes
	    },
	},

        series: [{
            type: 'ohlc',
            name: 'AAPL',
	    point: {
		events: {
		    mouseOver: function() {
			synchronize(this)
		    }
		}
	    },
            data: ohlc,
            dataGrouping: {
                //units: groupingUnits
		enabled: false
            },
	    boostThreshold: 1,
            turboThreshold: 1
        }, {
            type: 'line',
            name: 'Volume',
            data: volume,
            yAxis: 1,
            dataGrouping: {
                //units: groupingUnits
		enabled: false
            },
	    boostThreshold: 1,
            turboThreshold: 1
        }]
    });
});

// 2nd chart
Highcharts.getJSON('z15m.json', function (data) {

    // split the data set into ohlc and volume
    var ohlc = [],
        volume = [],
        dataLength = data.length,
        i = 0;

    for (i; i < dataLength; i += 1) {
        ohlc.push([
            data[i][0], // the date
            data[i][1], // open
            data[i][2], // high
            data[i][3], // low
            data[i][4] // close
        ]);

        volume.push([
            data[i][0], // the date
            data[i][5] // the volume
        ]);
    }

    // create the chart
    chart2 = Highcharts.stockChart('container1', {

        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'TFX 15min'
        },

        yAxis: [{
            height: '70%',
            lineWidth: 1,
            resize: {
                enabled: true
            }
        }, {
            top: '70%',
            height: '30%',
            offset: 0,
            lineWidth: 2
        }],

        tooltip: {
            split: true
        },

	xAxis: {
	    events: {
	    setExtremes: syncExtremes
	    },
	},

        series: [{
            type: 'ohlc',
            name: 'AAPL',
            data: ohlc,
            dataGrouping: {
                //units: groupingUnits
		enabled: false
            },
	    boostThreshold: 1,
            turboThreshold: 1
        }, {
            type: 'line',
            name: 'Volume',
            data: volume,
            yAxis: 1,
            dataGrouping: {
                //units: groupingUnits
		enabled: false
            },
	    boostThreshold: 1,
            turboThreshold: 1
        }]
    });
});

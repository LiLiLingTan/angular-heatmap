import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import * as _ from 'lodash';
// import * as Highcharts from 'highcharts';

declare var require: any;
const Highcharts = require('highcharts');
const heatMap = require('highcharts/modules/heatmap.src');
const More = require('highcharts/highcharts-more');
const exporting = require('highcharts/modules/exporting.src');
require('highcharts/modules/offline-exporting.src')(Highcharts);

More(Highcharts);
heatMap(Highcharts);
exporting(Highcharts);

@Component({
  selector: 'lib-sigma-contourplot',
  template: `
    <div class="container content">
      <div class="row">
        <div class="col">
          <div #containerImp style="height: 300px; width: 300px; font-size: 90%"></div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div #containerAct style="height: 300px; width: 300px; font-size: 90%"></div>
        </div>
      </div>
    </div>
  `
})
export class SigmaContourplotComponent {
  @Input() data: any[] = []; // all datapoints associated with one wafer
  @Input() legendOnly = false; // default false.
  @Input() minColor: number;
  @Input() maxColor: number;
  @ViewChild('containerAct', {static: false}) actualDiv: ElementRef;
  @ViewChild('containerImp',  {static: false}) imputeDiv: ElementRef;
  contourPlot: any;
  contourPlotAct: any;
  lotId: string;
  waferId: string;

  constructor(
    protected element: ElementRef) {
  }

  ngOnInit() {
    Highcharts.setOptions({
      exporting: {
        enabled: false, // unhide/hide button
        fallbackToExportServer: false // Ensure the export happens on the client side or not at all
      }
    });
    const xCats = _.uniq(this.data.map(x => parseInt(x['probe_x'], 10))).sort(this.compareNumbers);
    console.log(JSON.stringify(xCats));
    const yCats = _.uniq(this.data.map(x => parseInt(x['probe_y'], 10))).sort(this.compareNumbers);
    console.log(JSON.stringify(yCats));
    const seriesdata = this.data.map(x => {
      const datapoints = [];
      datapoints.push(parseInt(x['probe_x'], 10));
      datapoints.push(parseInt(x['probe_y'], 10));
      datapoints.push(parseFloat(x['val_Impute']));
      return datapoints;
    });
    const seriesActdata = this.data.map(x => {
      const datapoints = [];
      datapoints.push(parseInt(x['probe_x'], 10));
      datapoints.push(parseInt(x['probe_y'], 10));
      datapoints.push(x['val'] ? parseFloat(x['val']) : null);
      return datapoints;
    });
    this.lotId = this.data.map(x => x['lot'])[0];
    this.waferId = this.data.map(x => x['wafer'])[0];
    console.log(`lot: ${this.lotId}; wafer: ${this.waferId}`);
    let chartOptions: any = {
      chart: {
        type: 'heatmap',
        renderTo: this.imputeDiv.nativeElement,
        marginTop: 10,
        marginBottom: 20
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        heatmap: {
            nullColor: '#A8A8A8',
            dataLabels: {
                enabled: false,
                style: {
                    'fontSize': '90%',
                    'fontWeight': 'normal'
                }
            },
        }
      },
      title: {
          text: `${this.lotId} (${this.waferId})`,
          style: {
            fontSize: '90%'
          }
      },

      xAxis: {
         // categories: [-8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
          categories: xCats,
          gridLineWidth: 0,
          tickInterval: 1
      },

      yAxis: {
        // tslint:disable-next-line:max-line-length
        // categories: ['-1', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
        categories: yCats,
        gridLineWidth: 0,
        max: this.legendOnly ? 0 : Math.max(...yCats)
      },

      colorAxis: {
        stops: [
          [0, '#FF0000'],
          [0.25, '#FF8B00'],
          [0.50, '#E8FF00'],
          [0.75, '#17FF00'],
          [1, '#0000FF']
        ],
        min: this.minColor,
        max: this.maxColor,
        startOnTick: false,
        endOnTick: false,
        labels: {
            format: '{value}'
        }
      },

      legend: {
        enabled: this.legendOnly,
        align: 'right',
        layout: 'horizontal',
        margin: 0,
        verticalAlign: 'middle',
        y: 25,
        symbolHeight: 280
      },

      tooltip: {
          formatter: function () {
            return '<b>' + this.series.xAxis.categories[this.point.x] + ':' + this.series.yAxis.categories[this.point.y]
            + '</b><br>Value: ' + this.point.value;
          }
      },

      series: [{
          name: this.waferId,
          borderWidth: 1,
          data: seriesdata,
      }],

      responsive: {
        rules: [{
          condition: {
            maxWidth: 300
          },
          chartOptions: {
            legend: {
              enabled: this.legendOnly
            },
            xAxis: {
              title: {
                enabled: false
              },
              labels: {
                enabled: false
              },
              visible: false
            },
            yAxis: {
              title: {
                enabled: false
              },
              labels: {
                enabled: false
              }
            }
          }
        }]
      }
    };
    const actChartOptions: any = {
      chart: {
        type: 'heatmap',
        renderTo: this.actualDiv.nativeElement,
        marginTop: 10,
        marginBottom: 20
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        heatmap: {
            nullColor: '#A8A8A8',
            dataLabels: {
                enabled: false,
                style: {
                    'fontSize': '90%',
                    'fontWeight': 'normal'
                }
            },
        }
      },
      title: {
        text: ''
      },

      xAxis: {
          // categories: [-8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
          categories: xCats,
          gridLineWidth: 0,
          tickInterval: 1,
          title: {
            enabled: false
          },
          labels: {
            enabled: false
          },
          visible: false
      },

      yAxis: {
        // tslint:disable-next-line:max-line-length
        // categories: ['-1', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
        categories: yCats,
        gridLineWidth: 0,
        max: this.legendOnly ? 0 : Math.max(...yCats),
        title: {
          enabled: false
        },
        labels: {
          enabled: false
        }
      },

      colorAxis: {
        stops: [
          [0, '#FF0000'],
          [0.25, '#FF8B00'],
          [0.50, '#E8FF00'],
          [0.75, '#17FF00'],
          [1, '#0000FF']
        ],
        min: this.minColor,
        max: this.maxColor,
        startOnTick: false,
        endOnTick: false,
        labels: {
            format: '{value}'
        }
      },

      legend: {
        enabled: false,
        align: 'right',
        layout: 'horizontal',
        margin: 0,
        verticalAlign: 'middle',
        y: 25,
        symbolHeight: 280
      },

      tooltip: {
          formatter: function () {
              return '<b>' + this.lotId + '</b><br>'
              + '<b>' + this.series.xAxis.categories[this.point.x] + ':' + this.series.yAxis.categories[this.point.y]
              + '</b><br>Value: ' + this.point.value;
          }
      },

      series: [{
          name: this.waferId,
          borderWidth: 1,
          data: seriesActdata,
      }]
    };
    if (this.legendOnly) {
      this.imputeDiv.nativeElement.style.height = '100px';
      this.imputeDiv.nativeElement.style.width = '400px';
      this.actualDiv.nativeElement.style.height = '1px';
      chartOptions = {
        chart: {
          type: 'heatmap',
          renderTo: this.imputeDiv.nativeElement,
          spacing: [0, 0, 0, 0],
          marginTop: 0,
          marginBottom: 0,
          spacingTop: 0
        },
        title: {
          text: null
        },
        yAxis: {
          visible: false
        },
        xAxis: {
          visible: false
        },
        legend: {
          padding: 0,
          margin: 0,
          verticalAlign: 'middle',
          maxHeight: 200
        },
        colorAxis: {
          stops: [
            [0, '#FF0000'],
            [0.25, '#FF8B00'],
            [0.50, '#E8FF00'],
            [0.75, '#17FF00'],
            [1, '#0000FF']
          ],
          min: this.minColor,
          max: this.maxColor,
          startOnTick: false,
          endOnTick: false,
          labels: {
              format: '{value}'
          }
        },
        series: [{
          data: [],
        }],
        exporting: {
          enabled: false
        }
      };
    }
    this.contourPlot = new Highcharts.Chart(chartOptions);
    if (!this.legendOnly) {
      this.contourPlotAct = new Highcharts.Chart(actChartOptions);
    }
  }

  fillRange (start: number, end: number) {
    return [...Array(end - start + 1)].map((item, index) => start + index);
  }

  compareNumbers (a: number, b: number) {
    return a - b;
  }

  getChartSVG() {
    const svgArr = [];
    let top = 0;
    let width = 0;
    const charts = [this.contourPlot];
    if (!this.legendOnly) {
      charts.push(this.contourPlotAct);
    }
    charts.forEach((chart, i) => {
      let svg = chart.getSVG();
      // Get width/height of SVG for export
      const svgWidth = +svg.match(/^<svg[^>]*width\s*=\s*\"?(\d+)\"?[^>]*>/)[1];
      // console.log(`chart ${i} : Width is ${svgWidth}`);
      const svgHeight = +svg.match(
        /^<svg[^>]*height\s*=\s*\"?(\d+)\"?[^>]*>/
      )[1];
      // console.log(`chart ${i}: Height is ${svgHeight}`);
      // svg = svg.replace("<svg", '<g transform="translate(' + width + ', 0 )" ');
      // svg = svg.replace("</svg>", "</g>");
      // width += svgWidth;
      // top = Math.max(top, svgHeight);
      // Offset the position of this chart in the final SVG
      svg = svg.replace('<svg', '<g transform="translate(0,' + top + ')" ');
      svg = svg.replace('</svg>', '</g>');
      top += svgHeight;
      width = Math.max(width, svgWidth);
      svgArr.push(svg);
    });

    console.log(`Top: ${top}, Width: ${width}`);
    return (
      '<svg height="' +
      top +
      '" width="' +
      width +
      '" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
      svgArr.join('') +
      '</svg>'
    );
  }

  downloadSVGLocal(strSvg: string) {
    const options = Highcharts.getOptions().exporting;
    Highcharts.downloadSVGLocal(strSvg, options, function() {
      console.log('Failed to export on client side');
    });
  }

}

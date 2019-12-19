import { Component } from "@angular/core";
import * as Highcharts from "highcharts";
import { ConfigService } from './config.service';

declare var require: any;
const heatMap = require("highcharts/modules/heatmap.src");
let More = require("highcharts/highcharts-more");
let exporting = require("highcharts/modules/exporting.src");
let offline = require("highcharts/modules/offline-exporting.src");

More(Highcharts);
heatMap(Highcharts);
exporting(Highcharts);
offline(Highcharts);

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  chart: Highcharts.Chart;
  chart2: Highcharts.Chart;
  chart3: Highcharts.Chart;
  mode: any;
  contourData: any;
  contourMin: any;
  contourMax: any;
  constructor(private config: ConfigService) { }

  ngOnInit() {
    this.mode = 'contour';
    console.log(`Mode is: ${this.mode}`);
    this.init();
    this.initContour();
  }

  init() {
    Highcharts.setOptions({
      exporting: {
        fallbackToExportServer: false // Ensure the export happens on the client side or not at all
      }
    });
    let chart = new Highcharts.Chart("container", {
      chart: {
        type: "heatmap",
        marginTop: 40,
        marginBottom: 80,
        plotBorderWidth: 1
      },
      title: {
        text: "Sales per employee per weekday"
      },
      xAxis: {
        categories: [
          "Alexander",
          "Marie",
          "Maximilian",
          "Sophia",
          "Lukas",
          "Maria",
          "Leon",
          "Anna",
          "Tim",
          "Laura"
        ]
      },
      yAxis: {
        categories: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        title: null,
        reversed: true
      },
      colorAxis: {
        min: 0,
        minColor: "#FFFFFF",
        maxColor: "#FF0000"
      },
      legend: {
        align: "right",
        layout: "vertical",
        margin: 0,
        verticalAlign: "top",
        y: 25,
        symbolHeight: 280
      },
      series: [
        {
          type: "heatmap",
          name: "Sales per employee",
          borderWidth: 1,
          data: [
            [0, 0, 10],
            [0, 1, 19],
            [0, 2, 8],
            [0, 3, 24],
            [0, 4, 67],
            [1, 0, 92],
            [1, 1, 58],
            [1, 2, 78],
            [1, 3, 117],
            [1, 4, 48],
            [2, 0, 35],
            [2, 1, 15],
            [2, 2, 123],
            [2, 3, 64],
            [2, 4, 52],
            [3, 0, 72],
            [3, 1, 132],
            [3, 2, 114],
            [3, 3, 19],
            [3, 4, 16],
            [4, 0, 38],
            [4, 1, 5],
            [4, 2, 8],
            [4, 3, 117],
            [4, 4, 115],
            [5, 0, 88],
            [5, 1, 32],
            [5, 2, 12],
            [5, 3, 6],
            [5, 4, 120],
            [6, 0, 13],
            [6, 1, 44],
            [6, 2, 88],
            [6, 3, 98],
            [6, 4, 96],
            [7, 0, 31],
            [7, 1, 1],
            [7, 2, 82],
            [7, 3, 32],
            [7, 4, 30],
            [8, 0, 85],
            [8, 1, 97],
            [8, 2, 123],
            [8, 3, 64],
            [8, 4, 84],
            [9, 0, 47],
            [9, 1, 114],
            [9, 2, 31],
            [9, 3, 48],
            [9, 4, 91]
          ],
          dataLabels: {
            enabled: true,
            color: "#000000"
          }
        }
      ],
      exporting: {
        enabled: false // hide button
      }
    });
    this.chart = chart;

    this.chart2 = new Highcharts.Chart("container2", {
      chart: {
        height: 200
      },
      title: {
        text: "First Chart"
      },
      credits: {
        enabled: true
      },
      xAxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ]
      },
      series: [
        {
          type: "line",
          data: [
            29.9,
            71.5,
            106.4,
            129.2,
            144.0,
            176.0,
            135.6,
            148.5,
            216.4,
            194.1,
            95.6,
            54.4
          ],
          showInLegend: false
        }
      ],
      exporting: {
        enabled: true, // hide button
        fallbackToExportServer: false,
        chartOptions: {
          // specific options for the exported image
          plotOptions: {
            series: {
              dataLabels: {
                enabled: true
              }
            }
          }
        }
      }
    });

    this.chart3 = Highcharts.chart('container3', {
      chart: {
        height: 200,
        type: 'pie'
      },
      title: {
        text: 'First Chart'
      },
      credits: {
        enabled: false
      },
      series: [{
        type: 'pie',
        data: [
          ['Apples', 5],
          ['Pears', 9],
          ['Oranges', 2]
        ]
      }],
      exporting: {
        enabled: false // hide button
      }
    });
  }

  initContour() {
    this.config.getData().subscribe(data => {
      this.contourData = data;
      console.log('testing');
    });
  }

  getSVG(charts: Highcharts.Chart[]) {
    const svgArr = [];
    let top = 0;
    let width = 0;
    charts.forEach(chart => {
      let svg = chart.getSVG();
      // Get width/height of SVG for export
      const svgWidth = +svg.match(/^<svg[^>]*width\s*=\s*\"?(\d+)\"?[^>]*>/)[1];
      console.log(`chart ${chart.title.textStr} : Width is ${svgWidth}`);
      const svgHeight = +svg.match(
        /^<svg[^>]*height\s*=\s*\"?(\d+)\"?[^>]*>/
      )[1];
      console.log(`chart ${chart.title.textStr}: Height is ${svgHeight}`);
      // svg = svg.replace("<svg", '<g transform="translate(' + width + ', 0 )" ');
      // svg = svg.replace("</svg>", "</g>");
      // width += svgWidth;
      // top = Math.max(top, svgHeight);
      // Offset the position of this chart in the final SVG
      svg = svg.replace("<svg", '<g transform="translate(0,' + top + ')" ');
      svg = svg.replace("</svg>", "</g>");
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
      svgArr.join("") +
      "</svg>"
    );
  }

  onClickExport(type) {
    let options: Highcharts.Options = null;
    // Merge the options
    options = Highcharts.merge(Highcharts.getOptions().exporting, options);
    if (type === 'pdf') {
      options = Highcharts.merge(Highcharts.getOptions().exporting, {
        type: 'application/pdf'})
    }
    const svgStr = this.getSVG([this.chart, this.chart2, this.chart3]);

    Highcharts.downloadSVGLocal(svgStr, options, function() {
      console.log("Failed to export on client side");
    });
  }

  onChangeMode() {
    if (this.mode === 'contour') {
      this.chart.container.hidden = true;
      this.chart2.container.hidden = true;
      this.chart3.container.hidden = true;
    } 
    if (this.mode === 'simple') {
      this.chart.container.hidden = false;
      this.chart2.container.hidden = false;
      this.chart3.container.hidden = false;
    }
    console.log(this.mode);
  }
}

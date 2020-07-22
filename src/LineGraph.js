import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";
import { green } from "@material-ui/core/colors";
import './LineGraph.css';

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callback: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).formet("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],

    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

function LineGraph({casesType}) {
  const [data, setData] = useState({});

  const buildChartData = (data, casesType) => {
    const chartData = [];
    let lastDataPoint;
    for (let date in data.cases) {
      if (lastDataPoint) {
        const newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };

        chartData.push(newDataPoint);
      }

      lastDataPoint = data[casesType][date];
    }

    return chartData;
  };

  //  https://disease.sh/v3/covid-19/historical/all?lastdays=120

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((responce) => responce.json())
        .then((data) => {
          const chatData = buildChartData(data, casesType);

          setData(chatData);
        });
    };

    fetchData();
  }, [casesType]);

  return (
    <div>
     

      {data?.length > 0 && (
        <Line
          data={{

            datasets: [{
              backgroundColor: "rgba(204, 16, 52, 0.5)",

              borderColor: "#CC1034",
  
               data: data,
               }],
           
            
          }}
          options={options}
        />
      )}
      <h2 className='dev'><img src="https://as2.ftcdn.net/jpg/00/96/48/45/500_F_96484587_7lWZQz2UQKWLfiT0CMOyCnQ7OcwSmDzj.jpg"></img> Coded By-Pushpendra Singh</h2>
    </div>
  );
}

export default LineGraph;

import React, { useState, useEffect } from "react";
import "./app.css";

import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");

  const [countryInfo, setCountryInfo] = useState({});

  const [tableData, setTableData] = useState([]);

  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);

  const [mapCountries, setMapCountries] = useState([]);

  const [casesType, setCasesType] = useState("cases");

  //UseEffect is very important hooks

  //It rens some pice of code based on some

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((responce) => responce.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    //code inside once loade when the component

    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((responce) => responce.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    setCountry(countryCode);

    //for word wide

    //https://disease.sh/v3/covid-19/all

    //Based on country
    //https://disease.sh/v3/covid-19/countries/[countryCode]

    const url =
      countryCode == "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((responce) => responce.json())
      .then((data) => {
        setCountryInfo(data);
        //for map

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);

        setMapZoom(4);
      });
  };
  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1>COVID-19-TRACKER</h1>
          <FormControl className="app_dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">worldwide</MenuItem>

              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app_stats">
          <InfoBox
          isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title={"CoronaVirus Cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title={"Recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
          isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title={"Deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app-right">
        <CardContent>
          <h3>Live cases by country</h3>
          <Table countries={tableData} />

          <h3>World Wide New {casesType}</h3>
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;

import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import './InfoBox.css';


function InfoBox({ title, isRed, cases, active, total, ...props}) {
  return (
    <Card className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'}`} onClick = {props.onClick}>
      <CardContent>
  <Typography className = "infoBox_title" color="textSecondary">{title}</Typography>
  <h2 className={`ìnfoBox_cases ${!isRed && 'infoBox_cases--green'}`}>{cases}</h2>
  <Typography className="infoBox_total" color="textSecondary" >{total} Total</Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;

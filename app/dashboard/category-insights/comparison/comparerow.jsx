import React from "react";

const ComparisonRow = ({ logo, alt, data }) => (
  <div className="data-row">
    <div className="cell">
      <img src={logo} alt={alt} className="logo" style={{ maxWidth: "100%" }} />
    </div>
    {data.map((val, idx) => (
      <div className="cell" key={idx}>
        {val}
      </div>
    ))}
  </div>
);

export default ComparisonRow;

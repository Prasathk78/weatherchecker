import React from "react";

const Current = ({ currentwheather, location }) => {
  // Handle missing data gracefully
  if (!currentwheather || !location) {
    return (
      <div className="container mt-5">
        <h4 className="text-center">No weather data available.</h4>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h4 className="text-center">Current Weather of {location.name}</h4>
      <div className="row mt-2">
        {/* Row 1 */}
        <div className="col-12 col-md-6 col-lg-3 mb-3">
          <div className="card d-flex flex-row align-items-center p-2">
            <img
              src={currentwheather.condition.icon}
              alt="Weather icon"
              className="card-img w-25 h-25"
            />
            <div className="card-body">
              <div className="card-title fw-bold">
                {currentwheather.condition.text || "N/A"}
              </div>
            </div>
          </div>
        </div>

        {[
          { label: "Temperature in C", value: `${currentwheather.temp_c}°C` },
          { label: "Temperature in F", value: `${currentwheather.temp_f}°F` },
          { label: "Last Updated", value: currentwheather.last_updated },
        ].map((item, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-3 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{item.label} - {item.value}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row mt-2">
        {/* Row 2 */}
        {[
          { label: "Dew Point", value: `${currentwheather.dewpoint_c}°C` },
          { label: "Wind Degree", value: `${currentwheather.wind_degree}°` },
          { label: "Wind Direction", value: currentwheather.wind_dir },
          { label: "Heat Index (°F)", value: `${currentwheather.heatindex_f}°F` },
        ].map((item, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-3 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{item.label} - {item.value || "N/A"}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Current;

import React from "react";

const Forecaste = ({ forecastwheather, location }) => {
  if (!forecastwheather || !location) {
    return (
      <div className="mt-4">
        <h4 className="text-center text-dark">No forecast data available.</h4>
      </div>
    );
  }

  if (!Array.isArray(forecastwheather.forecastday)) {
    return (
      <div className="mt-4">
        <h4 className="text-center text-dark">Invalid forecast data.</h4>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h4 className="text-center text-dark">
        Forecast weather for {location.name}
      </h4>

      {forecastwheather.forecastday.map((data, index) => (
        <div
          key={index}
          className="accordion accordion-flush mt-3"
          id={`accordion-${index}`}
        >
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#forecast-${index}`}
                aria-expanded="false"
                aria-controls={`forecast-${index}`}
              >
                <div className="d-flex justify-content-between align-items-center mb-3 w-100">
                  <div className="p-2">Date: {data.date}</div>
                  <div className="p-2">
                    {data.day?.condition?.icon && (
                      <img src={data.day.condition.icon} alt="Weather icon" />
                    )}
                  </div>
                  <div className="p-2">{data.day?.condition?.text || "N/A"}</div>
                </div>
              </button>
            </h2>

            <div id={`forecast-${index}`} className="accordion-collapse collapse">
              <div className="accordion-body">
                {data.hour?.map((hourData, hourIndex) => {
                  const tempPercentage = ((hourData.temp_c + 10) / 50) * 100;

                  return (
                    <div key={hourIndex}>
                      <h6 className="text-center fst-italic">
                        ----- {hourData.time} ----- {hourData.temp_c}°C
                      </h6>
                      <div
                        className="progress"
                        role="progressbar"
                        aria-valuenow={tempPercentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <div
                          className="progress-bar progress-bar-striped progress-bar-animated"
                          style={{ width: `${tempPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Forecaste;

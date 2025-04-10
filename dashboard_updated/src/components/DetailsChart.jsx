// components/DetailsChart.jsx
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { ChevronDown, ChevronUp, BarChart2, Loader } from "lucide-react";

const DetailsChart = ({ brewery }) => {
  const [cityBreweries, setCityBreweries] = useState([]);
  const [stateBreweries, setStateBreweries] = useState([]);
  const [loadingCharts, setLoadingCharts] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [activeChart, setActiveChart] = useState("cityTypes");

  useEffect(() => {
    const fetchChartData = async () => {
      if (!brewery || !brewery.city || !brewery.state) return;

      setLoadingCharts(true);
      try {
        // Fetch breweries in the same city
        const cityResponse = await fetch(
          `https://api.openbrewerydb.org/v1/breweries?by_city=${encodeURIComponent(
            brewery.city
          )}&per_page=50`
        );
        const cityData = await cityResponse.json();
        setCityBreweries(cityData);

        // Fetch breweries in the same state
        const stateResponse = await fetch(
          `https://api.openbrewerydb.org/v1/breweries?by_state=${encodeURIComponent(
            brewery.state
          )}&per_page=50`
        );
        const stateData = await stateResponse.json();
        setStateBreweries(stateData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoadingCharts(false);
      }
    };

    if (brewery) {
      fetchChartData();
    }
  }, [brewery]);

  const capitalizeBreweryType = (type) => {
    if (!type) return "";
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getCityBreweryTypeCounts = () => {
    if (!cityBreweries.length) return [];

    const typeCounts = {};
    cityBreweries.forEach((cityBrewery) => {
      const type = cityBrewery.brewery_type;
      if (type) {
        const formattedType = capitalizeBreweryType(type);
        typeCounts[formattedType] = (typeCounts[formattedType] || 0) + 1;
      }
    });

    return Object.entries(typeCounts).map(([name, count]) => ({ name, count }));
  };

  const getCityBreweryTypePercentage = (type) => {
    if (!cityBreweries.length) return 0;

    const typeCount = cityBreweries.filter(
      (b) => b.brewery_type === type
    ).length;
    return Math.round((typeCount / cityBreweries.length) * 100);
  };

  const getBreweryTypeInsight = () => {
    if (!cityBreweries.length || !brewery)
      return "No data available for insights.";

    const breweryType = brewery.brewery_type;
    const percentage = getCityBreweryTypePercentage(breweryType);

    if (percentage > 50) {
      return `${capitalizeBreweryType(breweryType)} breweries dominate the ${
        brewery.city
      } brewing scene, representing ${percentage}% of all local breweries.`;
    } else if (percentage > 25) {
      return `${capitalizeBreweryType(breweryType)} breweries are common in ${
        brewery.city
      }, making up ${percentage}% of the local brewing industry.`;
    } else if (percentage < 10) {
      return `${brewery.name} is among the rare ${capitalizeBreweryType(
        breweryType
      )} breweries in ${
        brewery.city
      }, a type that makes up only ${percentage}% of local breweries.`;
    } else {
      return `${capitalizeBreweryType(
        breweryType
      )} breweries represent ${percentage}% of the brewing scene in ${
        brewery.city
      }.`;
    }
  };

  const getStateBreweryProfile = () => {
    if (!stateBreweries.length || !brewery) return [];

    // Calculate percentages for different characteristics
    const totalInState = stateBreweries.length;

    // Count breweries by type
    const typeCount = {};
    stateBreweries.forEach((b) => {
      if (b.brewery_type) {
        typeCount[b.brewery_type] = (typeCount[b.brewery_type] || 0) + 1;
      }
    });

    // Count breweries with websites
    const withWebsite = stateBreweries.filter((b) => b.website_url).length;
    const withWebsitePercent = Math.round((withWebsite / totalInState) * 100);

    // Count urban breweries (in cities with >1 brewery)
    const cityCounts = {};
    stateBreweries.forEach((b) => {
      if (b.city) {
        cityCounts[b.city] = (cityCounts[b.city] || 0) + 1;
      }
    });
    const urbanBreweries = stateBreweries.filter(
      (b) => cityCounts[b.city] > 1
    ).length;
    const urbanPercent = Math.round((urbanBreweries / totalInState) * 100);

    // Calculate percentages for current brewery's type
    const currentTypePercent = typeCount[brewery.brewery_type]
      ? Math.round((typeCount[brewery.brewery_type] / totalInState) * 100)
      : 0;

    // Create data for radar chart
    return [
      {
        attribute: "Type Prevalence",
        value: currentTypePercent,
        breweryValue: 80, // Higher value to make this brewery stand out
      },
      {
        attribute: "Web Presence",
        value: withWebsitePercent,
        breweryValue: brewery.website_url ? 90 : 20,
      },
      {
        attribute: "Urban Location",
        value: urbanPercent,
        breweryValue: cityCounts[brewery.city] > 1 ? 85 : 30,
      },
      {
        attribute: "Location Data",
        value:
          (stateBreweries.filter((b) => b.latitude && b.longitude).length /
            totalInState) *
          100,
        breweryValue: brewery.latitude && brewery.longitude ? 95 : 15,
      },
      {
        attribute: "Discoverability",
        value: 65, // Example value
        breweryValue: 75, // Example value
      },
    ];
  };

  const getStateProfileInsight = () => {
    if (!stateBreweries.length || !brewery)
      return "No data available for insights.";

    const typeName = capitalizeBreweryType(brewery.brewery_type);
    const sameTypeCount = stateBreweries.filter(
      (b) => b.brewery_type === brewery.brewery_type
    ).length;
    const percentage = Math.round(
      (sameTypeCount / stateBreweries.length) * 100
    );

    if (brewery.website_url && brewery.latitude && brewery.longitude) {
      return `${brewery.name} is well-positioned with complete location data and web presence, giving it an advantage over many ${brewery.state} breweries. ${typeName} breweries represent ${percentage}% of all breweries in the state.`;
    } else if (!brewery.website_url) {
      return `${
        brewery.name
      } could improve its online presence. ${percentage}% of breweries in ${
        brewery.state
      } are ${typeName.toLowerCase()} types, but most have websites to connect with customers.`;
    } else if (!brewery.latitude || !brewery.longitude) {
      return `Adding complete location data could help ${brewery.name} improve its discoverability. ${typeName} breweries like this one make up ${percentage}% of the ${brewery.state} brewery scene.`;
    } else {
      return `${
        brewery.name
      } is one of ${sameTypeCount} ${typeName.toLowerCase()} breweries in ${
        brewery.state
      }, representing ${percentage}% of the state's total breweries.`;
    }
  };

  // Helper function to get the nearby breweries data
  const getBreweryDistanceData = () => {
    if (
      !cityBreweries.length ||
      !brewery ||
      !brewery.latitude ||
      !brewery.longitude
    )
      return [];

    // Filter out breweries without lat/long and the current brewery
    const breweriesWithLocation = cityBreweries.filter(
      (b) => b.id !== brewery.id && b.latitude && b.longitude
    );

    // Calculate distances
    const breweryDistances = breweriesWithLocation.map((b) => {
      // Simple distance calculation using Pythagorean theorem (not accurate for real geography)
      // For a real app, you would use the Haversine formula or a mapping API
      const latDiff = parseFloat(b.latitude) - parseFloat(brewery.latitude);
      const lngDiff = parseFloat(b.longitude) - parseFloat(brewery.longitude);
      const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 69; // Rough miles conversion

      return {
        name: b.name,
        distance: parseFloat(distance.toFixed(1)),
        type: capitalizeBreweryType(b.brewery_type),
      };
    });

    // Sort by distance and take top 8
    return breweryDistances.sort((a, b) => a.distance - b.distance).slice(0, 8);
  };

  const getNearbyBreweriesInsight = () => {
    const distances = getBreweryDistanceData();
    if (!distances.length)
      return "No nearby breweries with location data available.";

    const averageDistance =
      distances.reduce((sum, b) => sum + b.distance, 0) / distances.length;
    const types = [...new Set(distances.map((b) => b.type))];

    if (distances.length > 5) {
      return `${brewery.name} is located in a brewery-rich area with ${
        distances.length
      } other breweries nearby, at an average distance of ${averageDistance.toFixed(
        1
      )} miles. The area features diverse brewery types including ${types
        .slice(0, 3)
        .join(", ")}.`;
    } else if (distances.length > 2) {
      return `${brewery.name} has ${distances.length} other breweries within the area, with the closest being ${distances[0].name} (${distances[0].distance} miles away). This creates a good opportunity for brewery touring in ${brewery.city}.`;
    } else if (distances.length > 0) {
      return `${brewery.name} has limited competition in the immediate area, with only ${distances.length} other breweries nearby. The closest is ${distances[0].name}, a ${distances[0].type} brewery ${distances[0].distance} miles away.`;
    } else {
      return `${brewery.name} appears to be the only brewery with location data in this area.`;
    }
  };

  if (!brewery) {
    return null;
  }

  return (
    <div className="brewery-charts-section">
      <button
        className="toggle-charts-button"
        onClick={() => setShowCharts(!showCharts)}
        aria-expanded={showCharts}
      >
        <BarChart2 size={20} />
        <span>Data Insights</span>
        {showCharts ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {showCharts && (
        <div className="charts-container">
          <div className="charts-tabs">
            <button
              className={`chart-tab ${
                activeChart === "cityTypes" ? "active" : ""
              }`}
              onClick={() => setActiveChart("cityTypes")}
            >
              Brewery Types in {brewery.city}
            </button>
            <button
              className={`chart-tab ${
                activeChart === "stateComparison" ? "active" : ""
              }`}
              onClick={() => setActiveChart("stateComparison")}
            >
              {brewery.state} Brewery Profile
            </button>
            <button
              className={`chart-tab ${
                activeChart === "nearbyBreweries" ? "active" : ""
              }`}
              onClick={() => setActiveChart("nearbyBreweries")}
            >
              Nearby Breweries
            </button>
          </div>

          <div className="chart-content">
            {loadingCharts ? (
              <div className="chart-loading">
                <Loader className="loading-icon" />
                <span>Loading chart data...</span>
              </div>
            ) : (
              <>
                {activeChart === "cityTypes" && (
                  <div className="chart-panel">
                    <div className="chart-description">
                      <h3>Brewery Types in {brewery.city}</h3>
                      <p>
                        This chart shows the distribution of brewery types in{" "}
                        {brewery.city}. {brewery.name} is a{" "}
                        {capitalizeBreweryType(brewery.brewery_type)} brewery,
                        which represents{" "}
                        {getCityBreweryTypePercentage(brewery.brewery_type)}% of
                        breweries in this city.
                      </p>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={getCityBreweryTypeCounts()}
                        margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          height={70}
                        />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [`${value} breweries`, "Count"]}
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              const isCurrentType =
                                label.toLowerCase() ===
                                capitalizeBreweryType(
                                  brewery.brewery_type
                                ).toLowerCase();
                              return (
                                <div className="custom-tooltip">
                                  <p className="label">{`${label}`}</p>
                                  <p className="value">{`${payload[0].value} breweries`}</p>
                                  {isCurrentType && (
                                    <p className="highlight">
                                      This brewery's type
                                    </p>
                                  )}
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar
                          dataKey="count"
                          fill="#8884d8"
                          name="Number of Breweries"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="chart-insight">
                      <p>
                        <strong>Insight:</strong> {getBreweryTypeInsight()}
                      </p>
                    </div>
                  </div>
                )}

                {activeChart === "stateComparison" && (
                  <div className="chart-panel">
                    <div className="chart-description">
                      <h3>Brewery Profile in {brewery.state}</h3>
                      <p>
                        This radar chart compares the prevalence of different
                        brewery characteristics in {brewery.state}. Higher
                        values indicate more common attributes among breweries
                        in this state.
                      </p>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart
                        outerRadius={90}
                        data={getStateBreweryProfile()}
                      >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="attribute" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar
                          name="State Average"
                          dataKey="value"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.6}
                        />
                        <Radar
                          name={brewery.name}
                          dataKey="breweryValue"
                          stroke="#82ca9d"
                          fill="#82ca9d"
                          fillOpacity={0.6}
                        />
                        <Legend />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                    <div className="chart-insight">
                      <p>
                        <strong>Insight:</strong> {getStateProfileInsight()}
                      </p>
                    </div>
                  </div>
                )}

                {activeChart === "nearbyBreweries" && (
                  <div className="chart-panel">
                    <div className="chart-description">
                      <h3>Nearby Breweries in {brewery.city}</h3>
                      <p>
                        This chart shows other breweries near {brewery.name} and
                        their approximate distances. Closer breweries could be
                        potential collaborators or competition.
                      </p>
                    </div>
                    {brewery.latitude && brewery.longitude ? (
                      <>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart
                            data={getBreweryDistanceData()}
                            layout="vertical"
                            margin={{
                              top: 20,
                              right: 30,
                              left: 120,
                              bottom: 20,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              type="number"
                              label={{
                                value: "Distance (miles)",
                                position: "bottom",
                              }}
                            />
                            <YAxis dataKey="name" type="category" width={100} />
                            <Tooltip
                              formatter={(value) => [
                                `${value} miles`,
                                "Distance",
                              ]}
                              labelFormatter={(label) => `${label}`}
                              content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="custom-tooltip">
                                      <p className="label">{label}</p>
                                      <p className="value">{`${payload[0].value} miles away`}</p>
                                      <p>{`Type: ${payload[0].payload.type}`}</p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Bar
                              dataKey="distance"
                              fill="#82ca9d"
                              name="Distance (miles)"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                        <div className="chart-insight">
                          <p>
                            <strong>Insight:</strong>{" "}
                            {getNearbyBreweriesInsight()}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="no-location-data">
                        <p>
                          This brewery doesn't have location coordinates, so
                          nearby breweries can't be determined.
                        </p>
                        <p>
                          A complete brewery profile with location data would
                          enable this feature.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsChart;

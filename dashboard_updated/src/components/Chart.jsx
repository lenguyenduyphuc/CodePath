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
} from "recharts";

const BreweryCharts = ({ byType, byState }) => {
  const typeData = Object.entries(byType || {})
    .map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1).replace("_", " "),
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const stateData = Object.entries(byState || {})
    .map(([state, count]) => ({
      name: state,
      value: count,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const COLORS = [
    "#8884d8",
    "#83a6ed",
    "#8dd1e1",
    "#82ca9d",
    "#a4de6c",
    "#d0ed57",
    "#ffc658",
    "#ff8042",
    "#ff6361",
    "#bc5090",
  ];

  return (
    <div className="brewery-visualizations">
      <h2>Brewery Insights</h2>
      <div className="charts-container">
        {/* Brewery Types Bar Chart */}
        <div className="chart-card">
          <h3>Brewery Types Distribution</h3>
          <div className="chart-description">
            <p>
              This chart shows the distribution of brewery types across the
              database. Micro breweries are smaller establishments focused on
              specialty beers, while brewpubs combine brewing with restaurant
              operations.
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={typeData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip
                formatter={(value) => [
                  `${value.toLocaleString()} breweries`,
                  "Count",
                ]}
              />
              <Legend />
              <Bar dataKey="count" name="Number of Breweries" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top States Pie Chart */}
        <div className="chart-card">
          <h3>Top 10 States by Brewery Count</h3>
          <div className="chart-description">
            <p>
              This visualization highlights which states have the most vibrant
              brewing scenes. States with more breweries tend to have stronger
              craft beer cultures and more diverse options for beer enthusiasts.
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stateData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {stateData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [
                  `${value.toLocaleString()} breweries`,
                  "Count",
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BreweryCharts;

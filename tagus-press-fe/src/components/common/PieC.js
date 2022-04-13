import React, { PureComponent } from "react";
import { PieChart, Pie, Cell } from "recharts";

class PieC extends PureComponent {
  static jsfiddleUrl = "https://jsfiddle.net/alidingling/c9pL8k61/";

  render() {
    const { data, colors } = this.props;
    console.log("data is ===> ", data);

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      percent
    }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      return (
        <text
          x={x}
          y={y}
          fill="black"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    };

    return (
      <PieChart width={200} height={200}>
        <Pie
          data={data}
          cx={100}
          cy={100}
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        {/* <Tooltip /> */}
      </PieChart>
    );
  }
}

export default PieC;


import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, Legend } from "recharts";
import { TypeSpecificAnalytics } from "@/services/analyticsService";

interface TypeSpecificChartProps {
  data: TypeSpecificAnalytics;
}

const TypeSpecificChart: React.FC<TypeSpecificChartProps> = ({ data }) => {
  const chartConfig = {
    count: { label: "Count", color: "#4A6741" },
    mistakes: { label: "Mistakes", color: "#EF4444" }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md">{data.type} - Progress</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[180px]">
          <ChartContainer
            config={chartConfig}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false}
                  tickMargin={8}
                  fontSize={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tickMargin={8}
                  fontSize={10}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <ChartTooltipContent
                          className="border-none bg-background/80 backdrop-blur-sm"
                          payload={payload}
                          active={active}
                          label={label}
                        />
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="var(--color-count)" 
                  strokeWidth={2} 
                  activeDot={{ r: 4 }} 
                  name="Sessions"
                />
                <Line 
                  type="monotone" 
                  dataKey="mistakes" 
                  stroke="var(--color-mistakes)" 
                  strokeWidth={2} 
                  activeDot={{ r: 4 }} 
                  name="Mistakes"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TypeSpecificChart;

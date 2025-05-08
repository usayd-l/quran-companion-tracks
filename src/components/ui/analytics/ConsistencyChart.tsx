
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from "recharts";

interface ConsistencyChartProps {
  data: { date: string; count: number }[];
}

const ConsistencyChart: React.FC<ConsistencyChartProps> = ({ data }) => {
  const chartConfig = {
    recitations: { label: "Recitations", color: "#4A6741" }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md">Weekly Consistency</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[180px]">
          <ChartContainer
            config={chartConfig}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
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
                <Bar 
                  dataKey="count" 
                  fill="var(--color-recitations)" 
                  radius={[4, 4, 0, 0]} 
                  name="recitations"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsistencyChart;

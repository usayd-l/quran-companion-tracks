
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, Legend } from "recharts";

interface MistakesTrendChartProps {
  data: {
    date: string;
    mistakes: number;
    stucks: number;
    marked: number;
  }[];
}

const MistakesTrendChart: React.FC<MistakesTrendChartProps> = ({ data }) => {
  const chartConfig = {
    mistakes: { label: "Mistakes", color: "#EF4444" },
    stucks: { label: "Stucks", color: "#F59E0B" },
    marked: { label: "Marked", color: "#3B82F6" }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md">Mistake Trends</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[180px]">
          <ChartContainer
            config={chartConfig}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
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
                <Line 
                  type="monotone" 
                  dataKey="mistakes" 
                  stroke="var(--color-mistakes)" 
                  strokeWidth={2} 
                  activeDot={{ r: 4 }} 
                  name="mistakes"
                />
                <Line 
                  type="monotone" 
                  dataKey="stucks" 
                  stroke="var(--color-stucks)" 
                  strokeWidth={2} 
                  activeDot={{ r: 4 }} 
                  name="stucks"
                />
                <Line 
                  type="monotone" 
                  dataKey="marked" 
                  stroke="var(--color-marked)" 
                  strokeWidth={2} 
                  activeDot={{ r: 4 }} 
                  name="marked"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MistakesTrendChart;

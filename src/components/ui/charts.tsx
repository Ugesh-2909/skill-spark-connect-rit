
import * as React from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./chart";
import * as RechartsPrimitive from "recharts";

export interface ChartProps {
  data: any;
  height?: number;
}

export function BarChart({ data, height = 300 }: ChartProps) {
  return (
    <ChartContainer config={{}} className={`h-[${height}px]`}>
      <RechartsPrimitive.BarChart data={data}>
        <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
        <RechartsPrimitive.XAxis dataKey="name" />
        <RechartsPrimitive.YAxis />
        <ChartTooltip
          content={<ChartTooltipContent />}
          cursor={{ fill: "var(--chart-tooltip-bg)" }}
        />
        <RechartsPrimitive.Bar
          dataKey="data"
          fill="var(--chart-primary, #6E59A5)"
          radius={4}
          maxBarSize={40}
        />
      </RechartsPrimitive.BarChart>
    </ChartContainer>
  );
}

export function PieChart({ data, height = 300 }: ChartProps) {
  return (
    <ChartContainer config={{}} className={`h-[${height}px]`}>
      <RechartsPrimitive.PieChart>
        <RechartsPrimitive.Pie
          data={data?.datasets?.[0]?.data?.map((value: number, index: number) => ({
            name: data.labels[index],
            value,
            fill: data?.datasets?.[0]?.backgroundColor?.[index] || `var(--chart-color-${index + 1}, #6E59A5)`,
          }))}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          dataKey="value"
        />
        <ChartTooltip content={<ChartTooltipContent />} />
      </RechartsPrimitive.PieChart>
    </ChartContainer>
  );
}

export function LineChart({ data, height = 300 }: ChartProps) {
  return (
    <ChartContainer config={{}} className={`h-[${height}px]`}>
      <RechartsPrimitive.LineChart data={data.labels?.map((label: string, index: number) => ({
        name: label,
        value: data.datasets?.[0]?.data?.[index],
      }))}>
        <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
        <RechartsPrimitive.XAxis dataKey="name" />
        <RechartsPrimitive.YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <RechartsPrimitive.Line
          type="monotone"
          dataKey="value"
          stroke={data.datasets?.[0]?.borderColor || "var(--chart-primary, #6E59A5)"}
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </RechartsPrimitive.LineChart>
    </ChartContainer>
  );
}

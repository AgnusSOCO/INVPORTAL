import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
} from "recharts";
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PieChart as RechartsPieChart, Pie, Cell } from "recharts";

// AreaChart Component
interface AreaChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  yAxisWidth?: number;
  showLegend?: boolean;
  showGridLines?: boolean;
  startEndOnly?: boolean;
  className?: string;
}

export function AreaChart({
  data,
  index,
  categories,
  colors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))"],
  valueFormatter = (value: number) => value.toString(),
  yAxisWidth = 40,
  showLegend = true,
  showGridLines = true,
  startEndOnly = true,
  className,
}: AreaChartProps) {
  const gradientId = useMemo(() => `gradient-${Math.random().toString(36).substring(2, 9)}`, []);

  return (
    <div className={cn("w-full h-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors[0]} stopOpacity={0.3} />
              <stop offset="95%" stopColor={colors[0]} stopOpacity={0} />
            </linearGradient>
          </defs>
          {showGridLines && (
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--border)"
              strokeOpacity={0.2}
            />
          )}
          <XAxis
            dataKey={index}
            axisLine={false}
            tickLine={false}
            tickMargin={8}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            tickFormatter={(value) => {
              if (typeof value === "string") {
                return value;
              }
              return value.toString();
            }}
            tickCount={startEndOnly ? 2 : undefined}
          />
          <YAxis
            width={yAxisWidth}
            axisLine={false}
            tickLine={false}
            tickMargin={8}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            tickFormatter={(value) => {
              if (typeof value === "string") {
                return value;
              }
              return valueFormatter(value);
            }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      {payload.map((entry, index) => (
                        <div key={`item-${index}`} className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {entry.name}
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {valueFormatter(entry.value as number)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          {showLegend && <Legend />}
          {categories.map((category, index) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, style: { fill: colors[index % colors.length] } }}
              fill={`url(#${gradientId})`}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

// BarChart Component
interface BarChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  yAxisWidth?: number;
  showLegend?: boolean;
  showGridLines?: boolean;
  className?: string;
}

export function BarChart({
  data,
  index,
  categories,
  colors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))"],
  valueFormatter = (value: number) => value.toString(),
  yAxisWidth = 40,
  showLegend = true,
  showGridLines = true,
  className,
}: BarChartProps) {
  return (
    <div className={cn("w-full h-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          {showGridLines && (
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--border)"
              strokeOpacity={0.2}
            />
          )}
          <XAxis
            dataKey={index}
            axisLine={false}
            tickLine={false}
            tickMargin={8}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            tickFormatter={(value) => {
              if (typeof value === "string") {
                return value;
              }
              return value.toString();
            }}
          />
          <YAxis
            width={yAxisWidth}
            axisLine={false}
            tickLine={false}
            tickMargin={8}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            tickFormatter={(value) => {
              if (typeof value === "string") {
                return value;
              }
              return valueFormatter(value);
            }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      {payload.map((entry, index) => (
                        <div key={`item-${index}`} className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {entry.name}
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {valueFormatter(entry.value as number)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          {showLegend && <Legend />}
          {categories.map((category, index) => (
            <Bar
              key={category}
              dataKey={category}
              fill={colors[index % colors.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

// LineChart Component
interface LineChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  yAxisWidth?: number;
  showLegend?: boolean;
  showGridLines?: boolean;
  className?: string;
}

export function LineChart({
  data,
  index,
  categories,
  colors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))"],
  valueFormatter = (value: number) => value.toString(),
  yAxisWidth = 40,
  showLegend = true,
  showGridLines = true,
  className,
}: LineChartProps) {
  return (
    <div className={cn("w-full h-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          {showGridLines && (
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--border)"
              strokeOpacity={0.2}
            />
          )}
          <XAxis
            dataKey={index}
            axisLine={false}
            tickLine={false}
            tickMargin={8}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            tickFormatter={(value) => {
              if (typeof value === "string") {
                return value;
              }
              return value.toString();
            }}
          />
          <YAxis
            width={yAxisWidth}
            axisLine={false}
            tickLine={false}
            tickMargin={8}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            tickFormatter={(value) => {
              if (typeof value === "string") {
                return value;
              }
              return valueFormatter(value);
            }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      {payload.map((entry, index) => (
                        <div key={`item-${index}`} className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {entry.name}
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {valueFormatter(entry.value as number)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          {showLegend && <Legend />}
          {categories.map((category, index) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ fill: colors[index % colors.length] }}
              activeDot={{ r: 6, style: { fill: colors[index % colors.length] } }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

// PieChart Component
interface PieChartProps {
  data: any[];
  index: string;
  category: string;
  colors?: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
}

export function PieChart({
  data,
  index,
  category,
  colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ],
  valueFormatter = (value: number) => value.toString(),
  className,
}: PieChartProps) {
  const RADIAN = Math.PI / 180;
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className={cn("w-full h-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey={category}
            nameKey={index}
          >
            {data.map((_item, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0];
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        {data.name}
                      </span>
                      <span className="font-bold text-muted-foreground">
                        {valueFormatter(data.value as number)}
                      </span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
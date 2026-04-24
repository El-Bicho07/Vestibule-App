import React from "react";
import { View, Text, Dimensions } from "react-native";
import Svg, { Rect, Text as SvgText, Line } from "react-native-svg";
import { useThemeStore } from "../store/useThemeStore";
import { getColors } from "../constants/theme";
import { WeeklyBar } from "../utils/insights";

interface ChartProps {
  data: WeeklyBar[];
  height?: number;
  testID?: string;
}

// Custom SVG bar chart — avoids heavyweight deps while honoring the architectural tone.
export const Chart: React.FC<ChartProps> = ({ data, height = 200, testID }) => {
  const { theme } = useThemeStore();
  const c = getColors(theme);

  const screenWidth = Dimensions.get("window").width - 48;
  const chartWidth = screenWidth;
  const chartHeight = height;
  const barAreaHeight = chartHeight - 28;

  const maxMinutes = Math.max(...data.map((d) => d.minutes), 30);
  const barWidth = chartWidth / data.length - 10;

  return (
    <View testID={testID}>
      <Svg width={chartWidth} height={chartHeight}>
        {/* Baseline */}
        <Line
          x1={0}
          y1={barAreaHeight}
          x2={chartWidth}
          y2={barAreaHeight}
          stroke={c.border}
          strokeWidth={1}
        />
        {data.map((d, i) => {
          const h = d.minutes === 0 ? 2 : (d.minutes / maxMinutes) * (barAreaHeight - 16);
          const x = i * (chartWidth / data.length) + 5;
          const y = barAreaHeight - h;
          const fill = d.isPeak ? c.accent : d.minutes === 0 ? c.border : c.primary;
          return (
            <React.Fragment key={d.day}>
              <Rect x={x} y={y} width={barWidth} height={h} fill={fill} rx={2} />
              <SvgText
                x={x + barWidth / 2}
                y={chartHeight - 4}
                fontSize={11}
                fill={d.isPeak ? c.accent : c.subtext}
                textAnchor="middle"
                fontWeight={d.isPeak ? "600" : "400"}
              >
                {d.day}
              </SvgText>
              {d.minutes > 0 && (
                <SvgText
                  x={x + barWidth / 2}
                  y={y - 6}
                  fontSize={10}
                  fill={c.subtext}
                  textAnchor="middle"
                >
                  {d.minutes}m
                </SvgText>
              )}
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

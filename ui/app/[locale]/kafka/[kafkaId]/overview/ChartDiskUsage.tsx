"use client";
import {
  height,
  padding,
} from "@/app/[locale]/kafka/[kafkaId]/overview/chartConsts";
import {
  Chart,
  ChartArea,
  ChartAxis,
  ChartLegend,
  ChartStack,
  ChartThemeColor,
  ChartThreshold,
  ChartVoronoiContainer,
} from "@/libs/patternfly/react-charts";
import { chart_color_orange_300 } from "@/libs/patternfly/react-tokens";
import { useFormatBytes } from "@/utils/format";
import { useFormatter } from "next-intl";
import { useChartWidth } from "./useChartWidth";

type ChartDiskUsageProps = {
  usages: TimeSeriesMetrics[];
  available: TimeSeriesMetrics[];
};

export function ChartDiskUsage({ usages, available }: ChartDiskUsageProps) {
  const format = useFormatter();
  const formatBytes = useFormatBytes();
  const [containerRef, width] = useChartWidth();

  const itemsPerRow = 4;

  const hasMetrics = Object.keys(usages).length > 0;
  if (!hasMetrics) {
    return <div>TODO</div>;
  }

  return (
    <div ref={containerRef}>
      <Chart
        ariaTitle={"Available disk space"}
        containerComponent={
          <ChartVoronoiContainer
            labels={({ datum }) => `${datum.name}: ${formatBytes(datum.y)}`}
            constrainToVisibleArea
          />
        }
        legendPosition="bottom-left"
        legendComponent={
          <ChartLegend
            orientation={"horizontal"}
            data={[
              ...usages.map((_, idx) => ({ name: `Node ${idx}` })),
              {
                name: "Available storage threshold",
                symbol: { fill: chart_color_orange_300.var, type: "threshold" },
              },
            ]}
            itemsPerRow={itemsPerRow}
          />
        }
        height={height}
        padding={padding}
        themeColor={ChartThemeColor.multiUnordered}
        width={width}
        legendAllowWrap={true}
      >
        <ChartAxis
          scale={"time"}
          tickFormat={(d) => {
            const [_, time] = format
              .dateTime(d, {
                dateStyle: "short",
                timeStyle: "short",
                timeZone: "UTC",
              })
              .split(" ");
            return time;
          }}
        />
        <ChartAxis
          dependentAxis
          showGrid={true}
          tickFormat={(d) => {
            return formatBytes(d, { maximumFractionDigits: 0 });
          }}
        />
        <ChartStack>
          {usages.map((usage, idx) => {
            const usageArray = Object.entries(usage);
            return (
              <ChartArea
                key={`usage-area-${idx}`}
                data={usageArray.map(([x, y]) => ({
                  name: `Node ${idx + 1}`,
                  x,
                  y,
                }))}
              />
            );
          })}
        </ChartStack>
        {usages.map((usage, idx) => {
          const usageArray = Object.entries(usage);
          const data = Object.entries(available[idx]);
          return (
            <ChartThreshold
              key={`chart-softlimit-${idx}}`}
              data={data.map(([_, y], x) => ({
                name: `Node ${idx + 1}`,
                x: usageArray[x][0],
                y,
              }))}
              style={{
                data: {
                  stroke: chart_color_orange_300.var,
                },
              }}
            />
          );
        })}
      </Chart>
    </div>
  );
}

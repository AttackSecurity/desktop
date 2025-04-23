"use client";
import dynamic from "next/dynamic";
import {Chip} from "@nextui-org/react";
import {Icon} from "@iconify/react";
import {Settings} from "@/components/Settings";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const ChartComp = ({ datasets, title }) => {
  const options = {
    series: [
      {
        name: title,
        data: datasets,
      },
    ],
    chart: {
      type: "line",
      height: 240,
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      theme: "dark",
      enabled: true,
      x: {
        show: false,
      },
      y: {
        formatter: function (val) {
          return val;
        },
      },
      marker: {
        show: false,
      },
    },
    legend: {
      show: false,
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0.30,
        shade: "#1C64F2",
        gradientToColors: ["#1C64F2"],
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      lineCap: "round",
      curve: "smooth",
    },
    markers: {
      size: 0.5,
    },
    grid: {
      show: false,
      padding: { top: 30, bottom: -15, left: 3, right: 0.2 },
    },
    xaxis: {
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      show: false,
      labels: {},
    },
  };

  const series = [
    {
      name: title,
      data: datasets,
    },
  ];

  return (
      <ApexChart
        type="area"
        options={options}
        series={series}
        height={"100%"}
        width={"100%"}
      />
  );
};

function determineTrend(currentValue, previousValues) {
  const total = previousValues.reduce((acc, value) => acc + value, 0);
  const average = total / previousValues.length;

  if (currentValue > average) {
    return (
        <Chip color="success" variant="flat" classNames={{
          base: "p-0 py-0 my-0 rounded-md h-full",
          content: "p-1 py-0 mx-1",
        }}>
          <Icon icon={"lucide:trending-up"} color={"#00FF00"} width={22} height={32} />
        </Chip>
    );
  } else if (currentValue < average) {
    return (
        <Chip color="danger" variant="flat" classNames={{
          base: "p-0 py-0 my-0 rounded-md h-full",
          content: "p-1 py-0 mx-1",
        }}>
          <Icon icon={"lucide:trending-down"} color={"#FA8072"} width={22} height={32} />
        </Chip>
    );
  } else if (currentValue === 0) {
    return (
        <Chip color="warning" variant="flat" classNames={{
          base: "p-0 py-0 my-0 rounded-md h-full",
          content: "p-1 py-0 mx-1",
        }}>
          <Icon icon={"solar:question-circle-bold-duotone"} width={22} height={32} />
        </Chip>
    )
  }
}

function formatNumber(value) {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  }

  else if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }

  return value.toLocaleString();
}

export function Chart({ title, scores }) {
  const currentScore = scores[scores.length - 1];
  const previousScores = scores.slice(0, -1);

  if (Settings.formatNumbers) {
    formatNumber(currentScore)
  }

  return (
      <div className="card w-full">
        <div className="absolute top-2 left-2 items-center flex gap-2 flex-row card p-1 px-1.5">
          {determineTrend(currentScore, previousScores)}
          <div className="flex flex-col">
            <p className="text-xs font-mono uppercase text-white">
              {title}
            </p>
            <p className="text-xs font-mono uppercase text-white card px-2">
              {Settings.formatNumbers ? formatNumber(currentScore) : currentScore}
            </p>
          </div>
        </div>
        <div className="shadow-2xl overflow-hidden rounded-lg">
          <ChartComp title={title} datasets={scores}/>
        </div>
      </div>
  );
}
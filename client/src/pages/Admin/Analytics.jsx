import { useEffect, useState } from "react";
import Loading from "../../components/Loading/Loading";
import { apiClient } from "../../utils/requests";
import "chart.js/auto";
import { Chart } from "react-chartjs-2";
const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const Analytics = () => {
  const [data, setData] = useState(null);
  //const [loading, setLoading] = useState(true);
  const today = new Date().getDay();
  useEffect(() => {
    apiClient.get("admin/data-vis").then((res) => {
      if (res.status === 200) {
        setData(res.data);
        console.log(res.data);
      } else setData({ totalLogs: 0 });
    });
  }, []);
  return (
    <div className="w-full">
      {!data ? (
        <div className="flex h-scrn-8 items-center justify-center">
          <Loading text={"Initializing data"} />
        </div>
      ) : (
        <div className="w-full">
          <span className="flex items-center">
            <span className="font-display mr-4 text-sky-500 font-bold text-5xl">
              {data.totalLogs}
            </span>
            <span className="font-display text-slate-700 font-bold text-xl">
              scans recorded!
            </span>
          </span>
          <span className="inline-flex mr-5 mt-2 items-center">
            <span className="font-display mr-2 text-blue-500 font-bold text-3xl">
              {data.totalRf}
            </span>
            <span className="font-display text-blue-500 font-bold text-xl">
              RFID
            </span>
          </span>
          <span className="inline-flex items-center">
            <span className="font-display mr-2 text-teal-500 font-bold text-3xl">
              {data.totalQR}
            </span>
            <span className="font-display text-teal-500 font-bold text-xl">
              QR
            </span>
          </span>
          <div className="chart-container-sm p-4">
            <Chart
              type="pie"
              datasetIdKey="id"
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
              data={{
                labels: ["QR Codes", "RFID Tag"],

                datasets: [
                  {
                    data: [data.totalQR, data.totalRf],
                    backgroundColor: ["#14b8a6", "#3b82f6"],
                  },
                ],
              }}
            />
          </div>
          <div className="chart-container">
            <Chart
              type="line"
              datasetIdKey="id"
              options={{
                responsive: true,
                elements: {
                  line: {
                    tension: 0.3,
                  },
                },
                plugins: {
                  legend: {
                    position: "right",
                  },
                },
              }}
              data={{
                labels: [
                  weekday[new Date(data.weekLogStat.thisWeek[0].date).getDay()],
                  weekday[new Date(data.weekLogStat.thisWeek[1].date).getDay()],
                  weekday[new Date(data.weekLogStat.thisWeek[2].date).getDay()],
                  weekday[new Date(data.weekLogStat.thisWeek[3].date).getDay()],
                  weekday[new Date(data.weekLogStat.thisWeek[4].date).getDay()],
                  weekday[new Date(data.weekLogStat.thisWeek[5].date).getDay()],
                  weekday[new Date(data.weekLogStat.thisWeek[6].date).getDay()],
                ],
                datasets: [
                  {
                    id: 1,
                    label: "Two weeks ago",
                    data: data.weekLogStat.last2Week.map((el) => el.total),
                    borderColor: "#5eead4",
                    backgroundColor: "rgba(94, 234, 212, 0.3)",
                  },
                  {
                    id: 2,
                    label: "A week ago",
                    data: data.weekLogStat.lastWeek.map((el) => el.total),
                    borderColor: "#22d3ee",
                    backgroundColor: "rgba(34, 211, 238, 0.6)",
                  },
                  {
                    id: 3,
                    label: "This week",
                    data: data.weekLogStat.thisWeek.map((el) => el.total),
                    borderColor: "#0ea5e9",
                    backgroundColor: "rgba(14, 165, 233, 0.7)",
                  },
                ],
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;

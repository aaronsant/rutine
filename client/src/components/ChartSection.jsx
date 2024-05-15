// client/src/components/ChartSection.jsx
import React, { useEffect, useState } from "react";
import { CartesianGrid, Bar, Brush, BarChart, XAxis, YAxis, Tooltip, Legend, Label, ResponsiveContainer} from "recharts";
import { getWeek } from "date-fns";

function ChartSection(props){

    const [group, setGroup] = useState("Daily");
    const [data, setData] = useState([])
    const [yDomainHeight, setYDomainHeight] = useState(0)
    const windowWidth = useWindowWidth()

    useEffect(() => {
        if (group === "Daily") {
            setData(getDailyData(props.data))
        } else if (group === "Weekly"){
            setData(getWeeklyData(props.data))
        } else if (group === "Monthly"){
            setData(getMonthlyData(props.data))
        }
    }, [props.data])

    useEffect(()=>{
        const mx = data.reduce((prev, curr) => (prev && prev.tasksCompleted > curr.tasksCompleted) ? prev : curr, 0)
        setYDomainHeight(mx.tasksCompleted)
    }, [data, group])

    function getDailyData(data){
        let today = new Date();
        let startDate = new Date(today.getFullYear(), 0, 1);
        let day = startDate;
        var chartData = [];
        while (day <= today) {
            chartData.push({
                date: day.toDateString().slice(4,10),
                tasksCompleted: 0,
            })
            day.setDate(day.getDate()+1);
        }
        data.forEach(entry => {
            if (entry.completed && entry.habit_group == "Daily") {
                let index = Math.floor((new Date(entry.date) - new Date(today.getFullYear(),0,1))/(1000*60*60*24));
                chartData[index]['tasksCompleted'] = chartData[index]['tasksCompleted'] + 1;
            }
        });
        return chartData;
    }

    function getWeeklyData(data){
        let today = new Date();
        let firstDayOfYear = new Date(today.getFullYear(), 0, 1);
        let firstWeekdayOfYear = firstDayOfYear.getDay();
        let firstMondayOfYear = 1 + ((8 -  firstWeekdayOfYear) % 7)
        let day = new Date(today.getFullYear(),0, firstMondayOfYear)  
        var chartData = [];
        while (day <= today) {
            chartData.push({
                date: day.toDateString().slice(4,10),
                tasksCompleted: 0,
            })
            day.setDate(day.getDate()+7);
        }

        data.forEach(entry => {
            if (entry.completed && entry.habit_group == "Weekly") {
                let index = getWeek(entry.date) -1;
                chartData[index]['tasksCompleted'] = chartData[index]['tasksCompleted'] + 1;
            }
        });
        return chartData;
    }

    function getMonthlyData(data){
        let today = new Date();
        let startDate = new Date(today.getFullYear(), 0, 1);
        let day = startDate;
        var chartData = [];
        while (day <= today) {
            chartData.push({
                date: day.toDateString().slice(4,7),
                tasksCompleted: 0,
            })
            day.setMonth(day.getMonth()+1);
        }
        data.forEach(entry => {
            if (entry.completed && entry.habit_group == "Monthly") {
                let index = new Date(entry.date).getMonth();
                chartData[index]['tasksCompleted'] = chartData[index]['tasksCompleted'] + 1;
            }
        });
        return chartData;
    }

    function renderLegend() {
        return(
            <div className="legend">
                <button className={group == "Daily" ? "selected" : ""} type="button" onClick={() => {
                    setGroup("Daily")
                    setInterval(6)
                    setData(getDailyData(props.data))
                }}>Daily</button>
                <button className={group == "Weekly" ? "selected" : ""} type="button" onClick={() => {
                    setGroup("Weekly")
                    setInterval(0)
                    setData(getWeeklyData(props.data))
                }}>Weekly</button>
                <button className={group == "Monthly" ? "selected" : ""} type="button" onClick={() => {
                    setGroup("Monthly")
                    setInterval(0)    
                    setData(getMonthlyData(props.data))
                }}>Monthly</button>
            </div>
        )        
    }
    
    function getXLabel() {
        if (group == "Daily") {
            return "Day"
        } else if (group == "Weekly") {
            return "Week of"
        } else if (group == "Monthly"){
            return "Month"
        }
    }

    function CustomTooltip({active, payload, label}) {
        if (active && payload && payload.length) {
            let date = label
            let tasksCompleted = payload[0].payload.tasksCompleted;
            let today = new Date()
            const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            let dayOfWeek = weekdays[new Date(`${date}, ${today.getFullYear()}`).getDay()]
            if (group == "Weekly") {
                let startDate = new Date(`${date}, ${today.getFullYear()}`);
                let endDate = new Date(startDate)
                endDate.setDate(endDate.getDate() + 6)
                if (startDate.getMonth() == endDate.getMonth()) {
                    date = `${date} - ${endDate.getDate()}`
                } else {
                    date = `${date} - ${endDate.toDateString().slice(4,10)}`
                }
            } else if (group == "Monthly"){
                let day = new Date(`${date} 1`)
                date = day.toLocaleString('default', {month: 'long'})
            }
            return (
                <div className="custom-tooltip">
                    <span><b>{date}</b>{group === "Daily" ? `  (${dayOfWeek})` : null}</span>
                    <br/>
                    <span>{tasksCompleted} {tasksCompleted == 1 ? "task" :  "tasks"} completed</span>
                </div>
            )
        }
        return null
    }

    function calcbuffer() {
        let buffer = 0;
        if (windowWidth > 1280) {
            buffer = (windowWidth - 1280)*(200/640)
        }
        return Math.floor(buffer)
    }

    function calcStartIndex() {
        let rate = 0
        let start = 0
        if (group == "Daily") {
            start = 30
            rate = 7/100
        } else if (group == "Weekly") {
            rate = 3/200
            start = 5
        } else if (group == "Monthly") {
            start = 6
            rate = 2/100
        }

        let endIndex = data.length
        let visibleDatapoints = start + Math.floor((windowWidth - 500)*rate)
        let startIndex =  endIndex - visibleDatapoints
        return startIndex < 0 ? 0 : startIndex
    }

    return (
        <div className="chart-zone">
        <ResponsiveContainer width="100%" height='100%' minWidth={200} >
            <BarChart width={800} height={400} data={data} margin={{left: calcbuffer() + 20, right: calcbuffer() + 80}}>
                <CartesianGrid strokeDasharray="2 6" fill="black" fillOpacity={0.5}/>
                <XAxis dataKey="date" angle={0} tickMargin={5} stroke="white"  tickSize={10} height={50}>
                    <Label value={getXLabel()} position='insideBottom'/>
                </XAxis>
                <YAxis stroke="white" allowDecimals={false} domain={[0, yDomainHeight]} />
                <Tooltip content={<CustomTooltip />} cursor='pointer'/>
                <Legend  verticalAlign="top" content={renderLegend()} height={40}/>
                <Brush dataKey='date' height={25} stroke='black' startIndex={calcStartIndex()}/>
                <Bar type="monotone" dataKey="tasksCompleted" fill="cornflowerblue" minPointSize={3} animationBegin={200} />
            </BarChart>
        </ResponsiveContainer>    
        </div>
    )
}

const useWindowWidth = () => {
    const [width, setWidth] = useState(0)
    
    useEffect(() => {
      function handleResize() {
        setWidth(window.innerWidth)
      }
      window.addEventListener("resize", handleResize)
      handleResize()
      return () => { 
        window.removeEventListener("resize", handleResize)
      }
    }, [setWidth])
    
    return width
}

export default ChartSection;
import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from "react";
import {ThChart} from "./charts/ThChart";
import {Table, Button} from "reactstrap";
import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import de from 'date-fns/locale/de';
registerLocale('de', de)

const App = props => {
    const [logs, setLogs] = useState([])
    const [start, setStart] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0))
    const [end, setEnd] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 0))
    const [show, setShow] = useState(100)

    const filteredData = () => logs.filter(l => l.zeit > start && l.zeit < end)

    useEffect(() => {
        load()
        window.setTimeout(load, 30000)
    }, [])

    const load = async () => {
        const resp = await fetch("data.php")                        // use for deployment
        // const resp = await fetch("http://192.168.4.65/data.php")      // use for local testing
        const res = await resp.json()
        const parsed = res.map(r => {
                return {...r, zeit: new Date(r.zeit)}
            })
        setLogs(parsed)
    }

    const dtOpt = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };

    return (
        <div className="App">
            <h1>Sensordaten Kinoraum</h1>
            von
            <div className="mb-2">
                <DatePicker selected={start} onChange={date => setStart(date)} showTimeSelect dateFormat="Pp"
                            className="form-control" locale="de"/>
            </div>
            bis
            <div>
                <DatePicker selected={end} onChange={date => setEnd(date)} showTimeSelect dateFormat="Pp"
                            className="form-control" locale="de"/>
            </div>
            <ThChart data={logs.filter(l => l.zeit > start && l.zeit < end)}/>

            <Table border="1" align="center" className="table table-dark table-striped">
                <thead>
                <tr>
                    <th>Timestamp</th>
                    <th>Temperature in Celcius</th>
                    <th>Relative Humidity</th>
                </tr>
                </thead>
                <tbody>
                {filteredData().reverse().slice(0, show).map(l =>
                    <tr>
                        <td>{l.zeit.toLocaleTimeString("de-DE", dtOpt)}</td>
                        <td>{l.temperatur} °C</td>
                        <td>{l.luftfeuchtigkeit} %</td>
                    </tr>
                )}
                </tbody>
            </Table>
            {show < logs.length && <Button color="success" onClick={() => setShow(prev => (prev + 100) < logs.length ? prev + 100 : logs.length)}>Mehr anzeigen</Button>}
        </div>
    );
}

export default App;

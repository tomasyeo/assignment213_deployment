import logo from './logo.svg';
import bootstrap from '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import TblReadings from './components/TblReadings';

const axios = require('axios');

const instance = axios.create({
    baseURL: 'https://api.data.gov.sg/v1'
});

class App extends React.Component {
    defaultReading = {
        metadata: { 'stations': [], 'reading_type': "", 'reading_unit': "" },
        items: [{ 'timestamp': "", 'readings': [{ 'station_id': "", 'value': 0 }] }]
    };

    constructor() {
        super();
        this.state = this.defaultReading;
        this.componentDidMount = this.componentDidMount.bind(this);

        this.counter = 0;
    }

    render() {
        let stations = this.state.metadata.stations;
        let data = this.state.items;
        //console.log('render', data);
        return (
            <>
                <header className="pb-3 mb-4 border-bottom"><h1>Realtime Weather Readings across Singapore</h1></header>
                <div className='row'><TblReadings headers={stations} data={data} /></div>
            </>
        );
    }

    componentDidMount() {
        const onPageLoad = async () => {
            let data = await this.getTemperature(true);
            //console.log('mount', data.readings);
            this.setState({
                metadata: data.metadata,
                items: data.readings
            });

            this.counter += 1;
            //console.log(this.counter);
        };

        // Check if the page has already loaded
        if (document.readyState === "complete") {
            onPageLoad();

        } else {
            window.addEventListener("load", onPageLoad);
            // Remove the event listener when component unmounts
            return () => window.removeEventListener("load", onPageLoad);
        }
    }

    async getTemperature(init = false) {
        try {
            const { status, data } = await instance.get("/environment/air-temperature?date=2022-05-31");
            //  ?date_time=2022-05-15T12%3A02%3A00

            if (status === 200) {
                // Init metadata.
                if (init) {
                    return { 'metadata': this.parseMetadata(data), 'readings': this.parseReading(data) };
                } else {
                    return this.parseReading(data);
                }
            }
        } catch (e) {
            console.log(e.name);
        }
    }


    parseMetadata(data) {
        let reading_type = data['metadata']['reading_type'];
        let reading_unit = data['metadata']['reading_unit'];
        let stations = data['metadata']['stations'];

        return { 'reading_type': reading_type, 'reading_unit': reading_unit, 'stations': stations };
    }

    parseReading(data) {
        // Read the first index for singular time point.
        //let timestamp = data['items'][0]['timestamp'];
        //let readings = data['items'][0]['readings'];
        //return { 'timestamp': timestamp, 'readings': readings };
        return data['items'];
    }

}

export default App;

function getCurrentTime() {
    let date = new Date();
    console.log(encodeURIComponent(date.toISOString()));
    return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'medium', timeZone: 'Asia/Singapore' }).format(date);

}

//console.log(getCurrentTime());

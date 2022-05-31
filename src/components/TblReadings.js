import React from 'react';

const RowHeader = (props) => {
    const styleVtext = { 'writingMode': 'vertical-rl', 'textOrientation': 'sideways' }
    const stations = props.headers;

    const headerName = stations.map((station) => {
        return <th scope="col" className="table-primary" style={styleVtext}>{station.name}</th>
    });

    const headerID = stations.map((station) => {
        return <th scope="col" className="table-secondary" >{station.device_id}</th>
    });

    return (
        <thead>
            <tr><th>Stations</th>{headerName}</tr>
            <tr><th>Timestamp</th>{headerID}</tr>
        </thead>
    );
}

function formatDate(ts) {
    try {
        let date = new Date(ts);
        return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'medium', timeZone: 'Asia/Singapore' }).format(date);
    } catch (e) {
        console.log(e.name);
    }
}

const RowItem = (props) => {
    const items = props.data;

    //console.log('RowItem', items);
    const rows = items.map((item) => {
        return <tr><td>{formatDate(item.timestamp)}</td><RowTemps readings={item.readings} /></tr>
    });
    return rows;
}

const RowTemps = (props) => {
    const item = props.readings;
    let readings = item.map((reading) => <td>{reading.value}</td>);
    return readings;
}


const TblReadings = (props) => {
    const headers = props.headers;
    const reading_type = headers.reading_type;
    const reading_unit = headers.reading_unit;
    const data = props.data;
    //console.log(data);
    return (
        <div>{reading_type} {reading_unit}
            <table className="table table-striped-columns table-bordered border-primary">
                {<RowHeader headers={headers} />}
                <tbody>
                {<RowItem key={data.timestamp} data={data} />}
                </tbody>
            </table>
        </div>
    );
}

export default TblReadings;
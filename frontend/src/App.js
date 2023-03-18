import React, { useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { Marker, Popup } from 'react-map-gl';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { AiTwotoneStar } from 'react-icons/ai';
import axios from 'axios'
import './App.css'



function App() {

  const [pins, setPins] = useState([])

  const [viewState, setViewState] = useState({
    longitude: 87.92,
    latitude: 25.19,
    zoom: 6
  });


  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/pins");
        setPins(res.data);
      } catch (error) {
        console.log(error)
      }
    }
    getPins()
  }, []);

  console.log(pins)
  return (
    <>

      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100vw', height: '100vh' }}
        mapStyle="mapbox://styles/dbsmandal/clfedae2k003201qp3ldjbpt5"
      >
        {
          pins.map((pin,id) => {
            const {_id,createdAt,desc,lat,long,rating,title,username}=pin;
            return (
              <div key={_id}>

                <Marker longitude={long} latitude={lat} anchor="bottom" >
                  <FaMapMarkerAlt style={{ fontSize: viewState.zoom * 5, color: 'slateblue' }} />
                </Marker>
                <Popup longitude={long} latitude={lat}
                  anchor="left"
                >
                  <div className="card">
                    <label>Place</label>
                    <h4 className="place">{title}</h4>
                    <label>Review</label>
                    <p className="desc">{desc}</p>
                    <label>Rating:{rating}</label>
                    <div className="stars">
                      <AiTwotoneStar className='star' />
                      <AiTwotoneStar className='star' />
                      <AiTwotoneStar className='star' />
                      <AiTwotoneStar className='star' />
                      <AiTwotoneStar className='star' />


                    </div>
                    <label>Information</label>
                    <span className="username">
                      Created by <b>{username}</b>
                    </span>
                    <span className="date">{createdAt}</span>
                  </div>
                </Popup>
              </div>
            )
          })
        }

      </Map>

    </>
  );
}
export default App;
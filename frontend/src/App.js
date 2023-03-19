import React, { useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { Marker, Popup } from 'react-map-gl';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { AiTwotoneStar } from 'react-icons/ai';
import axios from 'axios';
import './App.css'



function App() {

  const currentUser = 'dipak'
  const [pins, setPins] = useState([]);
  const [currentplace, setCurrentPlace] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const [newPlace, setNewPlace] = useState(null)


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


  const handleMapMarkerClick = (pin) => {
    setCurrentPlace(pin);
    setShowPopup(true);
    setViewState({...viewState,latitude:pin.lat,longitude:pin.long})
  }

  const handleAddClick = (e) => {
    // console.log(e,e.lngLat.lat,e.lngLat.lng)
    
    setNewPlace({
      lat:e.lngLat.lat,
      long:e.lngLat.lng
    })
  }

  console.log(newPlace)

  return (

    <>

      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        onViewStateChange={(viewState) => setViewState(viewState)}
        style={{ width: '100vw', height: '100vh' }}
        onDblClick={ handleAddClick}
        mapStyle="mapbox://styles/dbsmandal/clfedae2k003201qp3ldjbpt5"
      >
        {
          pins.map((pin, id) => {
            return (
              <div key={id}>

                <Marker longitude={pin.long} latitude={pin.lat} anchor="bottom"
                  onClick={() => handleMapMarkerClick(pin)}
                >
                  <FaMapMarkerAlt style={{
                    fontSize: viewState.zoom * 5,
                    color: pin.username === currentUser ? 'tomato' : 'slateblue'
                  }}

                  />
                </Marker>

              </div>
            )
          })
        }
        {
          showPopup === true ? (<Popup
            longitude={currentplace.long}
            latitude={currentplace.lat}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setShowPopup(false)}
            anchor="left"
          >
            <div className="card">
              <label>Place</label>
              <h4 className="place">{currentplace.title}</h4>
              <label>Review</label>
              <p className="desc">{currentplace.desc}</p>
              <label>Rating:</label>
              <div className="stars">
                <AiTwotoneStar className='star' />
                <AiTwotoneStar className='star' />
                <AiTwotoneStar className='star' />
                <AiTwotoneStar className='star' />
                <AiTwotoneStar className='star' />


              </div>
              <label>Information</label>
              <span className="username">
                Created by <b>{currentplace.username}</b>
              </span>
              <span className="date">{currentplace.createdAt}</span>
            </div>
          </Popup>
          ) : null
        }
      {
        newPlace && (
          <Popup
            longitude={newPlace.long}
            latitude={newPlace.lat}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
            anchor="left"
          >New place popup</Popup>
        )
      }

      </Map>

    </>
  );
}
export default App;
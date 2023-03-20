import React, { useEffect, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { Marker, Popup } from 'react-map-gl';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { AiTwotoneStar } from 'react-icons/ai';
import TimeAgo from 'react-timeago';
import axios from 'axios';
import './App.css'
import Register from './Components/Register';
import Login from './Components/Login';



function App() {
  const myStorage=window.localStorage
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"))
  const [pins, setPins] = useState([]);
  const [currentplace, setCurrentPlace] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [newPlace, setNewPlace] = useState(null);

  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);


  //for new pin

  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(null)
  // const [title,setTitle]=useState(null)




  const [viewState, setViewState] = useState({
    longitude: 87.92,
    latitude: 25.19,
    zoom: 8
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
    setViewState({ ...viewState, latitude: pin.lat, longitude: pin.long })
  }

  const handleAddClick = (e) => {
    setNewPlace({
      lat: e.lngLat.lat,
      long: e.lngLat.lng
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long
    }
    try {
      const res = await axios.post("http://localhost:8800/api/pins", newPin)
      setPins([...pins, res.data]);
      setNewPlace(null)

    } catch (error) {
      console.log(error)
    }
  }
const handleRegister=()=>{
  setShowRegister(true);
  setShowLogin(false)
}
const handleLogin=()=>{
  setShowRegister(false);
  setShowLogin(true)
}

const handleLogout=()=>{
  myStorage.removeItem("user");
  setCurrentUser(null)
}

  return (

    <>

      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        onViewStateChange={(viewState) => setViewState(viewState)}
        transitionDuration="200"
        style={{ width: '100vw', height: '100vh' }}
        onDblClick={handleAddClick}
        mapStyle="mapbox://styles/dbsmandal/clfedae2k003201qp3ldjbpt5"
      >
        {
          pins.map((pin, id) => {
            return (
              <div key={id}>

                <Marker
                  longitude={pin.long}
                  latitude={pin.lat}
                  anchor="bottom"
                  offsetLeft={-3.5 * viewState.zoom}
                  offsetTop={-7 * viewState.zoom}
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
                {Array(currentplace.rating).fill(<AiTwotoneStar className='star' />)}



              </div>
              <label>Information</label>
              <span className="username">
                Created by <b>{currentplace.username}</b>
              </span>
              <span className="date"><TimeAgo date={currentplace.createdAt}  /> </span>
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
            >
              <div>
                <form onSubmit={handleSubmit} >
                  <label >Title</label>
                  <input type="text"
                    placeholder='Enter a Title'
                    onChange={(e) => setTitle(e.target.value)} />
                  <label >Review</label>
                  <textarea placeholder='Say us somthing about place'
                    onChange={(e) => setDesc(e.target.value)} />
                  <label >Rating</label>
                  <select onChange={(e) => setRating(e.target.value)} >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>

                  </select>
                  <button className='add_pin' type='submit' >Add Pin</button>
                </form>
              </div>
            </Popup>
          )
        }
        {
          currentUser ? (<button className="button logout" onClick={handleLogout} >Log Out</button>) : (<div className="buttons">
            <button className="button login" onClick={handleLogin}>Login</button>
            <button className="button register"
              onClick={handleRegister}
            > Register</button>

          </div>)
        }
        {showRegister && <Register setShowRegister={setShowRegister} setShowLogin={setShowLogin} />}
        {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser} />}

      </Map>

    </>
  );
}
export default App;
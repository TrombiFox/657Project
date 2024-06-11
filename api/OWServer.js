import axios from 'axios';
import { OW_KEY } from './OWKey';

// note: to call the API:
// https://api.openweathermap.org/data/2.5/weather?lat=LATTITUDE&lon=LONGITUDE&appid=API_KEY&units=imperial


const OWServer = axios.create({
    baseURL: 'https://api.openweathermap.org/data/2.5/weather',
    // notice how the get() in getVideos() example uses something...
        // ... like this, and then the parameters
});

// adds token, if we have one to all requests
// (I am leaving the commented code from the lecture in for...
    // ...potential future use and my own notes)
OWServer.interceptors.request.use(
    async (config) => {
        // called when request is made
        config.headers.Accept = 'application/json';
        // const token = await AsyncStorage.getItem('token');
        // if (token) {
        // config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (err) => {
        // called when error
        return Promise.reject(err);
    }
);

const unitType = 'imperial';

export const getWeather = async (lat, lon, callback) => {
    // test data that should return 'Allendale' for "name":
        // let lat = 42.97199453892559;
        // let lon = -85.89032577316132;
    const response = await OWServer.get(
        `?lat=${lat}&lon=${lon}&appid=${OW_KEY}&units=${unitType}`
    );
    callback(response.data);
};

// test and receive status code for a request
// no actual response means code 400? (no data comes back)
export const getStatus = async (lat, lon, callback) => {
    const response = await OWServer.get(
        `?lat=${lat}&lon=${lon}&appid=${OW_KEY}&units=${unitType}`
    );
    callback(response.status);
};


export default OWServer;
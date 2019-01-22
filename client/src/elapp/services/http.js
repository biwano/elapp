import axios from 'axios';

export default {
  // The http object
  init(config) {
    this.config = {
      baseURL: config.http.baseURL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    };
    this.http = axios.create(config);
  },
  // Basic handling of errors
  errorHandler(promise) {
    return new Promise((resolve, reject) => {
      promise.then((response) => {
        if (response.data.status === 'ko') {
          reject(response.data.payload);
        } else {
          resolve(response.data.payload);
        }
      });
    });
  },
  // Updates an object when a save operation is done
  updateHandler(promise, destination) {
    return new Promise((resolve, reject) => {
      promise.then((data) => {
        Object.assign(destination, data);
        resolve(destination);
      }).catch(data => reject(data));
    });
  },
  makeConfig(config) {
    return Object.assign({}, this.config, config);
  },
  // get wrapper
  get(url, config) {
    return this.errorHandler(this.http.get(url, this.makeConfig(config)));
  },
  // post wrapper
  post(url, object, config) {
    return this.errorHandler(this.http.post(url, object, this.makeConfig(config)));
  },
  // put wrapper
  put(url, object, config) {
    return this.errorHandler(this.http.put(url, object, this.makeConfig(config)));
  },
  // delete wrapper
  delete(url, config) {
    return this.errorHandler(this.http.delete(url, this.makeConfig(config)));
  },
};

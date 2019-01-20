import io from 'socket.io-client';
import { DISCONNECTED } from '@/constants/socketEvents';

let socket = null;

const connect = () => {
  if (socket) {
    return;
  }

  socket = io();
  socket.once(DISCONNECTED, () => {
    socket = null;
  });
  if (process.env.VUE_APP_API_SOCKET_EXPOSE === 'true') {
    window.socket = socket;
  }
};

const disconnect = () => {
  if (!socket) {
    return;
  }

  return new Promise(resolve => {
    socket.once(DISCONNECTED, () => {
      socket = null;
      resolve();
    });
    socket.disconnect();
  });
};

const proxyMethods = {};
['on', 'once', 'emit'].forEach(method => {
  proxyMethods[method] = (...args) => socket[method](...args);
});

const request = (event, params) => {
  if (!socket) {
    throw new Error('socket not connected');
  }

  return new Promise((resolve, reject) => {
    socket.emit(event, params, (error, data) => {
      if (error) return reject(error);
      return resolve(data);
    });
  });
};

export default Object.assign(
  {
    connect,
    disconnect,
    request,
  },
  proxyMethods,
);

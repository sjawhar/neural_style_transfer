import io from 'socket.io-client';
import { DISCONNECTED } from '@/constants/socketEvents';

let socket = null;

const connect = () => {
  if (socket) {
    return;
  }

  socket = io(process.env.VUE_APP_SOCKET_HOST);
  socket.once(DISCONNECTED, () => {
    socket = null;
  });
  if (process.env.VUE_APP_SOCKET_EXPOSE === 'true') {
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

const request = (event, ...args) => {
  if (!socket) {
    connect();
  }

  return new Promise((resolve, reject) => {
    socket.emit(event, ...args, (error, data) => {
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

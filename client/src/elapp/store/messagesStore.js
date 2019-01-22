// Adds a messsage to a message list
let messageId = 0;
const message = function message(messages, type, text) {
  messages.push({ id: messageId, type, text });
  messageId += 1;
};
// Messae store
const messagesStore = {
  namespaced: true,
  state: {
    messages: [],
  },
  mutations: {
    message(state, payload) {
      state.messages = [];
      message(state.messages, payload.type, payload.text);
      if (payload.type === 'error') { console.error(payload.text); console.trace(); }
    },
    remove(state, id) {
      for (let i = 0; i < state.messages.length; i += 1) {
        if (state.messages[i].id === id) {
          state.messages.splice(i, 1);
          break;
        }
      }
    },
    clear(state) {
      state.messages = [];
    },
  },
};

// Mixin to be imported in Vue
export default messagesStore;

import http from '../services/http';

// Locales object
const locales = {
//  $current: 'en',
//  $languages: [],
  yes: 'yes',
  no: 'no',
  $load(language) {
    return http.get(`/locale/${language}`).then((locale) => {
      Object.assign(this, locale);
      this.$callbacks.forEach((callback) => {
        callback(this);
      });
    });
  },
  $callbacks: [],
  $(key) {
    return this[key] === undefined ? key : this[key];
  },
};

const LocalesMixin = {
  data() {
    return {
      L: locales,
    };
  },
  created() {
    this.L.$callbacks.push((newLocales) => {
      this.L = Object.assign({}, newLocales);
    });
  },
};
export { LocalesMixin, locales };

// Mixin to be imported in Vue
export default LocalesMixin;

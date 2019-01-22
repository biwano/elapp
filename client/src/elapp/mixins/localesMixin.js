
// Locales object
const locales = {
//  $current: 'en',
//  $languages: [],
  yes: 'yes',
  no: 'no',
  $load(languageName, dictionnary) {
    Object.assign(this, dictionnary);
  },
  $(key) {
    return this[key] === undefined ? key : this[key];
  },
};
locales.$load('en');

const LocalesMixin = {
  created() {
    this.L = locales;
  },
};
export { LocalesMixin, locales };

// Mixin to be imported in Vue
export default LocalesMixin;

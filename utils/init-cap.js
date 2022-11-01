
const initCap = ( value = '' ) => {
    return value
      .toLowerCase()
      .replace(/(?:^|[^a-zØ-öø-ÿ])[a-zØ-öø-ÿ]/g, function (m) {
        return m.toUpperCase();
      });
  }

  module.exports = {
    initCap
  }
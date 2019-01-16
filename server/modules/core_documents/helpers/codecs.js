module.exports = {
  decodeFieldName(fieldName) {
    const fieldParts = fieldName.split('_');
    return fieldParts.length > 1 ? fieldParts[1] : fieldName;
  },
  decode(hit) {
    if (hit === null) return hit;
    const doc = {};
    Object.keys(hit).forEach((key) => {
      doc[this.decodeFieldName(key)] = hit[key];
    });
    return doc;
  },
  encodeFieldName(schemaId, fieldName) {
    return fieldName.startsWith('$') ? fieldName : `${schemaId}_${fieldName}`;
  },
  encode(doc) {
    const hit = {};
    Object.keys(doc).forEach((key) => {
      hit[this.encodeFieldName(doc.$schema, key)] = doc[key];
    });
    return hit;
  },
};

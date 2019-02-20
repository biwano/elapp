module.exports = {
  // decodes a fieldName
  decodeFieldName(fieldName) {
    const fieldParts = fieldName.split('_');
    return fieldParts.length > 1 ? fieldParts[1] : fieldName;
  },
  // decodes a document
  decode(hit) {
    if (hit === null) return hit;
    const doc = {};
    Object.keys(hit).forEach((key) => {
      doc[this.decodeFieldName(key)] = hit[key];
    });
    return doc;
  },
  // checks if a search parameter is quoted
  isQuoted(str) {
    return str[0] === "'" && str[str.length - 1] === "'";
  },
  // encodes a fieldName
  encodeFieldName(schemaId, fieldName) {
    return typeof (schemaId !== undefined)
    && typeof (fieldName === 'string') // field is a string
    && !this.isQuoted(fieldName) // not a literal
    && !fieldName.startsWith('$') // not a global attribute
      ? `${schemaId}_${fieldName}` : fieldName;
  },
  // encodes a document
  encode(doc) {
    const hit = {};
    Object.keys(doc).forEach((key) => {
      hit[this.encodeFieldName(doc.$schema, key)] = doc[key];
    });
    return hit;
  },
  // returns the schema sought for by the query
  findSchemaId(query) {
    let schemaId;
    if (query.$op === 'and') {
      // Search schemaId recursively
      query.$params.forEach((subQuery) => {
        const tmpSchemaId = this.findSchemaId(subQuery);
        if (typeof tmpSchemaId !== 'undefined') schemaId = tmpSchemaId;
      });
    } else if (query.$op === '=') {
      // Check for schema equality
      if (query.$params[0] === '$schema') {
        schemaId = query.$params[1];
      }
    }
    return schemaId;
  },
  // encodes a query by adding the schema prefix to fieldNames
  encodeQuery(query_, schemaId_) {
    const query = query_;
    let schemaId = schemaId_;
    if (typeof schemaId === 'undefined') {
      schemaId = this.findSchemaId(query.$params);
    }
    console.log(query.$params);
    query.$params.forEach((param, id) => {
      if (typeof param === 'string') { query.$params[id] = this.encodeFieldName(schemaId, param); } else query.$params[id] = this.encodeQuery(param);
    });
    return query;
  },
};

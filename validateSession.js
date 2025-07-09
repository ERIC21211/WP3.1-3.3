const fs = require('fs');
const Ajv = require('ajv');
const addFormats = require('ajv-formats'); // ✅ NEW LINE

const schema = require('./session_schema.json');
const sessionData = require('./trip1.json');

const ajv = new Ajv();
addFormats(ajv); // ✅ ENABLE FORMAT CHECKS

const validate = ajv.compile(schema);
const valid = validate(sessionData);

if (valid) {
  console.log("✅ Session is valid.");
} else {
  console.error("❌ Session is invalid:");
  console.error(validate.errors);
}

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
console.log(process.env.SuperbaseUrl);
const superbase = createClient(
  process.env.SuperbaseUrl,
  process.env.SuperbaseKey
);

module.exports = superbase;

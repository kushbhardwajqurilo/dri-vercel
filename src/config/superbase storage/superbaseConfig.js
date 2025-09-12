require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const superbase = createClient(
  process.env.SuperbaseUrl,
  process.env.SuperbaseKey
);

module.exports = superbase;

const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");
const cors = require("cors");

let dbPath = 'mongodb://localhost/graphQLTest';
const app = express();
const PORT = 8000;

//allow cross-orign request
app.use(cors());

mongoose.connect(dbPath,{"useNewUrlParser": true});

mongoose.connection.once('open', () => {
  console.log('conneted to database');
});

app.use('/graphql',graphqlHTTP({
  schema,
  graphiql:true
}));

app.listen(PORT,()=>{
  console.log(`Now listening for requests on port ${PORT}`);
});
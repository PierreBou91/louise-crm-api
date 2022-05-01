require("dotenv").config();

const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGO_URL);

async function upsertCustomFields(body) {
  var result;
  try {
    await client.connect();
    const id = body._id;
    delete body._id;
    result = await client
      .db("api-crm-mongo")
      .collection("custom_fields")
      .updateOne({ _id: id }, { $set: body }, { upsert: true });
  } catch (e) {
    console.log(e);
  } finally {
    await client.close();
  }
  return result;
}

async function deleteCustomField(body) {
  var result;
  try {
    await client.connect();
    const id = body._id;
    delete body._id;
    result = await client
      .db("api-crm-mongo")
      .collection("custom_fields")
      .updateOne({ _id: id }, { $unset: body });
  } catch (e) {
    console.log(e);
  } finally {
    await client.close();
  }
  return result;
}

module.exports = { upsertCustomFields, deleteCustomField };

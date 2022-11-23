const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
  },
  //   when create a new record in a collection, below will assign it a new ID or ObjectID, created automatically
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    // below means the client id should relate to the client model
    ref: "Client",
  },
});

module.exports = mongoose.model("Project", ProjectSchema);

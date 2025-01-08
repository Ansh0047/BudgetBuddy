const mongoose = require("mongoose");
const { Schema } = mongoose;

const TransactionSchema = new Schema({
  user : {
    type : Schema.Types.ObjectId,
    ref : 'user',
  },
  amount: Number,

  description: String ,

  date: {
    type: Date,
    default: Date.now,
  },
  
  createdAt : {
    type: Date,
    default: Date.now,
  }
  
});

module.exports = mongoose.model("transaction", TransactionSchema);

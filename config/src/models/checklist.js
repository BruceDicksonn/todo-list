const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const checklistSchema = new Schema({
    name: {type: String, required: true},
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }]
});

// o mongoose.model criará uma nova collection no banco de dados caso a mesma não exista
module.exports = mongoose.model("Checklist", checklistSchema);
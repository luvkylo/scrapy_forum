var mongoose = require("mongoose");

var Schema = mongoose.Schema;


var NoteSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    note: {
        type: String,
        required: true
    }
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
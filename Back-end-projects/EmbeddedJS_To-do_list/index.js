const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');
const itemsSchema = new mongoose.Schema({
    name:String
});
const items = mongoose.model('items', itemsSchema);

app.get('/', (req, res) => {
    items.find({}).then((found)=>{
        res.render('list', {ejes : found});
    });
});

app.post('/', (req, res) => {
    const item_n = String(req.body.added);
    if(item_n.length > 0){
        const todoele = new items({
            name: item_n
        });
        todoele.save();
    }
    res.redirect('/');
});

app.post('/delete', (req, res) => {
    const item_nn = String(req.body.checkbox1);
    items.findByIdAndRemove(item_nn).then((err)=>{
        if(!err) {
            console.log('Deleted');
            res.redirect('/');
        }
    });
});

app.listen(8800, () => {
    console.log('Server running on port 8800');
});
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Vault Dragon Test by Ricky' });
});

/* POST for store object data*/
router.post('/object', function(req, res)
{
    console.log("post method to store object data");
    const postBody = req.body;
    var key_data = Object.keys(postBody);
    var value_data = Object.values(postBody);

    if ((key_data.length != value_data.length) || (key_data.length === 0) || (value_data.length === 0))
    {
        res.set("Content-Type", "application/json");
        res.status(400).send('{"message":"Please check your JSON format."}');
        return res.end;
    }
    else
    {
        var object_array = new Array();
        var object_item = new Object();
        for (var i=0;i<key_data.length;i++)
        {
            object_item = {key:key_data[i], value:value_data[i], timestamp:new Date()};
            object_array.push(object_item);
        }

        var object_collection = mongoose.model('object_collection');
        object_collection.insertMany(object_array, function(err) {
            if (err) {
                console.error('ERROR!');
            }

            res.set("Content-Type", "application/json");
            res.send(JSON.stringify(object_array[(object_array.length - 1)]));
            return res.end;
        });
    }
});

router.get('/object/:id', function(req, res)
{
    console.log("get method to read object data");
    console.log("show id name ="+ req.params.id);

    var query_time = new Date();
    var query_object = new Object();

    if (typeof req.query.timestamp != "undefined")
    {
        console.log("timestamp = "+decodeURIComponent(req.query.timestamp));
        var regex1 = RegExp(/[^0-9]/);
        if (regex1.test(req.query.timestamp) != true)
        {
            try{
                query_time.setTime((decodeURIComponent(req.query.timestamp) * 1000));
            }
            catch (e) {
                console.log(e);
                res.set("Content-Type", "application/json");
                res.status(400).send('{"message":"timestamp format was wrong!!"}');
                return res.end;
            }
            console.log("time stamp = "+query_time.toISOString());
            query_object = {key:req.params.id,
                timestamp:{$lte:query_time}};
        }
        else
        {
            res.set("Content-Type", "application/json");
            res.status(400).send('{"message":"timestamp format was wrong!!"}');
            return res.end;
        }
    }
    else
    {
        query_object = {key:req.params.id};
    }
    var object_collection = mongoose.model('object_collection');
    object_collection.findOne(query_object, {_id: 0, value: 1}, {sort: {timestamp: -1}}, function(err, object_data){
        if (err) {
            console.log("error issue: "+err);
        }

        if ((typeof object_data != "undefined") && (object_data != null))
        {
            res.set("Content-Type", "application/json");
            res.send(JSON.stringify(object_data));
            return res.end;
        }
        else
        {
            res.set("Content-Type", "application/json");
            res.send('{"message":"We can\'t get the value of '+req.params.id+' by this timestamp!!"}');
            return res.end;
        }
    });
});

module.exports = router;

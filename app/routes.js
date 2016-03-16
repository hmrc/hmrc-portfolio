var express = require('express'),
    router  = express.Router(),
    _       = require('underscore');

/*
  A way to force the ordering of the themes.
*/
var theme_order = [
      'Business tax',
      'Personal tax',
      'Platforms'
    ];


/*
  A way to force the ordering of the phases.
*/
var phase_order = ['backlog','Discovery','Alpha','Beta', 'Live'];

/*
  A function to gather the data by
  'phase' and then 'facing' so the
  index.html can spit them out.
*/
function indexify(data)
{
  var new_data = {};
  _.each(data, function(value, key, list)
  {
    var item = _.groupBy(value,'phase');
    new_data[key] = {};
    _.each(item, function(v,k,l)
    {
      var piece = _.groupBy(v,'facing');
      new_data[key][k] = piece;
    });
  });
  return new_data;
}

/*
  - - - - - - - - - -  INDEX PAGE - - - - - - - - - -
*/
router.get('/theme', function (req, res)
{
  var data = _.groupBy(req.app.locals.data, 'theme');
  var new_data = indexify(data);
  var phases = _.countBy(req.app.locals.data, 'phase');
  res.render('index', {
    "data":new_data,
    "counts":phases,
    "view":"theme",
    "theme_order":theme_order,
    "phase_order":phase_order
    }
  );
});

/*
  - - - - - - - - - -  LOCATION INDEX PAGE - - - - - - - - - -
*/
router.get('/', function (req, res)
{
  var data = _.groupBy(req.app.locals.data, 'location');
  var new_data = indexify(data);

  var loc_order = [];
  _.each(data, function(value, key, list)
  {
    loc_order.push(key);
  });
  loc_order.sort();

  var phases = _.countBy(req.app.locals.data, 'phase');
  res.render('index', {
    "data":new_data,
    "counts":phases,
    "view":"location",
    "theme_order":loc_order,
    "phase_order":phase_order
  });
});



/*
  - - - - - - - - - -  PROJECT PAGE - - - - - - - - - -
*/
router.get('/projects/:id/:slug', function (req, res)
{
  console.log(req.params.id);
  console.log(req.app.locals.data);

  var data = _.findWhere(req.app.locals.data, {id:(req.params.id)});
  res.render('project', {
    "data":data
  });

});

/*
  - - - - - - - - - -  ALL THE DATA AS JSON - - - - - - - - - -
*/

router.get('/api', function (req, res) {
  console.log(req.app.locals.data);
  res.json(req.app.locals.data);
});

router.get('/api/:id', function (req, res) {
  var data = _.findWhere(req.app.locals.data, {id: (parseInt(req.params.id))});
  if (data) {
    res.json(data);
  } else {
    res.json({error: 'ID not found'});
  }
});

module.exports = router;
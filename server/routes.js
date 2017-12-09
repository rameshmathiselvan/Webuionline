/*
// Created by Academy on 20/10/16
*/
var HttpStatus = require('http-status');

var StudentController = require('./controllers/StudentController');
var CountryController = require('./controllers/master/CountryController');
var StateController = require('./controllers/master/StateController');
var CityController = require('./controllers/master/CityController');
var CollegeController = require('./controllers/CollegeController');
var HostelController = require('./controllers/HostelController');

module.exports = function (router) {

    router.all('/', function (req, res) {
        res.sendFile('index.html', {
            root: './public/'
        });
    });

    router.all('/isServerRunning', function (req, res) {
        res.status(200).json({
            code: 200,
            data: "Server Running..."
        })
    });

    router.all('/getTime', function (req, res) {
        res.status(200).json({
            code: 200,
            data: {
                date: new Date().toUTCString()
            }
        })
    });

    /*
        Add your routes here
    */

    // Student routes
    router.post('/college/:collegeid/student', StudentController.save);
    router.get('/students', StudentController.list);
    router.get('/student/:id', StudentController.get);
    router.get('/college/:id/students', StudentController.getByCollege);
    router.put('/student/:id', StudentController.update);
    router.put('/student/:id/activate', StudentController.activate);
    router.put('/student/:id/deactivate', StudentController.deactivate);

    // Country routes
    router.post('/country', CountryController.save);
    router.get('/countries', CountryController.list);
    router.get('/activeCountries', CountryController.activeList);
    router.put('/country/:id', CountryController.update);
    router.put('/country/:id/activate', CountryController.activate);
    router.put('/country/:id/deactivate', CountryController.deactivate);

    // State routes
    router.post('/state', StateController.save);
    router.get('/states', StateController.list);
    router.get('/activeStates', StateController.activeList);
    router.get('/country/:id/states', StateController.getByCountry);
    router.put('/state/:id', StateController.update);
    router.put('/state/:id/activate', StateController.activate);
    router.put('/state/:id/deactivate', StateController.deactivate);

    // College routes
    router.post('/college', CollegeController.save);
    router.get('/colleges', CollegeController.list);
    router.get('/activeColleges', CollegeController.activeList);
    router.get('/country/:id/colleges', CollegeController.getByCountry);
    router.get('/college/:id', CollegeController.get);
    router.put('/college/:id', CollegeController.update);
    router.put('/college/:id/activate', CollegeController.activate);
    router.put('/college/:id/deactivate', CollegeController.deactivate);

    // Hostel routes
    router.post('/hostel', HostelController.save);
    router.get('/hostels', HostelController.list);
    router.get('/college/:id/activeHostels', HostelController.activeListByCollege);
    router.get('/college/:id/hostels', HostelController.getByCollege);
    router.get('/hostel/:id', HostelController.get);
    router.put('/hostel/:id', HostelController.update);
    router.put('/hostel/:id/activate', HostelController.activate);
    router.put('/hostel/:id/deactivate', HostelController.deactivate);

    // City routes
    router.post('/city', CityController.save);
    router.get('/cities', CityController.list);
    router.get('/activeCities', CityController.activeList);
    router.get('/state/:id/cities', CityController.getByState);
    router.get('/city/:id', CityController.get);
    router.put('/city/:id', CityController.update);
    router.put('/city/:id/activate', CityController.activate);
    router.put('/city/:id/deactivate', CityController.deactivate);

};
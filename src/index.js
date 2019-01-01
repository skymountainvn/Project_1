const app = require('./app');
require('./startDatabase');
app.listen(3000, () => console.log('Server started!'));
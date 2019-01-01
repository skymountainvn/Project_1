const User = require ('../src/models/user.model.js');
const Story = require('../src/models/story.model');
const Comment = require('../src/models/comment.model');
require('../src/startDatabase');

beforeEach('Remove all data before each Test', async () => {
    await User.remove();
    await Story.remove();
    await Comment.remove();
});


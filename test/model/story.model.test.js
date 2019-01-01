const assert = require('assert');
const { compare } = require('bcrypt');
const User = require('../../src/models/user.model');
const Story = require('../../src/models/story.model');

describe('Create story for user', () => {
    let _id;
    beforeEach('Create new user for test.', async () => {
        const user = await User.signUp('a@gmail.com', '123', 'teo', '321');
        _id = user._id; 
    });

    it('Can create new story', async () => {
        const story = new Story({ content: 'abcd', author: _id });
        await story.save();
        const newStory = await Story.findById(story._id).populate('author');
        // console.log(newStory);
        assert.equal(newStory.content,'abcd');
        const { name, phone, email} = newStory.author;
        assert.equal(name,'teo');
        assert.equal(email, 'a@gmail.com');
    });

    it('Can create new story in stories array', async () => {
        const story = new Story({ content: 'abcd', author: _id });
        await story.save();
        await User.findByIdAndUpdate(_id, {$addToSet: { stories: story._id } });
        const newStory = await Story.findById(story._id).populate('author');
        // console.log(newStory);
        assert.equal(newStory.content,'abcd');
        const { name, phone, email} = newStory.author;
        assert.equal(name,'teo');
        assert.equal(email, 'a@gmail.com');
        const user = await User.findById(_id).populate('stories');
        assert.equal(user.stories[0].content, 'abcd');
    });

    it('Can add new story with static method', async () => {
        await Story.createStory(_id,'asdasd');
        const story = await Story.findOne({ }).populate('author');
        assert.equal(story.author.name, 'teo');
        const user = await User.findById(_id).populate('stories');
        assert.equal(user.stories[0].content, 'asdasd');
    });

    it('Cannot add new story with wrong idUser ', async () => {
       try {
           await Story.createStory('x','asd');
       } catch (error) {
        //    console.log(error);
           assert.equal(error.code,'CANNOT_FIND_USER')
       }
    });
});
describe('Remove Story', () => {
    let idUser1, idUser2, idStory;
    beforeEach('Create new user for test.', async () => {
        const user1 = await User.signUp('a@gmail.com', '123', 'teo', '321');
        const user2 = await User.signUp('b@gmail.com', '123', 'ty', '123');
        idUser1 = user1._id; 
        idUser2 = user2._id;
        const story = await Story.createStory(idUser1, 'abcd');
        idStory = story._id;
    });

    it('Can remove story', async () => {
        await Story.removeStory(idUser1, idStory);
        const storyCount = await Story.count({});
        assert.equal(storyCount, 0);
        const user = await User.findById(idUser1);
        assert.equal(user.stories.length, 0);
    });

    it('Cannot remove story with wrong storyID', async() => {
        try {
            await Story.removeStory(idUser1,'abcd');
            throw new Error('Wrong at remove with wrong storyID');
        } catch (err) {
            assert.equal(err.code,'CANNOT_FIND_STORY');
        }
    });


    it('Cannot remove story of other', async() => {
        try {
            await Story.removeStory(idUser2,idStory);
            throw new Error('Wrong at Cannot remove story of other');
        } catch (err) {
            assert.equal(err.code,'CANNOT_FIND_STORY');
        };
    });
});

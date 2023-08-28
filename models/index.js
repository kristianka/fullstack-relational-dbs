const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readinglist')
const Session = require('./session')

User.hasMany(Blog)
Blog.belongsTo(User)

Blog.belongsToMany(User, { through: ReadingList, as: 'readers' })
User.belongsToMany(Blog, { through: ReadingList, as: 'entries' })
Session.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
    Blog, User, ReadingList
}
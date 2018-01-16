const Sequelize = require('sequelize');
const sequelize = new Sequelize('sql11216049', 'sql11216049', 'KyjZYlWzcG', {
    host: 'sql11.freemysqlhosting.net',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const User = sequelize.define('user', {
    name: { type: Sequelize.STRING, allowNull: false },
    surname: { type: Sequelize.STRING, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false, unique: true },
    isAdmin: { type: Sequelize.BOOLEAN, allowNull: false }
});

const Questionnaire = sequelize.define('questionnaire', {
    title: { type: Sequelize.STRING, allowNull: false }
});

const Question = sequelize.define('question', {
    question: { type: Sequelize.STRING, allowNull: false },
    type: { type: Sequelize.INTEGER, allowNull: false }
});
Question.Questionnaire = Question.belongsTo(Questionnaire, { foreignKey: { allowNull: false } });

const Choice = sequelize.define('choice', {
    answer: { type: Sequelize.STRING, allowNull: false }
});
Choice.Question = Choice.belongsTo(Question, { foreignKey: { allowNull: false } });

const Answer = sequelize.define('answer', {
    answerText: { type: Sequelize.STRING, allowNull: true },
    answerYesNo: { type: Sequelize.BOOLEAN, allowNull: true }
});
Answer.Choice = Answer.belongsTo(Choice, { as: 'answerSingle', foreignKey: { allowNull: true } });
Answer.Question = Answer.belongsTo(Question, { foreignKey: { allowNull: false } });
Answer.Questionnaire = Answer.belongsTo(Questionnaire, { foreignKey: { allowNull: false } });
Answer.User = Answer.belongsTo(User, { foreignKey: { allowNull: false } });

const AnswerMultiple = sequelize.define('answerMultiple', {});
AnswerMultiple.Choice = AnswerMultiple.belongsTo(Choice, { foreignKey: { allowNull: false } });
AnswerMultiple.Answer = AnswerMultiple.belongsTo(Answer, { foreignKey: { allowNull: false } });


User.Answers = User.hasMany(Answer);
Questionnaire.Questions = Questionnaire.hasMany(Question);
Question.Choices = Question.hasMany(Choice);
Answer.AnswerMultipleChoices = Answer.hasMany(AnswerMultiple);

sequelize.authenticate()
    .then(() => {
        console.log("Connected to database");
        sequelize.sync()
            .then(() => {
                console.log("Database is set up");
            })
            .catch((error) => {
                console.error("Database setup error: " + error);
                process.exit(1);
            });
    })
    .catch(err => {
        console.error("Error connecting to database: " + err);
        process.exit(1);
    });

module.exports = {
    sequelize,
    User,
    Questionnaire,
    Question,
    Choice,
    Answer,
    AnswerMultiple
}
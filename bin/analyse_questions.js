const fs = require('fs')
const language = require('@google-cloud/language')
const questions = require('../models/questions.json')

const fetchTextAnalysis = async (text) => {
  const client = new language.LanguageServiceClient()
  const document = { content: text, type: 'PLAIN_TEXT', language: 'EN' }
  const [sentiment] = await client.analyzeSentiment({ document })
  const [classification] = await client.classifyText({ document })
  return { sentiment, classification }
}

const analyseQuestions = async (questions) => {
  const questionsImmutable = [ ...questions ]
  for(const q of questionsImmutable){
    for(const a of q.answers){
      const res = await fetchTextAnalysis(a.answer)
      a.sentiment = res.sentiment
      a.categories = res.classification.categories
    }
  }
  return questionsImmutable
}

analyseQuestions(questions)
  .then((res) => fs.writeFileSync('./models/questions_analysed.json', JSON.stringify(res)))

const fs = require('fs')
const express = require('express')
const questionsAnalysed = require('./models/questions_analysed.json')

const server = express()
server.use(require('cors')())

const viewIndex = fs.readFileSync('./view/index.html').toString()

const viewHtmlSentiment = (sentiment) => {
  const { score, magnitude } = sentiment.documentSentiment
  const verb = score === 0 ? 'Neutral' : score > 0 ? 'Positive' : 'Negative'
  return `<div class="sentiment--${verb.toLowerCase()}">${verb} ${score}<br/>Magnitude ${magnitude}</div>`
}

const viewHtmlCategories = (categories) => {
  return categories.map(cat => `${cat.name} <small>(${cat.confidence})</small><br/>`)

}

const viewHtmlTableRowResults = (answers) => {
  return answers.map(a => `
    <tr>
      <td>${a.answer}</td>
      <td>${viewHtmlSentiment(a.sentiment)}</td>
      <td>${viewHtmlCategories(a.categories)}</td>
    </tr>
  `).join('')
}

server.get('/:questionNumber', async (req,res) => {
  const index = req.params.questionNumber - 1
  const question = questionsAnalysed[ index ]
  const view = viewIndex
    .replace('%%question%%', question.question)
    .replace('%%tableRowResults%%', viewHtmlTableRowResults(question.answers))

  res.send(view)
})

server.get('/', async (req,res) => {
  res.redirect('/1')
})

server.listen(process.env.PORT, () => {
  console.log(`server listning on port ${process.env.PORT}`)
})

const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/search?source=search-page&q=israel',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/international',
        base: '',
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/israel-hamas-war',
        base: 'https://www.telegraph.co.uk',
    },
    {
        name: 'nyt',
        address: 'https://www.nytimes.com/news-event/israel-hamas-gaza',
        base: '',
    },
    {
        name: 'latimes',
        address: 'https://www.latimes.com/world-nation',
        base: '',
    },
    {
        name: 'smh',
        address: 'https://www.smh.com.au/world/middle-east',
        base: 'https://www.smh.com.au',
    },

    {
        name: 'bbc',
        address: 'https://www.bbc.com/news/topics/c2vdnvdg6xxt',
        base: 'https://www.bbc.co.uk',
    },
    {
        name: 'es',
        address: 'https://www.standard.co.uk/news/world',
        base: 'https://www.standard.co.uk'
    },
    {
        name: 'sun',
        address: 'https://www.thesun.co.uk/news/worldnews/',
        base: ''
    },
    {
        name: 'dm',
        address: 'https://www.dailymail.co.uk/home/latest/index.html#news',
        base: ''
    },
    {
        name: 'nyp',
        address: 'https://nypost.com/news/',
        base: ''
    }
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("Israel")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })

        })
})

app.get('/', (req, res) => {
    res.json('Welcome to my Israel News API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base


    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("Israel")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))

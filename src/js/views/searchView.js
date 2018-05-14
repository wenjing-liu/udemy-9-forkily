import axios from 'axios'

async function getResults(query) {
    const proxy = 'https://cors-anywhere.herokuapp.com/'
    const key = '5213478da3fc522261f69e917c6e99f8'
    try {
        const res = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${query}`)
        const recipes = res.data.recipes
        console.log(recipes)
    } catch (error) {
        alert(error)
    }
    
}

getResults('pizza');

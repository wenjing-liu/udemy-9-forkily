import axios from 'axios'
export default class Search {
    constructor(query) {
        this.query = query
    }
    async getResults() {
        const proxy = 'https://cors-anywhere.herokuapp.com/'
        const key = '5213478da3fc522261f69e917c6e99f8'
        try {
            const res = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`)
            this.result = res.data.recipes
        } catch (error) {
            alert(error)
        }
        
    } 
}
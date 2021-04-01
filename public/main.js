const deleteText = document.querySelectorAll('.fa-trash')
const thumbText = document.querySelectorAll('.fa-thumbs-up')

Array.from(deleteText).forEach((element)=>{
    element.addEventListener('click', deleteRecipe)
})

Array.from(thumbText).forEach((element)=>{
    element.addEventListener('click', addLike)
})

async function deleteRecipe(){
    const name = this.parentNode.childNodes[1].innerText
    const author = this.parentNode.childNodes[3].innerText
    const link = this.parentNode.childNodes[5].innerText
    try{
        const response = await fetch('deleteRecipe', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'recipeName': name,
              'recipeAuthor': author,
              'link': link
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function addLike(){
    const name = this.parentNode.childNodes[1].innerText
    const author = this.parentNode.childNodes[3].innerText
    const link = this.parentNode.childNodes[5].innerText
    const likes = Number(this.parentNode.childNodes[7].innerText)
    try{
        const response = await fetch('addOneLike', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'recipeName': name,
                'recipeAuthor': author,
                'link': link,
                'likes': likes
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}


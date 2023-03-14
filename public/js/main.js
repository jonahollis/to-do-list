const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

async function deleteItem() {
    const row = this.closest('tr'); // find the closest parent <tr> element
    const itemText = row.querySelector('td:first-child').innerText; // get the text from the first <td> element in the row
    try {
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        });
        const data = await response.json();
        console.log(data);
        location.reload()
    } catch (err) {
        console.log(err);
    }
}

async function markComplete(){
    // const itemText = this.parentNode.childNodes[1].innerText
    const row = this.closest('tr'); // find the closest parent <tr> element
    const itemText = row.querySelector('td:first-child').innerText; // get the text from the first <td> element in the row
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    // const itemText = this.parentNode.childNodes[1].innerText
    const row = this.closest('tr'); // find the closest parent <tr> element
    const itemText = row.querySelector('td:first-child').innerText; // get the text from the first <td> element in the row
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}
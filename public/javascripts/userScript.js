let tableData = document.querySelectorAll('.td')
let form = document.getElementById('edit')
let button = document.getElementById('SubmitButton')
let disabled = (event) => {
    event.preventDefault(disabled);

}
let Edit = () => {
    tableData.forEach((element) => {
        element.contentEditable = true;
        element.style.backgroundColor = 'white'
        element.style.color = 'black'
        element.style.fontSize = 'larger'
    });
    form.addEventListener('submit', disabled);
    button.onclick = submit
    button.innerHTML = 'Submit changes'

};

let submit = () => {
    let all = document.getElementsByTagName('input')

    for (let i = 0; i < all.length; i++) {
        const element = all[i];
        element.type = 'text'

    }

    let cname = document.querySelector('#hname').innerText
    let caddress = document.querySelector('#haddress').innerText
    let cphone = document.querySelector('#hphone').innerText
    let cbirth = document.querySelector('#hbirth').innerText

    document.getElementById('cname').value = cname;
    document.getElementById('caddress').value = caddress;
    document.getElementById('cphone').value = cphone;
    document.getElementById('cbirth').value = cbirth;

    form.removeEventListener('submit', disabled);
    form.action = '/edited'
    button.removeEventListener('click', Edit)
    button.type = 'submit'
    console.log('successful')
}
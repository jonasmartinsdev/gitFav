import { GithubUser } from "./GithubUser.js";

// classe qie vai conter a lógica dos dados
// como os dados serão estruturados
class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);

    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@gitfav:')) || []
  }

  save() {
    localStorage.setItem('@gitfav:', JSON.stringify(this.entries))
    this.notFavority()
  }

 async add(username) {
    try {
      const userExists = this.entries.find(entry => entry.login === username);

      if(userExists) {
        throw new Error('Usuário já cadastrado!')
      }

      const user = await GithubUser.search(username);

      if(user.login === undefined) {
        throw new Error('Usuário já cadastrado!')
      }
   
      this.entries = [user, ...this.entries]
      
      this.update()
      this.save()
      
    } catch (error) {
      alert(error.message);
    }
  }

  delete(user) {
    const filteredEntities = this.entries.filter((entries) => entries.login !==  user.login)
    this.entries = filteredEntities

    this.update()
    this.save()
   }
}

// classe que vai cria a visualização e eventos do HTML

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.tbody = document.querySelector('table tbody')

    this.update()
    this.onadd()
    this.notFavority()
  }

  onadd() {
    const addButton = this.root.querySelector('#search button')
     addButton.onclick = () => {
       const { value } = this.root.querySelector('#search input')
       this.add(value)
     }
  }

  update() {
    this.removeAllTr()
    
    this.entries.forEach((user) => {
     const row = this.createRow()

     row.querySelector('.user img').src = `https://github.com/${user.login}.png`
     row.querySelector('.user a').href = `https://github.com/${user.login}`
     row.querySelector('.user a p').textContent = user.name
     row.querySelector('.user a span').textContent = `/${user.login}`
     row.querySelector('.repositories').textContent = user.public_repos
     row.querySelector('.followers').textContent = user.followers

     row.querySelector('.remove').addEventListener('click', () => {
       const isOk = confirm('Tem ceterteza que deseja remover essa linha?')
       if(isOk) {
         this.delete(user)
       }
     })


     this.tbody.append(row);
    })

  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
        <td class="user">
        <img src="https://github.com/maykbrito.png" alt="Imagem avatar ">
        <a href="https://github.com/maykbrito" target="_blank">
          <p>Mayk Brito</p>
          <span>maykbrito</span>
        </a>
      </td>
      <td class="repositories">
        123
      </td>
      <td class="followers">
        1234
      </td>
      <td>
        <button class="remove">Remover</button>
      </td>
    `

    return tr
  }

  notFavority() {
    if(this.entries <= 0) {
      this.root.querySelector('.not-favorite').classList.remove('hide')
    } else {
      this.root.querySelector('.not-favorite').classList.add('hide')

    }
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr')
    .forEach((tr) => {
      tr.remove();
    })
  }
}


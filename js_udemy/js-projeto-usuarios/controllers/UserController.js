class UserController {

  constructor(formID, formIdUpdate, tableId){

    this.formEl = document.getElementById(formID)
    this.formUpdateEl = document.getElementById(formIdUpdate)
    this.tableId = document.getElementById(tableId)
    
    this.onSubmit()
    this.onEdit()
  }

  onEdit(){
    document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e => {
      this.showPanelCreate()
    });

    this.formUpdateEl.addEventListener("submit", e => {
      e.preventDefault()
      let btn = this.formUpdateEl.querySelector("[type=submit]")
      btn.disabled = true

      let values = this.getValues(this.formUpdateEl)
      let index = this.formUpdateEl.dataset.trIndex

      let tr = this.tableId.rows[index]
      let userOld = JSON.parse(tr.dataset.user)
      let result = Object.assign({}, userOld, values)


      tr.dataset.user = JSON.stringify(result)


      this.getPhoto(this.formUpdateEl).then((content) => {
        if(!values.photo) {
          result._photo = userOld._photo
        } else {
          result._photo = content
        }

        tr.innerHTML = `
          <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
          <td>${result._name}</td>
          <td>${result._email}</td>
          <td>${result._admin ? 'Sim' : 'Não'}</td>
          <td>${Utils.dateFormat(result._register)}</td>
          <td>
            <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
          </td>`
  
        this.addEventsTr(tr)
        this.updateCount()
        
        this.formUpdateEl.reset()
        btn.disabled = false
        this.showPanelCreate()

      }, (e) => { console.log(e)})

    })
  }

  onSubmit() {
    this.formEl.addEventListener("submit", (e) => {
      e.preventDefault()

      let btn = this.formEl.querySelector("[type=submit]")
      btn.disabled = true

      let values = this.getValues(this.formEl)
      if(!values) return false

      this.getPhoto(this.formEl).then((content) => {
        values.photo = content
        this.addLine(values)
        this.formEl.reset()
        btn.disabled = false
      }, (e) => { console.log(e)})
    })
  }

  getPhoto(formEl) {
    return new Promise((resolve,reject) => {
      let fileReader = new FileReader()
      let elements = [...formEl.elements].filter(item => {
        if (item.name === 'photo') {
          return item
        }
      })
      let file = elements[0].files[0]
      fileReader.onload = () => {
        resolve(fileReader.result)
      }
      fileReader.onerror = () => {
        reject(e)
      }
      file ? fileReader.readAsDataURL(file) : resolve("#")
    })

  }

  getValues(formEl) {
    let user = {}
    let values = [...formEl.elements]
    let isValid = true

     if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) {
      
      field.parentElement.classList.add('has-error')
      isValid = false
     }

    values.forEach(function (field) {
      if(field.name === "gender"){
        if(field.checked) {
          user[field.name] = field.value
        } 
      } else if (field.name == "admin"){
        user[field.name] = field.checked
      } else {
        user[field.name] = field.value
      }
    });

    if(!isValid) return false
  
    return new User(user.name, user.gender, user.birth, user.country, user.email, user.password, user.photo, user.admin)
  }

  
//adicao de linha tabela
  addLine(dataUser) {
    let tr = document.createElement('tr')
    tr.dataset.user = JSON.stringify(dataUser)

    tr.innerHTML = `
      <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
      <td>${dataUser.name}</td>
      <td>${dataUser.email}</td>
      <td>${dataUser.admin ? 'Sim' : 'Não'}</td>
      <td>${Utils.dateFormat(dataUser.register)}</td>
      <td>
        <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
        <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
      </td>`

      this.addEventsTr(tr)

    this.tableId.appendChild(tr);
    this.updateCount()
  }

  addEventsTr(tr) {
    tr.querySelector("#btn-delete").addEventListener("click", e => {

      if(confirm("Deseja realmente excluir?")) {
        tr.remove()
      }
      this.updateCount()

    })


    tr.querySelector(".btn-edit").addEventListener("click", e => {
      // atualizar a lista dataUser e trazer p editar
      let json = JSON.parse(tr.dataset.user)
      //uptade
      this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex
      // trazendo fields novamente
      for (let name in json) {
        let field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "")+ "]")
        if(field) {
          if(field.typep == 'file') continue
          switch (field.typep) {
            case 'file':
              continue
              break;
            case 'radio':
              field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "")+ "][value=" + json[name] + "]")
              field.checked = true
              break;
            case 'checked':
              field.checked = json[name]
            default:
              field.value = json[name]
          }

        } 
      }
      this.formUpdateEl.querySelector(".photo").src = json._photo
      this.showPanelUpdate()
    })
  }

  showPanelCreate() {
    document.querySelector("#box-user-create").style.display = "block"
    document.querySelector("#box-user-update").style.display = "none"
  }
  
  showPanelUpdate() {
    document.querySelector("#box-user-create").style.display = "none"
    document.querySelector("#box-user-update").style.display = "block"
  }

  // Atualizar numeros de cadastrados
  updateCount() {
    let numberUsers = 0
    let usersAdmin = 0
    let tableCount = [...this.tableId.children]

    tableCount.forEach(tr => {

      numberUsers++
      let user = JSON.parse(tr.dataset.user)
      if(user._admin) usersAdmin++
    });

    document.querySelector("#number-users").innerHTML = numberUsers
    document.querySelector("#number-users-admin").innerHTML = usersAdmin

  }


}



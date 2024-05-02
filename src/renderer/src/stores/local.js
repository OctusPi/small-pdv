import { ref } from 'vue'

const admin = ref(localStorage.getItem('admin'))

function setAdmin(adminValue) {
    localStorage.setItem('admin', JSON.stringify(adminValue))
    admin.value = JSON.stringify(adminValue)
}

function getAdmin() {
    try {
      return JSON.parse(admin.value);
    } catch (e) {
      console.log('Fail parse string to JSON')
      return null
    }
  }

function clear(){
    localStorage.removeItem('admin')
    admin.value = null
}

export default {
    admin: admin.value,
    setAdmin,
    getAdmin,
    clear
}

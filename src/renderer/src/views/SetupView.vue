<script setup>
import { ref } from 'vue'
import ctrl from '../services/controller'
import masks from "@renderer/utils/masks.js"

const page = ref({})

const ipcHandle = () => {
  
}
</script>

<template>
  <main class="cotainer-setup d-flex justify-content-center align-items-center">
    <section class="box box-setup p-4 m-4">
      <header class="text-center">
        <img src="./../assets/icon.png" width="80" />
        <h1 class="fw-bold fs-5">Bem Vindo ao SmallPDVF</h1>
        <p class="small text-secondary mb-4">
          Agora faremos a configuração inicial para utilização do sistema.
        </p>
      </header>

      <div class="company-pic text-center mb-4 d-flex align-items-center justify-content-center">
        <span class="small text-secondary d-block">Selecionar logomarca</span>
        <input type="file" name="pic" class="company-pic-input" />
      </div>
      <form class="form-row g-3 mb-3" @submit.prevent="elevateAccess">
        <div class="col-12">
          <label for="company" class="form-label text-start">Nome da Empresa</label>
          <input
            id="company"
            v-model="page.company"
            type="text"
            class="form-control"
            placeholder="Digite o nome da sua Empresa"
          />
        </div>
        <div class="col-12">
          <label for="address" class="form-label text-start">Endereço</label>
          <input
            type="text"
            class="form-control"
            id="address"
            placeholder="Logradouro, n - Bairro, Cidade"
            v-model="address"
          />
        </div>
        <div class="col-12">
          <label for="phone" class="form-label text-start">Telefone</label>
          <input
            type="text"
            class="form-control"
            id="phone"
            placeholder="(00)9.0000-0000"
            v-maska:[masks.maskphone]
            v-model="phone"
          />
        </div>
        <div class="col-12">
          <label for="admpass" class="form-label text-start">Senha Administrador</label>
          <input type="password" class="form-control" id="admpass" v-model="page.admpass" />
        </div>

        <footer class="text-center mt-4">
          <button @click="ipcHandle" type="submit" class="btn btn-setup">
            <i class="bi bi-arrow-right"></i>
          </button>
        </footer>
      </form>
    </section>
  </main>
</template>

<style scoped>
.cotainer-setup {
  width: 100%;
}
.box-setup {
  width: 400px;
}

.company-pic {
  height: 140px;
  background-color: var(--color-fundo);
  border-radius: 10px;
  border: 2px dashed var(--color-input-border);
  position: relative;
}

.company-pic-input {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  cursor: pointer;
  opacity: 0;
}

.btn-setup {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  background-color: var(--color-base);
  color: white;
}

.form-control {
  font-size: 1rem;
}
</style>

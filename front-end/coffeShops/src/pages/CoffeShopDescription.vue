<template>
  <div class="q-pa-md cmp-specs">
    <q-form @submit="onSubmit" @reset="onReset" class="q-pa-lg cmp-specs__form">
      <q-input
        filled
        :disable="!this.isLoggedIn"
        v-model="name"
        label="Coffee Shop Name *"
        hint="Name of the coffee shop"
        lazy-rules
        class="q-mb-md"
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <q-input
        filled
        class="q-mb-md"
        :disable="!this.isLoggedIn"
        v-model="adress"
        label="Address *"
        hint="Adress of the coffee shop"
        lazy-rules
        :rules="[(val) => (val !== null && val !== '') || 'Please type address']"
      />

      <q-input
        filled
        class="q-mb-md"
        :disable="!this.isLoggedIn"
        v-model="atmosphere"
        label="Atmosphere *"
        hint="Cozy, Modern, etc."
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />

      <q-input
        filled
        class="q-mb-md"
        :disable="!this.isLoggedIn"
        v-model="menu"
        label="Menu *"
        hint="Espresso, Latte, etc."
        lazy-rules
        :rules="[
          (val) => (val !== null && val !== '') || 'Please add menu items',
        ]"
      />

      <div class="cmp-specs__form-buttons">
        <q-btn
          label="Submit"
          type="submit"
          color="primary"
          :disable="!this.isLoggedIn"
        />
        <q-btn
          :disable="!this.isLoggedIn"
          label="Reset"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
      <div
        v-if="!this.isLoggedIn"
        class="cmp-specs__form-message q-mt-md flex flex-center"
        style="color: red"
      >
        Not Authenticated. Please Login To Edit Coffee Shop.
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
import { CoffeShopData } from '../components/models';
import { defineComponent, onMounted, computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute } from 'vue-router';
import Axios, { AxiosResponse, AxiosError } from 'axios';
import Utils from '../components/utils';

export default defineComponent({
  name: 'CoffeShopDescription',
  setup() {
    const route = useRoute();
    const params = computed(() => route.params);
    const paramsString = params.value.coffeShop_id.toString();
    const $q = useQuasar();
    let name = ref('');
    let adress = ref('');
    let atmosphere = ref('');
    let menu = ref('');
    let isLoggedIn = Utils.getExpiringLocalStorage('jwt-auth') ? true : false;

    let coffeShopResults;
    onMounted(async () => {
      coffeShopResults = (
        await Axios.get(Utils.URLs.coffeShop.getCoffeShop(paramsString), {
          withCredentials: false,
        })
      ).data as CoffeShopData;
      name.value = coffeShopResults.name;
      adress.value = coffeShopResults.adress;
      atmosphere.value = coffeShopResults.atmosphere;
      menu.value = coffeShopResults.menu;
    });

    return {
      onMounted,
      coffeShopResults,
      name,
      adress,
      atmosphere,
      menu,
      isLoggedIn,
      onSubmit() {
        const editCoffeShopBody: CoffeShopData = {
          name: name.value,
          adress: adress.value,
          atmosphere: atmosphere.value,
          menu: menu.value,
        };
        const token = Utils.getExpiringLocalStorage('jwt-auth');
        Utils.setDefaultHeader(token);
        void Axios.put(Utils.URLs.coffeShop.editCoffeShop(paramsString), editCoffeShopBody, {
          withCredentials: true,
        })
          .then((response: AxiosResponse) => {
            $q.notify({
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: response.data.message,
            });
          })
          .catch((err: AxiosError) => {
            $q.notify({
              color: 'red-8',
              textColor: 'white',
              icon: 'error',
              message: err.response?.data.message,
            });
          });
      },
      onReset() {
        name.value = '';
        adress.value = '';
        atmosphere.value = '';
        menu.value = '';
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.cmp-specs {
  display: flex;
  justify-content: center;
  align-content: center;

  &__form {
    width: 80%;
    @media (min-width: 1368px) {
      width: 25%;
      padding: 24px;
      margin-top: 18px;
      box-shadow: 0px 0px 18px 1px #d4d4d4;
      border-radius: 6px;
    }
    &-buttons {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
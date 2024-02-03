<template>
  <q-page class="row items-center justify-evenly" v-if="carResponse.length > 0">
    <div class="cmp-coffeShop-grid">
      <coffeShop-card v-for="coffeShop in carResponse" :key="coffeShop.id" :coffeShop="coffeShop"> </coffeShop-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import CoffeShopCard from '../components/CoffeShopCard.vue';
import Axios from 'axios';
import { CoffeShop } from '../components/models';
import Utils from '../components/utils';

export default defineComponent({
  name: 'PageIndex',
  components: { CoffeShopCard },
  setup() {
    let carResponse = ref([] as CoffeShop[]);
    let current = ref(1);
    onMounted(async () => {
      carResponse.value = (
        await Axios.get(Utils.URLs.coffeShop.getAll, { withCredentials: false })
      ).data as CoffeShop[];
    });
    return { carResponse, onMounted, current };
  },
});
</script>

<style lang="scss" scoped>
.cmp-coffeShop-grid {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}
</style>

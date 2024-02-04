<template>
  <div class="q-pa-md row items-start q-gutter-md cmp-coffeShop">
    <q-card class="cmp-coffeshop__element">
      <q-card-section>
        <div class="text-h6 q-mb-xs text-center">
          {{ coffeShop.data.name }} {{ coffeShop.data.model }}
        </div>
        <div class="row no-wrap items-center">

        </div>
      </q-card-section>
      <img class="q-pa-md" src="../../public/coffeShop-placeholder.png" />

      <q-list>
        <q-item clickable @click="handleEdit">
          <q-item-section avatar>
            <q-icon color="primary" name="edit_note" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Description</q-item-label>
            <q-item-label caption>View and Update Coffe Shop Description</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable @click="handleReview">
          <q-item-section avatar>
            <q-icon color="orange" name="reviews" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Reviews</q-item-label>
            <q-item-label caption>Read and Write Reviews</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable :disable="!isLoggedIn" @click="confirm">
          <q-item-section avatar>
            <q-icon color="red" name="delete_forever" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Delete</q-item-label>
            <q-item-label caption>Delete Coffe Shop</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import { CoffeShop } from './models';
import Utils from './utils';
import Axios from 'axios';
import { useQuasar } from 'quasar';
export default defineComponent({
  name: 'CoffeShopCard',
  props: ['coffeShop'],
  setup(props) {
    const token = Utils.getExpiringLocalStorage('jwt-auth');
    let isLoggedIn = ref(token ? true : false);
    const $q = useQuasar();
    function confirm() {
      $q.dialog({
        title: 'Confirm',
        message: 'This will delete the coffeShop from the database',
        cancel: true,
        persistent: true,
      }).onOk(() => {
        Utils.setDefaultHeader(Utils.getExpiringLocalStorage('jwt-auth'));
        Axios.delete(Utils.URLs.coffeShop.deleteCoffeShop(props.coffeShop.id), {
          withCredentials: true,
        })
          .then((response) => {
            $q.notify({
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: response.data.message,

            });
            //Refresh the page after delete
            window.location.reload();
          })
          .catch((err) => {
            $q.notify({
              color: 'red-8',
              textColor: 'white',
              icon: 'cloud_done',
              message: err.response?.data.message,
            });
          });
      });
    }

    return {
      carObj: ref(props.coffeShop as CoffeShop),
      isLoggedIn,
      confirm,
    };
  },
  methods: {
    handleEdit() {
      void this.$router.push(`/descriptions/${this.carObj.id}`);
    },
    handleReview() {
      void this.$router.push(`/reviews/${this.carObj.id}`);
    },
  },
});
</script>

<style lang="scss" scoped>
.cmp-coffeShop {
  width: 30%;

  @media (max-width: 768px) {
    width: 50%;
  }

  @media (max-width: 600px) {
    width: 100%;
  }
}

.cmp-coffeshop__element {
  // Add border-radius property to make the card have rounded corners
  border-radius: 30px;

  // Add any other styles you want for the q-card here
  .q-item:last-child {
    margin-bottom: 25px; // Adjust the value based on your preference
  }
}
</style>

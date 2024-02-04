/* eslint-disable @typescript-eslint/no-explicit-any */
<template>
  <div class="q-pa-md cmp-login">
    <div class="cmp-login__container">
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="cmp-login__container-form"
      >
        <img
          class="cmp-login__container-form-img"
          src="../../public/coffeShop-cup.png"
          alt="Login image"
        />
        <h5>Login</h5>
        <q-input
          filled
          v-model="email"
          label="Your email *"
          hint="Email address.."
          lazy-rules
          :rules="[(val:string) => (val && val.length > 0) || 'Please type something']"
        />

        <q-input
          filled
          type="password"
          class="q-mt-md"
          v-model="password"
          label="Your password *"
          lazy-rules
          :rules="[
            (val:string) =>
              (val !== null && val !== '') || 'Please type your password',
          ]"
        />

        <div class="q-mt-lg cmp-login__container-form-buttons">
          <q-btn
            class="cmp-login__container-form-buttons-login"
            label="Submit"
            type="submit"
            color="primary"
          />
          <q-btn
            label="Reset fields"
            type="reset"
            color="primary"
            flat
            class="q-mt-sm cmp-login__container-form-buttons-reset"
          />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { ref } from 'vue';
import Axios from 'axios';
import { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'vue-router';
import Utils from '../components/utils';

export default {
  setup() {
    const $q = useQuasar();
    const $router = useRouter();
    const email = ref(null);
    const password = ref(null);

    return {
      email,
      password,

      onSubmit() {
        const postValues = { email: email.value, password: password.value };
        void Axios.post('http://localhost:8081/api/auth/login', postValues, {
          withCredentials: true,
        })
          .then(async (response: AxiosResponse) => {
            Utils.setDefaultHeader(response.data.token as string);
            Utils.setExpiringLocalStorage(
              'jwt-auth',
              response.data.token,
              4 * 3600 * 1000
            );

            localStorage.setItem('uid', response.data.userId);

            // Notify success
            $q.notify({
              color: 'green-8',
              textColor: 'white',
              icon: 'cloud_done',
              message: 'Success',
            });

            // Generate user, review, and coffee shop
            await Utils.DataGenerator.generateUser(1);
            await Utils.DataGenerator.generateReview(1);
            await Utils.DataGenerator.generateCoffeeShop(1);

            // Redirect to home
            void $router.push('/');
          })
          .catch((err: AxiosError) => {
            // Notify error
            $q.notify({
              color: 'red-8',
              textColor: 'white',
              icon: 'error',
              message: err?.response?.data.message as string,
            });
          });
      },

      onReset() {
        email.value = null;
        password.value = null;
      },
    };
  },
};
</script>


<style lang="scss" scoped>
.cmp-login {
  display: flex;
  justify-content: center;
  &__container {
    width: 30vw;
    padding: 48px;
    box-shadow: 0px 0px 18px 1px #d4d4d4;
    border-radius: 6px;

    @media (max-width: 1024px) {
      width: 60%;
    }

    @media (max-width: 767px) {
      width: 100%;
    }
  }

  &__container &__container-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  &__container &__container-form h5 {
    margin-block: 24px;
    font-family: sans-serif;
    font-weight: 600;
    color: #111111;
  }
  &__container &__container-form > .q-input {
    width: 100%;
    @media (max-width: 767px) {
      width: 100%;
    }
  }

  &__container &__container-form &__container-form-buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  &__container-form-buttons-login,
  &__container-form-buttons-reset {
    width: 200px;
  }
}
</style>
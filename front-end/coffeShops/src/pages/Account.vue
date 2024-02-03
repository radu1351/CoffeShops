<template>
  <q-page class="row justify-center">
    <q-card
      flat
      bordered
      class="cmp-account q-ma-lg q-pa-md"
      style="width: 100%"
    >
      <q-card-section>
        <h4>Account panel</h4>
      </q-card-section>
      <q-separator inset />

      <q-card-section class="cmp-account__controls">
        <div
          class="q-pa-md cmp-account__controls-form"
          style="max-width: 400px"
        >
          <q-form @submit="onSubmit" @reset="onReset">
            <q-input
              filled
              v-model="firstName"
              label="Your name *"
              hint="Firstname"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please type something',
              ]"
            />

            <q-input
              filled
              v-model="lastName"
              label="Your surname *"
              hint="Lastname"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please type something',
              ]"
            />

            <q-input
              filled
              v-model="email"
              label="Your email *"
              hint="Email"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Please type something',
              ]"
            />

            <div>
              <q-btn label="Submit data" type="submit" color="primary" />
              <q-btn
                label="Clear Data"
                type="reset"
                color="primary"
                flat
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </div>

        <div class="cmp-account__controls-buttons">
          <q-btn
            label="Logout"
            icon="logout"
            type="reset"
            color="primary"
            class="q-ml-sm"
            @click="logout"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import Axios from 'axios';
import Utils from '../components/utils';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'Account Page',
  setup() {
    const $q = useQuasar();
    let firstName = ref('');
    let lastName = ref('');
    let email = ref('');
    const $router = useRouter();
    const uid = localStorage.getItem('uid');

    const logout = function () {
      localStorage.removeItem('jwt-auth');
      localStorage.removeItem('uid');
      $router.push('/');
      $q.notify({
        color: 'primary',
        textColor: 'white',
        icon: 'pan_tool',
        message: 'Bye bye',
      });
    };

    if (uid) {
      const token = Utils.getExpiringLocalStorage('jwt-auth');
      Utils.setDefaultHeader(token);
      Axios.get(Utils.URLs.user.getUser(uid))
        .then((response) => {
          firstName.value = response.data.firstName;
          lastName.value = response.data.lastName;
          email.value = response.data.email;
        })
        .catch(() => {
          $q.notify({
            color: 'red-8',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'An error occured when fetching user data..',
          });
        });
    }

    return {
      firstName,
      lastName,
      email,
      logout,
      onReset() {
        firstName.value = '';
        lastName.value = '';
        email.value = '';
      },
      onSubmit() {
        const token = Utils.getExpiringLocalStorage('jwt-auth');
        Utils.setDefaultHeader(token);
        if (uid) {
          Axios.put(
            Utils.URLs.user.updateUser(uid),
            {
              firstName: firstName.value,
              lastName: lastName.value,
              email: email.value,
            },
            { withCredentials: true }
          )
            .then(() => {
              $q.notify({
                color: 'green-4',
                textColor: 'white',
                icon: 'cloud_done',
                message: 'User data updated',
              });
            })
            .catch(() => {
              $q.notify({
                color: 'red-8',
                textColor: 'white',
                icon: 'cloud_done',
                message: 'An error occured when updating user data..',
              });
            });
        }
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.cmp-account {
  h4 {
    margin-block: 0;
    font-weight: bold;
  }
  &__controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    @media (max-width: 767px) {
      flex-direction: column;
    }
    &-form {
      width: 100%;
      flex: 1;
      .q-input {
        margin-bottom: 12px;
      }
      div {
        display: flex;
        justify-content: space-between;
        @media (max-width: 767px) {
          display: flex;
          justify-content: center;
        }
      }
    }
    &-buttons {
      padding: 24px;
      @media (max-width: 767px) {
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>

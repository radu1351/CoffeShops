<template>
  <q-page class="cmp-reviews col items-center justify-center">
    <div class="cmp-reviews__add">
      <q-chip class="q-mt-md" text-color="white" color="primary" square style="font-size: 18px; font-weight: bold">
        {{ reviewedCoffeShop.name }} {{ reviewedCoffeShop.adress }}
      </q-chip>
      <h5 v-if="!this.isLoggedIn" class="text-h5 text-weight-bold">
        Login to add your review
      </h5>
      <h5 v-if="!isEditing && isLoggedIn" class="text-h5 text-weight-bold">
        Add your review
      </h5>
      <h5 v-if="isEditing" class="text-h5 text-weight-bold">
        Edit your review
      </h5>
      <div class="q-pa-md cmp-reviews__add-field">
        <q-input :disable="!this.isLoggedIn" v-model="reviewMessage" filled type="textarea" />
        <q-rating :disable="!this.isLoggedIn" class="q-mt-sm" size="24px" v-model="stars" :max="5" color="primary" />
      </div>
      <div class="q-pl-md q-pr-md q-mb-md cmp-reviews__add-actions">
        <q-btn :disable="!this.isLoggedIn" round color="primary" icon="send" type="submit" @click="onSubmit" />
        <q-btn :disable="!this.isLoggedIn" round color="red-8" icon="delete_forever" @click="onReset" />
      </div>
    </div>
    <q-separator inset />
    <div class="cmp-reviews__actions flex q-mt-lg">
      <q-chip text-color="white" color="primary" square icon="grade">{{
        computeAverageRating().toFixed(2)
      }}</q-chip>
      <div class="cmp-reviews__actions-buttons">
        <q-select class="cmp-reviews__actions-type" outlined v-model="selectedSort" :options="sortOptions"
          :value="selectedSort" option-label="name" option-value="name" label="Sort By" />
        <q-btn color="green-8" label="Sort Reviews" @click="onSelectDropdown" />
      </div>
    </div>
    <div class="cmp-reviews__grid">
      <review-card @passDataToParent="getDataFromChild($event)" @emitDeleteEvent="getDeleteEventFromChild($event)"
        v-for="review in reviewsResponse" :key="review.id" :review="review"></review-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { ref, computed, onMounted } from 'vue';
import Axios from 'axios';
import { AxiosError, AxiosResponse } from 'axios';
import { useRoute } from 'vue-router';
import Utils from '../components/utils';
import ReviewCard from '../components/ReviewCard.vue';
import { CoffeShop, Review, ReviewData } from '../components/models';

export default {
  name: 'Reviews',
  components: { ReviewCard },
  setup() {
    const $q = useQuasar();
    const route = useRoute();
    const params = computed(() => route.params);
    const paramsString = params.value.coffeShop_id.toString();
    let reviewMessage = ref('');
    let stars = ref(0);
    let reviewsResponse = ref([] as Review[]);
    let reviewsDefaultArray = ref([] as Review[]);
    let reviewedCoffeShop = ref({} as CoffeShop);
    let localReviewId = 0;
    let isEditing = ref(false);
    let selectedSort = ref('Default');
    const token = Utils.getExpiringLocalStorage('jwt-auth');
    let isLoggedIn = ref(token ? true : false);
    const uid = localStorage.getItem('uid');

    onMounted(async () => {
      reviewsResponse.value = (
        await Axios.get(Utils.URLs.review.getAll(paramsString), {
          withCredentials: false,
        })
      ).data as Review[];
      reviewedCoffeShop.value = (await Axios.get(Utils.URLs.coffeShop.getCoffeShop(paramsString)))
        .data as CoffeShop;

      const currentUserReviewIndex = reviewsResponse.value.findIndex(
        (el) => el.data.userId == uid
      );
      if (currentUserReviewIndex >= 0) {
        const currentUserReview = reviewsResponse.value.splice(
          currentUserReviewIndex,
          1
        )[0];
        reviewsResponse.value.unshift(currentUserReview);
        reviewsDefaultArray.value = [...reviewsResponse.value];
      }
    });

    return {
      sortOptions: ['Default', 'Ascending Score', 'Descending Score'],
      selectedSort,
      reviewMessage,
      reviewsResponse,
      stars,
      isEditing,
      reviewedCoffeShop,
      isLoggedIn,

      onSelectDropdown() {
        if (selectedSort.value == 'Default') {
          reviewsResponse.value = [...reviewsDefaultArray.value];
        } else if (selectedSort.value == 'Ascending Score') {
          reviewsResponse.value.sort((a, b) => a.data.rating - b.data.rating);
        } else {
          reviewsResponse.value.sort((a, b) => b.data.rating - a.data.rating);
        }
      },

      onSubmit() {
        if (reviewMessage.value.length > 6 && stars.value > 0) {
          if (uid) {
            if (isEditing.value) {
              const token = Utils.getExpiringLocalStorage('jwt-auth');
              Utils.setDefaultHeader(token);
              Axios.put(
                Utils.URLs.user.editReview(paramsString),
                { message: reviewMessage.value, rating: stars.value },
                { withCredentials: true }
              )
                .then(() => {
                  $q.notify({
                    color: 'green-4',
                    textColor: 'white',
                    icon: 'cloud_done',
                    message: 'Review edited',
                  });

                  const editedReviewIndex = reviewsResponse.value.findIndex(
                    (el) => el.data.userId == uid
                  );
                  if (editedReviewIndex >= 0) {
                    reviewsResponse.value[editedReviewIndex] = {
                      id: localReviewId.toString(),
                      data: {
                        userId: uid,
                        message: reviewMessage.value,
                        rating: stars.value,
                      },
                    };
                    reviewMessage.value = '';
                    stars.value = 0;
                    isEditing.value = false;
                  }
                })
                .catch((err) => {
                  $q.notify({
                    color: 'red-8',
                    textColor: 'white',
                    icon: 'error',
                    message: err.response?.data.message,
                  });
                });
            } else {
              const token = Utils.getExpiringLocalStorage('jwt-auth');
              Utils.setDefaultHeader(token);
              Axios.post(
                Utils.URLs.user.addReview(paramsString),
                { message: reviewMessage.value, rating: stars.value },
                { withCredentials: true }
              )
                .then((response: AxiosResponse) => {
                  reviewsResponse.value.unshift({
                    id: ++localReviewId + '',
                    data: {
                      userId: uid,
                      message: reviewMessage.value,
                      rating: stars.value,
                    },
                  });
                  reviewMessage.value = '';
                  stars.value = 0;
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
            }
          }
        } else {
          $q.notify({
            color: 'red-8',
            textColor: 'white',
            icon: 'error',
            message:
              'Your review should have at least 6 characters and 1 star rating',
          });
        }
      },

      onReset() {
        reviewMessage.value = '';
        stars.value = 0;
      },

      getDataFromChild(data: ReviewData) {
        isEditing.value = true;
        reviewMessage.value = data.message;
        stars.value = data.rating;
      },

      getDeleteEventFromChild(data: Review) {
        const reviewIndex = reviewsResponse.value.findIndex(
          (el) => el.id == data.id
        );
        if (reviewIndex >= 0) {
          const token = Utils.getExpiringLocalStorage('jwt-auth');
          Utils.setDefaultHeader(token);
          Axios.delete(Utils.URLs.user.deleteReview(paramsString), {
            withCredentials: true,
          })
            .then(() => {
              isEditing.value = false;
              reviewsResponse.value.splice(reviewIndex, 1);
              $q.notify({
                color: 'green-4',
                textColor: 'white',
                icon: 'cloud_done',
                message: 'Review deleted',
              });
            })
            .catch((err) => {
              $q.notify({
                color: 'red-8',
                textColor: 'white',
                icon: 'error',
                message: err.response?.data.message,
              });
            });
        }
      },

      computeAverageRating() {
        let sum = 0;
        reviewsResponse.value.forEach((review) => {
          sum += review.data.rating;
        });
        return sum > 0 ? sum / reviewsResponse.value.length : 0;
      },
    };
  },
};
</script>

<style lang="scss" scoped>
h5 {
  margin-block-start: 12px;
  text-align: center;
}

.cmp-reviews {
  &__actions-buttons {
    display: flex;
    gap: 12px;
  }

  &__grid {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__actions {
    margin: 24px;
    justify-content: space-between;
    align-items: center;

    .q-chip {
      font-size: 16px;
      font-weight: bold;

      @media (max-width: 767px) {
        margin-bottom: 12px;
      }
    }

    &>.q-btn {
      height: 56px;
    }
  }

  &__actions-type {
    width: 200px;
  }

  &__add {
    display: flex;
    flex-direction: column;
    align-items: center;

    &-field {
      width: 50%;

      @media (max-width: 1023px) {
        width: 100%;
      }
    }

    &-actions {
      width: 50%;
      display: flex;
      justify-content: flex-end;
      gap: 24px;

      @media (max-width: 1023px) {
        width: 100%;
      }
    }
  }
}
</style>
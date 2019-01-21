<template>
  <div class="card">
    <div class="card-header">
      <h3 class="title">Submit Image</h3>
    </div>
    <div class="card-body">
      <div class="content">
        <form @submit.prevent="submitForm">
          <div class="row">
            <div class="col-lg-6">
              Style
            </div>
            <div class="col-lg-6">
              Content
            </div>
          </div>
          <div class="text-right">
            <button
              :disabled="isSubmitDisabled"
              type="submit"
              class="btn btn-info btn-fill btn-wd mt-2"
            >
              Request
            </button>
          </div>
          <div class="clearfix"/>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import socket from '@/util/socket';

export default {
  data: () => ({
    style: 'starry-night',
    result: null,
    error: false,
    waiting: false,
  }),
  mounted() {
    socket.connect();
  },
  methods: {
    submitForm() {},
  },
};
</script>

<style>
</style>

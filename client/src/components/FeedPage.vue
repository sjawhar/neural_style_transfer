<template>
  <div class="card">
    <div class="card-body">
      <div class="content">
        <div class="row">
          <div class="col-md-6 text-center">
            <h3>Before</h3>
            <img :src="currentImageBefore">
          </div>
          <div class="col-md-6 text-center">
            <h3>After</h3>
            <img :src="currentImageAfter">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import socket from '@/util/socket';
import {
  LIST_IMAGES,
  TRANSFER_STYLE_COMPLETED,
} from '@/constants/socketEvents';

export default {
  data: () => ({
    images: [],
    imageIndex: 0,
  }),
  computed: {
    currentImageAfter() {
      return this.images[this.imageIndex];
    },
    currentImageBefore() {
      return (
        this.currentImageAfter &&
        this.currentImageAfter.replace('/output/', '/input/')
      );
    },
  },
  async mounted() {
    this.images = await socket.request(LIST_IMAGES);
    socket.on(TRANSFER_STYLE_COMPLETED, this.handleNewImage);
    setInterval(() => {
      this.imageIndex = (this.imageIndex + 1) % (this.images.length || 1);
    }, 5000);
  },
  destroyed() {
    socket.off(TRANSFER_STYLE_COMPLETED, this.handleNewImage);
  },
  methods: {
    handleNewImage({ result }) {
      const newImages = this.images.slice();
      newImages.splice(this.imageIndex + 1, 0, result);
      this.images = newImages;
    },
  },
};
</script>

<style>
img {
  max-width: 100%;
}
</style>

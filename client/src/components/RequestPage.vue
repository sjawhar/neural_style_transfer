<template>
  <div class="card">
    <div class="card-header">
      <h3 class="title">Submit Image</h3>
    </div>
    <div class="card-body">
      <div class="content">
        <div 
          v-if="error" 
          class="error text-danger"
        >{{ error }}</div>
        <form @submit.prevent="submitForm">
          <div class="row">
            <div class="col-lg-6">
              <h3>Upload an Image</h3>
              <div class="input-group">
                <div class="content-file">
                  <input 
                    id="content-file" 
                    ref="contentFile" 
                    type="file" 
                    class="content-file-input" 
                    @change="handleContentFile"
                  >
                </div>
              </div>
              <img 
                v-if="imageString" 
                :src="imageString"
              >
            </div>
            <div class="col-lg-6">
              <h3>Choose a Style</h3>
              <div class="input-group">
                <select v-model="style">
                  <option
                    v-for="option in styleOptions"
                    :key="option.url"
                    :value="option.url"
                  >
                    {{ option.name }}
                  </option>
                </select>
              </div>
              <img :src="style" >
            </div>
          </div>
          <div class="text-right">
            <button
              :disabled="isSubmitDisabled"
              type="submit"
              class="btn btn-info btn-fill btn-wd mt-2"
            >
              TRANSFER!
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
import { TRANSFER_STYLE, LIST_STYLES } from '@/constants/socketEvents';

export default {
  data: () => ({
    imageFile: null,
    style: '',
    result: null,
    error: false,
    waiting: false,
    styles: [],
  }),
  computed: {
    isSubmitDisabled() {
      return this.waiting || !this.imageFile;
    },
    styleOptions() {
      return this.styles.map(url => ({
        name: url
          .split('/')
          .slice(-1)[0]
          .split('.')[0],
        url,
      }));
    },
    styleName() {
      return (
        this.style &&
        this.style
          .split('/')
          .slice(-1)[0]
          .split('.')[0]
      );
    },
  },
  asyncComputed: {
    async imageString() {
      if (!this.imageFile) {
        return null;
      }
      const result = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(this.imageFile);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
      return result;
    },
  },
  async mounted() {
    socket.connect();
    this.styles = await socket.request(LIST_STYLES);
    this.style = this.styles[0];
  },
  methods: {
    handleContentFile() {
      const [imageFile] = this.$refs.contentFile.files;
      if (!['image/png', 'image/jpeg'].includes(imageFile.type)) {
        this.error = 'File type must be an image';
        return;
      }
      this.error = false;
      this.imageFile = imageFile;
    },
    async submitForm() {
      this.error = false;
      this.waiting = true;
      try {
        await socket.request(TRANSFER_STYLE, {
          style: this.styleName,
          image: this.imageString,
          isPrivate: false,
        });
      } catch (error) {
        this.error = error.message;
      }
      this.waiting = false;
    },
  },
};
</script>

<style>
</style>

<template>
  <q-uploader ref="upload" square flat :multiple="multiple" :max-file-size="maxFileSize" :accept="accept" style="width:100%" :url="uploadUrl"
              :headers="headers" @uploaded="onUploaded" @finish="isDialogUpload=!isDialogUpload" field-name="file" />
</template>

<script>
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "TMUpload",
  props: {
    modelValue: { default: null },
    multiple: { type: Boolean, default: false },
    maxFileSize: { type: Number, default: 1024 * 1024 * 2 }, // 2MB
    accept: { type: String, default: undefined },
    uploadUrl: { type: String, required: true },
    headers: { type: Array, default: () => [] },
  },
  setup (props, { emit }) {
    const isDialogUpload = ref(false)
    return {
      isDialogUpload,
      onUploaded (val) {
        var res = JSON.parse(val.xhr.response)
        // if (res.length > 0) {
        // if (props.multiple) {
        //     const rs = props.modelValue.slice()
        //     rs.push(res[0].fullName)
        //     emit('update:modelValue', rs)
        //   } else emit('update:modelValue', res[0].fullName)
        // }
        // emit('uploaded', res)
        emit('update:modelValue', res)
      },
    }
  }
})
</script>

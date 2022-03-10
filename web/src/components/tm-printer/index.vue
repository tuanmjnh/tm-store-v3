<template>
  <div ref="tmPrinter" :style="hidden?'display: none;':''">
    <!--opacity:0;width:0;height:0;-->
    <slot name="content"></slot>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'tm-printer',
  props: {
    hidden: { type: Boolean, default: true },
    title: { type: String, default: 'TM Printer' },
    styles: { type: String, default: '' },
    width: { type: Number, default: 800 },
    height: { type: Number, default: 600 },
    timeout: { type: Number, default: 1000 }
    // styles: { type: String, default: '' },
    // width: { type: Number, default: 800 },
    // height: { type: Number, default: 900 },
    // timeout: { type: Number, default: 1000 }
  },
  setup (props) {
    const tmPrinter = ref(null)
    // const idElement = 'id' + (new Date()).getTime()
    const onPrinting = () => {
      // Get HTML to print from element
      // const prtHtml = document.getElementById('tm-print').innerHTML
      // Get all stylesheets HTML
      let stylesHtml = ''
      for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
        stylesHtml += node.outerHTML
      }
      stylesHtml += props.styles ? props.styles : ''
      // Open the print window
      const WinPrint = window.open('', '', `left=0,top=0,width=${props.width},height=${props.height},toolbar=0,scrollbars=0,status=0`)

      WinPrint.document.write(`<!DOCTYPE html>
        <html>
          <head>
          <title>${props.title ? props.title : 'Printer'}</title>
            ${stylesHtml ? stylesHtml : ''}
          </head>
          <body>
            ${tmPrinter.value.innerHTML}
          </body>
        </html>`)
      setTimeout(() => {
        WinPrint.document.close()
        WinPrint.focus()
        WinPrint.print()
        WinPrint.close()
        // prtHtml.innerHTML = ''
      }, props.timeout)
    }
    return { tmPrinter, onPrinting }
  }
})
</script>

<style>
</style>

<template>
  <div id="tm-print" :style="hidden?'opacity:0;width:0;height:0;':''">
    <slot name="content"></slot>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'tm-printer',
  props: {
    hidden: { type: Boolean, default: true }
    // styles: { type: String, default: '' },
    // width: { type: Number, default: 800 },
    // height: { type: Number, default: 900 },
    // timeout: { type: Number, default: 1000 }
  },
  setup (props) {
    const onExc = ({ styles, width, height, timeout }) => {
      width = width || 800
      height = height || 900
      timeout = timeout || 1000
      // Get HTML to print from element
      const prtHtml = document.getElementById('tm-print').innerHTML
      // Get all stylesheets HTML
      let stylesHtml = ''
      for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
        stylesHtml += node.outerHTML
      }
      stylesHtml += styles
      // Open the print window
      const WinPrint = window.open('', '', `left=0,top=0,width=${width},height=${height},toolbar=0,scrollbars=0,status=0`)

      WinPrint.document.write(`<!DOCTYPE html>
        <html>
          <head>
            ${stylesHtml}
          </head>
          <body>
            ${prtHtml}
          </body>
        </html>`)
      setTimeout(() => {
        WinPrint.document.close()
        WinPrint.focus()
        WinPrint.print()
        WinPrint.close()
      }, timeout)
    }
    return { props, onExc }
  }
})
</script>

<style>
</style>

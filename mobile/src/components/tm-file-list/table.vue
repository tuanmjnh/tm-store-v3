<template>
  <q-table flat dense :rows="rows" :columns="columns" :visible-columns="visibleColumns" row-key="name" selection="multiple"
           :no-data-label="$t('table.noData')" :rows-per-page-label="$t('table.rowPerPage')"
           :selected-rows-label="()=>`${selected.length} ${$t('table.rowSelected')}`" :rows-per-page-options="rowsPerPageOptions">
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          <span v-if="$q.dark.isActive" class="text-bold">{{col.label}}</span>
          <span v-else class="text-bold text-blue-grey-10">{{col.label}}</span>
        </q-th>
        <q-th auto-width>
          <q-btn flat round dense :color="$q.dark.isActive?'':'grey-7'" icon="menu_open">
            <q-tooltip v-if="!$q.platform.is.mobile">{{$t('table.displayColumns')}}</q-tooltip>
            <q-menu fit>
              <q-list dense style="min-width:100px">
                <template v-for="(item,index) in columns">
                  <q-item v-if="!item.required" clickable :key="index" :active="visibleColumns.indexOf(item.name)>-1||false"
                          @click="onColumns(item.name)">
                    <q-item-section>{{item.label}}</q-item-section>
                  </q-item>
                </template>
              </q-list>
            </q-menu>
          </q-btn>
        </q-th>
      </q-tr>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td auto-width key="index" :props="props">{{props.row.index+1}}</q-td>
        <q-td auto-width key="icon" :props="props">
          <q-img :src="props.row.name" spinner-color="primary" style="height:23px;max-width:25px" fit="cover"
                 v-if="Extension.isImage(props.row.name)">
            <template v-slot:error>
              <i class="content material-icons"
                 style="font-size:23px;position:absolute;top:0;left:0;color:#908f8f">photo_size_select_actual</i>
            </template>
          </q-img>
          <i v-else-if="Extension.isAudio(props.row.name)" class="content material-icons"
             style="font-size:20px">audiotrack</i>
          <i v-else-if="Extension.isVideo(props.row.name)" class="content material-icons"
             style="font-size:20px">video_library</i>
          <i v-else-if="Extension.isPdf(props.row.name)" class="content material-icons"
             style="font-size:20px">picture_as_pdf</i>
          <i v-else-if="Extension.isFlash(props.row.name)" class="content material-icons"
             style="font-size:20px">burst_mode</i>
          <i v-else-if="Extension.isCode(props.row.name)" class="content material-icons"
             style="font-size:20px">code</i>
          <i v-else-if="Extension.isDoc(props.row.name)" class="content material-icons"
             style="font-size:20px">description</i>
          <i v-else-if="Extension.isSheet(props.row.name)" class="content material-icons"
             style="font-size:20px">list_alt</i>
          <i v-else-if="Extension.isText(props.row.name)" class="content material-icons"
             style="font-size:20px">assignment</i>
          <i v-else class="content material-icons" style="font-size:20px">file_copy</i>
        </q-td>
        <q-td key="name" :props="props">{{Extension.getNameFilePath(props.row.name)}}</q-td>
        <q-td auto-width key="type" :props="props">{{props.row.type}}</q-td>
        <td auto-width>
          <q-btn flat round dense color="negative" icon="clear" size="sm" @click="onDelete(props.row.index)">
            <q-tooltip v-if="!$q.platform.is.mobile">{{labelDeleteFile}}</q-tooltip>
          </q-btn>
        </td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
export default {

}
</script>

<style>
</style>

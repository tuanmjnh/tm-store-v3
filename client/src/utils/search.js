export default function normalize(str) {
  return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
}

export function removeAccents(str) {
  var AccentsMap = [
    'aàảãáạăằẳẵắặâầẩẫấậ',
    'AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ',
    'dđ', 'DĐ',
    'eèẻẽéẹêềểễếệ',
    'EÈẺẼÉẸÊỀỂỄẾỆ',
    'iìỉĩíị',
    'IÌỈĨÍỊ',
    'oòỏõóọôồổỗốộơờởỡớợ',
    'OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ',
    'uùủũúụưừửữứự',
    'UÙỦŨÚỤƯỪỬỮỨỰ',
    'yỳỷỹýỵ',
    'YỲỶỸÝỴ'
  ]
  for (var i = 0; i < AccentsMap.length; i++) {
    var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g')
    var char = AccentsMap[i][0]
    str = str.replace(re, char)
  }
  return str
}

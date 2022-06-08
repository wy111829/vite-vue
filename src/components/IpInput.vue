<script setup>
import {
  ref, reactive, defineProps, defineEmits, watch
} from 'vue'

const props = defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])
const ipAdress = reactive([
  {
    value: ''
  },
  {
    value: ''
  },
  {
    value: ''
  },
  {
    value: ''
  }
])

const inputRef = ref([])

const setRef = (el) => {
  inputRef.value.push(el)
}

// const formatter = (val) => {
//   let value = val.toString()
//   if (value.length === 2) {
//     value = `0${value}`
//   } else if (value.length === 1) {
//     value = `00${value}`
//   } else if (value.length === 0) {
//     value = '000'
//   }
//   return value
// }
// 监听
watch(() => ipAdress, (newVal, oldVal) => {
  const arr = []
  let str = ''
  ipAdress.forEach((item) => {
    arr.push(item.value)
  })
  str = arr.join('.')
  if (str === '000.000.000.000') {
    str = ''
  }
  emit('update:modelValue', str)
}, { deep: true })

watch(() => props.modelValue, () => {
  props.modelValue.split('.').forEach((item, index) => {
    ipAdress[index].value = item
  })
}, { deep: true, immediate: true })

const checkIpVal = (item, index) => {
  // 确保每个值都处于0-255
  let val = item.value
  // 当输入的是空格时，值赋为空
  val = val.trim()
  val = parseInt(val, 10)
  if (Number.isNaN(val)) {
    val = ''
  } else {
    val = val < 0 ? 0 : val
    val = val > 255 ? 255 : val
  }
  ipAdress[index].value = val
}
const turnIpPOS = (item, index, event) => {
  const e = event || window.event
  // 左箭头向左跳转，左一不做任何措施
  if (e.keyCode === 37) {
    if (index !== 0) {
      inputRef.value[index - 1].focus()
    }
  }
  // 删除键把当前数据删除完毕后会跳转到前一个input，左一不做任何处理
  if (e.keyCode === 8 && item.value.length === 0) {
    if (index !== 0) {
      inputRef.value[index - 1].focus()
    }
  }
  // 右箭头、回车键、空格键、冒号均向右跳转，右一不做任何措施
  if (e.keyCode === 39 || e.keyCode === 13 || e.keyCode === 32 || e.keyCode === 190) {
    if (index !== 3) {
      inputRef.value[index + 1].focus()
    }
  }
  // 满3位，光标自动向下一个文本框
  if (item.value.toString().length === 3) {
    if (index !== 3) {
      inputRef.value[index + 1].focus()
    }
  }
}
const setDefaultVal = (item, index) => {
  // 当input失去焦点，而ip没有赋值时，会自动赋值为0
  const val = item.value
  if (val === '') {
    ipAdress[index + 1].value = ''
  }
}

</script>
<template>
  <ul class="ipAdress">
    <li v-for="(item, index) in ipAdress" :key="index">
      <input
        type="text"
        @input="checkIpVal(item, index)"
        @keyup="turnIpPOS(item, index, $event)"
        v-model="item.value"
        :ref="setRef"
        @blur="setDefaultVal(item, index)" />
      <div></div>
    </li>
  </ul>
</template>
<style lang="less" scoped>
.ipAdress {
  display: flex;
  border: 1px solid #dcdfe6;
  background: #fff;
  border-radius: 4px;
  width: 200px;
  height: 28px;
  padding-inline-start: 0px;
  margin: 0;
}
.ipAdress li {
  position: relative;
  height: 28px;
  width: 40px;
  margin: 0;
  list-style-type: none;
  flex: 1;
  input{
    border: none;
    width: 35px;
    outline: none;
    text-align: center;
  }
}
.ipInputClass {
  border: none;
  width: 49px;
  height: 23px;
  text-align: center;
  background: transparent;
}
.ipAdress li div {
  position: absolute;
  bottom: 8px;
  right: 0;
  border-radius: 50%;
  background: #505050;
  width: 2px;
  height: 2px;
}
/*只需要3个div*/
.ipAdress li:last-child div {
  display: none;
}
/*取消掉默认的input focus状态*/
.ipAdress input:focus {
  outline: none;
}
</style>

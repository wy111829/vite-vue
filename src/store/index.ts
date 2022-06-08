import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { InjectionKey } from 'vue'

export interface State {

}

export const key: InjectionKey<Store<State>> = Symbol('store')

export const store = createStore({
  state () {
    return {

    }
  },
  mutations: {

  }
})

// 定义自己的 useStore 组合式函数
export function useStore () {
  return baseUseStore(key)
}

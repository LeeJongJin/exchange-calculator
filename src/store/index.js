import Vue from 'vue'
import Vuex from 'vuex'
import http from '../api/http'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currencyInfos :{
      url: 'http://apilayer.net/api/live',
      access_key:'7b9f8d8d6267c826cdce2f1453835984',
      currencies: [ 
        {nation:'한국', money:'KRW'}, 
        {nation:'일본', money:'JPY'}, 
        {nation:'필리핀', money:'PHP'}
      ],
      source:'USD'
    },
    currencyData : {}
  },
  getters: {
    currencyData: state => {
      return state.currencyData;
    },
    currencyInfos: state => {
      let {currencies, source} = state.currencyInfos;
      return {currencies, source};
    },
    apiInfos: state => {
      const {url, access_key, source} = state.currencyInfos;
      const currencies = state.currencyInfos.currencies.map(item => { return item.money }).join(',');
      return {url, access_key, currencies, source};
    }
  },
  mutations: {
    setCurrencyData(state, currencyData){
      state.currencyData = currencyData;
    }
  },
  actions: {
    callCurrencyAPI : async ({commit
      , getters
    }) => {
      const apiInfo = getters.apiInfos;
      const url = apiInfo.url;
      const reuqest = {
        params:{
          access_key: apiInfo.access_key,
          currencies: apiInfo.currencies,
          source: apiInfo.source
        }
      }
      const data = await http.get(url, reuqest);

      // Api 샘플
      // const data = {
      //   "success":true,
      //   "terms":"https://currencylayer.com/terms",
      //   "privacy":"https://currencylayer.com/privacy",
      //   "timestamp":1645344662,
      //   "source":"USD",
      //   "quotes":{
      //     "USDKRW":1195.730384,
      //     "USDJPY":114.998504,
      //     "USDPHP":51.440375
      //   }
      // };

      commit('setCurrencyData', data.quotes)
    }
  },
  plugins: [store => store.dispatch('callCurrencyAPI')]
})

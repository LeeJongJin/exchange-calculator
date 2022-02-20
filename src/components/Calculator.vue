<template>
    <v-form>
        <v-container>
            <v-row>
                <v-col md="4">
                    <h1> 환율 계산 </h1>
                </v-col>
            </v-row>
            <v-row>
                <v-col md="2">
                    <v-subheader>송금국가</v-subheader>
                </v-col>
                <v-col md="2">
                    <v-input> {{currencyInfos.source}} </v-input>
                </v-col>
            </v-row>
            <v-row>
                <v-col md="2">
                    <v-subheader>수취국가</v-subheader>
                </v-col>
                <v-col md="2">
                    <v-select
                        v-model="select"
                        :hint="`${select.nation}(${select.money})`"
                        :items="currencyInfos.currencies"
                        item-text="nation"
                        item-value="money"
                        persistent-hint
                        return-object
                        @change="selectCurrency($event)"
                    ></v-select>
                </v-col>
            </v-row>
            <v-row>
                <v-col md="2">
                    <v-subheader>환율</v-subheader>
                </v-col>
                <v-col md="2">
                    <v-input> {{currency | $}} {{select.money}}/{{currencyInfos.source}} </v-input>
                </v-col>
            </v-row>
            <v-row>
                <v-col md="2">
                    <v-subheader>송금액</v-subheader>
                </v-col>
                <v-col md="2">
                <v-text-field
                    ref="amountField"
                    prefix='$'
                    :suffix="currencyInfos.source"
                    label="Amount"
                    v-model="amount"
                    :rules="amountRules"
                    required
                    clearable
                ></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col md="4" >
                    <v-btn
                     @click="exchangeRateCalculation"
                     :disabled="validateError"
                     > Submit </v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col md="4" >
                    <v-input> 수취 금액은 {{result | $}} {{select.money}} 입니다. </v-input>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>

<script>
export default {
    data(){
        return {
            select : {nation:'선택', money:''},
            currency : this.selectCurrency,
            amount: '',
            amountRules: [
                v => !!v || '송금액이 바르지 않습니다',
                v => (Number(v) >= 0 && Number(v) <= 10000) || '송금액이 바르지 않습니다'
            ],
            result: ''
        }
    },
    methods:{
        selectCurrency(event){
            let key = this.currencyInfos.source + event.money;
            this.currency = this.currencyData[key];
            this.amount = '';
            this.result = '';
        }, 
        exchangeRateCalculation() {
            this.result = this.amount * this.currency;
        }
    },
    computed: {
        currencyData(){
            return this.$store.getters.currencyData;
        },
        currencyInfos(){
            return this.$store.getters.currencyInfos;
        },
        validateError(){
            let bool = true;
            if( this.select.money !== '' && this.$refs.amountField && this.$refs.amountField.errorBucket.length === 0){
                bool = false;
            }
            return bool
        }
    }
}
</script>

<style lang="scss" scoped>
.col {
    border: 1px solid gray;
}
</style>>


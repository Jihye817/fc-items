import Vue from 'vue';
import firebase from 'firebase/compat/app';
import firebaseConfig from '../../firebaseConfig';

//사용할 기능 import
import 'firebase/compat/database';

firebase.initializeApp(firebaseConfig);
Vue.prototype.$firebase = firebase //전역 사용 설정
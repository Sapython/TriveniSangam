export const environment = {
  firebase: {
    apiKey: "REPLACEMENT_STRING",
    authDomain: "trivenisangam-aef13.firebaseapp.com",
    projectId: "trivenisangam-aef13",
    storageBucket: "trivenisangam-aef13.appspot.com",
    messagingSenderId: "197342273576",
    appId: "1:197342273576:web:7fbd8377c11bc5226cd51d",
    measurementId: "G-22NB57W1NK"
  },
  cloudFunctions: {
    createOrder: 'https://us-central1-trivenisangam-aef13.cloudfunctions.net/createOrder',
    capturePayment:
      'https://us-central1-trivenisangam-aef13.cloudfunctions.net/capturePayments',
  },
  RAZORPAY_KEY_ID: 'REPLACEMENT_STRING_pJeAVOFICNZy8Z',
  production: true,
};

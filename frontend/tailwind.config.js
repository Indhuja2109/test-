/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily:{
      display:["Poppins","sans-serif"],
    },


    extend: {
      //colors used in the project
      colors:{
        primary:"#0586D3",
        secondary:"#EF863E",
      },

      backgroundImage:{
        'login-bg-img':"url('https://ik.imagekit.io/Indhuja/assets/images/bg-image1.png?updatedAt=1732689904218')",
        'signup-bg-img':"url('https://ik.imagekit.io/Indhuja/assets/images/signup-bg.png?updatedAt=1732689903848')"
      }
    },
  },
  plugins: [],
}


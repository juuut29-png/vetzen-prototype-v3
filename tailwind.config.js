import defaultTheme from 'tailwindcss/defaultTheme'
export default {content:['./index.html','./src/**/*.{js,jsx,ts,tsx}'],theme:{extend:{colors:{emerald:{50:'#F3FBF6',600:'#2F8F63',700:'#256B4F'},cream:{100:'#F6EDE6'}},fontFamily:{sans:['Inter',...defaultTheme.fontFamily.sans]},borderRadius:{'2xl':'1rem','3xl':'1.5rem'},boxShadow:{soft:'0 10px 30px rgba(0,0,0,0.06)'}}},plugins:[]}
